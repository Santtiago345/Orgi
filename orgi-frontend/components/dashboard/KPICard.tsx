import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "blue" | "green" | "red" | "purple" | "amber";
  delay?: number;
}

const colorMap: Record<string, { bg: string; icon: string; border: string; gradient: string; shadow: string }> = {
  blue: {
    bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100",
    gradient: "from-blue-500/10 to-transparent", shadow: "shadow-blue-500/10",
  },
  green: {
    bg: "bg-success-light", icon: "text-success", border: "border-success/20",
    gradient: "from-success/10 to-transparent", shadow: "shadow-success/10",
  },
  red: {
    bg: "bg-danger-light", icon: "text-danger", border: "border-danger/20",
    gradient: "from-danger/10 to-transparent", shadow: "shadow-danger/10",
  },
  purple: {
    bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-100",
    gradient: "from-purple-500/10 to-transparent", shadow: "shadow-purple-500/10",
  },
  amber: {
    bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-100",
    gradient: "from-amber-500/10 to-transparent", shadow: "shadow-amber-500/10",
  },
};

export default function KPICard({ title, value, icon, trend, trendValue, color = "blue", delay = 0 }: KPICardProps) {
  const c = colorMap[color];
  const isNegative = value.replace(/[^0-9.-]/g, "") && parseFloat(value.replace(/[^0-9.-]/g, "")) < 0;

  return (
    <div
      className={`card-hover relative overflow-hidden ${c.border} animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} pointer-events-none`} />
      <div className="relative p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{title}</p>
          <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center ${c.icon}`}>
            {icon}
          </div>
        </div>
        <p className={`text-2xl font-bold font-mono tracking-tight mb-1 transition-all ${isNegative ? "text-danger" : ""}`}>
          {value}
        </p>
        {trend && trendValue && (
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-neutral-50">
            {trend === "up" ? (
              <TrendingUp size={14} className="text-success" />
            ) : trend === "down" ? (
              <TrendingDown size={14} className="text-danger" />
            ) : (
              <Minus size={14} className="text-neutral-400" />
            )}
            <span className={`text-xs font-medium ${
              trend === "up" ? "text-success" : trend === "down" ? "text-danger" : "text-neutral-400"
            }`}>
              {trendValue}
            </span>
            <span className="text-xs text-neutral-400">vs mes anterior</span>
          </div>
        )}
      </div>
    </div>
  );
}
