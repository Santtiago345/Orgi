# Documento de Arquitectura - ORGI

## Diagrama C4 de Contexto

```
┌─────────────┐       ┌──────────────────────────────────────────────────────┐
│             │       │              SISTEMA ORGI                             │
│   Usuario   │──────▶│                                                      │
│  (Browser)  │       │  ┌──────────┐    ┌──────────┐    ┌──────────────┐   │
│             │◀──────│  │  Next.js │◀──▶│ FastAPI  │◀──▶│  SQLite/     │   │
└─────────────┘       │  │ Frontend │    │ Backend  │    │  PostgreSQL  │   │
                      │  └──────────┘    └────┬─────┘    └──────────────┘   │
                      │                       │                             │
                      │                       ▼                             │
                      │              ┌─────────────────┐                    │
                      │              │ PDF Processor   │                    │
                      │              │ (pdfplumber)    │                    │
                      │              └─────────────────┘                    │
                      └──────────────────────────────────────────────────────┘
```

## Diagrama C4 de Contenedores

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             ORGI - Contenedores                             │
│                                                                             │
│  ┌─────────────────────────┐     ┌──────────────────────────────────────┐  │
│  │      FRONTEND           │     │           BACKEND                     │  │
│  │  (Next.js 14 + TS)      │     │  (FastAPI + Python 3.11)             │  │
│  │                         │     │                                       │  │
│  │  ┌───────────────────┐  │     │  ┌─────────────────────────────────┐ │  │
│  │  │ Pages (App Router)│  │     │  │ API Routes (REST)               │ │  │
│  │  │ /login            │  │     │  │ /api/v1/auth/*                  │ │  │
│  │  │ /dashboard        │  │HTTP │  │ /api/v1/accounts/*              │ │  │
│  │  │ /transactions     │  │◀───▶│  │ /api/v1/transactions/*          │ │  │
│  │  │ /accounts         │  │     │  │ /api/v1/debts/*                 │ │  │
│  │  │ /cards            │  │     │  │ /api/v1/cards/*                 │ │  │
│  │  │ /debts            │  │     │  │ /api/v1/pdf/*                   │ │  │
│  │  │ /reports          │  │     │  │ /api/v1/reports/*               │ │  │
│  │  └───────────────────┘  │     │  │ /api/v1/budgets/*               │ │  │
│  │                         │     │  │ /api/v1/categories/*            │ │  │
│  │  ┌───────────────────┐  │     │  └─────────────────────────────────┘ │  │
│  │  │ Components        │  │     │                                       │  │
│  │  │ shadcn/ui + Rechart│  │     │  ┌─────────────────────────────────┐ │  │
│  │  └───────────────────┘  │     │  │ Services (Business Logic)        │ │  │
│  │                         │     │  │ transaction_service.py           │ │  │
│  │  ┌───────────────────┐  │     │  │ account_service.py               │ │  │
│  │  │ State (Zustand)   │  │     │  │ debt_service.py                  │ │  │
│  │  │ Data (TanStack Q) │  │     │  │ report_service.py                │ │  │
│  │  └───────────────────┘  │     │  │ pdf_service.py                   │ │  │
│  └─────────────────────────┘     │  └─────────────────────────────────┘ │  │
│                                   │                                       │  │
│                                   │  ┌─────────────────────────────────┐ │  │
│                                   │  │ ORM (SQLAlchemy 2.0)            │ │  │
│                                   │  │ Models → Tables                 │ │  │
│                                   │  └──────────────┬──────────────────┘ │  │
│                                   └──────────────────┼───────────────────┘  │
│                                                      │                      │
│                                   ┌──────────────────┼───────────────────┐  │
│                                   │        DATABASE  │                   │  │
│                                   │                  ▼                   │  │
│                                   │  ┌─────────────────────────────┐    │  │
│                                   │  │  SQLite (dev) / PostgreSQL  │    │  │
│                                   │  │  (prod)                     │    │  │
│                                   │  └─────────────────────────────┘    │  │
│                                   └────────────────────────────────────┘  │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  EXTERNAL: PDF Files (upload by user)                                  │ │
│  │  → pdfplumber extrae texto/tablas                                      │ │
│  │  → Parsers específicos por banco (Bancolombia, Davivienda, BBVA, etc.) │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Diagrama C4 de Componentes del Backend

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                      BACKEND - Componentes Internos                          │
│                                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────┐ │
│  │ Auth Module│  │Accounts    │  │Transactns  │  │  Debts     │  │ Cards  │ │
│  │            │  │Module      │  │Module      │  │  Module    │  │ Module │ │
│  │ register() │  │create()    │  │create()    │  │  create()  │  │create()│ │
│  │ login()    │  │get_list()  │  │get_list()  │  │  pay()     │  │get()   │ │
│  │ refresh()  │  │update()    │  │update()    │  │  summary() │  │billing()│ │
│  │ logout()   │  │recalculate()│ │delete()    │  │            │  │         │ │
│  └─────┬──────┘  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘  └────┬────┘ │
│        │                │               │               │             │      │
│  ┌─────┴───────────────────┴──────────────────────────────┴───────────┴───┐ │
│  │                       SERVICES LAYER                                    │ │
│  │    transaction_service  |  account_service  |  debt_service             │ │
│  │    report_service       |  pdf_service       |  budget_service          │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                        │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                       CORE LAYER                                       │ │
│  │  config.py │ security.py │ database.py │ exception_handlers.py         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                        │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                       DATA ACCESS LAYER                                 │ │
│  │  Models (SQLAlchemy) → Alembic Migrations → SQLite/PostgreSQL          │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Decisiones de Arquitectura (ADR)

### ADR-001: SQLite en dev / PostgreSQL en prod
- **Contexto**: Necesitamos una DB que funcione localmente sin servidor y en producción con alta disponibilidad.
- **Decisión**: SQLite para desarrollo (zero-config, archivo local) y PostgreSQL en Railway free tier para producción.
- **Consecuencias**: SQLAlchemy abstrae las diferencias; evitar features específicas de cada motor.

### ADR-002: JWT local en lugar de Auth externo
- **Contexto**: Restricción de cero costos; servicios como Auth0 o Firebase tienen límites.
- **Decisión**: Implementar autenticación JWT propia con python-jose + passlib.
- **Consecuencias**: Mayor control pero responsabilidad de implementar refresh tokens y expiración.

### ADR-003: FastAPI sobre Django/Flask
- **Contexto**: API REST que debe ser rápida de desarrollar y con buena documentación automática.
- **Decisión**: FastAPI por rendimiento, validación automática con Pydantic v2, docs interactivas (Swagger), y soporte async nativo.
- **Consecuencias**: Menos batteries-included que Django pero más ligero y rápido.

### ADR-004: Next.js sobre Vite/CRA
- **Contexto**: Aplicación web que necesita SSR para SEO y App Router para rutas anidadas.
- **Decisión**: Next.js 14 con App Router por SSR, server components, y middleware para auth.
- **Consecuencias**: Mayor curva de aprendizaje inicial pero mejor rendimiento y SEO.

### ADR-005: TanStack Query vs Redux
- **Contexto**: Manejo de datos del servidor con caché y sincronización.
- **Decisión**: TanStack Query v5 para data fetching (caché automática, refetch, mutaciones) + Zustand para estado local (UI state).
- **Consecuencias**: Separación clara entre estado del servidor y estado de UI.

### ADR-006: Mapeo desde DB existente (MyFinance.db)
- **Contexto**: Existe una DB de una app Android con 2,817 transacciones en un esquema diferente.
- **Decisión**: Crear script de introspección que mapee tablas y columnas del esquema origen al nuevo, con INSERT OR IGNORE para evitar duplicados.
- **Consecuencias**: Los UUIDs de la DB original se preservan como referencia externa; se crean nuevos IDs autoincrementales.
