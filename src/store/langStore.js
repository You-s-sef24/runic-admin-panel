import { create } from "zustand";
import i18n from "@/i18n";

const storageKey = "app-language";

function applyLanguage(lang) {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    i18n.changeLanguage(lang);
}

export const useLanguageStore = create((set) => ({
    language: localStorage.getItem(storageKey) || "en",
    setLanguage: (lang) => {
        localStorage.setItem(storageKey, lang);
        applyLanguage(lang);
        set({ language: lang });
    },
}));