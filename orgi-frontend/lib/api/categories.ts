import apiClient from "./client";
import { Category } from "@/types";

export const getCategories = async (type?: string): Promise<Category[]> => {
  const { data } = await apiClient.get("/categories", { params: { type } });
  return data;
};

export const createCategory = async (category: Partial<Category>) => {
  const { data } = await apiClient.post("/categories", category);
  return data;
};
