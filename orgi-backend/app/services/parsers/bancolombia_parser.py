import re
from typing import List
from datetime import datetime
from decimal import Decimal
import pandas as pd
from app.services.parsers.types import TransactionRaw
from app.services.parsers.base_parser import BaseParser
from app.utils.pdf_cleaner import clean_amount_cop, clean_date, suggest_category

class BancolombiaParser(BaseParser):
    def parse(self, text: str, tables: List[pd.DataFrame]) -> List[TransactionRaw]:
        transactions = []
        for table in tables:
            if table.empty:
                continue
            headers = [str(h).lower() for h in table.columns]
            if any("fecha" in h for h in headers) and any("débito" in h or "crédito" in h or "debito" in h or "credito" in h for h in headers):
                for _, row in table.iterrows():
                    fecha_str = str(row.iloc[0])
                    desc = str(row.iloc[1]) if len(row) > 1 else ""
                    fecha = clean_date(fecha_str)
                    if not fecha:
                        continue
                    monto = Decimal("0")
                    tipo = "gasto"
                    if len(row) > 2:
                        deb_str = str(row.iloc[2]).replace("$", "").strip()
                        if deb_str and deb_str != "nan":
                            amt = clean_amount_cop(deb_str)
                            if amt > 0:
                                monto = amt
                                tipo = "gasto"
                    if monto == 0 and len(row) > 3:
                        cred_str = str(row.iloc[3]).replace("$", "").strip()
                        if cred_str and cred_str != "nan":
                            amt = clean_amount_cop(cred_str)
                            if amt > 0:
                                monto = amt
                                tipo = "ingreso"
                    if monto > 0:
                        cat, conf = suggest_category(desc)
                        transactions.append(TransactionRaw(
                            fecha=fecha,
                            descripcion=desc,
                            cantidad=monto,
                            tipo=tipo,
                            referencia=None,
                            categoria_sugerida=cat,
                            confianza=conf,
                        ))
        return transactions
