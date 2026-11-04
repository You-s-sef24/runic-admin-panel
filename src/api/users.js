import { api } from "./client";

export async function login(user) {
  const res = await api.post(`/users/login`, user);
  return res.data;
}

export async function logout() {
  const res = await api.post(`/users/logout`);
  return res.data;
}

export async function getUsers({ page = 1, limit = 10 } = {}) {
  const res = await api.get(`/users`, { params: { page, limit } });
  return res.data;
}

export async function updateUser(user) {
  const res = await api.put(`/users/me`, user);
  return res.data;
}
