import type { Language } from '../utils/i18n';

export const navigation = {
  bn: [
    { key: 'home', label: 'হোম', path: '' },
    { key: 'story', label: 'স্টোরি', path: 'story' },
    { key: 'blog', label: 'ব্লগ', path: 'blog' },
    { key: 'photography', label: 'ফটোগ্রাফি', path: 'photography' },
    { key: 'contact', label: 'যোগাযোগ', path: 'contact' }
  ],
  en: [
    { key: 'home', label: 'Home', path: '' },
    { key: 'story', label: 'Story', path: 'story' },
    { key: 'blog', label: 'Blog', path: 'blog' },
    { key: 'photography', label: 'Photography', path: 'photography' },
    { key: 'contact', label: 'Contact', path: 'contact' }
  ]
} satisfies Record<Language, Array<{ key: string; label: string; path: string }>>;
