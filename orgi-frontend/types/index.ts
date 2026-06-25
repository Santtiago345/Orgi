export interface User {
  id: number;
  email: string;
  full_name: string;
  currency: string;
  timezone: string;
  is_active: boolean;
}

export interface Account {
  id: number;
  user_id: number;
  name: string;
  type: "corriente" | "ahorros" | "efectivo" | "otro";
  bank_name?: string;
  balance: string;
  currency: string;
  color: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  user_id: number;
  name: string;
  type: "ingreso" | "gasto";
  color: string;
  icon?: string;
  parent_id?: number;
  is_system: boolean;
  created_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  account_id: number;
  category_id: number;
  fecha: string;
  tipo: "ingreso" | "gasto" | "transferencia";
  cantidad: string;
  descripcion?: string;
  referencia?: string;
  is_reconciled: boolean;
  notes?: string;
  created_at: string;
  account?: { id: number; name: string };
  category?: { id: number; name: string; color: string };
}

export interface CreditCard {
  id: number;
  user_id: number;
  name: string;
  bank_name?: string;
  last_four_digits?: string;
  credit_limit: string;
  current_balance: string;
  billing_cycle_day: number;
  payment_due_day: number;
  interest_rate?: string;
  color: string;
  is_active: boolean;
}

export interface Debt {
  id: number;
  user_id: number;
  name: string;
  creditor_name?: string;
  type: "prestamo" | "tarjeta" | "hipoteca" | "otro";
  original_amount: string;
  current_balance: string;
  interest_rate?: string;
  monthly_payment?: string;
  start_date?: string;
  end_date?: string;
  next_payment_date?: string;
  status: string;
  is_active: boolean;
}

export interface PDFImport {
  id: number;
  filename: string;
  bank_name?: string;
  status: string;
  transactions_found: number;
  transactions_imported: number;
  error_message?: string;
  created_at: string;
}

export interface MonthlySummary {
  ingresos_total: string;
  gastos_total: string;
  balance_neto: string;
  gastos_por_categoria: { categoria: string; monto: string; porcentaje: number; color?: string }[];
  vs_mes_anterior: { ingresos: number; gastos: number };
}

export interface NetWorth {
  activos: string;
  pasivos: string;
  patrimonio_neto: string;
}

export interface MonthlyDataPoint {
  mes: number;
  monto: number;
}

export interface AnnualSummary {
  ingresos_por_mes: MonthlyDataPoint[];
  gastos_por_mes: MonthlyDataPoint[];
  top_categorias: { categoria: string; total: number }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
