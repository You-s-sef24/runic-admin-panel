import { create } from "zustand";

const storageKey = "vite-ui-theme";

function applyTheme(theme) {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
}

const initialTheme = localStorage.getItem(storageKey) || "light";
applyTheme(initialTheme);

export const useThemeStore = create((set) => ({
    theme: initialTheme,
    setTheme: (theme) => {
        localStorage.setItem(storageKey, theme);
        applyTheme(theme);
        set({ theme });
    },
}));