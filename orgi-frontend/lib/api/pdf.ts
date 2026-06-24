import apiClient from "./client";
import { PDFImport } from "@/types";

export const uploadPDF = async (file: File, account_id?: number) => {
  const form = new FormData();
  form.append("file", file);
  if (account_id) form.append("account_id", String(account_id));
  const { data } = await apiClient.post("/pdf/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const getImportStatus = async (importId: number): Promise<PDFImport> => {
  const { data } = await apiClient.get(`/pdf/import/${importId}`);
  return data;
};

export const getImports = async (params?: { status?: string; page?: number }) => {
  const { data } = await apiClient.get("/pdf/imports", { params });
  return data;
};

export const confirmImport = async (importId: number, transactions: { index: number; confirm: boolean }[]) => {
  const { data } = await apiClient.post(`/pdf/import/${importId}/confirm`, { transactions });
  return data;
};
