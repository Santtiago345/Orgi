"use client";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { Menu, LogOut, Bell } from "lucide-react";

export default function Header() {
  const { toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-100 flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-xl hover:bg-neutral-100 active:scale-95 transition-all lg:hidden"
        >
          <Menu size={20} className="text-neutral-600" />
        </button>
        <div className="hidden sm:block">
          <p className="text-xs text-neutral-400">
            {new Date().toLocaleDateString("es-CO", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-xl hover:bg-neutral-100 active:scale-95 transition-all group">
          <Bell size={18} className="text-neutral-400 group-hover:text-neutral-600 transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-neutral-100">
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
          className="p-2 rounded-xl hover:bg-neutral-100 active:scale-95 transition-all group"
          title="Cerrar sesión"
        >
          <LogOut size={16} className="text-neutral-400 group-hover:text-danger transition-colors" />
        </button>
      </div>
    </header>
  );
}
