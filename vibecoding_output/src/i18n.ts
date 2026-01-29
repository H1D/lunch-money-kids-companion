import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import all translations statically (small app, no need for dynamic loading)
import en from './locales/en/translation.json'
import es from './locales/es/translation.json'
import nl from './locales/nl/translation.json'
import fr from './locales/fr/translation.json'
import it from './locales/it/translation.json'
import de from './locales/de/translation.json'
import pt from './locales/pt/translation.json'

export const SUPPORTED_LOCALES = ['en', 'es', 'nl', 'fr', 'it', 'de', 'pt'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const LOCALE_INFO: Record<Locale, { name: string; native: string; flag: string }> = {
  en: { name: 'English', native: 'English', flag: '🇬🇧' },
  es: { name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  nl: { name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
  fr: { name: 'French', native: 'Français', flag: '🇫🇷' },
  it: { name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  de: { name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  pt: { name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
}

const resources = {
  en: { translation: en },
  es: { translation: es },
  nl: { translation: nl },
  fr: { translation: fr },
  it: { translation: it },
  de: { translation: de },
  pt: { translation: pt },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LOCALES,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false, // React already escapes
    },
  })

/**
 * Check if a locale is supported
 */
export function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale)
}

/**
 * Get the base language from a locale string (e.g., 'en-US' -> 'en')
 */
export function getBaseLocale(locale: string): Locale {
  const base = locale.split('-')[0]
  return isValidLocale(base) ? base : 'en'
}

export default i18n
