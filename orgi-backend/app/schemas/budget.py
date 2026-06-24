from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal

class BudgetBase(BaseModel):
    category_id: int
    month: int = Field(ge=1, le=12)
    year: int = Field(ge=2020, le=2100)
    amount_limit: Decimal = Field(gt=0)

class BudgetCreate(BudgetBase):
    pass

class BudgetUpdate(BaseModel):
    amount_limit: Optional[Decimal] = None

class BudgetResponse(BudgetBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = {"from_attributes": True}
