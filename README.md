# Bilingual Travel Journal

A bilingual Bengali/English travel storytelling, travel blog, and photography publication built with Astro. The site is static, content-driven, lightweight, and designed for GitHub Pages.

The project intentionally separates **Story**, **Blog**, and **Photography**. New content is published by adding content files and images; you do not need to edit the Home page, archive pages, or article templates every time.

---

## 1. What is already built

- Home, Story, Blog, Photography, Contact, and 404 pages
- Bengali and English URLs (`/bn/` and `/en/`)
- context-preserving language switching
- separate Astro Content Collections for Story, Blog, and Photography
- schema validation for metadata
- responsive editorial layouts
- Story and Blog article templates
- Photography gallery with keyboard-accessible native lightbox
- related-content support
- responsive Astro images
- inline editorial image/caption component for Story and Blog MDX
- ready-to-copy content templates
- dependency-free content creation command
- sitemap and basic SEO metadata foundation
- GitHub Pages deployment workflow
- placeholders instead of invented personal information

---

## 2. What I need from you before the real public launch

Development can continue without these values. Before publishing the real site, replace the placeholders with your own information.

Required for final identity/deployment:

1. Website/publication name
2. GitHub username
3. GitHub repository name

Optional when you have them:

- Instagram URL
- Facebook URL
- YouTube URL
- professional portfolio URL
- contact email (only if you want one displayed)
- logo
- favicon
- custom domain
- real Stories, Blogs, and Photography collections

Do not invent these values. Until you provide them, placeholders should remain.

---

## 3. Requirements on your computer

Install:

- Git
- Node.js **v22.12.0 or higher** (use an even-numbered supported release such as Node 24)
- a code editor such as VS Code (recommended, but not required)

Then open a terminal inside this project folder.

---

## 4. First-time setup

Install the project packages:

```bash
npm install
```

This also creates/updates `package-lock.json`. Keep that lockfile in Git and commit it; the GitHub Pages action uses the lockfile to detect npm and reproducibly install dependencies.

Start the local development website:

```bash
npm run dev
```

Astro will show a local address, normally similar to:

```text
http://localhost:4321
```

Open that address in your browser.

Stop the development server with:

```text
Ctrl + C
```

---

## 5. The easiest way to create new content

The project contains a small content-creator script. It creates both Bengali and English starter files and automatically gives them the same `translationKey` and route slug.

### New Story

```bash
npm run content:new -- story saint-martin
```

Creates:

```text
src/content/stories/saint-martin/
├── bn.mdx
└── en.mdx
```

### New Blog

```bash
npm run content:new -- blog saint-martin-guide
```

Creates:

```text
src/content/blogs/saint-martin-guide/
├── bn.mdx
└── en.mdx
```

### New Photography collection

```bash
npm run content:new -- photography saint-martin-evening
```

Creates:

```text
src/content/photography/saint-martin-evening/
├── bn.mdx
└── en.mdx
```

### Slug rule

Use lowercase English letters/numbers and hyphens only:

```text
saint-martin        ✓
cox-bazar-guide     ✓
Saint Martin        ✗
saint_martin        ✗
```

The `routeSlug` becomes part of the URL.

---

## 6. Manual templates are also available

If you prefer to copy files yourself, use:

```text
content-templates/
├── story/
│   ├── bn.mdx
│   └── en.mdx
├── blog/
│   ├── bn.mdx
│   └── en.mdx
└── photography/
    ├── bn.mdx
    └── en.mdx
```

Copy the appropriate two files into a new folder under `src/content/...`, then replace every `YOUR-SLUG` and `TODO` value.

The command in section 5 is safer and faster for beginners.

---

# 7. How bilingual content works

Two files are treated as translations of the same content item when they share the same `translationKey`.

Example:

```yaml
translationKey: saint-martin
routeSlug: saint-martin
```

Bengali:

```yaml
lang: bn
```

English:

```yaml
lang: en
```

The resulting URLs are:

```text
/bn/story/saint-martin/
/en/story/saint-martin/
```

The language switcher can therefore move between the corresponding versions of the same Story instead of returning the visitor to the Home page.

If one version is not published, the other language remains usable and the unavailable translation is handled gracefully.

---

# 8. How to publish a Story

After running:

```bash
npm run content:new -- story saint-martin
```

edit:

```text
src/content/stories/saint-martin/bn.mdx
src/content/stories/saint-martin/en.mdx
```

A typical Story frontmatter looks like this:

```yaml
---
translationKey: saint-martin
lang: en
routeSlug: saint-martin
title: "Your title"
subtitle: "Your optional subtitle"
excerpt: "A short introduction used on cards and metadata."
cover: "./cover.jpg"
coverAlt: "Meaningful description of the cover photograph"
location: "Location"
publishedAt: 2026-09-01
category: "Your category"
tags:
  - tag-one
  - tag-two
featured: false
draft: true
relatedStories: []
relatedBlogs: []
relatedPhotography: []
seo:
  description: "A concise page description."
  noIndex: true
---
```

Write the article below the second `---`.

While preparing the article, keep:

```yaml
draft: true
```

When it is ready to appear publicly, change it to:

```yaml
draft: false
```

For a real public page, also change:

```yaml
seo:
  noIndex: false
```

---

# 9. Adding a Story or Blog cover image

Put the image in the same content folder:

```text
src/content/stories/saint-martin/
├── bn.mdx
├── en.mdx
└── cover.jpg
```

Then use:

```yaml
cover: "./cover.jpg"
coverAlt: "Fishing boats resting near the shore at dusk"
```

`coverAlt` should describe the photograph for someone who cannot see it. Avoid values such as `image`, `photo`, or `cover`.

Both language versions can use the same photograph while having language-appropriate alt text.

---

# 10. Adding photographs inside a Story or Blog

The reusable component is:

```text
src/components/EditorialImage.astro
```

Put the photograph in the same content folder:

```text
src/content/stories/saint-martin/
├── bn.mdx
├── en.mdx
├── cover.jpg
└── fishing-boats.jpg
```

Near the beginning of the MDX file, after the frontmatter, import the component and image:

```mdx
import EditorialImage from '../../../components/EditorialImage.astro';
import fishingBoats from './fishing-boats.jpg';
```

Then place the image where you want it to appear:

```mdx
<EditorialImage
  src={fishingBoats}
  alt="Fishing boats resting near the shore at dusk"
  caption="Boats returning to shore before evening"
  layout="wide"
/>
```

Optional image credit:

```mdx
<EditorialImage
  src={fishingBoats}
  alt="Fishing boats resting near the shore at dusk"
  caption="Boats returning to shore before evening"
  credit="Photo: YOUR CREDIT"
  layout="wide"
/>
```

### Available layouts

Normal reading-column image:

```text
layout="standard"
```

Large editorial image that breaks outside the reading column:

```text
layout="wide"
```

Edge-to-edge viewport image:

```text
layout="full"
```

Use `wide` selectively in Stories for visual rhythm. Use `full` only when a photograph genuinely benefits from the treatment.

The component automatically uses Astro responsive images and preserves image dimensions to reduce layout shift.

---

# 11. Publishing a Blog

Create it:

```bash
npm run content:new -- blog sundarbans-travel-guide
```

Then edit:

```text
src/content/blogs/sundarbans-travel-guide/bn.mdx
src/content/blogs/sundarbans-travel-guide/en.mdx
```

Blog supports:

- title
- excerpt
- cover
- location
- date
- category
- tags
- featured status
- related content
- SEO description
- inline editorial photographs

Blog pages intentionally use a slightly wider, more information-oriented reading layout than Story pages.

---

# 12. Publishing Photography

Create the collection:

```bash
npm run content:new -- photography sundarbans-monsoon
```

Add images to the same folder:

```text
src/content/photography/sundarbans-monsoon/
├── bn.mdx
├── en.mdx
├── cover.jpg
├── photo-01.jpg
├── photo-02.jpg
└── photo-03.jpg
```

Then set the cover:

```yaml
cover: "./cover.jpg"
coverAlt: "Meaningful description of the cover photograph"
```

Replace:

```yaml
images: []
```

with:

```yaml
images:
  - image: "./photo-01.jpg"
    alt: "Meaningful description of photograph one"
    caption: "Optional caption"
    credit: "Optional credit"

  - image: "./photo-02.jpg"
    alt: "Meaningful description of photograph two"
    caption: "Optional caption"
```

The Photography page automatically creates the responsive gallery and lightbox. You do not edit the gallery component when adding a collection.

---

# 13. Featured content on the Home page

You do not edit the Home page to feature a new item.

Set:

```yaml
featured: true
```

Optional ordering can use:

```yaml
featuredOrder: 1
```

Lower numbers have higher priority when the page needs an explicit featured order.

---

# 14. Related content

Related content uses `translationKey`, not URLs.

Example Story metadata:

```yaml
relatedStories:
  - another-story

relatedBlogs:
  - saint-martin-guide

relatedPhotography:
  - saint-martin-evening
```

The system finds the related item in the reader's current language when available.

Do not type `/bn/...` or `/en/...` URLs into these fields.

---

# 15. Dates

Write dates in ISO format:

```text
2026-09-01
```

Use:

```yaml
publishedAt: 2026-09-01
```

If an existing article is substantially updated:

```yaml
updatedAt: 2026-10-15
```

Do not manually write formatted display dates into templates. The website formats structured dates for the active language.

---

# 16. Categories and tags

The project does not force a final taxonomy.

Example only:

```yaml
category: "Nature"
tags:
  - forest
  - river
```

Choose your taxonomy intentionally as real content grows. Do not treat the placeholder categories as final categories.

---

# 17. Updating the site name and social links

Open:

```text
src/config/site.ts
```

Replace:

```ts
title: 'Arhj Sardar Hojaifa Travel Blog'
```

with your real publication name.

Replace only URLs you actually own/provide:

```ts
social: {
  instagram: 'https://...',
  facebook: 'https://...',
  youtube: 'https://...'
},
professionalPortfolio: 'https://...'
```

Until you provide the real URLs, leave the existing placeholders. The Contact page recognizes that they are placeholders and does not fabricate links.

---

# 18. Check the website before publishing

Run:

```bash
npm run check
```

Then:

```bash
npm run build
```

If both succeed, optionally preview the production build locally:

```bash
npm run preview
```

### Common content errors

Wrong route slug:

```text
Saint Martin
```

Correct:

```text
saint-martin
```

Missing required title/excerpt/date will cause schema validation to fail. Read the error path carefully; Astro normally identifies the content entry and field involved.

An image path must point to a real file. If you have not added the image yet, remove/comment the image field instead of leaving a broken path.

---

# 19. GitHub publishing workflow

Create a GitHub repository and push this project to it.

Typical first push:

```bash
git init
git add .
git commit -m "Initial travel journal"
git branch -M main
git remote add origin https://github.com/arhjsardarhojaifa/blog.git
git push -u origin main
```

On GitHub:

```text
Repository
→ Settings
→ Pages
→ Build and deployment
→ Source
→ GitHub Actions
```

The included file:

```text
.github/workflows/deploy.yml
```

builds the static Astro site and deploys it to GitHub Pages.

For an ordinary project repository, the configuration automatically supports the repository base path. For a `USERNAME.github.io` user-site repository, it uses the root path instead.

---

# 20. Your normal publishing routine after setup

After the site is configured once, publishing a new Story can be as simple as:

```text
1. npm run content:new -- story my-story
2. Write bn.mdx and en.mdx
3. Add images to the same folder
4. Keep draft: true while preparing
5. Run npm run dev and review
6. Set draft: false and seo.noIndex: false
7. Run npm run check
8. Run npm run build
9. git add .
10. git commit -m "Add my story"
11. git push
12. GitHub Actions updates the website
```

You do **not** need to edit the Home page, Story archive, article layout, language switcher, or navigation for every new Story.

---

# 21. Placeholder content

The repository includes explicit placeholder entries and abstract placeholder artwork so the layouts can be previewed without inventing your travel history.

Before public launch, remove these folders after you have real replacements:

```text
src/content/stories/placeholder-story/
src/content/blogs/placeholder-blog/
src/content/photography/placeholder-gallery/
```

They currently use `seo.noIndex: true` so they are not intended as real indexed content.

---

# 22. Important project folders

```text
src/
├── components/          Reusable UI and editorial components
├── config/              Site name, links, navigation configuration
├── content/             Your real Story, Blog, Photography content
├── layouts/             Shared page/article layouts
├── pages/               Astro routes
├── styles/              Design tokens, global typography and styles
└── utils/               Language/content/path/date helpers

content-templates/       Manual copy-ready publishing templates
scripts/                 Small local publishing helper scripts
public/                  Static files such as favicon/robots.txt
.github/workflows/       GitHub Pages deployment
```

---

# 23. Security and privacy

Do not place any of these in content or source files:

- passwords
- API keys
- GitHub personal access tokens
- private credentials
- private contact information you do not want public

This project does not require a database or secret key for normal static publishing.

---

# 24. If only one language is ready

The architecture supports a temporarily missing translation. You may remove the unfinished language file rather than publishing fake/automatic translation.

For example, a Bengali Story may exist while the English version is still being prepared. The live Bengali page should remain valid, and the language switcher should not lead to a broken English route.

Never use automatic translation merely to fill the missing version unless that is an intentional editorial decision made separately.

---

# 25. Useful reference

A compact field reference is available here:

```text
docs/CONTENT-FIELDS.md
```

A final pre-publish checklist is available here:

```text
docs/PUBLISHING-CHECKLIST.md
```

## Phase 7: SEO, accessibility and production QA

The project now includes a centralized `SEOHead.astro` component with canonical URLs, bilingual `hreflang`, Open Graph metadata, Twitter card metadata and JSON-LD structured data. Story pages use `Article`, Blog pages use `BlogPosting`, and Photography collections use `ImageGallery` structured data.

The sitemap is content-aware and generated at `/sitemap.xml`. Draft entries and entries with `seo.noIndex: true` are automatically excluded. `robots.txt` is generated using the configured GitHub Pages/custom-domain base path and points to the sitemap.

Development QA:

```bash
npm run qa
```

Launch readiness:

```bash
npm run qa:launch
```

The normal production build now runs Astro's type/content checker before building:

```bash
npm run build
```

See [`docs/PRODUCTION-QA.md`](docs/PRODUCTION-QA.md) for the complete checklist.


---

## Phase 8: configured production identity

This copy is configured for:

- **Publication:** Arhj Sardar Hojaifa Travel Blog
- **GitHub repository:** `arhjsardarhojaifa/blog`
- **GitHub Pages origin:** `https://arhjsardarhojaifa.github.io`
- **Project base path:** `/blog`
- **Expected site URL:** `https://arhjsardarhojaifa.github.io/blog/`

The production defaults live in `astro.config.mjs`. `SITE_URL` and `BASE_PATH` can still override them later if a custom domain or different repository is used.

For an exact Bengali deployment walkthrough, see `docs/GITHUB-PAGES-DEPLOY-BN.md`.
