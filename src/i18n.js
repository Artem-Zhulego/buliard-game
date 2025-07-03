import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ruTranslate from "./locales/ru.json"
import enTranslate from "./locales/en.json"

const resources = {
  en: {
    translation: enTranslate
  },
  ru: {
    translation: ruTranslate,
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ru", 
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
