from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.report import MonthlySummaryResponse, AnnualSummaryResponse, NetWorthResponse, BudgetVsActualResponse
from app.services.report_service import get_monthly_summary, get_annual_summary, get_net_worth, get_budget_vs_actual

router = APIRouter()

@router.get("/monthly", response_model=MonthlySummaryResponse)
def monthly(year: int = Query(...), month: int = Query(..., ge=1, le=12), current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    return get_monthly_summary(db, user_id, year, month)

@router.get("/annual", response_model=AnnualSummaryResponse)
def annual(year: int = Query(...), current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    return get_annual_summary(db, user_id, year)

@router.get("/net-worth", response_model=NetWorthResponse)
def net_worth(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    return get_net_worth(db, user_id)

@router.get("/budget-vs-actual", response_model=BudgetVsActualResponse)
def budget_vs_actual(month: int = Query(..., ge=1, le=12), year: int = Query(...), current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    return get_budget_vs_actual(db, user_id, month, year)
