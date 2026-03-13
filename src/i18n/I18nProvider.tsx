"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale, Messages } from "@/i18n/messages";

type I18nContextValue = {
  lang: Locale;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getByPath(messages: Messages, key: string) {
  return messages[key];
}

export default function I18nProvider({
  lang,
  messages,
  children
}: {
  lang: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nContextValue>(() => {
    return {
      lang,
      t: (key: string) => getByPath(messages, key) ?? key
    };
  }, [lang, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
