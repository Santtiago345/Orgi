"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Props {
  data: { mes: number; ingresos: number; gastos: number }[];
}

const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default function IncomeExpenseChart({ data }: Props) {
  const chartData = data.map((d) => ({
    name: monthNames[d.mes - 1] || `Mes ${d.mes}`,
    Ingresos: d.ingresos / 1_000_000,
    Gastos: d.gastos / 1_000_000,
  }));

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h3 className="font-semibold mb-4">Ingresos vs Gastos</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}M`} />
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}M`} />
          <Legend />
          <Bar dataKey="Ingresos" fill="#0EA472" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Gastos" fill="#E02424" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
