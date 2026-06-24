# Matriz de Módulos - ORGI

| Módulo | Descripción | Agente Responsable | Prioridad | Dependencias | Complejidad |
|--------|-------------|-------------------|-----------|--------------|-------------|
| Auth | Registro, login, JWT, refresh tokens | Agente 4 | P1 | Ninguna | Media |
| Accounts | CRUD cuentas bancarias, balance tracking | Agente 4 | P1 | Auth | Baja |
| Categories | Categorías predefinidas + personalizadas | Agente 4 | P1 | Auth | Baja |
| Transactions | CRUD transacciones, actualización saldo | Agente 4 | P1 | Accounts, Categories | Alta |
| Credit Cards | Gestión tarjetas, transacciones, ciclos | Agente 4 | P1 | Auth | Media |
| Debts | Deudas, pagos, cálculo intereses | Agente 4 | P1 | Auth | Alta |
| PDF Import | Upload, extracción, parsing bancos | Agente 3 + 4 | P1 | Auth, Categories | Alta |
| Reports | Dashboard mensual/anual, patrimonio | Agente 4 | P1 | Transactions, Accounts, Debts | Media |
| Budgets | Presupuestos por categoría vs real | Agente 4 | P2 | Categories, Transactions | Media |
| Export | Exportación CSV de transacciones | Agente 4 | P2 | Transactions | Baja |
| Migration | Script introspección y migración MyFinance.db | Agente 2 | P2 | Ninguna | Media |
| Notifications | Recordatorios de pagos próximos | Agente 4 | P2 | Debts | Baja |
| Dark Mode | Toggle de tema oscuro | Agente 6 | P2 | Ninguna | Baja |
| Multi-currency | Soporte USD/EUR con tasas | Agente 4 | P3 | Transactions | Media |
| OFX Import | Importación formato bancario estándar | Agente 4 | P3 | Categories | Alta |
| PWA | Offline support | Agente 6 | P3 | Frontend | Alta |

## Leyenda
- **P1**: MVP (Días 1-11)
- **P2**: Segunda iteración (Semanas 3-4)
- **P3**: Escala futura
- **Complejidad**: Baja (<1 día), Media (1-2 días), Alta (2-3 días)
