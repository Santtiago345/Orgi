from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class TransactionBase(BaseModel):
    fecha: datetime
    tipo: str = Field(pattern="^(ingreso|gasto|transferencia)$")
    cantidad: Decimal = Field(gt=0)
    descripcion: Optional[str] = Field(max_length=500, default=None)
    referencia: Optional[str] = None
    notes: Optional[str] = None

class TransactionCreate(TransactionBase):
    account_id: int
    category_id: int

class TransactionUpdate(BaseModel):
    fecha: Optional[datetime] = None
    cantidad: Optional[Decimal] = None
    descripcion: Optional[str] = None
    category_id: Optional[int] = None
    notes: Optional[str] = None

class TransactionResponse(TransactionBase):
    id: int
    user_id: int
    account_id: int
    category_id: int
    is_reconciled: bool
    created_at: datetime

    model_config = {"from_attributes": True}

class PaginatedTransactions(BaseModel):
    data: List[TransactionResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
