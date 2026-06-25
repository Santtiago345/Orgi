"use client";
import { useQuery } from "@tanstack/react-query";
import { getNetWorth, getMonthlySummary, getAnnualSummary } from "@/lib/api/reports";
import IncomeExpenseChart from "@/components/charts/IncomeExpenseChart";
import CategoryDonutChart from "@/components/charts/CategoryDonutChart";

export default function ReportsPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { data: netWorth } = useQuery({ queryKey: ["netWorth"], queryFn: getNetWorth });
  const { data: summary } = useQuery({ queryKey: ["monthlySummary", year, month], queryFn: () => getMonthlySummary(year, month) });
  const { data: annual } = useQuery({ queryKey: ["annualSummary", year], queryFn: () => getAnnualSummary(year) });

  const formatCOP = (val: string | number) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(num);
  };

  const parseToNum = (val?: string) => val ? parseFloat(val) : 0;

  const monthlyChartData = annual ? annual.ingresos_por_mes.map((d: { mes: number; monto: string }, i: number) => ({
    mes: d.mes || i + 1,
    ingresos: parseToNum(d.monto),
    gastos: parseToNum(annual.gastos_por_mes[i]?.monto) || 0,
  })) : [];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Reportes</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-card p-6">
          <p className="text-sm text-neutral-600">Activos</p>
          <p className="text-2xl font-bold font-mono text-success">{formatCOP(netWorth?.activos || "0")}</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-6">
          <p className="text-sm text-neutral-600">Pasivos</p>
          <p className="text-2xl font-bold font-mono text-danger">{formatCOP(netWorth?.pasivos || "0")}</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-6">
          <p className="text-sm text-neutral-600">Patrimonio Neto</p>
          <p className="text-2xl font-bold font-mono text-primary">{formatCOP(netWorth?.patrimonio_neto || "0")}</p>
        </div>
      </div>

      {monthlyChartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncomeExpenseChart data={monthlyChartData} />
          {summary?.gastos_por_categoria && (
            <CategoryDonutChart
              data={summary.gastos_por_categoria.map((c) => ({
                categoria: c.categoria,
                monto: parseToNum(c.monto),
                porcentaje: c.porcentaje,
                color: c.color,
              }))}
            />
          )}
        </div>
      )}
    </div>
  );
}
