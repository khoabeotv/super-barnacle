import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const startI18n = (files, lang) => {
  i18n.use(initReactI18next).init({
    lng: lang,
    resources: files,
    debug: false,
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common'
  });

  return i18n;
};

export const getTranslation = async (lang) => {
  let trans = null;
  switch (lang) {
    case 'vi':
      trans = await import('public/locales/vi');
      break;
    case 'id':
      trans = await import('public/locales/id');
      break;
    default:
      trans = await import('public/locales/en');
      break;
  }

  return { [lang]: { common: trans.default } };
};

export default i18n;
