import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des traductions
import frCommon from './locales/fr/common.json';

i18n
  .use(LanguageDetector) // Détecte la langue du navigateur
  .use(initReactI18next) // Intégration React
  .init({
    resources: {
      fr: {
        common: frCommon
      }
    },
    fallbackLng: 'fr',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;