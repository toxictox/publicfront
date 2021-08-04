import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { ru } from "./lang/ru";
import { ua } from "./lang/ua";
const resources = {
  ru: {
    translation: {
      ...ru,
    },
  },
  ua: {
    translation: {
      ...ua,
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ru",
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
});
