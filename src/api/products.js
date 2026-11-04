import { api } from "./client";

function buildProductFormData(product) {
  const formData = new FormData();

  formData.append("name[en]", product.name.en);
  formData.append("name[ar]", product.name.ar);
  formData.append("description[en]", product.description.en);
  formData.append("description[ar]", product.description.ar);
  formData.append("price", product.price);
  formData.append("dimensions", product.dimensions);
  formData.append("categoryId", product.categoryId);
  formData.append("featured", product.featured ?? false);

  (product.images || []).forEach((img) => {
    if (img instanceof File) {
      formData.append("images", img);
    } else {
      formData.append("existingImages", img);
    }
  });

  return formData;
}

export async function getProducts({ page = 1, limit = 10 } = {}) {
  const res = await api.get(`/products`, { params: { page, limit } });
  return res.data;
}

export async function deleteProduct(id) {
  const res = await api.delete(`/products/${id}`);
  return res.data;
}

export async function createProduct(product) {
  const res = await api.post(`/products`, buildProductFormData(product));
  return res.data;
}

export async function updateProduct({ id, ...product }) {
  const res = await api.put(`/products/${id}`, buildProductFormData(product));
  return res.data;
}
