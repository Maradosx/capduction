'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DICT, type DictKey, type Lang } from './dict';

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;
}

const I18nContext = createContext<I18nValue | null>(null);
const STORAGE_KEY = 'capduction_lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('th');

  // Hydrate from localStorage or browser language
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === 'th' || stored === 'en') {
      setLangState(stored);
      document.documentElement.lang = stored;
      document.body.lang = stored;
      return;
    }
    const browserLang = navigator.language.toLowerCase();
    const detected: Lang = browserLang.startsWith('th') ? 'th' : 'en';
    setLangState(detected);
    document.documentElement.lang = detected;
    document.body.lang = detected;
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
    document.body.lang = l;
  }, []);

  const t = useCallback(
    (key: DictKey): string => {
      const entry = DICT[key];
      return entry?.[lang] ?? entry?.en ?? String(key);
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <LanguageProvider>');
  return ctx;
}

/** Convenience hook: just the `t` translator function */
export function useT() {
  return useI18n().t;
}
