from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from decimal import Decimal
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.credit_card import CreditCard
from app.models.credit_card_transaction import CreditCardTransaction
from app.schemas.credit_card import (
    CreditCardCreate, CreditCardUpdate, CreditCardResponse,
    CreditCardTransactionCreate, CreditCardTransactionResponse, BillingPeriodResponse,
)

router = APIRouter()

@router.get("", response_model=List[CreditCardResponse])
def list_cards(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    return db.query(CreditCard).filter(CreditCard.user_id == user_id, CreditCard.is_active == True).all()

@router.post("", response_model=CreditCardResponse, status_code=201)
def create(data: CreditCardCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    card = CreditCard(user_id=user_id, **data.model_dump())
    db.add(card)
    db.commit()
    db.refresh(card)
    return card

@router.get("/{card_id}", response_model=CreditCardResponse)
def detail(card_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    card = db.query(CreditCard).filter(CreditCard.id == card_id, CreditCard.user_id == user_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Credit card not found")
    return card

@router.put("/{card_id}", response_model=CreditCardResponse)
def update(card_id: int, data: CreditCardUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    card = db.query(CreditCard).filter(CreditCard.id == card_id, CreditCard.user_id == user_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Credit card not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(card, key, value)
    db.commit()
    db.refresh(card)
    return card

@router.post("/{card_id}/transactions", response_model=CreditCardTransactionResponse, status_code=201)
def add_transaction(card_id: int, data: CreditCardTransactionCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    card = db.query(CreditCard).filter(CreditCard.id == card_id, CreditCard.user_id == user_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Credit card not found")

    tx = CreditCardTransaction(
        credit_card_id=card_id,
        category_id=data.category_id,
        fecha=data.fecha,
        descripcion=data.descripcion,
        cantidad=data.cantidad,
        tipo=data.tipo,
    )
    if data.tipo == "cargo":
        card.current_balance = Decimal(str(card.current_balance or 0)) + data.cantidad
    elif data.tipo == "abono" or data.tipo == "pago":
        card.current_balance = max(Decimal("0"), Decimal(str(card.current_balance or 0)) - data.cantidad)

    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx

@router.get("/{card_id}/billing-periods", response_model=List[BillingPeriodResponse])
def billing_periods(card_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    card = db.query(CreditCard).filter(CreditCard.id == card_id, CreditCard.user_id == user_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Credit card not found")

    periods = []
    now = datetime.now()
    for i in range(6):
        cycle_day = card.billing_cycle_day or 1
        period_end = datetime(now.year, now.month, 1) - timedelta(days=30 * i)
        period_start = period_end - timedelta(days=30)

        cargos = db.query(CreditCardTransaction).filter(
            CreditCardTransaction.credit_card_id == card_id,
            CreditCardTransaction.tipo == "cargo",
            CreditCardTransaction.fecha >= period_start,
            CreditCardTransaction.fecha < period_end,
        ).all()

        abonos = db.query(CreditCardTransaction).filter(
            CreditCardTransaction.credit_card_id == card_id,
            CreditCardTransaction.tipo.in_(["abono", "pago"]),
            CreditCardTransaction.fecha >= period_start,
            CreditCardTransaction.fecha < period_end,
        ).all()

        total_cargos = sum(tx.cantidad for tx in cargos) if cargos else Decimal("0")
        total_abonos = sum(tx.cantidad for tx in abonos) if abonos else Decimal("0")

        periods.append(BillingPeriodResponse(
            period_start=period_start,
            period_end=period_end,
            total_cargos=Decimal(str(total_cargos)),
            total_abonos=Decimal(str(total_abonos)),
            balance=Decimal(str(total_cargos)) - Decimal(str(total_abonos)),
        ))

    return periods
