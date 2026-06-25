"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { CreditCard } from "@/types";
import { CreditCard as CreditCardIcon, Plus, Building2 } from "lucide-react";

export default function CardsPage() {
  const { data: cards, isLoading } = useQuery<CreditCard[]>({
    queryKey: ["cards"],
    queryFn: async () => {
      const { data } = await apiClient.get("/cards");
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
          <h2 className="text-xl font-bold text-neutral-800">Tarjetas de Crédito</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Controla tus tarjetas y su nivel de uso</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Nueva Tarjeta
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-neutral-100 rounded w-32 mb-3" />
              <div className="h-8 bg-neutral-100 rounded w-40 mb-2" />
              <div className="h-3 bg-neutral-100 rounded w-24" />
            </div>
          ))}
        </div>
      ) : cards && cards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => {
            const limit = parseFloat(card.credit_limit);
            const balance = parseFloat(card.current_balance);
            const usage = limit > 0 ? (balance / limit) * 100 : 0;
            return (
              <div key={card.id} className="card-hover p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                    <CreditCardIcon size={22} style={{ color: card.color }} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-neutral-800 truncate">{card.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                      <Building2 size={12} />
                      <span className="truncate">{card.bank_name} •••• {card.last_four_digits}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500">Saldo actual</span>
                    <span className="font-mono font-semibold text-neutral-800">{formatCOP(card.current_balance)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500">Límite</span>
                    <span className="font-mono text-neutral-600">{formatCOP(card.credit_limit)}</span>
                  </div>
                  <div className="pt-1">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-neutral-400">Uso del cupo</span>
                      <span className={`font-semibold ${usage > 80 ? "text-danger" : usage > 50 ? "text-amber-600" : "text-success"}`}>
                        {usage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          usage > 80 ? "bg-danger" : usage > 50 ? "bg-amber-500" : "bg-success"
                        }`}
                        style={{ width: `${Math.min(usage, 100)}%` }}
                      />
                    </div>
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
              <CreditCardIcon size={24} className="text-neutral-400" />
            </div>
            <p className="font-semibold text-neutral-700">No hay tarjetas registradas</p>
            <p className="text-sm text-neutral-500 mt-1">Agrega tus tarjetas para monitorear su uso.</p>
          </div>
        </div>
      )}
    </div>
  );
}
