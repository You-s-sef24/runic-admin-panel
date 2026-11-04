import { api } from "./client";

export async function getOrdersByStatus() {
  const res = await api.get(`/stats/orders-by-status`);
  return res.data;
}

export async function getTopProducts() {
  const res = await api.get(`/stats/top-products`);
  return res.data;
}

export async function getProductsByCategory() {
  const res = await api.get(`/stats/products-by-category`);
  return res.data;
}

export async function getPriceDistribution() {
  const res = await api.get(`/stats/price-distribution`);
  return res.data;
}

export async function getSummary() {
  const res = await api.get(`/stats/summary`);
  return res.data;
}
