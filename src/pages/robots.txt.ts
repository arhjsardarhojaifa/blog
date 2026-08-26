import type { APIRoute } from 'astro';

const normalizeBase = (base: string) => {
  const trimmed = base.replace(/\/$/, '');
  return trimmed && trimmed !== '/' ? trimmed : '';
};

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://arhjsardarhojaifa.github.io');
  const base = normalizeBase(import.meta.env.BASE_URL);
  const sitemapURL = new URL(`${base}/sitemap.xml`.replace(/\/+/g, '/'), origin);

  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${sitemapURL.href}`,
    ''
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};
