import { api } from "./client";

function buildCategoryFormData(category) {
  const formData = new FormData();

  formData.append("name[en]", category.name.en);
  formData.append("name[ar]", category.name.ar);
  formData.append("description[en]", category.description.en);
  formData.append("description[ar]", category.description.ar);
  if (category.image instanceof File) {
    formData.append("image", category.image);
  }

  return formData;
}

export async function getCategories({ page = 1, limit = 10 } = {}) {
  const res = await api.get(`/category`, { params: { page, limit } });
  return res.data;
}

export async function getCategoryById(id) {
  const res = await api.get(`/category/${id}`);
  return res.data;
}

export async function deleteCategory(id) {
  const res = await api.delete(`/category/${id}`);
  return res.data;
}

export async function createCategory(category) {
  const res = await api.post(`/category`, buildCategoryFormData(category));
  return res.data;
}

export async function updateCategory({ id, ...category }) {
  const res = await api.patch(
    `/category/${id}`,
    buildCategoryFormData(category),
  );
  return res.data;
}
