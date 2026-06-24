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
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Presupuestos</h2>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90">
          <Plus size={16} /> Nuevo Presupuesto
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {budgets?.map((budget: any) => {
          const limit = parseFloat(budget.amount_limit);
          const spent = 0;
          const pct = limit > 0 ? (spent / limit) * 100 : 0;
          return (
            <div key={budget.id} className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <PiggyBank size={20} className="text-primary" />
                <div>
                  <h3 className="font-medium">{budget.category?.name || `Categoría ${budget.category_id}`}</h3>
                  <p className="text-xs text-neutral-600">{budget.month}/{budget.year}</p>
                </div>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-600">Presupuesto: {formatCOP(budget.amount_limit)}</span>
                <span className="font-mono">{pct.toFixed(0)}% usado</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${pct > 90 ? "bg-danger" : pct > 70 ? "bg-warning" : "bg-success"}`}
                  style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
            </div>
          );
        })}
        {(!budgets || budgets.length === 0) && (
          <div className="text-center py-12 text-neutral-600">
            No hay presupuestos configurados para este mes.
          </div>
        )}
      </div>
    </div>
  );
}
