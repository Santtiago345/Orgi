"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { PiggyBank, Plus } from "lucide-react";

export default function BudgetsPage() {
  const now = new Date();
  const { data: budgets } = useQuery({
    queryKey: ["budgets", now.getMonth() + 1, now.getFullYear()],
    queryFn: async () => {
      const { data } = await apiClient.get("/budgets", { params: { month: now.getMonth() + 1, year: now.getFullYear() } });
      return data;
    },
  });

  const formatCOP = (amount: string) => {
    try {
      const num = parseFloat(amount);
      return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(num);
    } catch { return amount; }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-800">Presupuestos</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Define límites de gasto por categoría</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Nuevo Presupuesto
        </button>
      </div>

      {budgets && budgets.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {budgets.map((budget: any) => {
            const limit = parseFloat(budget.amount_limit);
            const spent = 0;
            const pct = limit > 0 ? (spent / limit) * 100 : 0;
            return (
              <div key={budget.id} className="card-hover p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                      <PiggyBank size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800">{budget.category?.name || `Categoría ${budget.category_id}`}</h3>
                      <p className="text-xs text-neutral-500">{budget.month}/{budget.year}</p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-semibold text-neutral-800">{formatCOP(budget.amount_limit)}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Progreso</span>
                    <span className={`font-mono font-medium ${pct > 90 ? "text-danger" : pct > 70 ? "text-amber-600" : "text-success"}`}>{pct.toFixed(0)}% usado</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct > 90 ? "bg-danger" : pct > 70 ? "bg-amber-500" : "bg-success"
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <PiggyBank size={24} className="text-neutral-400" />
            </div>
            <p className="font-semibold text-neutral-700">No hay presupuestos configurados</p>
            <p className="text-sm text-neutral-500 mt-1">Crea un presupuesto mensual para controlar tus gastos.</p>
          </div>
        </div>
      )}
    </div>
  );
}
