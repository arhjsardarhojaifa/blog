import { mkdir, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';

const [, , type, slug] = process.argv;
const typeMap = {
  story: 'stories',
  blog: 'blogs',
  photography: 'photography'
};

const fail = (message) => {
  console.error(`\nContent creator: ${message}\n`);
  console.error('Usage: npm run content:new -- <story|blog|photography> <lowercase-kebab-slug>');
  console.error('Example: npm run content:new -- story saint-martin\n');
  process.exit(1);
};

if (!type || !typeMap[type]) fail('Choose story, blog, or photography.');
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  fail('Slug must use lowercase letters/numbers and hyphens only. Example: saint-martin');
}

const collection = typeMap[type];
const targetDir = join(process.cwd(), 'src', 'content', collection, slug);

try {
  await access(targetDir, constants.F_OK);
  fail(`The folder already exists: src/content/${collection}/${slug}`);
} catch {
  // Expected when the content item does not exist yet.
}

const today = new Date().toISOString().slice(0, 10);
const shared = (lang) => `translationKey: ${slug}\nlang: ${lang}\nrouteSlug: ${slug}`;

const story = {
  bn: `---\n${shared('bn')}\ntitle: "TODO: বাংলা শিরোনাম"\nsubtitle: "TODO: বাংলা উপশিরোনাম"\nexcerpt: "TODO: সংক্ষিপ্ত পরিচিতি"\npublishedAt: ${today}\ntags: []\nfeatured: false\ndraft: true\nrelatedStories: []\nrelatedBlogs: []\nrelatedPhotography: []\nseo:\n  # title: "TODO: Optional search/social title"\n  description: "TODO: বাংলা SEO description"\n  # ogImageAlt: "TODO: Optional social-card image description"\n  noIndex: true\n---\nimport EditorialImage from '../../../components/EditorialImage.astro';\n\nএখানে বাংলা Story লিখুন।\n`,
  en: `---\n${shared('en')}\ntitle: "TODO: English title"\nsubtitle: "TODO: English subtitle"\nexcerpt: "TODO: Short introduction"\npublishedAt: ${today}\ntags: []\nfeatured: false\ndraft: true\nrelatedStories: []\nrelatedBlogs: []\nrelatedPhotography: []\nseo:\n  # title: "TODO: Optional search/social title"\n  description: "TODO: English SEO description"\n  # ogImageAlt: "TODO: Optional social-card image description"\n  noIndex: true\n---\nimport EditorialImage from '../../../components/EditorialImage.astro';\n\nWrite the English Story here.\n`
};

const blog = {
  bn: `---\n${shared('bn')}\ntitle: "TODO: বাংলা Blog শিরোনাম"\nexcerpt: "TODO: সংক্ষিপ্ত পরিচিতি"\npublishedAt: ${today}\ntags: []\nfeatured: false\ndraft: true\nrelatedStories: []\nrelatedBlogs: []\nrelatedPhotography: []\nseo:\n  # title: "TODO: Optional search/social title"\n  description: "TODO: বাংলা SEO description"\n  # ogImageAlt: "TODO: Optional social-card image description"\n  noIndex: true\n---\nimport EditorialImage from '../../../components/EditorialImage.astro';\n\nএখানে বাংলা Blog লিখুন।\n`,
  en: `---\n${shared('en')}\ntitle: "TODO: English Blog title"\nexcerpt: "TODO: Short introduction"\npublishedAt: ${today}\ntags: []\nfeatured: false\ndraft: true\nrelatedStories: []\nrelatedBlogs: []\nrelatedPhotography: []\nseo:\n  # title: "TODO: Optional search/social title"\n  description: "TODO: English SEO description"\n  # ogImageAlt: "TODO: Optional social-card image description"\n  noIndex: true\n---\nimport EditorialImage from '../../../components/EditorialImage.astro';\n\nWrite the English Blog here.\n`
};

const photography = {
  bn: `---\n${shared('bn')}\ntitle: "TODO: বাংলা Photography collection শিরোনাম"\ndescription: "TODO: সংক্ষিপ্ত পরিচিতি"\npublishedAt: ${today}\nimages: []\ntags: []\nfeatured: false\ndraft: true\nrelatedStories: []\nrelatedBlogs: []\nseo:\n  # title: "TODO: Optional search/social title"\n  description: "TODO: বাংলা SEO description"\n  # ogImageAlt: "TODO: Optional social-card image description"\n  noIndex: true\n---\nএখানে চাইলে সংগ্রহটির ছোট ভূমিকা লিখুন।\n`,
  en: `---\n${shared('en')}\ntitle: "TODO: English Photography collection title"\ndescription: "TODO: Short introduction"\npublishedAt: ${today}\nimages: []\ntags: []\nfeatured: false\ndraft: true\nrelatedStories: []\nrelatedBlogs: []\nseo:\n  # title: "TODO: Optional search/social title"\n  description: "TODO: English SEO description"\n  # ogImageAlt: "TODO: Optional social-card image description"\n  noIndex: true\n---\nOptionally write a short introduction to the collection here.\n`
};

const templates = { story, blog, photography };
await mkdir(targetDir, { recursive: true });
await Promise.all([
  writeFile(join(targetDir, 'bn.mdx'), templates[type].bn, 'utf8'),
  writeFile(join(targetDir, 'en.mdx'), templates[type].en, 'utf8')
]);

console.log(`\nCreated bilingual ${type}:`);
console.log(`  src/content/${collection}/${slug}/bn.mdx`);
console.log(`  src/content/${collection}/${slug}/en.mdx`);
console.log('\nNext: add your text/images, preview with npm run dev, then set draft: false when ready to publish.\n');
