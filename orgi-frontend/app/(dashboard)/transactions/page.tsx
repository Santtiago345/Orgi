"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction } from "@/lib/api/transactions";
import TransactionTable from "@/components/transactions/TransactionTable";
import TransactionForm from "@/components/transactions/TransactionForm";
import { Transaction } from "@/types";
import { Plus, Upload, Search, Filter, X } from "lucide-react";
import Link from "next/link";

export default function TransactionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (deletingId !== null) {
      await remove.mutateAsync(deletingId);
      setDeletingId(null);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTransaction(undefined);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-800">Transacciones</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Registra y gestiona todos tus movimientos financieros</p>
        </div>
        <div className="flex gap-2">
          <Link href="/pdf" className="btn-secondary"><Upload size={16} /> <span className="hidden sm:inline">Importar PDF</span></Link>
          <button onClick={() => { setEditingTransaction(undefined); setShowForm(true); }} className="btn-primary"><Plus size={16} /> <span className="hidden sm:inline">Nueva</span></button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por descripción..." className="input-field pl-10" />
        </div>
        <button onClick={() => setFiltersOpen(!filtersOpen)}
          className={`btn-secondary ${filtersOpen ? "!border-primary/50 !bg-primary-light !text-primary" : ""}`}>
          <Filter size={16} /> Filtros {filtersOpen && <X size={14} />}
        </button>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <TransactionTable filters={{ search }} onEdit={handleEdit} onDelete={(tx) => setDeletingId(tx.id)} />
      </div>

      {showForm && (
        <TransactionForm transaction={editingTransaction} onSuccess={handleFormSuccess}
          onClose={() => { setShowForm(false); setEditingTransaction(undefined); }} />
      )}

      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setDeletingId(null)}>
          <div className="bg-white rounded-2xl shadow-modal p-6 w-full max-w-sm mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-lg text-neutral-800 mb-2">Eliminar transacción</h3>
            <p className="text-sm text-neutral-600 mb-6">Se restaurará el balance de la cuenta correspondiente. ¿Estás seguro?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingId(null)} className="btn-secondary flex-1">Cancelar</button>
              <button onClick={confirmDelete} disabled={remove.isPending}
                className="flex-1 py-2.5 bg-danger text-white rounded-xl text-sm font-medium hover:bg-danger/90 active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100 transition-all">
                {remove.isPending ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
