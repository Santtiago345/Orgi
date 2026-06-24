import apiClient from "./client";
import { MonthlySummary, NetWorth } from "@/types";

export const getMonthlySummary = async (year: number, month: number): Promise<MonthlySummary> => {
  const { data } = await apiClient.get("/reports/monthly", { params: { year, month } });
  return data;
};

export const getAnnualSummary = async (year: number) => {
  const { data } = await apiClient.get("/reports/annual", { params: { year } });
  return data;
};

export const getNetWorth = async (): Promise<NetWorth> => {
  const { data } = await apiClient.get("/reports/net-worth");
  return data;
};
