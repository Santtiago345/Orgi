import apiClient from "./client";
import { Account } from "@/types";

export const getAccounts = async (): Promise<Account[]> => {
  const { data } = await apiClient.get("/accounts");
  return data;
};

export const createAccount = async (account: Partial<Account>) => {
  const { data } = await apiClient.post("/accounts", account);
  return data;
};

export const updateAccount = async (id: number, account: Partial<Account>) => {
  const { data } = await apiClient.put(`/accounts/${id}`, account);
  return data;
};
