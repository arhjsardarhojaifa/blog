import type { Language } from './i18n';

export function formatDate(date: Date, lang: Language): string {
  return new Intl.DateTimeFormat(lang === 'bn' ? 'bn-BD' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}
