import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import des traductions
import frCommon from './locales/fr/common.json';
import frAuth from './locales/fr/auth.json';

i18n
  .use(initReactI18next) // Intégration React
  .init({
    resources: {
      fr: {
        common: frCommon,
        auth: frAuth
      }
    },
    fallbackLng: 'fr',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;