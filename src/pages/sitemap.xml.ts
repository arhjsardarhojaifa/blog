import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { contentPath, localizedPath } from '../utils/paths';
import type { Language } from '../utils/i18n';

const languages: Language[] = ['bn', 'en'];
const staticSections = ['', 'story', 'blog', 'photography', 'contact'] as const;

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

interface Alternate { lang: Language | 'x-default'; href: string; }
interface SitemapItem { loc: string; lastmod?: string; alternates: Alternate[]; }

export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL('https://arhjsardarhojaifa.github.io');
  const absolute = (pathname: string) => new URL(pathname, origin).toString();
  const items: SitemapItem[] = [];

  for (const section of staticSections) {
    for (const lang of languages) {
      const current = localizedPath(lang, section);
      const other = lang === 'bn' ? 'en' : 'bn';
      const alternate = localizedPath(other, section);
      items.push({
        loc: absolute(current),
        alternates: [
          { lang, href: absolute(current) },
          { lang: other, href: absolute(alternate) },
          { lang: 'x-default', href: absolute(localizedPath('en', section)) }
        ]
      });
    }
  }

  const contentDefinitions = [
    ['stories', 'story'],
    ['blogs', 'blog'],
    ['photography', 'photography']
  ] as const;

  for (const [collection, section] of contentDefinitions) {
    const entries = await getCollection(collection, ({ data }) => !data.draft && !data.seo?.noIndex);

    for (const entry of entries) {
      const currentPath = contentPath(entry.data.lang, section, entry.data.routeSlug);
      const translation = entries.find((candidate) =>
        candidate.data.translationKey === entry.data.translationKey &&
        candidate.data.lang !== entry.data.lang
      );
      const currentHref = absolute(currentPath);
      const alternates: Alternate[] = [{ lang: entry.data.lang, href: currentHref }];

      if (translation) {
        const translationHref = absolute(contentPath(translation.data.lang, section, translation.data.routeSlug));
        alternates.push({ lang: translation.data.lang, href: translationHref });
        const englishHref = entry.data.lang === 'en' ? currentHref : translationHref;
        alternates.push({ lang: 'x-default', href: englishHref });
      }

      items.push({
        loc: currentHref,
        lastmod: (entry.data.updatedAt ?? entry.data.publishedAt).toISOString(),
        alternates
      });
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    items.map((item) => {
      const links = item.alternates.map((alternate) =>
        `    <xhtml:link rel="alternate" hreflang="${alternate.lang}" href="${escapeXml(alternate.href)}" />`
      ).join('\n');
      return [
        '  <url>',
        `    <loc>${escapeXml(item.loc)}</loc>`,
        item.lastmod ? `    <lastmod>${escapeXml(item.lastmod)}</lastmod>` : '',
        links,
        '  </url>'
      ].filter(Boolean).join('\n');
    }).join('\n') +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
