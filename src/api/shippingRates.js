import { api } from "./client";

export async function getShippingRates() {
  const res = await api.get(`/shipping-rates`);
  return res.data;
}

export async function createShippingRate(rate) {
  const res = await api.post(`/shipping-rates`, rate);
  return res.data;
}

export async function updateShippingRate({ id, ...rate }) {
  const res = await api.patch(`/shipping-rates/${id}`, rate);
  return res.data;
}

export async function deleteShippingRate(id) {
  const res = await api.delete(`/shipping-rates/${id}`);
  return res.data;
}
