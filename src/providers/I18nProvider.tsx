"use client";
import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react";
import { defaultLocale, Locale, locales } from "@/i18n";
import vi from "@/messages/vi.json";
import en from "@/messages/en.json";

interface I18nContextValue {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (l: Locale) => void;
}

const dictionaries: Record<Locale, Record<string, string>> = {
  vi,
  en,
};

export const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  t: (k) => k,
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  // đọc locale từ cookie nếu có
  useEffect(() => {
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    if (match && locales.includes(match[1] as Locale)) {
      setLocale(match[1] as Locale);
    }
  }, []);

  const t = useMemo(() => {
    const dict = dictionaries[locale] || dictionaries[defaultLocale];
    return (key: string) => dict[key] || key;
  }, [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(() => ({ locale, t, setLocale }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  return ctx.t;
}
