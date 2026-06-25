"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/lib/api/transactions";
import { Transaction } from "@/types";
import MoneyAmount from "@/components/MoneyAmount";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

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
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="p-8 space-y-4 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 bg-neutral-200 rounded w-24" />
              <div className="h-4 bg-neutral-200 rounded flex-1" />
              <div className="h-4 bg-neutral-200 rounded w-20" />
              <div className="h-4 bg-neutral-200 rounded w-28" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Fecha</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Descripción</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Categoría</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Cuenta</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-neutral-600">Monto</th>
              <th className="w-20 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 text-sm text-neutral-700">
                  {new Date(tx.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3 text-sm font-medium">{tx.descripcion || "—"}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: tx.category?.color ? `${tx.category.color}20` : "#f0f0f0", color: tx.category?.color || "#666" }}>
                    {tx.category?.name || "Sin categoría"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-neutral-600">{tx.account?.name || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <MoneyAmount amount={tx.cantidad} colored size="sm" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => onEdit(tx)} className="p-1.5 text-neutral-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Editar">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => onDelete(tx)} className="p-1.5 text-neutral-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors" title="Eliminar">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-neutral-500">
                  <p className="font-medium">No hay transacciones</p>
                  <p className="text-sm mt-1">Crea una nueva transacción o importa un PDF para empezar.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200">
          <span className="text-sm text-neutral-600">
            Página {page} de {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} /> Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
