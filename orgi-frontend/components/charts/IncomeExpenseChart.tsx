"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getMonthName } from "@/lib/utils";

interface Props {
  data: { mes: number; ingresos: number; gastos: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white/90 backdrop-blur-xl shadow-elevated border border-white/40 rounded-xl p-3 text-sm">
      <p className="font-semibold text-neutral-900 mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-neutral-500">{p.name}:</span>
          <span className="font-mono font-medium">${(p.value || 0).toFixed(2)}M</span>
        </div>
      ))}
    </div>
  );
};

export default function IncomeExpenseChart({ data }: Props) {
  const chartData = (data || []).map((d) => ({
    name: getMonthName(d.mes),
    Ingresos: d.ingresos / 1_000_000,
    Gastos: d.gastos / 1_000_000,
  }));

  return (
    <div className="card p-4 sm:p-6">
      <h3 className="font-semibold text-neutral-900 mb-1">Ingresos vs Gastos</h3>
      <p className="text-xs text-neutral-400 mb-4">Evolucion mensual en millones de COP</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#94A3B8" }}
            axisLine={{ stroke: "#F1F5F9" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#94A3B8" }}
            tickFormatter={(v) => `$${v}M`}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.03)" }} />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
          <Bar dataKey="Ingresos" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={32} />
          <Bar dataKey="Gastos" fill="#EF4444" radius={[6, 6, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
