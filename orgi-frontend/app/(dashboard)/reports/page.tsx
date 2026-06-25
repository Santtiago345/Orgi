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
      <div>
        <h2 className="text-xl font-bold text-neutral-800">Reportes</h2>
        <p className="text-sm text-neutral-500 mt-0.5">Visualiza tus finanzas con gráficas detalladas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-hover border-success/15 p-5">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Activos</p>
          <p className="text-2xl font-bold font-mono text-success">{formatCOP(netWorth?.activos || "0")}</p>
        </div>
        <div className="card-hover border-danger/15 p-5">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Pasivos</p>
          <p className="text-2xl font-bold font-mono text-danger">{formatCOP(netWorth?.pasivos || "0")}</p>
        </div>
        <div className="card-hover border-primary/15 p-5">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Patrimonio Neto</p>
          <p className="text-2xl font-bold font-mono text-primary">{formatCOP(netWorth?.patrimonio_neto || "0")}</p>
        </div>
      </div>

      {monthlyChartData.length > 0 || (summary?.gastos_por_categoria && summary.gastos_por_categoria.length > 0) ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncomeExpenseChart data={monthlyChartData} />
          {summary?.gastos_por_categoria && summary.gastos_por_categoria.length > 0 && (
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
      ) : (
        <div className="card p-12">
          <div className="text-center text-neutral-500">
            No hay datos suficientes para generar reportes. Crea algunas transacciones primero.
          </div>
        </div>
      )}
    </div>
  );
}
