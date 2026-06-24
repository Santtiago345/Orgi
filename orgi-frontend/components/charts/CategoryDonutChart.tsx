"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface Props {
  data: { categoria: string; monto: number; porcentaje: number; color?: string }[];
}

const COLORS = ["#E02424", "#FF8800", "#1A56DB", "#16BDCA", "#8B5CF6", "#EC4899", "#0EA472", "#6B7280"];

export default function CategoryDonutChart({ data }: Props) {
  const chartData = data.map((d, i) => ({
    name: d.categoria,
    value: d.porcentaje,
    color: d.color || COLORS[i % COLORS.length],
  }));

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h3 className="font-semibold mb-4">Distribución de Gastos</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
