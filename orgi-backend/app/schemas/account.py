from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class AccountBase(BaseModel):
    name: str = Field(max_length=255)
    type: str = Field(pattern="^(corriente|ahorros|efectivo|otro)$")
    bank_name: Optional[str] = None
    balance: Optional[Decimal] = Decimal("0.00")
    currency: str = "COP"
    color: Optional[str] = "#1A56DB"
    icon: Optional[str] = None

class AccountCreate(AccountBase):
    pass

class AccountUpdate(BaseModel):
    name: Optional[str] = None
    bank_name: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    is_active: Optional[bool] = None

class AccountResponse(AccountBase):
    id: int
    user_id: int
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}

class BalancePoint(BaseModel):
    fecha: datetime
    balance: Decimal

class AccountWithHistoryResponse(AccountResponse):
    balance_history: List[BalancePoint] = []
