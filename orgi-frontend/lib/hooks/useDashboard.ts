"use client";
import { useQuery } from "@tanstack/react-query";
import { getNetWorth, getMonthlySummary, getAnnualSummary } from "@/lib/api/reports";
import { getTransactions } from "@/lib/api/transactions";

export function useDashboard() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const netWorthQuery = useQuery({
    queryKey: ["netWorth"],
    queryFn: getNetWorth,
  });

  const summaryQuery = useQuery({
    queryKey: ["monthlySummary", year, month],
    queryFn: () => getMonthlySummary(year, month),
  });

  const annualQuery = useQuery({
    queryKey: ["annualSummary", year],
    queryFn: () => getAnnualSummary(year),
  });

  const recentTxQuery = useQuery({
    queryKey: ["transactions", "recent"],
    queryFn: () => getTransactions({ page: 1, per_page: 5 }),
  });

  const getLast6Months = () => {
    if (!annualQuery.data) return [];
    const dp: { mes: number; ingresos: number; gastos: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const m = month - i;
      if (m >= 1) {
        const idx = m - 1;
        dp.push({
          mes: m,
          ingresos: annualQuery.data.ingresos_por_mes[idx]?.monto || 0,
          gastos: annualQuery.data.gastos_por_mes[idx]?.monto || 0,
        });
      }
    }
    return dp;
  };

  return {
    netWorth: netWorthQuery.data,
    summary: summaryQuery.data,
    recentTransactions: recentTxQuery.data?.data || [],
    chartData: getLast6Months(),
    isLoading: netWorthQuery.isLoading || summaryQuery.isLoading || annualQuery.isLoading || recentTxQuery.isLoading,
  };
}
