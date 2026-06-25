"use client";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { Menu, Search, LogOut } from "lucide-react";

export default function Header() {
  const { toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-neutral-100 flex items-center justify-between px-4 lg:px-8 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-xl hover:bg-neutral-100 transition-colors lg:hidden"
        >
          <Menu size={20} className="text-neutral-600" />
        </button>
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar transacciones..."
            className="w-64 lg:w-80 pl-9 pr-3 py-2 bg-neutral-50 border border-transparent rounded-xl text-sm
                       placeholder:text-neutral-400
                       focus:outline-none focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10
                       transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 pr-3 border-r border-neutral-100">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center ring-2 ring-primary/5">
            <span className="text-sm font-bold text-primary">
              {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold leading-tight text-neutral-800">{user?.full_name || "Usuario"}</p>
            <p className="text-xs text-neutral-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-neutral-100 transition-colors group"
          title="Cerrar sesión"
        >
          <LogOut size={16} className="text-neutral-400 group-hover:text-danger transition-colors" />
        </button>
      </div>
    </header>
  );
}
