from dataclasses import dataclass
from decimal import Decimal
from datetime import datetime
from typing import List, Optional


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
