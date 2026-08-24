export const getDefaultLang = (): string => {
  const browserLanguage = navigator.language.split('-')[0];

  return ['pl', 'en'].includes(browserLanguage) ? browserLanguage : 'en';
};
