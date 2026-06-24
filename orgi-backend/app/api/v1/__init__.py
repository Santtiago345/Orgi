from fastapi import APIRouter
from app.api.v1.routes import auth_router, accounts_router, transactions_router, debts_router, cards_router, reports_router, budgets_router, categories_router, pdf_router

router = APIRouter()
router.include_router(auth_router.router, prefix="/auth", tags=["Auth"])
router.include_router(accounts_router.router, prefix="/accounts", tags=["Accounts"])
router.include_router(transactions_router.router, prefix="/transactions", tags=["Transactions"])
router.include_router(debts_router.router, prefix="/debts", tags=["Debts"])
router.include_router(cards_router.router, prefix="/cards", tags=["Credit Cards"])
router.include_router(reports_router.router, prefix="/reports", tags=["Reports"])
router.include_router(budgets_router.router, prefix="/budgets", tags=["Budgets"])
router.include_router(categories_router.router, prefix="/categories", tags=["Categories"])
router.include_router(pdf_router.router, prefix="/pdf", tags=["PDF Import"])
