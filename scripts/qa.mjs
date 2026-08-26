import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const strictLaunch = process.argv.includes('--launch');
const errors = [];
const warnings = [];
const passes = [];

const addError = (message) => errors.push(message);
const addWarning = (message) => warnings.push(message);
const addPass = (message) => passes.push(message);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function parseValue(raw) {
  const value = raw.trim();
  if (!value) return '';
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^['"].*['"]$/.test(value)) return value.slice(1, -1);
  if (value.startsWith('[') && value.endsWith(']')) {
    return [...value.matchAll(/["']([^"']+)["']/g)].map((match) => match[1]);
  }
  return value;
}


function resolveRelativeImport(sourceFile, specifier) {
  const base = path.resolve(path.dirname(sourceFile), specifier);
  const candidates = [
    base,
    `${base}.astro`, `${base}.ts`, `${base}.js`, `${base}.mjs`, `${base}.css`, `${base}.mdx`, `${base}.md`,
    path.join(base, 'index.astro'), path.join(base, 'index.ts'), path.join(base, 'index.js')
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function luminance(hex) {
  const value = hex.replace('#', '');
  const channels = [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map((channel) => channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(a, b) {
  const first = luminance(a);
  const second = luminance(b);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

function parseFrontmatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return { data: {}, text };

  const data = {};
  let section = null;
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const indent = line.match(/^\s*/)?.[0].length ?? 0;
    const keyMatch = line.trim().match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!keyMatch) continue;
    const [, key, raw] = keyMatch;

    if (indent === 0) {
      section = raw.trim() === '' ? key : null;
      data[key] = parseValue(raw);
    } else if (section) {
      data[`${section}.${key}`] = parseValue(raw);
    }
  }
  return { data, text };
}

const collections = {
  stories: path.join(root, 'src/content/stories'),
  blogs: path.join(root, 'src/content/blogs'),
  photography: path.join(root, 'src/content/photography')
};

const entries = [];
for (const [collection, dir] of Object.entries(collections)) {
  for (const file of walk(dir).filter((item) => /\.(md|mdx)$/.test(item))) {
    const parsed = parseFrontmatter(file);
    entries.push({ collection, file, ...parsed });
  }
}

if (entries.length) addPass(`Found ${entries.length} content entries.`);
else addWarning('No content entries found. Empty archives are supported, but the publication will have no editorial content.');

const routeSlugKeys = new Map();
const translationLangKeys = new Map();
const translationMap = new Map();

for (const entry of entries) {
  const rel = path.relative(root, entry.file);
  const { data, text, collection } = entry;
  const required = ['translationKey', 'lang', 'routeSlug', 'title'];
  for (const field of required) {
    if (!data[field]) addError(`${rel}: missing ${field}.`);
  }

  if (data.lang && !['bn', 'en'].includes(data.lang)) addError(`${rel}: lang must be bn or en.`);
  if (data.routeSlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.routeSlug)) addError(`${rel}: routeSlug must be lowercase kebab-case.`);

  const routeSlugKey = `${collection}:${data.lang}:${data.routeSlug}`;
  if (routeSlugKeys.has(routeSlugKey)) addError(`${rel}: duplicate route slug; also used by ${routeSlugKeys.get(routeSlugKey)}.`);
  else routeSlugKeys.set(routeSlugKey, rel);

  const translationLangKey = `${collection}:${data.translationKey}:${data.lang}`;
  if (translationLangKeys.has(translationLangKey)) addError(`${rel}: duplicate translationKey + language; also used by ${translationLangKeys.get(translationLangKey)}.`);
  else translationLangKeys.set(translationLangKey, rel);

  const bundleKey = `${collection}:${data.translationKey}`;
  const languages = translationMap.get(bundleKey) ?? new Set();
  if (data.lang) languages.add(data.lang);
  translationMap.set(bundleKey, languages);

  if (data.cover && !data.coverAlt) addError(`${rel}: coverAlt is required when cover is present.`);

  const relativeAssetMatches = [...text.matchAll(/(?:cover|image):\s*["'](\.\.?\/[^"']+)["']/g)];
  for (const match of relativeAssetMatches) {
    const asset = path.resolve(path.dirname(entry.file), match[1]);
    if (!fs.existsSync(asset)) addError(`${rel}: referenced image does not exist: ${match[1]}`);
  }

  const isPlaceholder = /PLACEHOLDER/i.test(text) || String(data.translationKey).startsWith('placeholder-');
  const isPublished = data.draft !== true;
  const noIndex = data['seo.noIndex'] === true;
  if (isPlaceholder && isPublished) {
    const message = `${rel}: placeholder content is published${noIndex ? ' (noindex)' : ''}; replace it or set draft: true before launch.`;
    if (strictLaunch) addError(message); else addWarning(message);
  }
  if (isPlaceholder && isPublished && !noIndex) addError(`${rel}: published placeholder content must never be indexable.`);
}

for (const [bundle, languages] of translationMap) {
  if (languages.size === 1) {
    const missing = languages.has('bn') ? 'English' : 'Bengali';
    addWarning(`${bundle}: ${missing} translation is not available. This is supported and the language switcher will degrade gracefully.`);
  }
}

// Validate related-content keys when they use the compact one-line array format from the templates.
const keysByCollection = Object.fromEntries(Object.keys(collections).map((collection) => [
  collection,
  new Set(entries.filter((entry) => entry.collection === collection).map((entry) => entry.data.translationKey))
]));
const relationTargets = {
  relatedStories: 'stories',
  relatedBlogs: 'blogs',
  relatedPhotography: 'photography'
};
for (const entry of entries) {
  const rel = path.relative(root, entry.file);
  for (const [field, targetCollection] of Object.entries(relationTargets)) {
    const values = Array.isArray(entry.data[field]) ? entry.data[field] : [];
    for (const value of values) {
      if (!keysByCollection[targetCollection].has(value)) addError(`${rel}: ${field} references unknown translationKey "${value}".`);
    }
  }
}

const siteConfigPath = path.join(root, 'src/config/site.ts');
if (fs.existsSync(siteConfigPath)) {
  const siteConfig = fs.readFileSync(siteConfigPath, 'utf8');
  if (/TRAVEL_JOURNAL_TITLE/.test(siteConfig)) {
    const message = 'Website title is still TRAVEL_JOURNAL_TITLE.';
    if (strictLaunch) addError(message); else addWarning(message);
  } else addPass('Website title placeholder has been replaced.');
  if (/https?:\/\//.test(siteConfig) && !/SOCIAL_.*_URL|PROFESSIONAL_PORTFOLIO_URL/.test(siteConfig)) addPass('At least one external URL is configured.');
}

const astroConfigPath = path.join(root, 'astro.config.mjs');
if (fs.existsSync(astroConfigPath)) {
  const astroConfig = fs.readFileSync(astroConfigPath, 'utf8');
  if (!astroConfig.includes("defaultOwner = 'arhjsardarhojaifa'")) addError('Astro config is not pinned to the expected GitHub owner.');
  if (!astroConfig.includes("defaultRepository = 'blog'")) addError('Astro config is not pinned to the expected GitHub repository.');
  if (astroConfig.includes("defaultOwner = 'arhjsardarhojaifa'") && astroConfig.includes("defaultRepository = 'blog'")) {
    addPass('GitHub Pages production target is configured for arhjsardarhojaifa/blog.');
  }
}

const navigationPath = path.join(root, 'src/config/navigation.ts');
if (fs.existsSync(navigationPath)) {
  const nav = fs.readFileSync(navigationPath, 'utf8');
  const expected = ['Home', 'Story', 'Blog', 'Photography', 'Contact'];
  const missing = expected.filter((label) => !nav.includes(`label: '${label}'`) && !nav.includes(`label: "${label}"`));
  if (missing.length) addError(`English navigation is missing required primary items: ${missing.join(', ')}.`);
  else addPass('Five required primary navigation sections are present.');
}

const requiredFiles = [
  'src/components/SEOHead.astro',
  'src/components/LanguageSwitcher.astro',
  'src/components/Gallery.astro',
  'src/pages/robots.txt.ts',
  'src/pages/sitemap.xml.ts',
  'src/pages/404.astro',
  'src/styles/global.css'
];
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) addError(`Missing required production file: ${file}.`);
}

const globalCss = fs.existsSync(path.join(root, 'src/styles/global.css'))
  ? fs.readFileSync(path.join(root, 'src/styles/global.css'), 'utf8')
  : '';
if (!globalCss.includes(':focus-visible')) addError('Global CSS is missing a visible keyboard focus rule.');
if (!globalCss.includes('prefers-reduced-motion')) addError('Global CSS is missing reduced-motion handling.');
else addPass('Focus-visible and reduced-motion foundations are present.');

const seoHead = fs.existsSync(path.join(root, 'src/components/SEOHead.astro'))
  ? fs.readFileSync(path.join(root, 'src/components/SEOHead.astro'), 'utf8')
  : '';
for (const token of ['rel="canonical"', 'hreflang', 'og:title', 'twitter:card', 'application/ld+json']) {
  if (!seoHead.includes(token)) addError(`SEOHead is missing expected SEO primitive: ${token}.`);
}
if (seoHead) addPass('Canonical, hreflang, Open Graph, Twitter and JSON-LD primitives are present.');



// Resolve local source imports without needing npm dependencies.
const sourceFiles = walk(path.join(root, 'src')).filter((file) => /\.(astro|ts|js|mjs|mdx|md)$/.test(file));
let importErrors = 0;
for (const file of sourceFiles) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/(?:from\s+|import\s+)["'](\.{1,2}\/[^"']+)["']/g)) {
    if (!resolveRelativeImport(file, match[1])) {
      importErrors += 1;
      addError(`${path.relative(root, file)}: unresolved local import ${match[1]}.`);
    }
  }
}
if (!importErrors) addPass('All detected relative source imports resolve to local files.');

// Verify core palette contrast numerically.
const tokensPath = path.join(root, 'src/styles/tokens.css');
if (fs.existsSync(tokensPath)) {
  const tokensText = fs.readFileSync(tokensPath, 'utf8');
  const colors = Object.fromEntries([...tokensText.matchAll(/--color-([a-z-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]));
  const checks = [
    ['ink', 'paper', 4.5, 'body text'],
    ['ink-soft', 'paper', 4.5, 'secondary text'],
    ['paper-soft', 'forest-deep', 4.5, 'dark-section text'],
    ['focus', 'paper', 3, 'focus indicator']
  ];
  let contrastErrors = 0;
  for (const [foreground, background, minimum, label] of checks) {
    if (!colors[foreground] || !colors[background]) continue;
    const ratio = contrastRatio(colors[foreground], colors[background]);
    if (ratio < minimum) {
      contrastErrors += 1;
      addError(`Palette contrast for ${label} is ${ratio.toFixed(2)}:1; expected at least ${minimum}:1.`);
    }
  }
  if (!contrastErrors) addPass('Core Earth & Journal text/focus contrast checks pass.');
}

console.log('\nTravel Journal QA\n=================');
for (const item of passes) console.log(`PASS  ${item}`);
for (const item of warnings) console.log(`WARN  ${item}`);
for (const item of errors) console.log(`ERROR ${item}`);
console.log(`\nSummary: ${passes.length} pass, ${warnings.length} warning, ${errors.length} error.`);
if (strictLaunch) console.log('Mode: launch readiness (placeholders are blockers).');
else console.log('Mode: development QA (use npm run qa:launch before public launch).');

if (errors.length) process.exit(1);
