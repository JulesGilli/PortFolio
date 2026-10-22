import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import de from './locales/de.json';

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'de'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<SupportedLanguage, { native: string; flag: string }> = {
  en: { native: 'English', flag: '🇬🇧' },
  fr: { native: 'Français', flag: '🇫🇷' },
  es: { native: 'Español', flag: '🇪🇸' },
  de: { native: 'Deutsch', flag: '🇩🇪' },
};

const STORAGE_KEY = 'lang';

/**
 * The URL decides first: /en/… is English, everything else is French. A language the visitor
 * picked before (stored) comes next. The browser language is deliberately not used: crawlers
 * run with an English browser and would otherwise index English text under the French URL.
 */
function detect(): SupportedLanguage {
  if (typeof window === 'undefined') return 'fr';
  if (/^\/en(\/|$)/.test(window.location.pathname)) return 'en';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)) return stored as SupportedLanguage;
  } catch {
    /* storage blocked */
  }
  return 'fr';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    es: { translation: es },
    de: { translation: de },
  },
  lng: detect(),
  fallbackLng: 'en',
  supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
  interpolation: { escapeValue: false },
});

/** Remember the visitor's pick (called by the language selector, not by page loads). */
export function rememberLanguage(lng: SupportedLanguage) {
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    /* storage blocked */
  }
}

export default i18n;
