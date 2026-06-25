"use client";
import { Transaction } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatCOP, formatDateShort } from "@/lib/utils";

interface Props {
  transactions: Transaction[];
  limit?: number;
  showViewAll?: boolean;
}

export default function TransactionsList({ transactions, limit = 5, showViewAll = true }: Props) {
  const items = (transactions || []).slice(0, limit);

  return (
    <div className="card p-6">
      <h3 className="font-semibold text-neutral-800 mb-4">Últimas Transacciones</h3>
      {items.length > 0 ? (
        <div className="space-y-1">
          {items.map((tx, idx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-neutral-50 transition-all -mx-3"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                  tx.tipo === "ingreso" ? "bg-success-light text-success" : "bg-danger-light text-danger"
                }`}>
                  {tx.tipo === "ingreso" ? "+" : "-"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-800 truncate">{tx.descripcion || "Sin descripción"}</p>
                  <p className="text-xs text-neutral-500">{tx.category?.name || "Sin categoría"} · {formatDateShort(tx.fecha)}</p>
                </div>
              </div>
              <span className={`font-mono text-sm font-bold shrink-0 ml-3 ${
                tx.tipo === "ingreso" ? "text-success" : "text-danger"
              }`}>
                {tx.tipo === "ingreso" ? "+" : "-"}{formatCOP(tx.cantidad)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-500 text-center py-8">No hay transacciones recientes</p>
      )}
      {showViewAll && items.length > 0 && (
        <Link href="/transactions" className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-neutral-100 text-sm font-medium text-primary hover:text-primary-dark transition-all group">
          Ver todas las transacciones <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}
