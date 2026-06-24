from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetResponse
from app.services.budget_service import create_budget, get_budgets, update_budget, delete_budget

router = APIRouter()

@router.get("", response_model=List[BudgetResponse])
def list_budgets(month: int = Query(..., ge=1, le=12), year: int = Query(...), current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    return get_budgets(db, user_id, month, year)

@router.post("", response_model=BudgetResponse, status_code=201)
def create(data: BudgetCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    try:
        return create_budget(db, user_id, data)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.put("/{budget_id}", response_model=BudgetResponse)
def update(budget_id: int, data: BudgetUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    budget = update_budget(db, budget_id, user_id, data)
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    return budget

@router.delete("/{budget_id}")
def delete(budget_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    if not delete_budget(db, budget_id, user_id):
        raise HTTPException(status_code=404, detail="Budget not found")
    return {"message": "Budget deleted"}
