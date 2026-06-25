"use client";
import { useUIStore } from "@/store/ui.store";
import { Menu } from "lucide-react";

export default function Header() {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-30 bg-white/60 backdrop-blur-xl border-b border-white/40">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-xl hover:bg-white/80 active:scale-95 transition-all lg:hidden border border-neutral-200/50"
        >
          <Menu size={20} className="text-neutral-500" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-sm text-neutral-400">
          <div className="w-2 h-2 rounded-full bg-primary/40" />
          <span className="font-medium capitalize">
            {new Date().toLocaleDateString("es-CO", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/70 border border-neutral-200/50 shadow-sm">
          <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center shadow-sm">
            <span className="text-white text-[10px] font-bold">O</span>
          </div>
          <span className="text-xs font-semibold text-neutral-700">orgi</span>
        </div>
      </div>
    </header>
  );
}
