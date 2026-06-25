"use client";
import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  changeType?: "up" | "down";
  icon: LucideIcon;
  color: string;
  loading?: boolean;
}

export default function KPICard({ title, value, change, changeType, icon: Icon, color, loading }: KPICardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-card p-6 animate-pulse">
        <div className="h-4 bg-neutral-200 rounded w-24 mb-3" />
        <div className="h-8 bg-neutral-200 rounded w-36 mb-2" />
        <div className="h-3 bg-neutral-200 rounded w-20" />
      </div>
    );
  }

  const formatCOP = (val: string) => {
    try {
      const num = parseFloat(val.replace(/[^0-9.-]/g, ""));
      return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(num);
    } catch {
      return val;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-neutral-600">{title}</span>
        <Icon size={20} style={{ color }} />
      </div>
      <p className="text-2xl font-bold font-mono mb-1">{formatCOP(value)}</p>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-sm ${changeType === "up" ? "text-success" : "text-danger"}`}>
          {changeType === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{Math.abs(change).toFixed(1)}% vs mes anterior</span>
        </div>
      )}
    </div>
  );
}
