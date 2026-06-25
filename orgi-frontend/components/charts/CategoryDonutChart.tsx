"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatCOPShort } from "@/lib/utils";

interface Props {
  data: { categoria: string; monto: number; porcentaje: number; color?: string }[];
}

const COLORS = ["#E02424", "#FF8800", "#1A56DB", "#16BDCA", "#8B5CF6", "#EC4899", "#0EA472", "#6B7280"];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white shadow-elevated border border-neutral-100 rounded-xl p-3 text-sm">
      <p className="font-semibold text-neutral-800">{d.categoria}</p>
      <p className="text-xs text-neutral-500 mt-0.5">{formatCOPShort(d.monto)} ({d.porcentaje}%)</p>
    </div>
  );
};

export default function CategoryDonutChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="card p-6 flex items-center justify-center h-[350px]">
        <p className="text-sm text-neutral-400">No hay datos de categorías</p>
      </div>
    );
  }

  return (
    <div className="card p-4 sm:p-6">
      <h3 className="font-semibold text-neutral-800 mb-1">Distribución de Gastos</h3>
      <p className="text-xs text-neutral-400 mb-4">Por categoría este mes</p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="monto"
            nameKey="categoria"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={data[idx]?.color || COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ fontSize: 11, paddingLeft: 10 }}
            formatter={(value) => (
              <span className="text-neutral-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
