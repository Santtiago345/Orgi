import apiClient from "./client";
import { User } from "@/types";

export const login = async (email: string, password: string) => {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data;
};

export const register = async (email: string, password: string, full_name: string) => {
  const { data } = await apiClient.post("/auth/register", { email, password, full_name });
  return data;
};

export const refreshToken = async (refresh_token: string) => {
  const { data } = await apiClient.post("/auth/refresh", { refresh_token });
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await apiClient.get("/auth/me");
  return data;
};
