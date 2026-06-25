from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from decimal import Decimal
from datetime import datetime

from app.models.transaction import Transaction
from app.models.account import Account
from app.schemas.transaction import TransactionCreate, TransactionUpdate
from app.utils.queries import get_paginated_transactions

def create_transaction(db: Session, user_id: int, data: TransactionCreate) -> Transaction:
    account = db.query(Account).filter(
        Account.id == data.account_id,
        Account.user_id == user_id,
    ).first()
    if not account:
        raise ValueError("Account not found")

    amount = data.cantidad
    if data.tipo == "gasto":
        account.balance = Decimal(str(account.balance or 0)) - amount
    elif data.tipo == "ingreso":
        account.balance = Decimal(str(account.balance or 0)) + amount

    transaction = Transaction(
        user_id=user_id,
        account_id=data.account_id,
        category_id=data.category_id,
        fecha=data.fecha,
        tipo=data.tipo,
        cantidad=amount,
        descripcion=data.descripcion,
        referencia=data.referencia,
        notes=data.notes,
    )
    db.add(transaction)
    db.commit()
    return transaction

def get_transactions(db: Session, user_id: int, filters: dict, pagination: dict):
    return get_paginated_transactions(
        db, user_id,
        page=pagination.get("page", 1),
        per_page=pagination.get("per_page", 20),
        start_date=filters.get("start_date"),
        end_date=filters.get("end_date"),
        tipo=filters.get("tipo"),
        category_id=filters.get("category_id"),
        account_id=filters.get("account_id"),
        search=filters.get("search"),
    )

def get_transaction(db: Session, tx_id: int, user_id: int) -> Optional[Transaction]:
    return db.query(Transaction).filter(
        Transaction.id == tx_id,
        Transaction.user_id == user_id,
    ).first()

def update_transaction(db: Session, user_id: int, tx_id: int, data: TransactionUpdate) -> Optional[Transaction]:
    tx = get_transaction(db, tx_id, user_id)
    if not tx:
        return None

    update_data = data.model_dump(exclude_unset=True)
    if "cantidad" in update_data or "category_id" in update_data:
        account = db.query(Account).filter(Account.id == tx.account_id).first()
        if account and "cantidad" in update_data:
            if tx.tipo == "ingreso":
                account.balance = Decimal(str(account.balance or 0)) - tx.cantidad + update_data["cantidad"]
            elif tx.tipo == "gasto":
                account.balance = Decimal(str(account.balance or 0)) + tx.cantidad - update_data["cantidad"]

    for key, value in update_data.items():
        setattr(tx, key, value)
    db.commit()
    db.refresh(tx)
    return tx

def delete_transaction(db: Session, user_id: int, tx_id: int) -> bool:
    tx = get_transaction(db, tx_id, user_id)
    if not tx:
        return False

    account = db.query(Account).filter(Account.id == tx.account_id).first()
    if account:
        if tx.tipo == "ingreso":
            account.balance = Decimal(str(account.balance or 0)) - tx.cantidad
        elif tx.tipo == "gasto":
            account.balance = Decimal(str(account.balance or 0)) + tx.cantidad

    db.delete(tx)
    db.commit()
    return True

def get_transactions_summary(db: Session, user_id: int, start_date: datetime, end_date: datetime) -> dict:
    incomes = db.query(func.coalesce(func.sum(Transaction.cantidad), 0)).filter(
        Transaction.user_id == user_id,
        Transaction.tipo == "ingreso",
        Transaction.fecha >= start_date,
        Transaction.fecha <= end_date,
    ).scalar()

    expenses = db.query(func.coalesce(func.sum(Transaction.cantidad), 0)).filter(
        Transaction.user_id == user_id,
        Transaction.tipo == "gasto",
        Transaction.fecha >= start_date,
        Transaction.fecha <= end_date,
    ).scalar()

    return {
        "ingresos_total": Decimal(str(incomes or 0)),
        "gastos_total": Decimal(str(expenses or 0)),
        "balance_neto": Decimal(str(incomes or 0)) - Decimal(str(expenses or 0)),
    }
