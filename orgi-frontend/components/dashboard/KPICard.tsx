import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "blue" | "green" | "red" | "purple" | "amber";
  delay?: number;
}

const colorMap: Record<string, { bg: string; icon: string; gradient: string }> = {
  blue: {
    bg: "bg-primary-light", icon: "text-primary",
    gradient: "from-primary/5 via-transparent to-transparent",
  },
  green: {
    bg: "bg-success-light", icon: "text-success",
    gradient: "from-success/5 via-transparent to-transparent",
  },
  red: {
    bg: "bg-danger-light", icon: "text-danger",
    gradient: "from-danger/5 via-transparent to-transparent",
  },
  purple: {
    bg: "bg-accent-light", icon: "text-accent",
    gradient: "from-accent/5 via-transparent to-transparent",
  },
  amber: {
    bg: "bg-warning-light", icon: "text-warning",
    gradient: "from-warning/5 via-transparent to-transparent",
  },
};

export default function KPICard({ title, value, icon, trend, trendValue, color = "blue", delay = 0 }: KPICardProps) {
  const c = colorMap[color];
  const numVal = parseFloat(value.replace(/[^0-9.-]/g, ""));
  const isNegative = !isNaN(numVal) && numVal < 0;

  return (
    <div
      className="card-hover relative overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none", c.gradient)} />
      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">{title}</p>
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", c.bg, c.icon)}>
            {icon}
          </div>
        </div>
        <p className={cn("text-2xl font-bold font-mono tracking-tight", isNegative ? "text-danger" : "text-neutral-900")}>
          {value}
        </p>
        {trend && trendValue && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-neutral-50">
            {trend === "up" ? (
              <TrendingUp size={13} className="text-success" />
            ) : trend === "down" ? (
              <TrendingDown size={13} className="text-danger" />
            ) : (
              <Minus size={13} className="text-neutral-300" />
            )}
            <span className={cn("text-xs font-medium",
              trend === "up" ? "text-success" : trend === "down" ? "text-danger" : "text-neutral-400"
            )}>
              {trendValue}
            </span>
            <span className="text-[11px] text-neutral-400">vs mes ant.</span>
          </div>
        )}
      </div>
    </div>
  );
}
