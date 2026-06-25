"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { sidebarPinned } = useUIStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-neutral-400 font-medium">Cargando orgi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-glow">
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <Sidebar />
      <div
        className={cn(
          "relative flex flex-col min-h-screen transition-all duration-300",
          sidebarPinned ? "lg:pl-64" : "lg:pl-0",
        )}
      >
        <Header />
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
