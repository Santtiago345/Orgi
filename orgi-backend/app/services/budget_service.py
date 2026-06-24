from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Optional

from app.models.budget import Budget
from app.schemas.budget import BudgetCreate, BudgetUpdate

def create_budget(db: Session, user_id: int, data: BudgetCreate) -> Budget:
    existing = db.query(Budget).filter(
        Budget.user_id == user_id,
        Budget.category_id == data.category_id,
        Budget.month == data.month,
        Budget.year == data.year,
    ).first()
    if existing:
        raise ValueError("Budget already exists for this category and period")

    budget = Budget(
        user_id=user_id,
        category_id=data.category_id,
        month=data.month,
        year=data.year,
        amount_limit=data.amount_limit,
    )
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget

def get_budgets(db: Session, user_id: int, month: int, year: int) -> list:
    return db.query(Budget).filter(
        Budget.user_id == user_id,
        Budget.month == month,
        Budget.year == year,
    ).all()

def update_budget(db: Session, budget_id: int, user_id: int, data: BudgetUpdate) -> Optional[Budget]:
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == user_id,
    ).first()
    if not budget:
        return None
    if data.amount_limit is not None:
        budget.amount_limit = data.amount_limit
    db.commit()
    db.refresh(budget)
    return budget

def delete_budget(db: Session, budget_id: int, user_id: int) -> bool:
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == user_id,
    ).first()
    if not budget:
        return False
    db.delete(budget)
    db.commit()
    return True
