import api from "@/lib/axios";

export interface CategoryPayload {
  categoryName: string;
  image?: string;
}

/* ================= GET ================= */

export const getCategories = async () => {
  const res = await api.get("/category");
  return res.data.categories;
};

/* ================= CREATE ================= */

export const createCategory = async (data: CategoryPayload) => {
  const res = await api.post("/category", data);
  return res.data.category;
};

/* ================= UPDATE ================= */

export const updateCategory = async (
  id: string,
  data: CategoryPayload
) => {
  const res = await api.put(`/category/${id}`, data);
  return res.data.category;
};

/* ================= DELETE ================= */

export const deleteCategory = async (id: string) => {
  const res = await api.delete(`/category/${id}`);
  return res.data;
};