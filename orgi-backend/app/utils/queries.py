from sqlalchemy import func, extract, case
from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta
from decimal import Decimal
from typing import Optional
from app.models.transaction import Transaction
from app.models.account import Account
from app.models.category import Category
from app.models.debt import Debt
from app.models.debt_payment import DebtPayment

def get_total_balance(db: Session, user_id: int) -> Decimal:
    result = db.query(func.sum(Account.balance)).filter(
        Account.user_id == user_id,
        Account.is_active == True
    ).scalar()
    return result or Decimal("0.00")

def get_expenses_by_category(db: Session, user_id: int, start_date: datetime, end_date: datetime) -> list:
    results = db.query(
        Category.name,
        func.sum(Transaction.cantidad).label("total"),
        Category.color
    ).join(
        Transaction, Transaction.category_id == Category.id
    ).filter(
        Transaction.user_id == user_id,
        Transaction.tipo == "gasto",
        Transaction.fecha >= start_date,
        Transaction.fecha <= end_date,
        Category.is_system == True
    ).group_by(Category.name).all()
    return [{"categoria": r[0], "monto": r[1] or 0, "color": r[2]} for r in results]

def get_monthly_income_expense(db: Session, user_id: int, months: int = 12) -> list:
    since = datetime.now() - timedelta(days=30 * months)
    results = db.query(
        extract("year", Transaction.fecha).label("year"),
        extract("month", Transaction.fecha).label("month"),
        Transaction.tipo,
        func.sum(Transaction.cantidad).label("total"),
    ).filter(
        Transaction.user_id == user_id,
        Transaction.fecha >= since,
    ).group_by(
        extract("year", Transaction.fecha),
        extract("month", Transaction.fecha),
        Transaction.tipo,
    ).all()
    return [{"year": int(r[0]), "month": int(r[1]), "tipo": r[2], "total": r[3] or 0} for r in results]

def get_balance_history(db: Session, user_id: int, months: int = 12) -> list:
    since = datetime.now() - timedelta(days=30 * months)
    results = db.query(
        extract("year", Transaction.fecha).label("year"),
        extract("month", Transaction.fecha).label("month"),
        func.sum(case(
            (Transaction.tipo == "ingreso", Transaction.cantidad),
            else_=0
        )).label("ingresos"),
        func.sum(case(
            (Transaction.tipo == "gasto", Transaction.cantidad),
            else_=0
        )).label("gastos"),
    ).filter(
        Transaction.user_id == user_id,
        Transaction.fecha >= since,
    ).group_by(
        extract("year", Transaction.fecha),
        extract("month", Transaction.fecha),
    ).order_by("year", "month").all()
    return [{"year": int(r[0]), "month": int(r[1]), "ingresos": r[2] or 0, "gastos": r[3] or 0} for r in results]

def get_pending_debts(db: Session, user_id: int) -> list:
    return db.query(Debt).filter(
        Debt.user_id == user_id,
        Debt.status == "activa",
        Debt.is_active == True,
    ).order_by(Debt.next_payment_date.asc()).all()

def get_paginated_transactions(
    db: Session, user_id: int,
    page: int = 1, per_page: int = 20,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    tipo: Optional[str] = None,
    category_id: Optional[int] = None,
    account_id: Optional[int] = None,
    search: Optional[str] = None,
) -> dict:
    query = db.query(Transaction).filter(Transaction.user_id == user_id)

    if start_date:
        query = query.filter(Transaction.fecha >= start_date)
    if end_date:
        query = query.filter(Transaction.fecha <= end_date)
    if tipo:
        query = query.filter(Transaction.tipo == tipo)
    if category_id:
        query = query.filter(Transaction.category_id == category_id)
    if account_id:
        query = query.filter(Transaction.account_id == account_id)
    if search:
        query = query.filter(Transaction.descripcion.ilike(f"%{search}%"))

    total = query.count()
    total_pages = max(1, (total + per_page - 1) // per_page)
    items = query.order_by(Transaction.fecha.desc()).offset((page - 1) * per_page).limit(per_page).all()

    return {
        "data": items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
    }
