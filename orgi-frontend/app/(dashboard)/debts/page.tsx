"use client";
import { useQuery } from "@tanstack/react-query";
import { getDebts, getDebtSummary } from "@/lib/api/debts";
import { Plus, PercentCircle } from "lucide-react";

export default function DebtsPage() {
  const { data: debts } = useQuery({ queryKey: ["debts"], queryFn: () => getDebts() });
  const { data: summary } = useQuery({ queryKey: ["debts-summary"], queryFn: getDebtSummary });

  const formatCOP = (amount: string) => {
    try {
      const num = parseFloat(amount);
      return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(num);
    } catch { return amount; }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Deudas</h2>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90">
          <Plus size={16} /> Nueva Deuda
        </button>
      </div>

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-card p-6">
            <p className="text-sm text-neutral-600">Total Deuda</p>
            <p className="text-2xl font-bold font-mono text-danger">{formatCOP(summary.total_debt)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-card p-6">
            <p className="text-sm text-neutral-600">Deudas Activas</p>
            <p className="text-2xl font-bold">{summary.active_count}</p>
          </div>
          <div className="bg-white rounded-xl shadow-card p-6">
            <p className="text-sm text-neutral-600">En Mora</p>
            <p className="text-2xl font-bold text-danger">{summary.overdue_count}</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {debts?.map((debt) => (
          <div key={debt.id} className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <PercentCircle size={20} className="text-danger" />
                <div>
                  <h3 className="font-medium">{debt.name}</h3>
                  <p className="text-xs text-neutral-600">{debt.creditor_name || debt.type}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                debt.status === "activa" ? "bg-warning/10 text-warning" :
                debt.status === "pagada" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
              }`}>
                {debt.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neutral-600">Saldo pendiente:</span>
                <span className="font-mono font-medium ml-2">{formatCOP(debt.current_balance)}</span>
              </div>
              <div>
                <span className="text-neutral-600">Pago mensual:</span>
                <span className="font-mono ml-2">{debt.monthly_payment ? formatCOP(debt.monthly_payment) : "—"}</span>
              </div>
            </div>
          </div>
        ))}
        {(!debts || debts.length === 0) && (
          <div className="text-center py-12 text-neutral-600">No hay deudas registradas.</div>
        )}
      </div>
    </div>
  );
}
