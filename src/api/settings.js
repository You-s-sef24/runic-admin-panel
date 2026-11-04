import { api } from "./client";

export async function getNailCost() {
  const res = await api.get(`/settings/nail-cost`);
  return res.data;
}

export async function updateNailCost(cost) {
  const res = await api.patch(`/settings/nail-cost`, { nailCost: cost });
  return res.data;
}
