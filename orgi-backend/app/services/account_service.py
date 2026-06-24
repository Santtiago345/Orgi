from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from decimal import Decimal
from datetime import datetime, timedelta

from app.models.account import Account
from app.models.transaction import Transaction
from app.schemas.account import AccountCreate, AccountUpdate, BalancePoint

def create_account(db: Session, user_id: int, data: AccountCreate) -> Account:
    account = Account(
        user_id=user_id,
        name=data.name,
        type=data.type,
        bank_name=data.bank_name,
        balance=data.balance or Decimal("0.00"),
        currency=data.currency,
        color=data.color,
        icon=data.icon,
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return account

def get_accounts(db: Session, user_id: int) -> List[Account]:
    return db.query(Account).filter(
        Account.user_id == user_id,
        Account.is_active == True,
    ).all()

def get_account(db: Session, account_id: int, user_id: int) -> Optional[Account]:
    return db.query(Account).filter(
        Account.id == account_id,
        Account.user_id == user_id,
    ).first()

def update_account(db: Session, account_id: int, user_id: int, data: AccountUpdate) -> Optional[Account]:
    account = get_account(db, account_id, user_id)
    if not account:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(account, key, value)
    db.commit()
    db.refresh(account)
    return account

def deactivate_account(db: Session, account_id: int, user_id: int) -> bool:
    account = get_account(db, account_id, user_id)
    if not account:
        return False
    account.is_active = False
    db.commit()
    return True

def recalculate_balance(db: Session, account_id: int) -> Decimal:
    incomes = db.query(func.coalesce(func.sum(Transaction.cantidad), 0)).filter(
        Transaction.account_id == account_id,
        Transaction.tipo == "ingreso",
    ).scalar()

    expenses = db.query(func.coalesce(func.sum(Transaction.cantidad), 0)).filter(
        Transaction.account_id == account_id,
        Transaction.tipo == "gasto",
    ).scalar()

    balance = Decimal(str(incomes or 0)) - Decimal(str(expenses or 0))
    db.query(Account).filter(Account.id == account_id).update({"balance": balance})
    db.commit()
    return balance

def get_account_balance_history(db: Session, account_id: int, months: int = 12) -> List[BalancePoint]:
    since = datetime.now() - timedelta(days=30 * months)
    results = db.query(
        func.date(Transaction.fecha).label("fecha"),
        func.sum(Transaction.cantidad).label("total"),
        Transaction.tipo,
    ).filter(
        Transaction.account_id == account_id,
        Transaction.fecha >= since,
    ).group_by(
        func.date(Transaction.fecha),
        Transaction.tipo,
    ).all()

    balance = Decimal("0")
    history = []
    for r in sorted(results, key=lambda x: x[0]):
        if r.tipo == "ingreso":
            balance += Decimal(str(r.total))
        else:
            balance -= Decimal(str(r.total))
        history.append(BalancePoint(fecha=r[0], balance=balance))

    return history
