"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAccounts } from "@/lib/api/accounts";
import { getCategories } from "@/lib/api/categories";
import { createTransaction, updateTransaction } from "@/lib/api/transactions";
import { Transaction } from "@/types";
import { X, ArrowLeftRight } from "lucide-react";

const schema = z.object({
  fecha: z.string().min(1, "La fecha es requerida"),
  tipo: z.enum(["ingreso", "gasto", "transferencia"]),
  cantidad: z.string().min(1, "El monto es requerido").refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, "El monto debe ser mayor a 0"),
  account_id: z.string().min(1, "Selecciona una cuenta"),
  category_id: z.string().min(1, "Selecciona una categoría"),
  descripcion: z.string().max(500).optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  transaction?: Transaction;
  onSuccess: () => void;
  onClose: () => void;
}

export default function TransactionForm({ transaction, onSuccess, onClose }: Props) {
  const queryClient = useQueryClient();

  const { data: accounts = [] } = useQuery({ queryKey: ["accounts"], queryFn: getAccounts });
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: () => getCategories() });

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fecha: transaction ? transaction.fecha.slice(0, 10) : new Date().toISOString().slice(0, 10),
      tipo: transaction?.tipo || "gasto",
      cantidad: transaction ? transaction.cantidad : "",
      account_id: transaction ? String(transaction.account_id) : "",
      category_id: transaction ? String(transaction.category_id) : "",
      descripcion: transaction?.descripcion || "",
      notes: transaction?.notes || "",
    },
  });

  const tipo = watch("tipo");
  const filteredCategories = categories.filter((c) => c.type === tipo || tipo === "transferencia");

  const create = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["transactions"] }); onSuccess(); },
  });

  const update = useMutation({
    mutationFn: ({ id, tx }: { id: number; tx: Partial<Transaction> }) => updateTransaction(id, tx),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["transactions"] }); onSuccess(); },
  });

  const onSubmit = async (data: FormData) => {
    const payload = {
      fecha: data.fecha,
      tipo: data.tipo,
      cantidad: parseFloat(data.cantidad).toFixed(2),
      account_id: parseInt(data.account_id, 10),
      category_id: parseInt(data.category_id, 10),
      descripcion: data.descripcion || undefined,
      notes: data.notes || undefined,
    };
    if (transaction) {
      await update.mutateAsync({ id: transaction.id, tx: payload });
    } else {
      await create.mutateAsync(payload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto border border-neutral-100" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <ArrowLeftRight size={18} className="text-primary" />
            </div>
            <h3 className="font-semibold text-lg">{transaction ? "Editar Transacción" : "Nueva Transacción"}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="flex gap-1 bg-neutral-100 rounded-xl p-1">
            {(["gasto", "ingreso", "transferencia"] as const).map((t) => (
              <button key={t} type="button" onClick={() => {
                const el = document.getElementsByName("tipo")[0] as HTMLSelectElement;
                if (el) { el.value = t; el.dispatchEvent(new Event("input", { bubbles: true })); }
              }} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${tipo === t ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"}`}>
                {t === "gasto" ? "Gasto" : t === "ingreso" ? "Ingreso" : "Transferencia"}
              </button>
            ))}
          </div>
          <input type="hidden" {...register("tipo")} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Fecha</label>
              <input type="date" {...register("fecha")} className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow" />
              {errors.fecha && <p className="text-xs text-danger mt-1">{errors.fecha.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Monto ($ COP)</label>
              <input type="number" step="0.01" min="0" placeholder="0.00" {...register("cantidad")} className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow font-mono" />
              {errors.cantidad && <p className="text-xs text-danger mt-1">{errors.cantidad.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Cuenta</label>
            <select {...register("account_id")} className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow">
              <option value="">Seleccionar cuenta</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name} — {a.bank_name || "Sin banco"}</option>
              ))}
            </select>
            {errors.account_id && <p className="text-xs text-danger mt-1">{errors.account_id.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Categoría</label>
            <select {...register("category_id")} className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow">
              <option value="">Seleccionar categoría</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-xs text-danger mt-1">{errors.category_id.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Descripción</label>
            <input type="text" placeholder="Descripción de la transacción" {...register("descripcion")} className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Notas <span className="text-neutral-400 font-normal">(opcional)</span></label>
            <textarea rows={2} placeholder="Notas adicionales" {...register("notes")} className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm">
              {isSubmitting ? "Guardando..." : transaction ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
