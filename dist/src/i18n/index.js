const DEFAULT_LANG = 
// @ts-ignore
import.meta.env.PUBLIC_DEFAULT_LANGUAGE ||
    process.env.PUBLIC_DEFAULT_LANGUAGE;
import de from "./de";
import en from "./en";
export const languages = {
    en: "English",
    de: "Deutsch",
};
export const defaultLang = (DEFAULT_LANG || "en");
const labels = { de, en };
const defaultLabels = labels[defaultLang];
export const getLangFromUrl = (url) => {
    const [, lang] = url.pathname.split("/");
    if (lang in labels)
        return lang;
    return defaultLang;
};
export const getTranslations = (url, dictionary) => {
    const lang = getLangFromUrl(new URL(url));
    return {
        lang,
        t: {
            ...defaultLabels[dictionary],
            ...labels[lang][dictionary],
        },
    };
};
export const getDefaultTranslations = (dictionary) => {
    const lang = defaultLang;
    return {
        lang,
        t: {
            ...defaultLabels[dictionary],
            ...labels[lang][dictionary],
        },
    };
};
