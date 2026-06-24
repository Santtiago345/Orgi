# Backlog Priorizado - ORGI

## P1 - Funcionalidades Críticas (MVP)

| # | Ticket | Descripción | Estimación | Dependencias |
|---|--------|-------------|------------|--------------|
| 1 | ORGI-001 | Autenticación JWT (registro, login, refresh) | 2 días | Ninguna |
| 2 | ORGI-002 | CRUD de cuentas bancarias | 1 día | ORGI-001 |
| 3 | ORGI-003 | CRUD de transacciones con actualización de saldo | 2 días | ORGI-001, ORGI-002 |
| 4 | ORGI-004 | Categorías de ingresos y gastos (sistema + personalizadas) | 1 día | ORGI-001 |
| 5 | ORGI-005 | Dashboard con KPIs y gráficas (ingresos vs gastos) | 2 días | ORGI-003 |
| 6 | ORGI-006 | Importación de extractos PDF bancarios | 3 días | ORGI-001 |
| 7 | ORGI-007 | Gestión de deudas y pagos | 2 días | ORGI-001 |
| 8 | ORGI-008 | Tarjetas de crédito y ciclo de facturación | 2 días | ORGI-001 |
| 9 | ORGI-009 | Reportes mensuales/anuales y patrimonio neto | 2 días | ORGI-003 |

## P2 - Mejoras (Semana 3-4)

| # | Ticket | Descripción | Estimación | Dependencias |
|---|--------|-------------|------------|--------------|
| 10 | ORGI-010 | Presupuestos vs real con alertas | 2 días | ORGI-004 |
| 11 | ORGI-011 | Exportación a CSV de transacciones | 0.5 día | ORGI-003 |
| 12 | ORGI-012 | Migración de datos desde MyFinance.db | 1 día | ORGI-003 |
| 13 | ORGI-013 | Metas de ahorro con progreso visual | 1 día | ORGI-003 |
| 14 | ORGI-014 | Notificaciones de pagos próximos | 1 día | ORGI-007 |
| 15 | ORGI-015 | Modo oscuro | 0.5 día | Ninguna |

## P3 - Escala Futura

| # | Ticket | Descripción |
|---|--------|-------------|
| 16 | ORGI-016 | Múltiples monedas (USD, EUR) |
| 17 | ORGI-017 | Importación OFX/QFX |
| 18 | ORGI-018 | Proyecciones financieras |
| 19 | ORGI-019 | Dashboard compartido (familia) |
| 20 | ORGI-020 | PWA para uso offline |
