"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction } from "@/lib/api/transactions";
import TransactionTable from "@/components/transactions/TransactionTable";
import TransactionForm from "@/components/transactions/TransactionForm";
import { Transaction } from "@/types";
import { Plus, Upload, Search } from "lucide-react";
import Link from "next/link";

export default function TransactionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
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
          <h2 className="page-title">Transacciones</h2>
          <p className="page-subtitle">Registra y gestiona todos tus movimientos financieros</p>
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
            placeholder="Buscar por descripcion..." className="input-field pl-10" />
        </div>
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
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-modal p-6 w-full max-w-sm mx-4 border border-white/40 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-lg text-neutral-900 mb-2">Eliminar transaccion</h3>
            <p className="text-sm text-neutral-500 mb-6">Se restaurara el balance de la cuenta correspondiente. Estas seguro?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingId(null)} className="btn-secondary flex-1">Cancelar</button>
              <button onClick={confirmDelete} disabled={remove.isPending}
                className="btn-danger flex-1">
                {remove.isPending ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
