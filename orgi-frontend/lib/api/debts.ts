import apiClient from "./client";
import { Debt } from "@/types";

export const getDebts = async (status?: string): Promise<Debt[]> => {
  const { data } = await apiClient.get("/debts", { params: { status } });
  return data;
};

export const createDebt = async (debt: Partial<Debt>) => {
  const { data } = await apiClient.post("/debts", debt);
  return data;
};

export const getDebtSummary = async () => {
  const { data } = await apiClient.get("/debts/summary");
  return data;
};

export const registerPayment = async (debtId: number, payment: { payment_date: string; amount: number }) => {
  const { data } = await apiClient.post(`/debts/${debtId}/payments`, payment);
  return data;
};
