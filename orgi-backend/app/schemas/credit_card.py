from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class CreditCardBase(BaseModel):
    name: str
    bank_name: Optional[str] = None
    last_four_digits: Optional[str] = Field(max_length=4, default=None)
    credit_limit: Decimal = Decimal("0")
    billing_cycle_day: int = Field(ge=1, le=31)
    payment_due_day: int = Field(ge=1, le=31)
    interest_rate: Optional[Decimal] = None
    color: Optional[str] = "#1A56DB"

class CreditCardCreate(CreditCardBase):
    current_balance: Decimal = Decimal("0")

class CreditCardUpdate(BaseModel):
    name: Optional[str] = None
    credit_limit: Optional[Decimal] = None
    billing_cycle_day: Optional[int] = None
    payment_due_day: Optional[int] = None
    color: Optional[str] = None
    is_active: Optional[bool] = None

class CreditCardResponse(CreditCardBase):
    id: int
    user_id: int
    current_balance: Decimal
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}

class CreditCardTransactionCreate(BaseModel):
    fecha: datetime
    descripcion: str
    cantidad: Decimal
    tipo: str = Field(pattern="^(cargo|abono|pago)$")
    category_id: Optional[int] = None

class CreditCardTransactionResponse(BaseModel):
    id: int
    credit_card_id: int
    fecha: datetime
    descripcion: str
    cantidad: Decimal
    tipo: str

    model_config = {"from_attributes": True}

class BillingPeriodResponse(BaseModel):
    period_start: datetime
    period_end: datetime
    total_cargos: Decimal
    total_abonos: Decimal
    balance: Decimal
