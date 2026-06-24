# QA Checklist - ORGI

## Autenticación
- [ ] Registro con email válido funciona
- [ ] Registro con email duplicado muestra error 409
- [ ] Login con credenciales correctas entra al dashboard
- [ ] Login con contraseña incorrecta muestra error 401
- [ ] Token expira correctamente y redirige a login
- [ ] Refresh token funciona

## Transacciones
- [ ] Crear ingreso → balance de cuenta aumenta
- [ ] Crear gasto → balance de cuenta disminuye
- [ ] Editar monto → balance se recalcula
- [ ] Eliminar → balance se restaura
- [ ] Filtros de fecha, tipo, categoría funcionan
- [ ] Paginación funciona correctamente
- [ ] Exportar CSV descarga archivo

## Cuentas
- [ ] Listar cuentas muestra todas las activas
- [ ] Crear cuenta nueva funciona
- [ ] Editar cuenta funciona
- [ ] Desactivar cuenta (soft delete) funciona
- [ ] Recalcular balance desde transacciones

## Deudas
- [ ] Crear deuda aparece en lista
- [ ] Registrar pago → saldo disminuye
- [ ] Deuda en mora se marca correctamente
- [ ] Summary muestra total correcto

## Tarjetas de Crédito
- [ ] Crear tarjeta funciona
- [ ] Agregar transacción a tarjeta funciona
- [ ] Límite de crédito se actualiza
- [ ] Períodos de facturación se muestran

## Dashboard
- [ ] KPIs muestran datos del mes actual
- [ ] Gráfica de ingresos vs gastos carga
- [ ] Últimas transacciones se muestran
- [ ] Responsive en mobile (375px)

## Importación PDF
- [ ] Subir PDF de Bancolombia → detecta banco
- [ ] PDF mayor de 10MB → error claro
- [ ] Confirmar importación → transacciones en lista
- [ ] No duplica si se sube el mismo PDF dos veces

## Reportes
- [ ] Resumen mensual con totales correctos
- [ ] Reporte anual con 12 meses de datos
- [ ] Patrimonio neto calcula activos - pasivos
