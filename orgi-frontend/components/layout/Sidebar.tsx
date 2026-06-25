"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import {
  LayoutDashboard, ArrowLeftRight, Wallet, CreditCard, PercentCircle,
  PiggyBank, FileText, BarChart3, LogOut, X, ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transacciones", icon: ArrowLeftRight },
  { href: "/accounts", label: "Cuentas", icon: Wallet },
  { href: "/cards", label: "Tarjetas", icon: CreditCard },
  { href: "/debts", label: "Deudas", icon: PercentCircle },
  { href: "/budgets", label: "Presupuestos", icon: PiggyBank },
  { href: "/pdf", label: "Importar PDF", icon: FileText },
  { href: "/reports", label: "Reportes", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen, sidebarPinned, setSidebarPinned } = useUIStore();

  const handleNav = () => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar flex flex-col z-50",
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          sidebarPinned ? "lg:translate-x-0 lg:w-64" : "lg:-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/30">
              <span className="text-white text-xs font-bold">O</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-sidebar-heading tracking-tight">orgi</h1>
              <p className="text-[10px] text-sidebar-text/60 leading-tight">Finanzas Personales</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSidebarPinned(!sidebarPinned)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-sidebar-hover text-sidebar-text/40 hover:text-sidebar-text transition-all"
              title={sidebarPinned ? "Fijar sidebar" : "Auto-ocultar"}
            >
              <ChevronLeft size={14} className={cn("transition-transform", !sidebarPinned && "rotate-180")} />
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-sidebar-hover text-sidebar-text lg:hidden transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
          <p className="px-3 text-[10px] font-semibold text-sidebar-text/40 uppercase tracking-widest mb-2">
            Menú principal
          </p>
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNav}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group",
                  active
                    ? "bg-sidebar-active/15 text-white font-medium"
                    : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-heading",
                )}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                )}
                <Icon
                  size={18}
                  className={cn(
                    "transition-colors",
                    active ? "text-primary" : "text-sidebar-text group-hover:text-sidebar-heading",
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] mb-1">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-xs font-bold">
                {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-heading truncate">
                {user?.full_name || "Usuario"}
              </p>
              <p className="text-[10px] text-sidebar-text/60 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); if (window.innerWidth < 1024) setSidebarOpen(false); }}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-xs text-sidebar-text/60 hover:text-danger hover:bg-danger/5 transition-all group"
          >
            <LogOut size={14} className="group-hover:scale-110 transition-transform" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
