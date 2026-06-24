"use client";
import { useQuery } from "@tanstack/react-query";
import { getNetWorth, getMonthlySummary } from "@/lib/api/reports";
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

  const recentTxQuery = useQuery({
    queryKey: ["transactions", "recent"],
    queryFn: () => getTransactions({ page: 1, per_page: 5 }),
  });

  return {
    netWorth: netWorthQuery.data,
    summary: summaryQuery.data,
    recentTransactions: recentTxQuery.data?.data || [],
    isLoading: netWorthQuery.isLoading || summaryQuery.isLoading || recentTxQuery.isLoading,
  };
}
