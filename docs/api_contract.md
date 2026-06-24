# Contrato de API - ORGI

Base URL: `/api/v1`
Formato: JSON
Auth: Bearer JWT (excepto `/auth/register` y `/auth/login`)

---

## Auth

### POST /auth/register
```
Request:  { email: string, password: string, full_name: string }
Response: { access_token: string, refresh_token: string, user: UserResponse }
Status:   201 Created | 409 Conflict (email duplicado) | 422 Validation Error
```

### POST /auth/login
```
Request:  { email: string, password: string }
Response: { access_token: string, refresh_token: string, user: UserResponse }
Status:   200 OK | 401 Unauthorized
```

### POST /auth/refresh
```
Request:  { refresh_token: string }
Response: { access_token: string, refresh_token: string }
Status:   200 OK | 401 Unauthorized
```

### POST /auth/logout
```
Request:  { refresh_token: string }
Response: { message: "Logged out" }
Status:   200 OK
```

### GET /auth/me
```
Response: UserResponse
Status:   200 OK | 401 Unauthorized
```

---

## Accounts

### GET /accounts
```
Query:    ?is_active=true
Response: Account[]
Status:   200 OK
```

### POST /accounts
```
Request:  { name: string, type: "corriente"|"ahorros"|"efectivo"|"otro",
            bank_name?: string, balance?: Decimal, color?: string, icon?: string }
Response: AccountResponse
Status:   201 Created | 422 Validation Error
```

### GET /accounts/{id}
```
Response: AccountWithHistoryResponse  (incluye balance_history: BalancePoint[])
Status:   200 OK | 404 Not Found
```

### PUT /accounts/{id}
```
Request:  { name?: string, bank_name?: string, color?: string, icon?: string, is_active?: boolean }
Response: AccountResponse
Status:   200 OK | 404 Not Found | 422 Validation Error
```

### DELETE /accounts/{id}
```
Response: { message: "Account deactivated" }
Status:   200 OK | 404 Not Found
```

### POST /accounts/{id}/recalculate
```
Response: { balance: Decimal }
Status:   200 OK | 404 Not Found
```

---

## Transactions

### GET /transactions
```
Query:    ?page=1&per_page=20&start_date=2026-01-01&end_date=2026-06-30
          &tipo=ingreso|gasto|transferencia&category_id=1&account_id=1
          &search=texto
Response: { data: TransactionResponse[], total: int, page: int,
            per_page: int, total_pages: int }
Status:   200 OK
```

### POST /transactions
```
Request:  { fecha: datetime, tipo: "ingreso"|"gasto"|"transferencia",
            cantidad: Decimal, descripcion: string, account_id: int,
            category_id: int, referencia?: string, notes?: string }
Response: TransactionResponse
Status:   201 Created | 404 (account/category no existe) | 422 Validation Error
```

### GET /transactions/{id}
```
Response: TransactionResponse (con relaciones account y category)
Status:   200 OK | 404 Not Found
```

### PUT /transactions/{id}
```
Request:  { fecha?: datetime, cantidad?: Decimal, descripcion?: string,
            category_id?: int, notes?: string }
Response: TransactionResponse
Status:   200 OK | 404 Not Found | 422 Validation Error
```

### DELETE /transactions/{id}
```
Response: { message: "Transaction deleted" }
Status:   200 OK | 404 Not Found
```

### GET /transactions/export/csv
```
Query:    ?start_date=&end_date=&tipo=&category_id=&account_id=
Response: CSV file (Content-Type: text/csv)
Status:   200 OK
```

---

## Categories

### GET /categories
```
Query:    ?type=ingreso|gasto
Response: CategoryResponse[]
Status:   200 OK
```

### POST /categories
```
Request:  { name: string, type: "ingreso"|"gasto", color?: string,
            icon?: string, parent_id?: int }
Response: CategoryResponse
Status:   201 Created | 422 Validation Error
```

### PUT /categories/{id}
```
Request:  { name?: string, color?: string, icon?: string }
Response: CategoryResponse
Status:   200 OK | 404 Not Found
```

### DELETE /categories/{id}
```
Response: { message: "Category deleted" }
Status:   200 OK | 404 Not Found | 409 Conflict (tiene transacciones)
```

---

## Debts

### GET /debts
```
Query:    ?status=activa|pagada|en_mora
Response: DebtResponse[]
Status:   200 OK
```

### POST /debts
```
Request:  { name: string, creditor_name: string,
            type: "prestamo"|"tarjeta"|"hipoteca"|"otro",
            original_amount: Decimal, current_balance: Decimal,
            interest_rate?: Decimal, monthly_payment?: Decimal,
            start_date: date, end_date?: date, next_payment_date?: date }
Response: DebtResponse
Status:   201 Created | 422 Validation Error
```

### GET /debts/{id}
```
Response: DebtWithPaymentsResponse  (incluye payments: DebtPaymentResponse[])
Status:   200 OK | 404 Not Found
```

### PUT /debts/{id}
```
Request:  { name?: string, current_balance?: Decimal, status?: string,
            monthly_payment?: Decimal, next_payment_date?: date, notes?: string }
Response: DebtResponse
Status:   200 OK | 404 Not Found
```

### POST /debts/{id}/payments
```
Request:  { payment_date: date, amount: Decimal, notes?: string }
Response: DebtPaymentResponse
Status:   201 Created | 404 Not Found | 422 Validation Error
```

### GET /debts/summary
```
Response: { total_debt: Decimal, active_count: int, next_payments: DebtPayment[],
            overdue_count: int }
Status:   200 OK
```

---

## Credit Cards

### GET /cards
```
Response: CreditCardResponse[]
Status:   200 OK
```

### POST /cards
```
Request:  { name: string, bank_name: string, last_four_digits: string,
            credit_limit: Decimal, billing_cycle_day: int (1-31),
            payment_due_day: int (1-31), interest_rate?: Decimal, color?: string }
Response: CreditCardResponse
Status:   201 Created | 422 Validation Error
```

### GET /cards/{id}
```
Response: CreditCardWithTransactionsResponse
Status:   200 OK | 404 Not Found
```

### PUT /cards/{id}
```
Request:  { name?: string, credit_limit?: Decimal, billing_cycle_day?: int,
            payment_due_day?: int, color?: string, is_active?: boolean }
Response: CreditCardResponse
Status:   200 OK | 404 Not Found
```

### POST /cards/{id}/transactions
```
Request:  { fecha: datetime, descripcion: string, cantidad: Decimal,
            tipo: "cargo"|"abono"|"pago", category_id?: int }
Response: CreditCardTransactionResponse
Status:   201 Created | 404 Not Found
```

### GET /cards/{id}/billing-periods
```
Response: BillingPeriodResponse[]
Status:   200 OK
```

---

## Reports

### GET /reports/monthly?year=2026&month=6
```
Response: { ingresos_total: Decimal, gastos_total: Decimal, balance_neto: Decimal,
            gastos_por_categoria: [{ categoria: string, monto: Decimal, porcentaje: float }],
            vs_mes_anterior: { ingresos: float, gastos: float } }
Status:   200 OK
```

### GET /reports/annual?year=2026
```
Response: { ingresos_por_mes: [{ mes: int, monto: Decimal }],
            gastos_por_mes: [{ mes: int, monto: Decimal }],
            top_categorias: [{ categoria: string, total: Decimal }] }
Status:   200 OK
```

### GET /reports/net-worth
```
Response: { activos: Decimal, pasivos: Decimal, patrimonio_neto: Decimal }
Status:   200 OK
```

### GET /reports/budget-vs-actual?month=6&year=2026
```
Response: { presupuestos: [{ categoria: string, presupuestado: Decimal,
                              real: Decimal, diferencia: Decimal, porcentaje: float }] }
Status:   200 OK
```

---

## Budgets

### GET /budgets?month=6&year=2026
```
Response: BudgetResponse[]
Status:   200 OK
```

### POST /budgets
```
Request:  { category_id: int, month: int, year: int, amount_limit: Decimal }
Response: BudgetResponse
Status:   201 Created | 409 Conflict (ya existe) | 422 Validation Error
```

### PUT /budgets/{id}
```
Request:  { amount_limit?: Decimal }
Response: BudgetResponse
Status:   200 OK | 404 Not Found
```

### DELETE /budgets/{id}
```
Response: { message: "Budget deleted" }
Status:   200 OK | 404 Not Found
```

---

## PDF Import

### POST /pdf/upload
```
Request:  multipart/form-data { file: PDF, account_id?: int }
Response: { import_id: int, status: "procesando" }
Status:   202 Accepted | 400 Bad Request (no PDF o >10MB) | 422 Validation Error
```

### GET /pdf/import/{import_id}
```
Response: { import_id: int, status: "procesando"|"completado"|"error"|"revision",
            filename: string, bank_name?: string, transactions_found: int,
            transactions_imported: int, error_message?: string,
            transactions?: TransactionRaw[] }
Status:   200 OK | 404 Not Found
```

### GET /pdf/imports
```
Query:    ?status=completado&page=1&per_page=20
Response: { data: PDFImportResponse[], total: int, page: int, per_page: int }
Status:   200 OK
```

### POST /pdf/import/{import_id}/confirm
```
Request:  { transactions: [{ index: int, category_id?: int, descripcion?: string,
                             confirm: boolean }] }
Response: { import_id: int, status: "completado", imported_count: int }
Status:   200 OK | 404 Not Found | 400 Bad Request
```

---

## Modelos de Respuesta

### UserResponse
```json
{ "id": 1, "email": "user@example.com", "full_name": "Juan Pérez",
  "currency": "COP", "timezone": "America/Bogota", "is_active": true }
```

### AccountResponse
```json
{ "id": 1, "user_id": 1, "name": "Cuenta Corriente", "type": "corriente",
  "bank_name": "Bancolombia", "balance": "1500000.00", "currency": "COP",
  "color": "#1A56DB", "icon": "wallet", "is_active": true,
  "created_at": "2026-01-01T00:00:00Z" }
```

### TransactionResponse
```json
{ "id": 1, "user_id": 1, "account_id": 1, "category_id": 3,
  "fecha": "2026-06-24T00:00:00Z", "tipo": "gasto", "cantidad": "45000.00",
  "descripcion": "Supermercado Éxito", "referencia": null,
  "is_reconciled": false, "notes": null,
  "account": { "id": 1, "name": "Cuenta Corriente" },
  "category": { "id": 3, "name": "Alimentación", "color": "#0EA472" },
  "created_at": "2026-06-24T00:00:00Z" }
```

### DebtResponse
```json
{ "id": 1, "user_id": 1, "name": "Préstamo Bancolombia",
  "creditor_name": "Bancolombia", "type": "prestamo",
  "original_amount": "10000000.00", "current_balance": "7500000.00",
  "interest_rate": 0.015, "monthly_payment": "500000.00",
  "start_date": "2026-01-15", "end_date": "2027-01-15",
  "next_payment_date": "2026-07-15", "status": "activa", "notes": null }
```

### CreditCardResponse
```json
{ "id": 1, "user_id": 1, "name": "Visa Oro", "bank_name": "Bancolombia",
  "last_four_digits": "1234", "credit_limit": "5000000.00",
  "current_balance": "1200000.00", "billing_cycle_day": 15,
  "payment_due_day": 5, "interest_rate": 0.029, "color": "#1A56DB",
  "is_active": true }
```
