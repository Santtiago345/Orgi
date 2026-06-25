"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface Props {
  data: { categoria: string; monto: number; porcentaje: number; color?: string }[];
}

const COLORS = ["#E02424", "#FF8800", "#1A56DB", "#16BDCA", "#8B5CF6", "#EC4899", "#0EA472", "#6B7280"];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white shadow-elevated border border-neutral-100 rounded-xl p-3 text-sm">
      <p className="font-semibold text-neutral-800 mb-1">{d.name}</p>
      <p className="text-xs text-neutral-500">{d.value.toFixed(1)}% del gasto total</p>
    </div>
  );
};

export default function CategoryDonutChart({ data }: Props) {
  const chartData = data.map((d, i) => ({
    name: d.categoria,
    value: d.porcentaje,
    color: d.color || COLORS[i % COLORS.length],
  }));

  return (
    <div className="card p-6">
      <h3 className="font-semibold text-neutral-800 mb-1">Distribución de Gastos</h3>
      <p className="text-xs text-neutral-400 mb-4">Porcentaje por categoría este mes</p>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={105}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            formatter={(value: string) => <span className="text-neutral-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
