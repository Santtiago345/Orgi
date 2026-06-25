"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { PiggyBank, Plus } from "lucide-react";
import { formatCOP, MONTH_NAMES_FULL } from "@/lib/utils";

export default function BudgetsPage() {
  const now = new Date();
  const { data: budgets } = useQuery({
    queryKey: ["budgets", now.getMonth() + 1, now.getFullYear()],
    queryFn: async () => {
      const { data } = await apiClient.get("/budgets", { params: { month: now.getMonth() + 1, year: now.getFullYear() } });
      return data;
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="page-title">Presupuestos</h2>
          <p className="page-subtitle">Define limites de gasto por categoria</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Nuevo Presupuesto</button>
      </div>

      {budgets && budgets.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {budgets.map((budget: any, idx: number) => {
            const limit = parseFloat(budget.amount_limit);
            const spent = 0;
            const pct = limit > 0 ? (spent / limit) * 100 : 0;
            return (
              <div key={budget.id} className="card-hover p-5 animate-fade-in-up" style={{ animationDelay: `${idx * 60}ms` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center border border-primary/10">
                      <PiggyBank size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">{budget.category?.name || `Categoria ${budget.category_id}`}</h3>
                      <p className="text-xs text-neutral-400">{MONTH_NAMES_FULL[budget.month - 1]} {budget.year}</p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-semibold text-neutral-900">{formatCOP(budget.amount_limit)}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Progreso</span>
                    <span className={`font-mono font-medium ${pct > 90 ? "text-danger" : pct > 70 ? "text-warning-dark" : "text-success"}`}>{pct.toFixed(0)}% usado</span>
                  </div>
                  <div className="w-full bg-neutral-100/50 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${pct > 90 ? "bg-danger" : pct > 70 ? "bg-warning" : "bg-success"}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card animate-fade-in">
          <div className="empty-state">
            <div className="empty-state-icon"><PiggyBank size={24} className="text-primary/40" /></div>
            <p className="font-semibold text-neutral-600">No hay presupuestos configurados</p>
            <p className="text-sm text-neutral-400 mt-1">Crea un presupuesto mensual para controlar tus gastos.</p>
          </div>
        </div>
      )}
    </div>
  );
}
