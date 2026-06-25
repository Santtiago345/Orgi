"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction } from "@/lib/api/transactions";
import TransactionTable from "@/components/transactions/TransactionTable";
import TransactionForm from "@/components/transactions/TransactionForm";
import { Transaction } from "@/types";
import { Plus, Upload } from "lucide-react";
import Link from "next/link";

export default function TransactionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setShowForm(true);
  };

  const handleDelete = (tx: Transaction) => {
    setDeletingId(tx.id);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => { setEditingTransaction(undefined); setShowForm(true); }}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
          >
            <Plus size={16} /> Nueva Transacción
          </button>
          <Link href="/pdf" className="flex items-center gap-2 border border-neutral-200 text-neutral-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50">
            <Upload size={16} /> Importar PDF
          </Link>
        </div>
      </div>

      <TransactionTable onEdit={handleEdit} onDelete={handleDelete} />

      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onSuccess={handleFormSuccess}
          onClose={() => { setShowForm(false); setEditingTransaction(undefined); }}
        />
      )}

      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeletingId(null)}>
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-2">Eliminar transacción</h3>
            <p className="text-sm text-neutral-600 mb-6">Esta acción restaurará el balance de la cuenta. ¿Estás seguro?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingId(null)} className="flex-1 py-2 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50">Cancelar</button>
              <button onClick={confirmDelete} disabled={remove.isPending} className="flex-1 py-2 bg-danger text-white rounded-lg text-sm font-medium hover:bg-danger/90 disabled:opacity-50">
                {remove.isPending ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
