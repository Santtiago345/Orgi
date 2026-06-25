import { create } from "zustand";
import { User } from "@/types";

const DEV_USER: User = {
  id: 3,
  email: "test@test.com",
  full_name: "Test User",
  currency: "COP",
  timezone: "America/Bogota",
  is_active: true,
};

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthStore>(() => ({
  user: DEV_USER,
  isAuthenticated: true,
}));
