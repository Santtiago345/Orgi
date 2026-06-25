"use client";
import { useQuery } from "@tanstack/react-query";
import { getNetWorth, getMonthlySummary, getAnnualSummary } from "@/lib/api/reports";
import IncomeExpenseChart from "@/components/charts/IncomeExpenseChart";
import CategoryDonutChart from "@/components/charts/CategoryDonutChart";
import { formatCOP, parseToNumber } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { data: netWorth } = useQuery({ queryKey: ["netWorth"], queryFn: getNetWorth });
  const { data: summary } = useQuery({
    queryKey: ["monthlySummary", year, month],
    queryFn: () => getMonthlySummary(year, month),
  });
  const { data: annual } = useQuery({
    queryKey: ["annualSummary", year],
    queryFn: () => getAnnualSummary(year),
  });

  const monthlyChartData = annual
    ? annual.ingresos_por_mes.map((d: { mes: number; monto: string }, i: number) => ({
        mes: d.mes || i + 1,
        ingresos: typeof d.monto === "string" ? parseToNumber(d.monto) : d.monto,
        gastos:
          typeof annual.gastos_por_mes[i]?.monto === "string"
            ? parseToNumber(annual.gastos_por_mes[i]?.monto)
            : annual.gastos_por_mes[i]?.monto || 0,
      }))
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Reportes</h2>
        <p className="text-sm text-neutral-400 mt-0.5">Visualiza tus finanzas con graficas detalladas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-hover p-5 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Activos</p>
          <p className="text-2xl font-bold font-mono text-success">{formatCOP(netWorth?.activos || "0")}</p>
        </div>
        <div className="card-hover p-5 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Pasivos</p>
          <p className="text-2xl font-bold font-mono text-danger">{formatCOP(netWorth?.pasivos || "0")}</p>
        </div>
        <div className="card-hover p-5 animate-fade-in-up" style={{ animationDelay: "160ms" }}>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Patrimonio Neto</p>
          <p className="text-2xl font-bold font-mono text-primary">{formatCOP(netWorth?.patrimonio_neto || "0")}</p>
        </div>
      </div>

      {monthlyChartData.length > 0 || (summary?.gastos_por_categoria && summary.gastos_por_categoria.length > 0) ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <IncomeExpenseChart data={monthlyChartData} />
          </div>
          {summary?.gastos_por_categoria && summary.gastos_por_categoria.length > 0 && (
            <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <CategoryDonutChart
                data={summary.gastos_por_categoria.map((c: any) => ({
                  categoria: c.categoria,
                  monto: parseToNumber(c.monto),
                  porcentaje: c.porcentaje,
                  color: c.color,
                }))}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="card p-12 animate-fade-in">
          <div className="text-center text-neutral-400">
            <div className="empty-state-icon mx-auto mb-4">
              <BarChart3 size={24} className="text-neutral-300" />
            </div>
            <p className="font-semibold text-neutral-600">No hay datos suficientes</p>
            <p className="text-sm text-neutral-400 mt-1">Crea algunas transacciones para generar reportes.</p>
          </div>
        </div>
      )}
    </div>
  );
}
