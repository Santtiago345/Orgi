"use client";
import { Transaction } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  transactions: Transaction[];
  limit?: number;
  showViewAll?: boolean;
}

export default function TransactionsList({ transactions, limit = 5, showViewAll = true }: Props) {
  const formatCOP = (amount: string) => {
    try {
      const num = parseFloat(amount);
      return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(num);
    } catch {
      return amount;
    }
  };

  const items = transactions.slice(0, limit);

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h3 className="font-semibold mb-4">Últimas Transacciones</h3>
      <div className="space-y-3">
        {items.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                tx.tipo === "ingreso" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
              }`}>
                {tx.tipo === "ingreso" ? "+" : "-"}
              </div>
              <div>
                <p className="text-sm font-medium">{tx.descripcion || "Sin descripción"}</p>
                <p className="text-xs text-neutral-600">{tx.category?.name || "Sin categoría"}</p>
              </div>
            </div>
            <span className={`font-mono text-sm font-medium ${
              tx.tipo === "ingreso" ? "text-success" : "text-danger"
            }`}>
              {tx.tipo === "ingreso" ? "+" : "-"}{formatCOP(tx.cantidad)}
            </span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-neutral-600 text-center py-4">No hay transacciones recientes</p>
        )}
      </div>
      {showViewAll && (
        <Link href="/transactions" className="flex items-center justify-center gap-1 mt-4 text-sm text-primary hover:underline">
          Ver todas <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
