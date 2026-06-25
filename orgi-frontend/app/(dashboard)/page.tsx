"use client";
import { Wallet, TrendingUp, TrendingDown, PercentCircle } from "lucide-react";
import { useDashboard } from "@/lib/hooks/useDashboard";
import KPICard from "@/components/dashboard/KPICard";
import TransactionsList from "@/components/dashboard/TransactionsList";
import IncomeExpenseChart from "@/components/charts/IncomeExpenseChart";
import CategoryDonutChart from "@/components/charts/CategoryDonutChart";

export default function DashboardPage() {
  const { netWorth, summary, recentTransactions, chartData, isLoading } = useDashboard();

  const parseAmount = (val?: string) => {
    if (!val) return "$0";
    try {
      const num = parseFloat(val.replace(/[^0-9.-]/g, ""));
      return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(num);
    } catch {
      return val;
    }
  };

  const parseToNumber = (val?: string) => {
    if (!val) return 0;
    return parseFloat(val.replace(/[^0-9.-]/g, ""));
  };

  const monthlyData = summary?.gastos_por_categoria?.map((c) => ({
    categoria: c.categoria,
    monto: parseToNumber(c.monto),
    porcentaje: c.porcentaje,
    color: c.color,
  })) || [];

  const getTrend = (val: number): "up" | "down" => val >= 0 ? "up" : "down";
  const trendPct = (val: number) => `${Math.abs(val).toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-neutral-800">Dashboard</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Resumen de tu situación financiera</p>
        </div>
        <div className="text-xs text-neutral-400 font-mono bg-white border border-neutral-100 rounded-xl px-3 py-1.5">
          {new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Patrimonio Neto"
          value={parseAmount(netWorth?.patrimonio_neto)}
          icon={<Wallet size={22} />}
          color="blue"
        />
        <KPICard
          title="Ingresos (mes)"
          value={parseAmount(summary?.ingresos_total)}
          icon={<TrendingUp size={22} />}
          trend={summary ? getTrend(summary.vs_mes_anterior?.ingresos || 0) : undefined}
          trendValue={summary ? trendPct(summary.vs_mes_anterior?.ingresos || 0) : undefined}
          color="green"
        />
        <KPICard
          title="Gastos (mes)"
          value={parseAmount(summary?.gastos_total)}
          icon={<TrendingDown size={22} />}
          trend={summary ? getTrend(summary.vs_mes_anterior?.gastos || 0) : "down"}
          trendValue={summary ? trendPct(summary.vs_mes_anterior?.gastos || 0) : undefined}
          color="red"
        />
        <KPICard
          title="Deudas Activas"
          value={parseAmount(netWorth?.pasivos)}
          icon={<PercentCircle size={22} />}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {monthlyData.length > 0 || chartData.length > 0 ? (
          <>
            <IncomeExpenseChart data={chartData.length >= 2 ? chartData : [
              { mes: new Date().getMonth() + 1, ingresos: parseToNumber(summary?.ingresos_total), gastos: parseToNumber(summary?.gastos_total) },
            ]} />
            {monthlyData.length > 0 && <CategoryDonutChart data={monthlyData} />}
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-100 p-12 col-span-2 text-center text-neutral-500">
            No hay datos suficientes para mostrar gráficas. Crea algunas transacciones primero.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionsList transactions={recentTransactions} />
        <div className="card p-6">
          <h3 className="font-semibold text-neutral-800 mb-4">Resumen Rápido</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 px-4 bg-success-light rounded-xl">
              <div>
                <span className="text-sm text-neutral-600">Activos (cuentas)</span>
                <p className="text-[10px] text-success font-medium mt-0.5">Total en cuentas bancarias</p>
              </div>
              <span className="font-mono text-sm font-bold text-success">{parseAmount(netWorth?.activos)}</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 bg-danger-light rounded-xl">
              <div>
                <span className="text-sm text-neutral-600">Pasivos (deudas)</span>
                <p className="text-[10px] text-danger font-medium mt-0.5">Total de obligaciones</p>
              </div>
              <span className="font-mono text-sm font-bold text-danger">{parseAmount(netWorth?.pasivos)}</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 bg-primary-light rounded-xl">
              <div>
                <span className="text-sm font-medium text-neutral-800">Patrimonio Neto</span>
                <p className="text-[10px] text-primary font-medium mt-0.5">Diferencia activos - pasivos</p>
              </div>
              <span className="font-mono text-sm font-bold text-primary">{parseAmount(netWorth?.patrimonio_neto)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
