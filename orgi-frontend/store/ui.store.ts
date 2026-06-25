import { create } from "zustand";

interface UIStore {
  sidebarOpen: boolean;
  sidebarPinned: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarPinned: (pinned: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  sidebarPinned: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  setSidebarPinned: (pinned: boolean) => set({ sidebarPinned: pinned }),
}));
