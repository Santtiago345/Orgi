"use client";
import { useUIStore } from "@/store/ui.store";
import { Menu } from "lucide-react";

export default function Header() {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-100/80 flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-xl hover:bg-neutral-100 active:scale-95 transition-all lg:hidden"
        >
          <Menu size={20} className="text-neutral-500" />
        </button>
        <p className="text-xs text-neutral-400 font-medium capitalize">
          {new Date().toLocaleDateString("es-CO", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-sm shadow-primary/20">
          <span className="text-white text-xs font-bold">O</span>
        </div>
      </div>
    </header>
  );
}
