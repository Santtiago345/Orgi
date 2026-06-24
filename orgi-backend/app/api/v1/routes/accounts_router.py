from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.account import AccountCreate, AccountUpdate, AccountResponse, AccountWithHistoryResponse
from app.services.account_service import create_account, get_accounts, get_account, update_account, deactivate_account, recalculate_balance, get_account_balance_history

router = APIRouter()

@router.get("", response_model=List[AccountResponse])
def list_accounts(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    return get_accounts(db, user_id)

@router.post("", response_model=AccountResponse, status_code=201)
def create(current_user: dict = Depends(get_current_user), data: AccountCreate = None, db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    return create_account(db, user_id, data)

@router.get("/{account_id}", response_model=AccountWithHistoryResponse)
def detail(account_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    account = get_account(db, account_id, user_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    history = get_account_balance_history(db, account_id)
    response = AccountWithHistoryResponse(
        **{c: getattr(account, c) for c in AccountResponse.model_fields},
        balance_history=history,
    )
    return response

@router.put("/{account_id}", response_model=AccountResponse)
def update(account_id: int, data: AccountUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    account = update_account(db, account_id, user_id, data)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account

@router.delete("/{account_id}")
def delete(account_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    if not deactivate_account(db, account_id, user_id):
        raise HTTPException(status_code=404, detail="Account not found")
    return {"message": "Account deactivated"}

@router.post("/{account_id}/recalculate")
def recalc(account_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    account = get_account(db, account_id, user_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    balance = recalculate_balance(db, account_id)
    return {"balance": balance}
