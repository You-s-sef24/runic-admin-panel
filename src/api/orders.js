import { api } from "./client";

export async function getOrders({ page = 1, limit = 10 } = {}) {
  const res = await api.get(`/orders`, { params: { page, limit } });
  return res.data;
}

export async function getOrder(id) {
  const res = await api.get(`/orders/${id}`);
  return res.data;
}

export async function updateOrder({ id, ...order }) {
  const res = await api.put(`/orders/${id}`, order);
  return res.data;
}
