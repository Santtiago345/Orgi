"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { CreditCard } from "@/types";
import { CreditCard as CreditCardIcon, Plus } from "lucide-react";

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
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tarjetas de Crédito</h2>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90">
          <Plus size={16} /> Nueva Tarjeta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards?.map((card) => {
          const limit = parseFloat(card.credit_limit);
          const balance = parseFloat(card.current_balance);
          const usage = limit > 0 ? (balance / limit) * 100 : 0;
          return (
            <div key={card.id} className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${card.color}20` }}>
                  <CreditCardIcon size={20} style={{ color: card.color }} />
                </div>
                <div>
                  <h3 className="font-medium">{card.name}</h3>
                  <p className="text-xs text-neutral-600">{card.bank_name} •••• {card.last_four_digits}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Saldo actual</span>
                  <span className="font-mono font-medium">{formatCOP(card.current_balance)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Límite</span>
                  <span className="font-mono">{formatCOP(card.credit_limit)}</span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Uso</span>
                    <span>{usage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${usage > 80 ? "bg-danger" : usage > 50 ? "bg-warning" : "bg-success"}`}
                      style={{ width: `${Math.min(usage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {(!cards || cards.length === 0) && (
          <div className="col-span-2 text-center py-12 text-neutral-600">
            No hay tarjetas registradas.
          </div>
        )}
      </div>
    </div>
  );
}
