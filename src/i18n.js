import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { ru } from "./lang/ru";
import { ua } from "./lang/ua";
import { en } from "./lang/en";
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
  en: {
    translation: {
      ...en,
    },
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("i18nextLng") || "en",
    debug: process.env.env === "development",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupQuerystring: "lng",
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
  });
