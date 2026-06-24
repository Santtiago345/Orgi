from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CategoryBase(BaseModel):
    name: str = Field(max_length=255)
    type: str = Field(pattern="^(ingreso|gasto)$")
    color: Optional[str] = "#6B7280"
    icon: Optional[str] = None
    parent_id: Optional[int] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None

class CategoryResponse(CategoryBase):
    id: int
    user_id: int
    is_system: bool
    created_at: datetime

    model_config = {"from_attributes": True}
