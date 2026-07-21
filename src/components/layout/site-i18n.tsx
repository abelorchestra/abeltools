"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

export type SiteLocale = "ko" | "en";

type SiteI18nValue = { locale: SiteLocale; setLocale: (locale: SiteLocale) => void };
const STORAGE_KEY = "abeltools.locale";
const SiteI18nContext = createContext<SiteI18nValue | null>(null);

export function SiteI18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SiteLocale>("ko");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== "ko" && stored !== "en") return;
    queueMicrotask(() => {
      setLocaleState(stored);
      document.documentElement.lang = stored;
    });
  }, []);

  function setLocale(next: SiteLocale) {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }

  return <SiteI18nContext.Provider value={{ locale, setLocale }}>{children}</SiteI18nContext.Provider>;
}

export function useSiteI18n() {
  const value = useContext(SiteI18nContext);
  if (!value) throw new Error("useSiteI18n must be used inside SiteI18nProvider");
  return value;
}
