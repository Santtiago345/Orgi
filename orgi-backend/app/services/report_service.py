from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime
from decimal import Decimal
from typing import Optional

from app.models.transaction import Transaction
from app.models.account import Account
from app.models.debt import Debt
from app.models.category import Category
from app.models.budget import Budget
from app.schemas.report import (
    MonthlySummaryResponse, CategoryExpense,
    AnnualSummaryResponse, MonthlyDataPoint,
    NetWorthResponse, BudgetVsActualResponse, BudgetVsActualItem,
)

def get_monthly_summary(db: Session, user_id: int, year: int, month: int) -> MonthlySummaryResponse:
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)

    incomes = db.query(func.coalesce(func.sum(Transaction.cantidad), 0)).filter(
        Transaction.user_id == user_id,
        Transaction.tipo == "ingreso",
        Transaction.fecha >= start_date,
        Transaction.fecha < end_date,
    ).scalar()

    expenses = db.query(func.coalesce(func.sum(Transaction.cantidad), 0)).filter(
        Transaction.user_id == user_id,
        Transaction.tipo == "gasto",
        Transaction.fecha >= start_date,
        Transaction.fecha < end_date,
    ).scalar()

    expenses_by_cat = db.query(
        Category.name,
        func.sum(Transaction.cantidad).label("total"),
        Category.color,
    ).join(
        Transaction, Transaction.category_id == Category.id
    ).filter(
        Transaction.user_id == user_id,
        Transaction.tipo == "gasto",
        Transaction.fecha >= start_date,
        Transaction.fecha < end_date,
    ).group_by(Category.name).all()

    total_expenses = Decimal(str(expenses or 0))
    categories = []
    for name, total, color in expenses_by_cat:
        total_dec = Decimal(str(total or 0))
        pct = float(total_dec / total_expenses * 100) if total_expenses > 0 else 0
        categories.append(CategoryExpense(categoria=name, monto=total_dec, porcentaje=pct, color=color))

    # vs previous month
    prev_month = month - 1
    prev_year = year
    if prev_month == 0:
        prev_month = 12
        prev_year = year - 1
    prev_start = datetime(prev_year, prev_month, 1)
    prev_end = start_date
    prev_incomes = db.query(func.coalesce(func.sum(Transaction.cantidad), 0)).filter(
        Transaction.user_id == user_id,
        Transaction.tipo == "ingreso",
        Transaction.fecha >= prev_start,
        Transaction.fecha < prev_end,
    ).scalar()
    prev_expenses = db.query(func.coalesce(func.sum(Transaction.cantidad), 0)).filter(
        Transaction.user_id == user_id,
        Transaction.tipo == "gasto",
        Transaction.fecha >= prev_start,
        Transaction.fecha < prev_end,
    ).scalar()

    vs_previous = {
        "ingresos": float((Decimal(str(incomes or 0)) - Decimal(str(prev_incomes or 0))) / Decimal(str(prev_incomes or 1)) * 100),
        "gastos": float((Decimal(str(expenses or 0)) - Decimal(str(prev_expenses or 0))) / Decimal(str(prev_expenses or 1)) * 100),
    }

    return MonthlySummaryResponse(
        ingresos_total=Decimal(str(incomes or 0)),
        gastos_total=total_expenses,
        balance_neto=Decimal(str(incomes or 0)) - total_expenses,
        gastos_por_categoria=categories,
        vs_mes_anterior=vs_previous,
    )

def get_annual_summary(db: Session, user_id: int, year: int) -> AnnualSummaryResponse:
    start_date = datetime(year, 1, 1)
    end_date = datetime(year + 1, 1, 1)

    results = db.query(
        extract("month", Transaction.fecha).label("mes"),
        Transaction.tipo,
        func.sum(Transaction.cantidad).label("total"),
    ).filter(
        Transaction.user_id == user_id,
        Transaction.fecha >= start_date,
        Transaction.fecha < end_date,
    ).group_by(
        extract("month", Transaction.fecha),
        Transaction.tipo,
    ).all()

    incomes_by_month = {r[0]: r[2] for r in results if r[1] == "ingreso"}
    expenses_by_month = {r[0]: r[2] for r in results if r[1] == "gasto"}

    top_categories = db.query(
        Category.name,
        func.sum(Transaction.cantidad).label("total"),
    ).join(
        Transaction, Transaction.category_id == Category.id
    ).filter(
        Transaction.user_id == user_id,
        Transaction.tipo == "gasto",
        Transaction.fecha >= start_date,
        Transaction.fecha < end_date,
    ).group_by(Category.name).order_by(func.sum(Transaction.cantidad).desc()).limit(5).all()

    return AnnualSummaryResponse(
        ingresos_por_mes=[MonthlyDataPoint(mes=m, monto=Decimal(str(incomes_by_month.get(m, 0)))) for m in range(1, 13)],
        gastos_por_mes=[MonthlyDataPoint(mes=m, monto=Decimal(str(expenses_by_month.get(m, 0)))) for m in range(1, 13)],
        top_categorias=[{"categoria": c[0], "total": Decimal(str(c[1] or 0))} for c in top_categories],
    )

def get_net_worth(db: Session, user_id: int) -> NetWorthResponse:
    assets = db.query(func.coalesce(func.sum(Account.balance), 0)).filter(
        Account.user_id == user_id,
        Account.is_active == True,
    ).scalar()

    liabilities = db.query(func.coalesce(func.sum(Debt.current_balance), 0)).filter(
        Debt.user_id == user_id,
        Debt.is_active == True,
        Debt.status == "activa",
    ).scalar()

    return NetWorthResponse(
        activos=Decimal(str(assets or 0)),
        pasivos=Decimal(str(liabilities or 0)),
        patrimonio_neto=Decimal(str(assets or 0)) - Decimal(str(liabilities or 0)),
    )

def get_budget_vs_actual(db: Session, user_id: int, month: int, year: int) -> BudgetVsActualResponse:
    budgets = db.query(Budget).filter(
        Budget.user_id == user_id,
        Budget.month == month,
        Budget.year == year,
    ).all()

    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)

    items = []
    for b in budgets:
        actual = db.query(func.coalesce(func.sum(Transaction.cantidad), 0)).filter(
            Transaction.user_id == user_id,
            Transaction.category_id == b.category_id,
            Transaction.tipo == "gasto",
            Transaction.fecha >= start_date,
            Transaction.fecha < end_date,
        ).scalar()
        actual_dec = Decimal(str(actual or 0))
        diff = b.amount_limit - actual_dec
        pct = float(actual_dec / b.amount_limit * 100) if b.amount_limit > 0 else 0
        items.append(BudgetVsActualItem(
            categoria=b.category.name if b.category else f"Cat {b.category_id}",
            presupuestado=b.amount_limit,
            real=actual_dec,
            diferencia=diff,
            porcentaje=pct,
        ))

    return BudgetVsActualResponse(presupuestos=items)
