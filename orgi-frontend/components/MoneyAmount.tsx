"use client";

interface Props {
  amount: number | string;
  currency?: string;
  colored?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function MoneyAmount({ amount, currency = "COP", colored = false, size = "md" }: Props) {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  const formatted = new Intl.NumberFormat("es-CO", { style: "currency", currency, maximumFractionDigits: 0 }).format(num);

  const sizeClasses = { sm: "text-sm", md: "text-base", lg: "text-xl" };
  const colorClass = colored ? (num >= 0 ? "text-success" : "text-danger") : "";

  return (
    <span className={`font-mono ${sizeClasses[size]} ${colorClass}`}>
      {formatted}
    </span>
  );
}
