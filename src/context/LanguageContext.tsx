/**
 * @license
 * GRAM-DISHA — Language & Localization Context
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguageCode, LanguageOption } from '../types';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';
import { getTranslation } from '../i18n/translations';

interface LanguageContextType {
  currentLanguage: SupportedLanguageCode;
  setLanguage: (code: SupportedLanguageCode) => void;
  availableLanguages: LanguageOption[];
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<SupportedLanguageCode>(() => {
    const saved = localStorage.getItem('gram_disha_lang');
    return (saved as SupportedLanguageCode) || 'en';
  });

  const setLanguage = (code: SupportedLanguageCode) => {
    setCurrentLanguageState(code);
    localStorage.setItem('gram_disha_lang', code);
  };

  const t = (key: string) => {
    return getTranslation(key, currentLanguage);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        availableLanguages: SUPPORTED_LANGUAGES,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
