"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatCOPShort } from "@/lib/utils";

interface Props {
  data: { categoria: string; monto: number; porcentaje: number; color?: string }[];
}

const COLORS = ["#EF4444", "#F59E0B", "#6366F1", "#06B6D4", "#8B5CF6", "#EC4899", "#10B981", "#64748B"];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white/90 backdrop-blur-xl shadow-elevated border border-white/40 rounded-xl p-3 text-sm">
      <p className="font-semibold text-neutral-900">{d.categoria}</p>
      <p className="text-xs text-neutral-500 mt-0.5">{formatCOPShort(d.monto)} ({d.porcentaje}%)</p>
    </div>
  );
};

export default function CategoryDonutChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="card p-6 flex items-center justify-center h-[350px]">
        <p className="text-sm text-neutral-400">No hay datos de categorias</p>
      </div>
    );
  }

  return (
    <div className="card p-4 sm:p-6">
      <h3 className="font-semibold text-neutral-900 mb-1">Distribucion de Gastos</h3>
      <p className="text-xs text-neutral-400 mb-4">Por categoria este mes</p>
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
              <span className="text-neutral-500">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
