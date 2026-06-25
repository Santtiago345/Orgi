"use client";
import { Wallet, TrendingUp, TrendingDown, PercentCircle } from "lucide-react";
import { useDashboard } from "@/lib/hooks/useDashboard";
import KPICard from "@/components/dashboard/KPICard";
import TransactionsList from "@/components/dashboard/TransactionsList";
import IncomeExpenseChart from "@/components/charts/IncomeExpenseChart";
import CategoryDonutChart from "@/components/charts/CategoryDonutChart";
import { formatCOP, parseToNumber, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { netWorth, summary, recentTransactions, chartData, isLoading } = useDashboard();

  const monthlyData = summary?.gastos_por_categoria?.map((c: any) => ({
    categoria: c.categoria,
    monto: parseToNumber(c.monto),
    porcentaje: c.porcentaje,
    color: c.color,
  })) || [];

  const getTrend = (val: number): "up" | "down" => val >= 0 ? "up" : "down";
  const trendPct = (val: number) => `${Math.abs(val).toFixed(1)}%`;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="skeleton h-3 w-20 mb-4" />
              <div className="skeleton h-8 w-36 mb-3" />
              <div className="skeleton h-3 w-28" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6"><div className="skeleton h-[300px] w-full" /></div>
          <div className="card p-6"><div className="skeleton h-[300px] w-full" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fade-in-down">
        <div>
          <h2 className="text-xl font-bold text-neutral-800">Dashboard</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Resumen de tu situación financiera</p>
        </div>
        <div className="text-xs text-neutral-400 font-mono bg-white border border-neutral-100 rounded-xl px-3 py-1.5">
          {formatDate(new Date().toISOString())}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Patrimonio Neto" value={formatCOP(netWorth?.patrimonio_neto || "0")} icon={<Wallet size={22} />} color="blue" delay={0} />
        <KPICard title="Ingresos (mes)" value={formatCOP(summary?.ingresos_total || "0")} icon={<TrendingUp size={22} />}
          trend={summary ? getTrend(summary.vs_mes_anterior?.ingresos || 0) : undefined}
          trendValue={summary ? trendPct(summary.vs_mes_anterior?.ingresos || 0) : undefined} color="green" delay={100} />
        <KPICard title="Gastos (mes)" value={formatCOP(summary?.gastos_total || "0")} icon={<TrendingDown size={22} />}
          trend={summary ? getTrend(summary.vs_mes_anterior?.gastos || 0) : undefined}
          trendValue={summary ? trendPct(summary.vs_mes_anterior?.gastos || 0) : undefined} color="red" delay={200} />
        <KPICard title="Deudas Activas" value={formatCOP(netWorth?.pasivos || "0")} icon={<PercentCircle size={22} />} color="amber" delay={300} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartData.length > 0 || monthlyData.length > 0 ? (
          <>
            <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <IncomeExpenseChart data={chartData.length >= 2 ? chartData : [
                { mes: new Date().getMonth() + 1, ingresos: parseToNumber(summary?.ingresos_total), gastos: parseToNumber(summary?.gastos_total) },
              ]} />
            </div>
            {monthlyData.length > 0 && (
              <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <CategoryDonutChart data={monthlyData} />
              </div>
            )}
          </>
        ) : (
          <div className="card p-12 col-span-2 animate-fade-in">
            <div className="text-center text-neutral-500">
              <div className="empty-state-icon mx-auto mb-4">
                <TrendingUp size={24} className="text-neutral-400" />
              </div>
              <p className="font-semibold text-neutral-700">No hay datos suficientes</p>
              <p className="text-sm text-neutral-500 mt-1">Crea algunas transacciones para ver gráficas.</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <TransactionsList transactions={recentTransactions} />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <div className="card p-6">
            <h3 className="font-semibold text-neutral-800 mb-4">Resumen Rápido</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 px-4 bg-success-light rounded-xl">
                <div>
                  <span className="text-sm text-neutral-600">Activos (cuentas)</span>
                  <p className="text-[10px] text-success font-medium mt-0.5">Total en cuentas bancarias</p>
                </div>
                <span className="font-mono text-sm font-bold text-success">{formatCOP(netWorth?.activos || "0")}</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-danger-light rounded-xl">
                <div>
                  <span className="text-sm text-neutral-600">Pasivos (deudas)</span>
                  <p className="text-[10px] text-danger font-medium mt-0.5">Total de obligaciones</p>
                </div>
                <span className="font-mono text-sm font-bold text-danger">{formatCOP(netWorth?.pasivos || "0")}</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-primary-light rounded-xl">
                <div>
                  <span className="text-sm font-medium text-neutral-800">Patrimonio Neto</span>
                  <p className="text-[10px] text-primary font-medium mt-0.5">Activos - Pasivos</p>
                </div>
                <span className="font-mono text-sm font-bold text-primary">{formatCOP(netWorth?.patrimonio_neto || "0")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
