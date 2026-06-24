from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal

class CategoryExpense(BaseModel):
    categoria: str
    monto: Decimal
    porcentaje: float
    color: Optional[str] = None

class MonthlySummaryResponse(BaseModel):
    ingresos_total: Decimal
    gastos_total: Decimal
    balance_neto: Decimal
    gastos_por_categoria: List[CategoryExpense]
    vs_mes_anterior: dict

class MonthlyDataPoint(BaseModel):
    mes: int
    monto: Decimal

class AnnualSummaryResponse(BaseModel):
    ingresos_por_mes: List[MonthlyDataPoint]
    gastos_por_mes: List[MonthlyDataPoint]
    top_categorias: List[dict]

class NetWorthResponse(BaseModel):
    activos: Decimal
    pasivos: Decimal
    patrimonio_neto: Decimal

class BudgetVsActualItem(BaseModel):
    categoria: str
    presupuestado: Decimal
    real: Decimal
    diferencia: Decimal
    porcentaje: float

class BudgetVsActualResponse(BaseModel):
    presupuestos: List[BudgetVsActualItem]
