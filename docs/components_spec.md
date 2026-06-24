# Especificación de Componentes - ORGI

## KPICard
Props: `{ title: string, value: string, change?: number, changeType?: 'up'|'down', icon: LucideIcon, color: string, loading?: boolean }`
Estados: default, loading (skeleton), error
Responsive: full width en mobile, 25% en desktop

## TransactionRow
Props: `{ transaction: Transaction, showAccount?: boolean }`
Estados: default, hover (highlight)
Responsive: stack en mobile (icono + descripción arriba, monto abajo)

## MoneyAmount
Props: `{ amount: number, currency?: string, colored?: boolean, size?: 'sm'|'md'|'lg' }`
Estados: positivo (verde), negativo (rojo), neutro (gris)
Usa: Intl.NumberFormat('es-CO', {currency:'COP'})

## TransactionForm (Modal)
Props: `{ transaction?: Transaction, onSuccess: () => void, onClose: () => void }`
Estados: idle, submitting, error, validation
Campos: tipo (switch), fecha, monto, cuenta, categoría, descripción, notas

## PDFUploader
Props: `{ onSuccess: () => void }`
Estados: empty (drag zone), uploading (progress bar), processing, review (transactions list), completed
