from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.debt import DebtCreate, DebtUpdate, DebtResponse, DebtWithPaymentsResponse, DebtPaymentCreate, DebtPaymentResponse, DebtSummaryResponse
from app.models.debt import Debt
from app.models.debt_payment import DebtPayment
from app.services.debt_service import create_debt, get_debts, get_debt, update_debt, register_payment, get_debt_summary

router = APIRouter()

@router.get("", response_model=List[DebtResponse])
def list_debts(
    status: Optional[str] = Query(None, pattern="^(activa|pagada|en_mora)$"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = int(current_user["sub"])
    return get_debts(db, user_id, status)

@router.post("", response_model=DebtResponse, status_code=201)
def create(data: DebtCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    return create_debt(db, user_id, data)

@router.get("/summary", response_model=DebtSummaryResponse)
def summary(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    return get_debt_summary(db, user_id)

@router.get("/{debt_id}", response_model=DebtWithPaymentsResponse)
def detail(debt_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    debt = get_debt(db, debt_id, user_id)
    if not debt:
        raise HTTPException(status_code=404, detail="Debt not found")
    payments = db.query(DebtPayment).filter(DebtPayment.debt_id == debt_id).all()
    response = DebtWithPaymentsResponse(
        **{c: getattr(debt, c) for c in DebtResponse.model_fields},
        payments=[DebtPaymentResponse.model_validate(p) for p in payments],
    )
    return response

@router.put("/{debt_id}", response_model=DebtResponse)
def update(debt_id: int, data: DebtUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    debt = update_debt(db, debt_id, user_id, data)
    if not debt:
        raise HTTPException(status_code=404, detail="Debt not found")
    return debt

@router.post("/{debt_id}/payments", response_model=DebtPaymentResponse, status_code=201)
def make_payment(debt_id: int, data: DebtPaymentCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    payment = register_payment(db, debt_id, user_id, data)
    if not payment:
        raise HTTPException(status_code=404, detail="Debt not found")
    return payment
