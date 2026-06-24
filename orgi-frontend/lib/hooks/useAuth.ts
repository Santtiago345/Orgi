"use client";
import { useAuthStore } from "@/store/auth.store";
import { login as apiLogin, register as apiRegister } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    login(data.access_token, data.refresh_token, data.user);
    router.push("/dashboard");
    return data;
  };

  const handleRegister = async (email: string, password: string, full_name: string) => {
    const data = await apiRegister(email, password, full_name);
    login(data.access_token, data.refresh_token, data.user);
    router.push("/dashboard");
    return data;
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return { user, isAuthenticated, login: handleLogin, register: handleRegister, logout: handleLogout };
}
