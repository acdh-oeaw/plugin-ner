export interface Translations {
    lang: string;
    t: {
        [key: string]: string;
    };
}
export declare const languages: {
    en: string;
    de: string;
};
export declare const defaultLang: keyof typeof languages;
declare const defaultLabels: {
    all: {
        "Perform NER on Document": string;
    };
} | {
    all: {
        "Perform NER on Document": string;
    };
};
export declare const getLangFromUrl: (url: URL) => "en" | "de";
export declare const getTranslations: (url: string, dictionary: keyof typeof defaultLabels) => Translations;
export declare const getDefaultTranslations: (dictionary: keyof typeof defaultLabels) => Translations;
export {};
//# sourceMappingURL=index.d.ts.map