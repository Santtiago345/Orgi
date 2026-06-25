# ORGI — Estructura Completa del Proyecto

> Aplicación Web de Gestión Financiera Personal
> Stack: Next.js 14 (App Router) + FastAPI + SQLite/PostgreSQL

---

## 1. ARQUITECTURA GENERAL

```
orgi/
├── PROMPT_MAESTRO_FINANZAS.md    ← Orquestación del sistema multi-agente
├── docker-compose.yml             ← Entorno local con Docker
├── Makefile                       ← Comandos de desarrollo
├── README.md
├── .gitignore
├── .github/                       ← CI/CD (GitHub Actions)
│
├── orgi-frontend/                 ← Next.js 14 + TypeScript + Tailwind
│
├── orgi-backend/                  ← FastAPI + SQLAlchemy + Alembic
│
├── Database app/                  ← DB SQLite con datos históricos
│   └── MyFinance.db
│
├── docs/                          ← Documentación
├── pdf bancos/                    ← Extractos PDF de ejemplo
└── SESION_COMPACT.md
```

---

## 2. FRONTEND (`orgi-frontend/`)

### 2.1 Estructura de Directorios

```
orgi-frontend/
├── app/                           ← App Router (Next.js 14)
│   ├── layout.tsx                 ← Layout raíz (fonts, metadata)
│   ├── providers.tsx              ← QueryClient + AuthHydrate
│   ├── globals.css                ← Estilos globales + animaciones + componentes
│   │
│   ├── (auth)/                    ← Grupo de autenticación
│   │   ├── layout.tsx             ← Layout auth (fondo degradado, logo)
│   │   ├── login/page.tsx         ← Página de inicio de sesión
│   │   └── register/page.tsx      ← Página de registro
│   │
│   ├── (dashboard)/               ← Grupo protegido (requiere auth)
│   │   ├── layout.tsx             ← Sidebar + Header + main content
│   │   ├── page.tsx               ← Dashboard principal (KPIs, gráficas)
│   │   ├── accounts/page.tsx      ← Gestión de cuentas bancarias
│   │   ├── budgets/page.tsx       ← Presupuestos por categoría
│   │   ├── cards/page.tsx         ← Tarjetas de crédito
│   │   ├── debts/page.tsx         ← Gestión de deudas
│   │   ├── pdf/page.tsx           ← Importación de extractos PDF
│   │   ├── reports/page.tsx       ← Reportes y gráficas
│   │   └── transactions/page.tsx  ← CRUD de transacciones
│   │
│   ├── auth/                      ← (vacío, legacy)
│   └── dashboard/                 ← (vacío, legacy)
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx            ← Navegación lateral (colapsable, animada)
│   │   └── Header.tsx             ← Barra superior (sticky, búsqueda, usuario)
│   │
│   ├── dashboard/
│   │   ├── KPICard.tsx            ← Tarjeta de KPI con animación de entrada
│   │   └── TransactionsList.tsx   ← Lista de últimas transacciones
│   │
│   ├── charts/
│   │   ├── IncomeExpenseChart.tsx ← BarChart ingresos vs gastos (Recharts)
│   │   └── CategoryDonutChart.tsx ← DonutChart distribución de gastos
│   │
│   ├── transactions/
│   │   ├── TransactionTable.tsx   ← Tabla paginada con filtros
│   │   └── TransactionForm.tsx    ← Modal de creación/edición (react-hook-form + zod)
│   │
│   ├── pdf/
│   │   └── PDFUploader.tsx        ← Drag & drop upload de PDF
│   │
│   ├── MoneyAmount.tsx            ← Componente atómico de montos COP
│   └── ui/                        ← (shadcn/ui components)
│
├── lib/
│   ├── utils.ts                   ← Utilidades: cn(), formatCOP(), formatDate(), etc.
│   ├── api/
│   │   ├── client.ts              ← Axios instance + interceptors (auth)
│   │   ├── auth.ts                ← login, register, refreshToken, getMe
│   │   ├── accounts.ts            ← CRUD cuentas
│   │   ├── transactions.ts        ← CRUD transacciones
│   │   ├── categories.ts          ← CRUD categorías
│   │   ├── debts.ts               ← CRUD deudas + pagos
│   │   ├── cards.ts               ← CRUD tarjetas
│   │   ├── reports.ts             ← Reportes (monthly, annual, netWorth)
│   │   ├── pdf.ts                 ← Upload, status, confirm import
│   │   └── budgets.ts             ← CRUD presupuestos
│   │
│   └── hooks/
│       ├── useAuth.ts             ← Hook de autenticación (login, register, logout)
│       ├── useDashboard.ts        ← Hook que combina queries del dashboard
│       └── useTransactions.ts     ← Hook con queries + mutations de transacciones
│
├── store/
│   ├── auth.store.ts              ← Zustand: user, accessToken, login/logout/hydrate
│   └── ui.store.ts                ← Zustand: sidebarOpen, sidebarPinned
│
├── types/
│   └── index.ts                   ← Interfaces: User, Account, Transaction, etc.
│
├── tests/                         ← Tests con Vitest
├── middleware.ts                   ← Protección de rutas (redirect si no auth)
├── tailwind.config.ts             ← Design tokens + animaciones
├── next.config.js                 ← Configuración Next.js
├── tsconfig.json                  ← TypeScript strict
├── vercel.json                    ← Configuración Vercel deploy
├── package.json                   ← Dependencias
├── .env.local.example             ← Variables de entorno
└── next-env.d.ts
```

### 2.2 Tipos TypeScript (`types/index.ts`)

```typescript
User        { id, email, full_name, currency, timezone, is_active }
Account     { id, user_id, name, type, bank_name, balance, currency, color, icon, is_active }
Category    { id, user_id, name, type, color, icon, parent_id, is_system }
Transaction { id, user_id, account_id, category_id, fecha, tipo, cantidad, descripcion,
              referencia, pdf_import_id, is_reconciled, notes, account, category }
CreditCard  { id, user_id, name, bank_name, last_four_digits, credit_limit,
              current_balance, billing_cycle_day, payment_due_day, interest_rate, color }
Debt        { id, user_id, name, creditor_name, type, original_amount, current_balance,
              interest_rate, monthly_payment, start_date, end_date, next_payment_date, status }
PDFImport   { id, filename, bank_name, status, transactions_found, transactions_imported }
Budget      { id, user_id, category_id, month, year, amount_limit, category }
MonthlySummary { ingresos_total, gastos_total, balance_neto, gastos_por_categoria, vs_mes_anterior }
NetWorth    { activos, pasivos, patrimonio_neto }
```

### 2.3 Design System (`tailwind.config.ts`)

| Token | Valor |
|---|---|
| `primary` | `#1A56DB` |
| `primary-dark` | `#1243B0` |
| `success` | `#0EA472` |
| `danger` | `#E02424` |
| `warning` | `#FF8800` |
| `sidebar` | `#0F172A` |
| `surface` | `#F8FAFC` |
| Font sans | Inter |
| Font mono | JetBrains Mono |
| Animaciones | fade-in, fade-in-up, fade-in-down, fade-in-left/right, scale-in, slide-in-left, skeleton-pulse |

### 2.4 Animaciones CSS Disponibles

| Clase | Uso |
|---|---|
| `animate-fade-in` | Aparición suave (0.5s) |
| `animate-fade-in-up` | Aparición desde abajo (12px) |
| `animate-fade-in-down` | Aparición desde arriba |
| `animate-fade-in-left` | Aparición desde izquierda |
| `animate-fade-in-right` | Aparición desde derecha |
| `animate-scale-in` | Escalar desde 0.95 |
| `animate-slide-in-left` | Slide lateral (sidebar) |
| `animation-delay-{100..800}` | Delay progresivo para listas |
| `skeleton` | Skeleton loading pulso |

### 2.5 Componentes CSS Clase

| Clase | Propósito |
|---|---|
| `input-field` | Inputs con focus ring |
| `btn-primary` | Botón primario azul |
| `btn-secondary` | Botón secundario outline |
| `card` | Card blanca con sombra |
| `card-hover` | Card con hover lift |
| `empty-state` | Estado vacío centrado |
| `badge` / `badge-{success,danger,warning,neutral}` | Etiquetas de estado |

---

## 3. BACKEND (`orgi-backend/`)

### 3.1 Estructura de Directorios

```
orgi-backend/
├── app/
│   ├── main.py                    ← FastAPI app con CORS + routers
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py        ← Router agregador
│   │       └── routes/
│   │           ├── auth_router.py       ← POST login, register, refresh, logout
│   │           ├── accounts_router.py   ← CRUD cuentas + recalcular balance
│   │           ├── transactions_router.py ← CRUD transacciones + export CSV
│   │           ├── categories_router.py ← CRUD categorías
│   │           ├── debts_router.py      ← CRUD deudas + pagos + summary
│   │           ├── cards_router.py      ← CRUD tarjetas + transacciones
│   │           ├── reports_router.py    ← Reportes monthly/annual/net-worth
│   │           ├── budgets_router.py    ← CRUD presupuestos
│   │           └── pdf_router.py        ← Upload/status/confirm imports
│   │
│   ├── core/
│   │   ├── config.py              ← Settings (pydantic-settings)
│   │   ├── database.py            ← Engine + SessionLocal + get_db
│   │   ├── security.py            ← JWT creation/verification + password hashing
│   │   └── exception_handlers.py  ← Manejo global de errores
│   │
│   ├── models/                    ← SQLAlchemy models
│   │   ├── base.py                ← TimestampMixin
│   │   ├── users.py
│   │   ├── accounts.py
│   │   ├── categories.py
│   │   ├── transactions.py
│   │   ├── credit_cards.py
│   │   ├── credit_card_transactions.py
│   │   ├── debts.py
│   │   ├── debt_payments.py
│   │   ├── pdf_imports.py
│   │   └── budgets.py
│   │
│   ├── schemas/                   ← Pydantic schemas (Base, Create, Update, Response)
│   │   ├── auth.py
│   │   ├── accounts.py
│   │   ├── categories.py
│   │   ├── transactions.py
│   │   ├── credit_cards.py
│   │   ├── debts.py
│   │   ├── pdf_imports.py
│   │   ├── budgets.py
│   │   └── reports.py
│   │
│   ├── services/                  ← Lógica de negocio
│   │   ├── transaction_service.py ← create/get/update/delete + balance update
│   │   ├── account_service.py     ← create/get/recalculate balance
│   │   ├── debt_service.py        ← create/register payment/summary
│   │   ├── report_service.py      ← monthly/annual/net-worth summaries
│   │   ├── pdf_service.py         ← PDFProcessor (detect → extract → parse → save)
│   │   └── parsers/
│   │       ├── base_parser.py     ← Clase abstracta BaseParser
│   │       ├── bancolombia_parser.py
│   │       ├── davivienda_parser.py
│   │       ├── bbva_parser.py
│   │       └── generic_parser.py
│   │
│   └── utils/
│       ├── pdf_cleaner.py         ← clean_amount_cop, clean_date, suggest_category
│       ├── queries.py             ← Queries optimizadas SQLAlchemy
│       └── inspect_existing_db.py ← Script para migrar .db existente
│
├── tests/
│   ├── conftest.py                ← Fixtures (db memory, user, account, auth headers)
│   ├── test_auth.py
│   ├── test_transactions.py       ← Tests críticos de balance
│   ├── test_debts.py
│   ├── test_pdf_cleaner.py
│   ├── test_reports.py
│   └── integration/
│       ├── test_full_transaction_flow.py
│       └── test_full_debt_flow.py
│
├── alembic/                       ← Migraciones versionadas
│   ├── alembic.ini
│   ├── env.py
│   └── versions/
│       ├── 001_initial_schema.py
│       └── 002_seed_categories.py
│
├── requirements.txt               ← Dependencias Python
├── Dockerfile
├── .env.example
└── railway.toml                   ← Config Railway deploy
```

### 3.2 Endpoints API (`/api/v1/`)

| Módulo | Endpoints | Métodos |
|---|---|---|
| **Auth** | `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me` | POST, GET |
| **Accounts** | `/accounts` | GET, POST |
| | `/accounts/{id}` | GET, PUT, DELETE |
| | `/accounts/{id}/recalculate` | POST |
| **Transactions** | `/transactions` | GET, POST |
| | `/transactions/{id}` | GET, PUT, DELETE |
| | `/transactions/export/csv` | GET |
| **Categories** | `/categories` | GET, POST |
| | `/categories/{id}` | PUT, DELETE |
| **Debts** | `/debts` | GET, POST |
| | `/debts/{id}` | GET, PUT |
| | `/debts/{id}/payments` | POST |
| | `/debts/summary` | GET |
| **Cards** | `/cards` | GET, POST |
| | `/cards/{id}` | GET, PUT |
| | `/cards/{id}/transactions` | POST |
| | `/cards/{id}/billing-periods` | GET |
| **PDF** | `/pdf/upload` | POST |
| | `/pdf/import/{import_id}` | GET |
| | `/pdf/imports` | GET |
| | `/pdf/import/{import_id}/confirm` | POST |
| **Reports** | `/reports/monthly` | GET |
| | `/reports/annual` | GET |
| | `/reports/net-worth` | GET |
| | `/reports/budget-vs-actual` | GET |
| **Budgets** | `/budgets` | GET, POST |
| | `/budgets/{id}` | PUT, DELETE |

---

## 4. FLUJO DE DATOS

```
Usuario → Frontend (Next.js) → Axios + JWT → Backend (FastAPI) → SQLAlchemy → SQLite/PostgreSQL
                                        ↕
                                   TanStack Query
                                  (caché + sync)

PDF Upload:
  Usuario → PDFUploader → multipart/form-data → /api/v1/pdf/upload
    → PDFProcessor (detect_bank → extract_text → parse_transactions)
    → save_to_db → pdf_imports + transactions → response
```

---

## 5. ESTADO GLOBAL (Zustand)

### AuthStore
- `user: User | null`
- `accessToken: string | null`
- `isAuthenticated: boolean`
- `login(token, refreshToken, user)`, `logout()`, `setUser()`, `hydrate()`

### UIStore
- `sidebarOpen: boolean` (mobile toggle)
- `sidebarPinned: boolean` (desktop pin)
- `toggleSidebar()`, `setSidebarOpen()`, `setSidebarPinned()`

---

## 6. DEPENDENCIAS

### Frontend (package.json)
```json
{
  "next": "^16.2.9", "react": "^18.3.0", "react-dom": "^18.3.0",
  "typescript": "^5.5.0", "tailwindcss": "^3.4.0",
  "@tanstack/react-query": "^5.50.0", "zustand": "^4.5.0",
  "axios": "^1.7.0", "recharts": "^2.12.0",
  "react-hook-form": "^7.52.0", "zod": "^3.23.0",
  "lucide-react": "^0.400.0", "date-fns": "^3.6.0",
  "clsx": "^2.1.0", "tailwind-merge": "^2.4.0",
  "class-variance-authority": "^0.7.0", "@hookform/resolvers": "^5.4.0"
}
```

### Backend (requirements.txt)
```
fastapi==0.115.0, uvicorn==0.30.0, sqlalchemy==2.0.35, alembic==1.13.3,
pydantic==2.9.0, pydantic-settings==2.5.2, python-jose[cryptography]==3.3.0,
passlib[bcrypt]==1.7.4, python-multipart==0.0.12,
pdfplumber==0.11.4, PyPDF2==3.0.1, camelot-py[cv]==0.11.0,
pandas==2.2.3, python-dateutil==2.9.0, aiofiles==24.1.0,
psycopg2-binary==2.9.9
```

---

## 7. MODELO DE DATOS (SQLAlchemy)

| Tabla | Columnas clave |
|---|---|
| `users` | id, email, hashed_password, full_name, currency, timezone |
| `accounts` | id, user_id, name, type, bank_name, balance (Numeric 15,2) |
| `categories` | id, user_id, name, type, color, icon, parent_id (self-ref) |
| `transactions` | id, user_id, account_id, category_id, fecha, tipo, cantidad |
| `credit_cards` | id, user_id, name, bank_name, credit_limit, current_balance |
| `credit_card_transactions` | id, credit_card_id, category_id, fecha, cantidad |
| `debts` | id, user_id, name, creditor_name, type, current_balance |
| `debt_payments` | id, debt_id, transaction_id, payment_date, amount |
| `pdf_imports` | id, user_id, filename, bank_name, status, transactions_count |
| `budgets` | id, user_id, category_id, month, year, amount_limit |

---

## 8. PÁGINAS DEL FRONTEND

| Ruta | Archivo | Propósito |
|---|---|---|
| `/login` | `app/(auth)/login/page.tsx` | Inicio de sesión |
| `/register` | `app/(auth)/register/page.tsx` | Registro de usuario |
| `/` | `app/(dashboard)/page.tsx` | Dashboard (KPIs + gráficas) |
| `/transactions` | `app/(dashboard)/transactions/page.tsx` | CRUD transacciones |
| `/accounts` | `app/(dashboard)/accounts/page.tsx` | Cuentas bancarias |
| `/cards` | `app/(dashboard)/cards/page.tsx` | Tarjetas de crédito |
| `/debts` | `app/(dashboard)/debts/page.tsx` | Gestión de deudas |
| `/budgets` | `app/(dashboard)/budgets/page.tsx` | Presupuestos |
| `/pdf` | `app/(dashboard)/pdf/page.tsx` | Importar PDF |
| `/reports` | `app/(dashboard)/reports/page.tsx` | Reportes |

---

## 9. ANIMACIONES IMPLEMENTADAS

1. **Sidebar**: slide-in/out con transición suave, overlay backdrop-blur en mobile
2. **KPIs**: fade-in-up con delay progresivo (0ms, 100ms, 200ms, 300ms)
3. **Listas**: fade-in-up con delay por item (50-80ms each)
4. **Páginas**: fade-in al cargar
5. **Modales**: scale-in + backdrop-blur
6. **Botones**: active:scale-[0.97], hover transitions
7. **Cards**: hover:-translate-y-0.5 + shadow-elevated
8. **Skeleton**: animate-skeleton-pulse (opacity pulse)
9. **Respeto preferencias**: `prefers-reduced-motion` desactiva animaciones

---

## 10. COMANDOS DE DESARROLLO

```bash
# Frontend
cd orgi-frontend
npm run dev          # Desarrollo en :3000
npm run build        # Build producción
npm run start        # Servir build
npm run lint         # Linting
npm run test         # Tests Vitest

# Backend
cd orgi-backend
uvicorn app.main:app --reload   # Desarrollo en :8000
pytest -v                        # Tests
alembic upgrade head            # Migraciones
```

---

*Documento generado el 25 de junio de 2026.*
*orgi — Gestión Financiera Personal*
