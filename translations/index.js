import el from './el.json';
import en from './en.json';

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  el: () => import('./el.json').then((module) => module.default),
};

export const translate = (locale) => dictionaries[locale]();

export const translations = {
  en: en,
  el: el,
};
