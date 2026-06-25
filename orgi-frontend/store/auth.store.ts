import { create } from "zustand";
import { User } from "@/types";

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: !!getStoredToken(),
  login: (token, refreshToken, user) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("refresh_token", refreshToken);
    document.cookie = `access_token=${token}; path=/; max-age=604800; SameSite=Lax`;
    set({ user, accessToken: token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    document.cookie = "access_token=; path=/; max-age=0";
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
  setUser: (user) => set({ user }),
  hydrate: () => {
    const token = getStoredToken();
    set({ accessToken: token, isAuthenticated: !!token });
  },
}));
