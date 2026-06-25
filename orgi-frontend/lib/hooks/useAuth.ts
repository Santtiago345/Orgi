"use client";
import { useAuthStore } from "@/store/auth.store";

export function useAuth() {
  const { user, isAuthenticated } = useAuthStore();
  return { user, isAuthenticated };
}
