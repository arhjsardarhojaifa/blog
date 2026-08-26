import { getCollection, type CollectionEntry } from 'astro:content';
import type { Language } from './i18n';

export type EditorialCollection = 'stories' | 'blogs' | 'photography';

export async function getVisibleCollection<T extends EditorialCollection>(
  collection: T,
  lang?: Language
): Promise<CollectionEntry<T>[]> {
  const entries = await getCollection(collection, ({ data }) => {
    return !data.draft && (!lang || data.lang === lang);
  });

  return entries.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export async function getTranslation<T extends EditorialCollection>(
  collection: T,
  translationKey: string,
  lang: Language
): Promise<CollectionEntry<T> | undefined> {
  const entries = await getCollection(collection, ({ data }) => {
    return !data.draft && data.translationKey === translationKey && data.lang === lang;
  });

  return entries[0];
}

export async function getByTranslationKeys<T extends EditorialCollection>(
  collection: T,
  keys: string[],
  lang: Language
): Promise<CollectionEntry<T>[]> {
  if (!keys.length) return [];
  const wanted = new Set(keys);
  const entries = await getCollection(collection, ({ data }) =>
    !data.draft && data.lang === lang && wanted.has(data.translationKey)
  );
  return keys.flatMap((key) => entries.filter((entry) => entry.data.translationKey === key));
}

export function getReadingMinutes(
  entry: CollectionEntry<'stories'> | CollectionEntry<'blogs'>
): number {
  if (entry.data.readingMinutes) return entry.data.readingMinutes;
  const body = entry.body ?? '';
  const words = body
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#*_`>\[\](){}/\\|-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const rate = entry.data.lang === 'bn' ? 170 : 220;
  return Math.max(1, Math.ceil(words / rate));
}

type AnyEditorialEntry = CollectionEntry<'stories'> | CollectionEntry<'blogs'> | CollectionEntry<'photography'>;

export function featuredFirst<T extends AnyEditorialEntry>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    const af = a.data.featured ? 1 : 0;
    const bf = b.data.featured ? 1 : 0;
    if (af !== bf) return bf - af;
    const ao = a.data.featuredOrder ?? Number.MAX_SAFE_INTEGER;
    const bo = b.data.featuredOrder ?? Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    return b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
  });
}

export function getAvailabilityMap<T extends AnyEditorialEntry>(entries: T[]) {
  const map = new Map<string, Language[]>();
  for (const entry of entries) {
    const current = map.get(entry.data.translationKey) ?? [];
    if (!current.includes(entry.data.lang)) current.push(entry.data.lang);
    map.set(entry.data.translationKey, current.sort((a, b) => a === b ? 0 : a === 'bn' ? -1 : 1));
  }
  return map;
}
