"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/lib/api/transactions";
import { Transaction } from "@/types";
import MoneyAmount from "@/components/MoneyAmount";
import { Pencil, Trash2, ChevronLeft, ChevronRight, Search } from "lucide-react";

interface Filters {
  start_date?: string;
  end_date?: string;
  tipo?: string;
  category_id?: number;
  account_id?: number;
  search?: string;
}

interface Props {
  filters?: Filters;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export default function TransactionTable({ filters = {}, onEdit, onDelete }: Props) {
  const [page, setPage] = useState(1);
  const perPage = 15;

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", { ...filters, page, per_page: perPage }],
    queryFn: () => getTransactions({ ...filters, page, per_page: perPage }),
  });

  const transactions = data?.data || [];
  const totalPages = data?.total_pages || 1;

  if (isLoading) {
    return (
      <div className="card overflow-hidden">
        <div className="p-8 space-y-5 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 bg-neutral-100 rounded w-20" />
              <div className="h-4 bg-neutral-100 rounded flex-1" />
              <div className="h-4 bg-neutral-100 rounded w-24" />
              <div className="h-4 bg-neutral-100 rounded w-28" />
              <div className="h-4 bg-neutral-100 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {transactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Search size={24} className="text-neutral-400" />
          </div>
          <p className="font-semibold text-neutral-700">No hay transacciones</p>
          <p className="text-sm text-neutral-500 mt-1 max-w-xs">Crea una nueva transacción o importa un PDF para empezar.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50">
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Fecha</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Descripción</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Categoría</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Cuenta</th>
                  <th className="text-right px-4 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Monto</th>
                  <th className="w-20 px-4 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => (
                  <tr key={tx.id} className={`border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-neutral-50/30"}`}>
                    <td className="px-4 py-3.5 text-sm text-neutral-600 font-medium">
                      {new Date(tx.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-neutral-800">{tx.descripcion || "—"}</td>
                    <td className="px-4 py-3.5">
                      {tx.category?.name ? (
                        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium"
                          style={{ backgroundColor: tx.category.color ? `${tx.category.color}12` : "#F3F4F6", color: tx.category.color || "#6B7280" }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tx.category.color || "#6B7280" }} />
                          {tx.category.name}
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-neutral-500">{tx.account?.name || "—"}</td>
                    <td className="px-4 py-3.5 text-right font-mono">
                      <MoneyAmount amount={tx.cantidad} colored size="sm" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => onEdit(tx)}
                          className="p-1.5 text-neutral-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="Editar">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => onDelete(tx)}
                          className="p-1.5 text-neutral-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-all" title="Eliminar">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3.5 border-t border-neutral-100 bg-neutral-50/30">
              <span className="text-sm text-neutral-500">
                Página {page} de {totalPages} · <span className="font-mono">{data?.total || 0}</span> transacciones
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="btn-secondary !px-3 !py-1.5 text-xs">
                  <ChevronLeft size={14} /> Anterior
                </button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="btn-secondary !px-3 !py-1.5 text-xs">
                  Siguiente <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}


