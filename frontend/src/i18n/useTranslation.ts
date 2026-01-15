import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, Translations } from './translations';
import { translations, defaultLanguage } from './translations';

interface LanguageStore {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: defaultLanguage,
      t: translations[defaultLanguage],
      setLanguage: (lang: Language) => set({ 
        language: lang, 
        t: translations[lang] 
      }),
    }),
    {
      name: 'mafia-language',
    }
  )
);

// Hook for translations
export const useTranslation = () => {
  const { t, language, setLanguage } = useLanguageStore();
  return { t, language, setLanguage };
};

// Re-export types
export type { Language, Translations };
