# Estructura de Directorios - ORGI

```
orgi/
│
├── README.md
├── docker-compose.yml
├── .gitignore
│
├── orgi-backend/                          # FastAPI + Python 3.11
│   ├── .env.example
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── railway.toml
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                        # FastAPI app, CORS, routers
│   │   │
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       └── routes/
│   │   │           ├── __init__.py
│   │   │           ├── auth_router.py
│   │   │           ├── accounts_router.py
│   │   │           ├── transactions_router.py
│   │   │           ├── debts_router.py
│   │   │           ├── cards_router.py
│   │   │           ├── reports_router.py
│   │   │           ├── budgets_router.py
│   │   │           ├── categories_router.py
│   │   │           └── pdf_router.py
│   │   │
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py                  # Pydantic Settings
│   │   │   ├── database.py                # Engine, SessionLocal, Base
│   │   │   ├── security.py                # JWT, hashing
│   │   │   └── exception_handlers.py      # Errores globales
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── base.py                    # TimestampMixin
│   │   │   ├── user.py
│   │   │   ├── account.py
│   │   │   ├── category.py
│   │   │   ├── transaction.py
│   │   │   ├── credit_card.py
│   │   │   ├── credit_card_transaction.py
│   │   │   ├── debt.py
│   │   │   ├── debt_payment.py
│   │   │   ├── pdf_import.py
│   │   │   └── budget.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── account.py
│   │   │   ├── category.py
│   │   │   ├── transaction.py
│   │   │   ├── credit_card.py
│   │   │   ├── debt.py
│   │   │   ├── pdf_import.py
│   │   │   ├── budget.py
│   │   │   └── report.py
│   │   │
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── transaction_service.py
│   │   │   ├── account_service.py
│   │   │   ├── debt_service.py
│   │   │   ├── report_service.py
│   │   │   ├── pdf_service.py
│   │   │   ├── budget_service.py
│   │   │   └── parsers/
│   │   │       ├── __init__.py
│   │   │       ├── base_parser.py
│   │   │       ├── bancolombia_parser.py
│   │   │       ├── davivienda_parser.py
│   │   │       ├── bbva_parser.py
│   │   │       └── generic_parser.py
│   │   │
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── pdf_cleaner.py
│   │       ├── queries.py
│   │       └── inspect_existing_db.py     # Migración desde MyFinance.db
│   │
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   ├── test_auth.py
│   │   ├── test_transactions.py
│   │   ├── test_debts.py
│   │   ├── test_pdf_cleaner.py
│   │   ├── test_reports.py
│   │   └── integration/
│   │       ├── __init__.py
│   │       ├── test_full_transaction_flow.py
│   │       └── test_full_debt_flow.py
│   │
│   └── alembic/
│       ├── alembic.ini
│       ├── env.py
│       └── versions/
│           ├── 001_initial_schema.py
│           └── 002_seed_categories.py
│
├── orgi-frontend/                         # Next.js 14 + TypeScript
│   ├── .env.local.example
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── vercel.json
│   │
│   ├── app/
│   │   ├── layout.tsx                     # Layout raíz (providers, fonts)
│   │   ├── page.tsx                       # Redirect a /dashboard o /login
│   │   │
│   │   ├── (auth)/
│   │   │   ├── layout.tsx                 # Layout centrado sin sidebar
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                 # Layout con sidebar + header
│   │   │   ├── page.tsx                   # Dashboard (KPIs + gráficas)
│   │   │   ├── transactions/
│   │   │   │   └── page.tsx
│   │   │   ├── accounts/
│   │   │   │   └── page.tsx
│   │   │   ├── cards/
│   │   │   │   └── page.tsx
│   │   │   ├── debts/
│   │   │   │   └── page.tsx
│   │   │   ├── budgets/
│   │   │   │   └── page.tsx
│   │   │   ├── pdf/
│   │   │   │   └── page.tsx
│   │   │   └── reports/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/                           # API routes de Next.js (proxy)
│   │       └── [...path]/
│   │           └── route.ts
│   │
│   ├── components/
│   │   ├── ui/                            # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   ├── dashboard/
│   │   │   ├── KPICard.tsx
│   │   │   └── TransactionsList.tsx
│   │   ├── charts/
│   │   │   ├── IncomeExpenseChart.tsx
│   │   │   └── CategoryDonutChart.tsx
│   │   ├── transactions/
│   │   │   ├── TransactionTable.tsx
│   │   │   └── TransactionForm.tsx
│   │   └── pdf/
│   │       └── PDFUploader.tsx
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts                  # Axios instance
│   │   │   ├── auth.ts
│   │   │   ├── accounts.ts
│   │   │   ├── transactions.ts
│   │   │   ├── debts.ts
│   │   │   ├── cards.ts
│   │   │   ├── reports.ts
│   │   │   ├── pdf.ts
│   │   │   ├── categories.ts
│   │   │   └── budgets.ts
│   │   └── hooks/
│   │       ├── useAuth.ts
│   │       ├── useTransactions.ts
│   │       └── useDashboard.ts
│   │
│   ├── store/
│   │   ├── auth.store.ts
│   │   └── ui.store.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── middleware.ts
│   │
│   └── tests/
│       ├── vitest.config.ts
│       └── components/
│           ├── MoneyAmount.test.tsx
│           ├── KPICard.test.tsx
│           └── TransactionForm.test.tsx
│
├── docs/
│   ├── architecture.md
│   ├── project_structure.md
│   ├── api_contract.md
│   ├── modules_matrix.md
│   ├── design_system.md
│   ├── wireframes.md
│   ├── components_spec.md
│   ├── BACKLOG.md
│   ├── CALENDARIO.md
│   └── deployment.md
│
├── Database app/
│   └── MyFinance.db                       # Datos históricos (Android app)
│
└── .github/
    ├── workflows/
    │   ├── ci.yml
    │   └── deploy.yml
    └── PULL_REQUEST_TEMPLATE.md
```
