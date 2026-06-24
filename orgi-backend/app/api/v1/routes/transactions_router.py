from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionResponse, PaginatedTransactions
from app.services.transaction_service import create_transaction, get_transactions, get_transaction, update_transaction, delete_transaction

router = APIRouter()

@router.get("", response_model=PaginatedTransactions)
def list_transactions(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    tipo: Optional[str] = None,
    category_id: Optional[int] = None,
    account_id: Optional[int] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = int(current_user["sub"])
    filters = {
        "start_date": start_date,
        "end_date": end_date,
        "tipo": tipo,
        "category_id": category_id,
        "account_id": account_id,
        "search": search,
    }
    pagination = {"page": page, "per_page": per_page}
    return get_transactions(db, user_id, filters, pagination)

@router.post("", response_model=TransactionResponse, status_code=201)
def create(data: TransactionCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    try:
        return create_transaction(db, user_id, data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{tx_id}", response_model=TransactionResponse)
def detail(tx_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    tx = get_transaction(db, tx_id, user_id)
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return tx

@router.put("/{tx_id}", response_model=TransactionResponse)
def update(tx_id: int, data: TransactionUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    tx = update_transaction(db, user_id, tx_id, data)
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return tx

@router.delete("/{tx_id}")
def delete(tx_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    if not delete_transaction(db, user_id, tx_id):
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Transaction deleted"}

@router.get("/export/csv")
def export_csv(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    tipo: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    from fastapi.responses import StreamingResponse
    import io
    import csv

    user_id = int(current_user["sub"])
    filters = {"start_date": start_date, "end_date": end_date, "tipo": tipo}
    pagination = {"page": 1, "per_page": 10000}
    result = get_transactions(db, user_id, filters, pagination)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Fecha", "Tipo", "Cantidad", "Descripción", "Categoría", "Cuenta"])
    for tx in result["data"]:
        writer.writerow([tx.id, tx.fecha, tx.tipo, tx.cantidad, tx.descripcion, tx.category_id, tx.account_id])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=transactions.csv"},
    )
