import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

const getValue = (locale, keys) => {
  let result = translations[locale];
  for (const key of keys) {
    result = result?.[key];
  }
  return typeof result === 'string' ? result : undefined;
};

const interpolate = (value, params) => {
  if (!params) return value;
  return value.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    params[key] !== undefined ? String(params[key]) : `{{${key}}}`
  );
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return translations[saved] ? saved : 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = ['ar', 'he', 'fa'].includes(language) ? 'rtl' : 'ltr';
  }, [language]);

  const value = useMemo(() => {
    const t = (key, params) => {
      const keys = key.split('.');
      const current = getValue(language, keys);
      // Fall back to the primary locale instead of rendering raw keys.
      const fallbackFr = getValue('fr', keys);
      const fallbackEn = getValue('en', keys);
      const result = current ?? fallbackFr ?? fallbackEn ?? key;
      return interpolate(result, params);
    };

    return { language, setLanguage, t };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export default LanguageContext;
