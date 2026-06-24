"use client";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/ui.store";
import { Menu, Bell } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/transactions": "Transacciones",
  "/accounts": "Cuentas Bancarias",
  "/cards": "Tarjetas de Crédito",
  "/debts": "Deudas",
  "/budgets": "Presupuestos",
  "/pdf": "Importar Extracto PDF",
  "/reports": "Reportes",
};

export default function Header() {
  const pathname = usePathname();
  const { toggleSidebar } = useUIStore();
  const title = pageTitles[pathname] || "orgi";

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden text-neutral-600 hover:text-neutral-900">
          <Menu size={20} />
        </button>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-neutral-600 hover:text-neutral-900 relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full" />
        </button>
      </div>
    </header>
  );
}
