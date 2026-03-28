import translations from './translations.json';

const LANGUAGE_KEY = 'app_lang';

export const getLanguage = () => {
    return localStorage.getItem(LANGUAGE_KEY) || 'en';
};

export const setLanguage = (lang) => {
    localStorage.setItem(LANGUAGE_KEY, lang);
    window.location.reload();
};

export const t = (key) => {
    const lang = getLanguage();
    return translations[lang][key] || key;
};
