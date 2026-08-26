import type { Language } from './i18n';

function cleanSegment(value: string): string {
  return value.replace(/^\/+|\/+$/g, '');
}

export function withBase(pathname = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = cleanSegment(pathname);
  if (!path) return `${base || ''}/`;
  return `${base}/${path}/`.replace(/\/+/g, '/');
}

export function assetPath(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = cleanSegment(pathname);
  return `${base}/${path}`.replace(/\/+/g, '/');
}

export function localizedPath(lang: Language, pathname = ''): string {
  const path = cleanSegment(pathname);
  return withBase(path ? `${lang}/${path}` : lang);
}

export function contentPath(
  lang: Language,
  section: 'story' | 'blog' | 'photography',
  slug: string
): string {
  return localizedPath(lang, `${section}/${slug}`);
}
