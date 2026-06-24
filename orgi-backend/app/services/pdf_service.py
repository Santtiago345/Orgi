import os
import tempfile
from typing import List, Optional
from dataclasses import dataclass
from decimal import Decimal
from datetime import datetime
import re
from sqlalchemy.orm import Session

import pdfplumber
import PyPDF2
import pandas as pd

from app.models.pdf_import import PDFImport
from app.models.transaction import Transaction
from app.models.account import Account
from app.models.category import Category
from app.utils.pdf_cleaner import is_duplicate, suggest_category
from app.services.parsers import BancolombiaParser, DaviviendaParser, BbvaParser, GenericParser

BANK_PATTERNS = [
    (re.compile(r'bancolombia', re.I), "BANCOLOMBIA"),
    (re.compile(r'davivienda', re.I), "DAVIVIENDA"),
    (re.compile(r'banco de bogotá|bogota', re.I), "BOGOTA"),
    (re.compile(r'bbva', re.I), "BBVA"),
    (re.compile(r'nequi', re.I), "NEQUI"),
    (re.compile(r'scotiabank|colpatria', re.I), "SCOTIABANK"),
]

PARSER_MAP = {
    "BANCOLOMBIA": BancolombiaParser,
    "DAVIVIENDA": DaviviendaParser,
    "BOGOTA": GenericParser,
    "BBVA": BbvaParser,
    "NEQUI": GenericParser,
    "SCOTIABANK": GenericParser,
}

@dataclass
class TransactionRaw:
    fecha: datetime
    descripcion: str
    cantidad: Decimal
    tipo: str
    referencia: Optional[str]
    categoria_sugerida: Optional[str]
    confianza: float

@dataclass
class PDFImportResult:
    import_id: int
    status: str
    transactions_found: int
    transactions_imported: int
    transactions_skipped: int
    errors: List[str]

class PDFProcessor:
    def __init__(self, filepath: str, user_id: int, db: Session, account_id: Optional[int] = None):
        self.filepath = filepath
        self.user_id = user_id
        self.db = db
        self.account_id = account_id
        self.bank_name = "GENERICO"

    def detect_bank(self) -> str:
        try:
            with pdfplumber.open(self.filepath) as pdf:
                first_page = pdf.pages[0]
                text = first_page.extract_text() or ""
        except Exception:
            try:
                with open(self.filepath, "rb") as f:
                    reader = PyPDF2.PdfReader(f)
                    text = reader.pages[0].extract_text() or ""
            except Exception:
                text = ""

        for pattern, bank_name in BANK_PATTERNS:
            if pattern.search(text):
                self.bank_name = bank_name
                return bank_name
        self.bank_name = "GENERICO"
        return "GENERICO"

    def extract_text(self) -> str:
        try:
            with pdfplumber.open(self.filepath) as pdf:
                text = "\n".join(page.extract_text() or "" for page in pdf.pages)
                return text
        except Exception:
            try:
                with open(self.filepath, "rb") as f:
                    reader = PyPDF2.PdfReader(f)
                    text = "\n".join(page.extract_text() or "" for page in reader.pages)
                    return text
            except Exception as e:
                raise ValueError(f"Could not extract text from PDF: {e}")

    def extract_tables(self) -> List[pd.DataFrame]:
        tables = []
        try:
            with pdfplumber.open(self.filepath) as pdf:
                for page in pdf.pages:
                    page_tables = page.extract_tables()
                    for t in page_tables:
                        if t:
                            df = pd.DataFrame(t[1:], columns=t[0])
                            tables.append(df)
        except Exception:
            pass
        return tables

    def parse_transactions(self) -> List[TransactionRaw]:
        text = self.extract_text()
        tables = self.extract_tables()
        parser_class = PARSER_MAP.get(self.bank_name, GenericParser)
        parser = parser_class()
        return parser.parse(text, tables)

    def save_to_db(self, transactions: List[TransactionRaw]) -> PDFImportResult:
        pdf_import = PDFImport(
            user_id=self.user_id,
            filename=os.path.basename(self.filepath),
            bank_name=self.bank_name,
            status="procesando",
            transactions_found=len(transactions),
        )
        self.db.add(pdf_import)
        self.db.flush()

        imported = 0
        skipped = 0
        errors = []

        existing_txns = self.db.query(Transaction).filter(
            Transaction.user_id == self.user_id
        ).all()

        account = None
        if self.account_id:
            account = self.db.query(Account).filter(
                Account.id == self.account_id,
                Account.user_id == self.user_id
            ).first()

        for tx in transactions:
            if is_duplicate(tx.fecha, tx.cantidad, tx.referencia, tx.descripcion, existing_txns):
                skipped += 1
                continue
            category = None
            if tx.categoria_sugerida:
                category = self.db.query(Category).filter(
                    Category.name == tx.categoria_sugerida,
                    Category.user_id == self.user_id,
                ).first()
            if not category:
                category = self.db.query(Category).filter(
                    Category.is_system == True,
                    Category.type == ("ingreso" if tx.tipo == "ingreso" else "gasto"),
                ).first()

            try:
                new_tx = Transaction(
                    user_id=self.user_id,
                    account_id=account.id if account else 1,
                    category_id=category.id if category else 1,
                    fecha=tx.fecha,
                    tipo=tx.tipo,
                    cantidad=tx.cantidad,
                    descripcion=tx.descripcion,
                    referencia=tx.referencia,
                    pdf_import_id=pdf_import.id,
                    is_reconciled=False,
                )
                self.db.add(new_tx)
                imported += 1
            except Exception as e:
                errors.append(str(e))

        pdf_import.transactions_imported = imported
        pdf_import.status = "completado" if not errors else "revision"
        if errors:
            pdf_import.error_message = "; ".join(errors[:5])
        self.db.commit()

        return PDFImportResult(
            import_id=pdf_import.id,
            status=pdf_import.status,
            transactions_found=len(transactions),
            transactions_imported=imported,
            transactions_skipped=skipped,
            errors=errors,
        )

    def process(self) -> PDFImportResult:
        self.detect_bank()
        transactions = self.parse_transactions()
        return self.save_to_db(transactions)
