import { cn } from "@/lib/utils";
import { formatCOP } from "@/lib/utils";

interface Props {
  amount: string | number;
  colored?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function MoneyAmount({ amount, colored = true, size = "md" }: Props) {
  const num = typeof amount === "string" ? parseFloat(amount.replace(/[^0-9.\-]/g, "")) : amount;
  const isNegative = num < 0;
  const isPositive = num > 0;

  const sizeClass = size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";

  return (
    <span className={cn(
      "font-mono font-semibold",
      sizeClass,
      colored && isPositive && "text-success",
      colored && isNegative && "text-danger",
      colored && !isPositive && !isNegative && "text-neutral-800",
      !colored && "text-neutral-800"
    )}>
      {formatCOP(amount)}
    </span>
  );
}
