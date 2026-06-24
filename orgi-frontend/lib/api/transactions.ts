import apiClient from "./client";
import { Transaction, PaginatedResponse } from "@/types";

export const getTransactions = async (params?: {
  page?: number;
  per_page?: number;
  start_date?: string;
  end_date?: string;
  tipo?: string;
  category_id?: number;
  account_id?: number;
  search?: string;
}): Promise<PaginatedResponse<Transaction>> => {
  const { data } = await apiClient.get("/transactions", { params });
  return data;
};

export const createTransaction = async (tx: Partial<Transaction>) => {
  const { data } = await apiClient.post("/transactions", tx);
  return data;
};

export const updateTransaction = async (id: number, tx: Partial<Transaction>) => {
  const { data } = await apiClient.put(`/transactions/${id}`, tx);
  return data;
};

export const deleteTransaction = async (id: number) => {
  const { data } = await apiClient.delete(`/transactions/${id}`);
  return data;
};
