"use client";
import { Wallet, TrendingUp, TrendingDown, PercentCircle } from "lucide-react";
import { useDashboard } from "@/lib/hooks/useDashboard";
import KPICard from "@/components/dashboard/KPICard";
import TransactionsList from "@/components/dashboard/TransactionsList";
import IncomeExpenseChart from "@/components/charts/IncomeExpenseChart";
import CategoryDonutChart from "@/components/charts/CategoryDonutChart";

export default function DashboardPage() {
  const { netWorth, summary, recentTransactions, isLoading } = useDashboard();

  const parseAmount = (val?: string) => {
    if (!val) return "0";
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Patrimonio Neto"
          value={netWorth?.patrimonio_neto || "0"}
          icon={Wallet}
          color="#1A56DB"
          loading={isLoading}
        />
        <KPICard
          title="Ingresos (mes)"
          value={summary?.ingresos_total || "0"}
          change={summary?.vs_mes_anterior?.ingresos}
          changeType={summary && parseFloat(summary?.vs_mes_anterior?.ingresos?.toString()) >= 0 ? "up" : "down"}
          icon={TrendingUp}
          color="#0EA472"
          loading={isLoading}
        />
        <KPICard
          title="Gastos (mes)"
          value={summary?.gastos_total || "0"}
          change={summary && Math.abs(parseFloat(summary?.vs_mes_anterior?.gastos?.toString()))}
          changeType="down"
          icon={TrendingDown}
          color="#E02424"
          loading={isLoading}
        />
        <KPICard
          title="Deudas Activas"
          value={netWorth?.pasivos || "0"}
          icon={PercentCircle}
          color="#FF8800"
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {summary && summary.gastos_por_categoria && summary.gastos_por_categoria.length > 0 ? (
          <>
            <IncomeExpenseChart data={[
              { mes: new Date().getMonth() + 1, ingresos: parseToNumber(summary.ingresos_total), gastos: parseToNumber(summary.gastos_total) },
            ]} />
            <CategoryDonutChart data={monthlyData} />
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-card p-6 col-span-2 text-center text-neutral-600">
            No hay datos suficientes para mostrar gráficas. Crea algunas transacciones primero.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionsList transactions={recentTransactions} />
        <div className="bg-white rounded-xl shadow-card p-6">
          <h3 className="font-semibold mb-4">Resumen Rápido</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-neutral-50">
              <span className="text-sm text-neutral-600">Activos (cuentas)</span>
              <span className="font-mono text-sm font-medium text-success">{parseAmount(netWorth?.activos)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-neutral-50">
              <span className="text-sm text-neutral-600">Pasivos (deudas)</span>
              <span className="font-mono text-sm font-medium text-danger">{parseAmount(netWorth?.pasivos)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium">Patrimonio Neto</span>
              <span className="font-mono text-sm font-bold text-primary">{parseAmount(netWorth?.patrimonio_neto)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
