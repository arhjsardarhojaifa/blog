import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

const defaultOwner = 'arhjsardarhojaifa';
const defaultRepository = 'blog';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? defaultRepository;
const owner = process.env.GITHUB_REPOSITORY_OWNER ?? defaultOwner;
const isUserSite = repository === `${owner}.github.io`;

const site = process.env.SITE_URL ?? `https://${owner}.github.io`;
const base = process.env.BASE_PATH ?? (!isUserSite ? `/${repository}` : undefined);

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      wrap: true
    }
  }
});
