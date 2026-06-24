from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal

class DebtBase(BaseModel):
    name: str
    creditor_name: Optional[str] = None
    type: str = Field(pattern="^(prestamo|tarjeta|hipoteca|otro)$")
    original_amount: Decimal = Decimal("0")
    current_balance: Decimal = Decimal("0")
    interest_rate: Optional[Decimal] = None
    monthly_payment: Optional[Decimal] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    next_payment_date: Optional[date] = None
    notes: Optional[str] = None

class DebtCreate(DebtBase):
    pass

class DebtUpdate(BaseModel):
    name: Optional[str] = None
    current_balance: Optional[Decimal] = None
    monthly_payment: Optional[Decimal] = None
    next_payment_date: Optional[date] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class DebtResponse(DebtBase):
    id: int
    user_id: int
    status: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}

class DebtPaymentCreate(BaseModel):
    payment_date: date
    amount: Decimal = Field(gt=0)
    notes: Optional[str] = None

class DebtPaymentResponse(BaseModel):
    id: int
    debt_id: int
    payment_date: date
    amount: Decimal
    principal_portion: Optional[Decimal] = None
    interest_portion: Optional[Decimal] = None

    model_config = {"from_attributes": True}

class DebtWithPaymentsResponse(DebtResponse):
    payments: List[DebtPaymentResponse] = []

class DebtSummaryResponse(BaseModel):
    total_debt: Decimal
    active_count: int
    next_payments: List[dict]
    overdue_count: int
