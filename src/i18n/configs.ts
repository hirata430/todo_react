import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translation_ja from "./ja.json";
import translation_en from "./en.json";

i18n
  .use(LanguageDetector) //ブラウザ言語検出機能
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translation_en },
      ja: { translation: translation_ja },
    },
    fallbackLng: "en", //言語が検出されない場合の言語
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"], //言語の検出順序
      caches: ["localStorage"], //自動で"i18nextLng"に保存する
    },
  });

export default i18n;
