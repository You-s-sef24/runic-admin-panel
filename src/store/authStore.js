import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      updateUser: (data) => set((s) => ({ user: { ...s.user, ...data } })),
    }),
    { name: "auth-storage" },
  ),
);
