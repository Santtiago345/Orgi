from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PDFUploadResponse(BaseModel):
    import_id: int
    status: str = "procesando"

class PDFImportResponse(BaseModel):
    id: int
    filename: str
    bank_name: Optional[str] = None
    status: str
    transactions_found: int
    transactions_imported: int
    error_message: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}

class TransactionConfirmItem(BaseModel):
    index: int
    category_id: Optional[int] = None
    descripcion: Optional[str] = None
    confirm: bool = True

class PDFConfirmRequest(BaseModel):
    transactions: List[TransactionConfirmItem]

class PDFConfirmResponse(BaseModel):
    import_id: int
    status: str
    imported_count: int
