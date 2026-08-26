# Production QA & Launch Readiness

This phase adds two dependency-free checks:

```bash
npm run qa
```

Use this while developing. It reports structural errors and warns about intentional placeholders.

Before public launch, run:

```bash
npm run qa:launch
```

Launch mode treats visible placeholder content and the placeholder website title as blockers.

## What the QA command checks

- required Story / Blog / Photography metadata
- `bn` / `en` language values
- lowercase kebab-case route slugs
- duplicate routes
- duplicate translation versions
- missing translations (warning only)
- cover-image alt text
- missing local image files
- related-content translation keys
- exactly the five required primary navigation sections
- focus-visible and reduced-motion foundations
- canonical, hreflang, Open Graph, Twitter and JSON-LD SEO primitives
- required `robots.txt`, sitemap and 404 source files
- visible placeholder content before launch

## Build command

`npm run build` now runs both Astro's checker and the production build:

```bash
astro check && astro build
```

So a successful production build also verifies Astro/TypeScript diagnostics.

## Sitemap behavior

The site has a content-aware static sitemap route at:

```text
/sitemap.xml
```

It automatically contains:

- Bengali and English homepages
- Story / Blog / Photography archives
- Contact pages
- published, indexable Story entries
- published, indexable Blog entries
- published, indexable Photography collections
- bilingual alternate links when both versions exist

Entries with either of these are excluded automatically:

```yaml
draft: true
```

or:

```yaml
seo:
  noIndex: true
```

You never edit the sitemap manually.

## robots.txt

`robots.txt` is generated from the actual configured site/base path and points to the generated sitemap. This prevents a repository-name base path from being hard-coded incorrectly.

## Accessibility baseline

The project includes:

- semantic landmarks and headings
- skip-to-content navigation
- visible keyboard focus
- current-page navigation state on desktop and mobile
- minimum-size mobile/lightbox controls
- native `<dialog>` lightbox behavior
- restored focus after closing the lightbox
- Arrow Left / Arrow Right gallery keyboard controls
- meaningful gallery control names
- alt text validation for cover and gallery images
- reduced-motion handling
- strong text contrast on the Earth & Journal palette

Accessibility still depends on the content you publish. In particular, write useful alt text for every meaningful photograph and keep heading order logical inside MDX articles.

## Before you make the site public

1. Website identity is already configured as `Arhj Sardar Hojaifa Travel Blog`.
2. Demo Story / Blog / Photography content is already `draft: true` and will not publish.
3. Add your real Story / Blog / Photography content when ready.
4. Run `npm run qa:launch`.
5. Run `npm run build`.
6. Preview with `npm run preview`.
7. Test Bengali and English pages on mobile and desktop.
8. Push to `https://github.com/arhjsardarhojaifa/blog.git`.
9. Confirm the GitHub Pages Action completes successfully.
10. Check `https://arhjsardarhojaifa.github.io/blog/robots.txt` and `https://arhjsardarhojaifa.github.io/blog/sitemap.xml` after deployment.
