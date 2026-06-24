# ORGI — Gestión Financiera Personal

Aplicación web full-stack para control de finanzas personales con soporte para múltiples cuentas, tarjetas de crédito, deudas, importación de extractos PDF y dashboard financiero.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui |
| Backend | FastAPI (Python 3.11) + SQLAlchemy 2.0 + Alembic |
| Base de Datos | SQLite (dev) / PostgreSQL (prod) |
| Procesamiento PDF | pdfplumber + PyPDF2 + camelot-py |
| Autenticación | JWT local (python-jose) |
| Gráficas | Recharts |
| Estado | Zustand + TanStack Query v5 |

## Inicio Rápido

### Con Docker (recomendado)

```bash
docker-compose up
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Docs API: http://localhost:8000/docs
```

### Manual

**Backend:**
```bash
cd orgi-backend
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd orgi-frontend
npm install
npm run dev
```

## Datos Históricos

La app utiliza datos existentes en `Database app/MyFinance.db` (2,817 transacciones, 2 cuentas, 34 categorías de una app Android financiera previa).

```bash
# Mapear e importar datos existentes
python -m app.utils.inspect_existing_db --source "Database app/MyFinance.db" --dry-run
```

## Estructura del Proyecto

```
orgi/
├── orgi-backend/          # FastAPI
│   ├── app/
│   │   ├── api/v1/routes/ # Endpoints REST
│   │   ├── core/          # Config, seguridad, DB
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Lógica de negocio
│   │   └── utils/         # Helpers
│   ├── tests/
│   └── alembic/           # Migraciones
├── orgi-frontend/         # Next.js 14
│   ├── app/               # App Router
│   ├── components/        # Componentes React
│   ├── lib/               # Utilidades, API client
│   ├── store/             # Zustand
│   └── types/             # TypeScript types
└── docs/                  # Documentación
```

## Fases del Proyecto

| Fase | Descripción | Duración |
|------|-------------|----------|
| 0 | Inicialización | Día 1 |
| 1 | Arquitectura + DB + PDF | Días 2-3 |
| 2 | Backend completo | Días 4-6 |
| 3 | Frontend completo | Días 7-11 |
| 4 | Deployment + Testing | Días 12-14 |
