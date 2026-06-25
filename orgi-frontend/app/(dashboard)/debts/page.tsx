"use client";
import { useQuery } from "@tanstack/react-query";
import { getDebts, getDebtSummary } from "@/lib/api/debts";
import { Plus, PercentCircle } from "lucide-react";
import { formatCOP } from "@/lib/utils";

export default function DebtsPage() {
  const { data: debts } = useQuery({ queryKey: ["debts"], queryFn: () => getDebts() });
  const { data: summary } = useQuery({ queryKey: ["debts-summary"], queryFn: getDebtSummary });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-800">Deudas</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Gestiona tus obligaciones financieras</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Nueva Deuda</button>
      </div>

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-hover border-danger/15 p-5 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Total Deuda</p>
            <p className="text-2xl font-bold font-mono text-danger">{formatCOP(summary.total_debt)}</p>
          </div>
          <div className="card-hover p-5 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Deudas Activas</p>
            <p className="text-2xl font-bold text-neutral-800">{summary.active_count}</p>
          </div>
          <div className="card-hover p-5 animate-fade-in-up" style={{ animationDelay: "160ms" }}>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">En Mora</p>
            <p className="text-2xl font-bold text-danger">{summary.overdue_count}</p>
          </div>
        </div>
      )}

      {debts && debts.length > 0 ? (
        <div className="space-y-3">
          {debts.map((debt, idx) => (
            <div key={debt.id} className="card-hover p-5 animate-fade-in-up" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-danger-light flex items-center justify-center">
                    <PercentCircle size={20} className="text-danger" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800">{debt.name}</h3>
                    <p className="text-xs text-neutral-500">{debt.creditor_name || debt.type}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${
                  debt.status === "activa" ? "bg-amber-50 text-amber-700 border-amber-200" :
                  debt.status === "pagada" ? "bg-success-light text-success border-success/20" :
                  "bg-danger-light text-danger border-danger/20"
                }`}>
                  {debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <span className="text-neutral-500 text-xs">Saldo pendiente</span>
                  <p className="font-mono font-semibold text-neutral-800 mt-0.5">{formatCOP(debt.current_balance)}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <span className="text-neutral-500 text-xs">Pago mensual</span>
                  <p className="font-mono font-semibold text-neutral-800 mt-0.5">{debt.monthly_payment ? formatCOP(debt.monthly_payment) : "—"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card animate-fade-in">
          <div className="empty-state">
            <div className="empty-state-icon"><PercentCircle size={24} className="text-neutral-400" /></div>
            <p className="font-semibold text-neutral-700">No hay deudas registradas</p>
            <p className="text-sm text-neutral-500 mt-1">Lleva el control de tus obligaciones financieras.</p>
          </div>
        </div>
      )}
    </div>
  );
}
