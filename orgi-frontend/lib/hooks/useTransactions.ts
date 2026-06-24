"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "@/lib/api/transactions";

export function useTransactions(params?: Record<string, any>) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["transactions", params],
    queryFn: () => getTransactions(params),
  });

  const create = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });

  const update = useMutation({
    mutationFn: ({ id, tx }: { id: number; tx: any }) => updateTransaction(id, tx),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });

  const remove = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });

  return { query, create, update, remove };
}
