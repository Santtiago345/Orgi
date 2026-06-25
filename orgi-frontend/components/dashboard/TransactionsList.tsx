"use client";
import { Transaction } from "@/types";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCOP, formatDateShort } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  transactions: Transaction[];
  limit?: number;
  showViewAll?: boolean;
}

export default function TransactionsList({ transactions, limit = 5, showViewAll = true }: Props) {
  const items = (transactions || []).slice(0, limit);

  return (
    <div className="card p-6">
      <h3 className="font-semibold text-neutral-900 mb-4">Ultimas Transacciones</h3>
      {items.length > 0 ? (
        <div className="space-y-1">
          {items.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/60 transition-all -mx-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                  tx.tipo === "ingreso"
                    ? "bg-success/10 text-success border-success/15"
                    : "bg-danger/10 text-danger border-danger/15"
                )}>
                  {tx.tipo === "ingreso"
                    ? <ArrowUpRight size={18} />
                    : <ArrowDownRight size={18} />
                  }
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-800 truncate">{tx.descripcion || "Sin descripcion"}</p>
                  <p className="text-xs text-neutral-400">{tx.category?.name || "Sin categoria"} · {formatDateShort(tx.fecha)}</p>
                </div>
              </div>
              <span className={cn(
                "font-mono text-sm font-bold shrink-0 ml-3",
                tx.tipo === "ingreso" ? "text-success" : "text-danger"
              )}>
                {tx.tipo === "ingreso" ? "+" : "-"}{formatCOP(tx.cantidad)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-400 text-center py-8">No hay transacciones recientes</p>
      )}
      {showViewAll && items.length > 0 && (
        <Link href="/transactions" className="flex items-center justify-center gap-1.5 mt-4 pt-4 border-t border-neutral-100/60 text-sm font-medium text-primary hover:text-primary-dark transition-all group">
          Ver todas las transacciones
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}
