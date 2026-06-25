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

const colorMap: Record<string, { from: string; to: string; iconBg: string; iconColor: string; textColor: string }> = {
  blue: {
    from: "from-primary/5", to: "to-primary/0",
    iconBg: "bg-gradient-to-br from-primary to-primary-dark",
    iconColor: "text-white",
    textColor: "text-primary",
  },
  green: {
    from: "from-success/5", to: "to-success/0",
    iconBg: "bg-gradient-to-br from-success to-success-dark",
    iconColor: "text-white",
    textColor: "text-success",
  },
  red: {
    from: "from-danger/5", to: "to-danger/0",
    iconBg: "bg-gradient-to-br from-danger to-danger-dark",
    iconColor: "text-white",
    textColor: "text-danger",
  },
  purple: {
    from: "from-accent/5", to: "to-accent/0",
    iconBg: "bg-gradient-to-br from-accent to-primary-dark",
    iconColor: "text-white",
    textColor: "text-accent",
  },
  amber: {
    from: "from-warning/5", to: "to-warning/0",
    iconBg: "bg-gradient-to-br from-warning to-warning-dark",
    iconColor: "text-white",
    textColor: "text-warning-dark",
  },
};

export default function KPICard({ title, value, icon, trend, trendValue, color = "blue", delay = 0 }: KPICardProps) {
  const c = colorMap[color];
  const numVal = parseFloat(value.replace(/[^0-9.-]/g, ""));
  const isNegative = !isNaN(numVal) && numVal < 0;

  return (
    <div
      className="card-hover relative overflow-hidden animate-fade-in-up group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none opacity-60", c.from, c.to)} />
      <div className="absolute top-0 right-0 w-32 h-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.08em]">{title}</p>
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-black/5", c.iconBg, c.iconColor)}>
            {icon}
          </div>
        </div>
        <p className={cn("text-2xl font-bold font-mono tracking-tight", isNegative ? "text-danger" : "text-neutral-900")}>
          {value}
        </p>
        {trend && trendValue && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-neutral-100/60">
            <div className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium",
              trend === "up" ? "text-success bg-success/5" : trend === "down" ? "text-danger bg-danger/5" : "text-neutral-400 bg-neutral-100/50"
            )}>
              {trend === "up" ? (
                <TrendingUp size={12} />
              ) : trend === "down" ? (
                <TrendingDown size={12} />
              ) : (
                <Minus size={12} />
              )}
              {trendValue}
            </div>
            <span className="text-[11px] text-neutral-400">vs mes anterior</span>
          </div>
        )}
      </div>
    </div>
  );
}
