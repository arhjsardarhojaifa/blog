export const languages = ['bn', 'en'] as const;
export type Language = (typeof languages)[number];

export const languageLabels: Record<Language, string> = {
  bn: 'বাংলা',
  en: 'English'
};

export function isLanguage(value: string | undefined): value is Language {
  return Boolean(value && languages.includes(value as Language));
}

export function oppositeLanguage(lang: Language): Language {
  return lang === 'bn' ? 'en' : 'bn';
}
