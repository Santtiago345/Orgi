"use client";
import { useState } from "react";
import { useTransactions } from "@/lib/hooks/useTransactions";
import { Plus, Upload } from "lucide-react";
import Link from "next/link";

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const { query, remove } = useTransactions({ page, per_page: 15 });
  const transactions = query.data?.data || [];
  const totalPages = query.data?.total_pages || 1;

  const formatCOP = (amount: string) => {
    try {
      const num = parseFloat(amount);
      return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(num);
    } catch { return amount; }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90">
            <Plus size={16} /> Nueva Transacción
          </button>
          <Link href="/pdf" className="flex items-center gap-2 border border-neutral-200 text-neutral-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50">
            <Upload size={16} /> Importar PDF
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Fecha</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Descripción</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Categoría</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-neutral-600">Monto</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                  <td className="px-4 py-3 text-sm">{new Date(tx.fecha).toLocaleDateString("es-CO")}</td>
                  <td className="px-4 py-3 text-sm">{tx.descripcion || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-neutral-100">{tx.category?.name || "Sin categoría"}</span>
                  </td>
                  <td className={`px-4 py-3 text-sm font-mono text-right ${tx.tipo === "ingreso" ? "text-success" : "text-danger"}`}>
                    {tx.tipo === "ingreso" ? "+" : "-"}{formatCOP(tx.cantidad)}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-neutral-600">No hay transacciones</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-neutral-200">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
            >
              ← Anterior
            </button>
            <span className="text-sm text-neutral-600">Página {page} de {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
