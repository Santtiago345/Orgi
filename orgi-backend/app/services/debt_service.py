from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from decimal import Decimal
from datetime import date

from app.models.debt import Debt
from app.models.debt_payment import DebtPayment
from app.schemas.debt import DebtCreate, DebtUpdate, DebtPaymentCreate

def create_debt(db: Session, user_id: int, data: DebtCreate) -> Debt:
    debt = Debt(
        user_id=user_id,
        name=data.name,
        creditor_name=data.creditor_name,
        type=data.type,
        original_amount=data.original_amount,
        current_balance=data.current_balance,
        interest_rate=data.interest_rate,
        monthly_payment=data.monthly_payment,
        start_date=data.start_date,
        end_date=data.end_date,
        next_payment_date=data.next_payment_date,
        notes=data.notes,
    )
    db.add(debt)
    db.commit()
    db.refresh(debt)
    return debt

def get_debts(db: Session, user_id: int, status: Optional[str] = None) -> List[Debt]:
    query = db.query(Debt).filter(Debt.user_id == user_id, Debt.is_active == True)
    if status:
        query = query.filter(Debt.status == status)
    return query.all()

def get_debt(db: Session, debt_id: int, user_id: int) -> Optional[Debt]:
    return db.query(Debt).filter(
        Debt.id == debt_id,
        Debt.user_id == user_id,
    ).first()

def update_debt(db: Session, debt_id: int, user_id: int, data: DebtUpdate) -> Optional[Debt]:
    debt = get_debt(db, debt_id, user_id)
    if not debt:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(debt, key, value)
    db.commit()
    db.refresh(debt)
    return debt

def register_payment(db: Session, debt_id: int, user_id: int, data: DebtPaymentCreate) -> Optional[DebtPayment]:
    debt = get_debt(db, debt_id, user_id)
    if not debt:
        return None

    interest = Decimal("0")
    principal = data.amount
    if debt.interest_rate and debt.current_balance:
        monthly_rate = Decimal(str(debt.interest_rate))
        interest = (debt.current_balance * monthly_rate) / Decimal("100")
        principal = data.amount - interest
        if principal < 0:
            principal = Decimal("0")

    payment = DebtPayment(
        debt_id=debt_id,
        payment_date=data.payment_date,
        amount=data.amount,
        principal_portion=principal,
        interest_portion=interest,
        notes=data.notes,
    )
    db.add(payment)

    debt.current_balance = max(Decimal("0"), debt.current_balance - data.amount)
    if debt.current_balance == 0:
        debt.status = "pagada"

    db.commit()
    db.refresh(payment)
    return payment

def get_debt_summary(db: Session, user_id: int) -> dict:
    total = db.query(func.coalesce(func.sum(Debt.current_balance), 0)).filter(
        Debt.user_id == user_id,
        Debt.is_active == True,
        Debt.status == "activa",
    ).scalar()

    active_count = db.query(func.count(Debt.id)).filter(
        Debt.user_id == user_id,
        Debt.is_active == True,
        Debt.status == "activa",
    ).scalar()

    overdue_count = db.query(func.count(Debt.id)).filter(
        Debt.user_id == user_id,
        Debt.is_active == True,
        Debt.status == "en_mora",
    ).scalar()

    next_payments = db.query(Debt).filter(
        Debt.user_id == user_id,
        Debt.is_active == True,
        Debt.status == "activa",
        Debt.next_payment_date.isnot(None),
    ).order_by(Debt.next_payment_date.asc()).limit(5).all()

    return {
        "total_debt": Decimal(str(total or 0)),
        "active_count": active_count or 0,
        "next_payments": [
            {"name": d.name, "amount": d.monthly_payment, "date": d.next_payment_date}
            for d in next_payments
        ],
        "overdue_count": overdue_count or 0,
    }
