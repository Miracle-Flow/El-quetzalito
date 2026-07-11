"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { type Locale, translations } from "./translations";

const STORAGE_KEY = "quetzal-locale";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("es");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === "en" || saved === "es") {
      setLocale(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const handleLocaleChange = useCallback((next: Locale) => {
    setLocale(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }, []);

  const t = useCallback((key: string) => translations[locale]?.[key] ?? key, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleLocaleChange, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within <I18nProvider>");
  return ctx;
}
