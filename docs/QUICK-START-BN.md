# বাংলা Quick Start

> Production target: **Arhj Sardar Hojaifa Travel Blog** → `https://arhjsardarhojaifa.github.io/blog/`


এই guide-টি তাদের জন্য যারা coding না জানলেও নতুন Story, Blog বা Photography publish করতে চান।

## প্রথমবার যা করবেন

Project folder extract করে Terminal খুলুন। তারপর:

```bash
npm install
npm run dev
```

Browser-এ Terminal-এ দেখানো local URL খুলুন। সাধারণত এটি `http://localhost:4321`-এর মতো হবে।

`npm install` করার পর `package-lock.json` তৈরি হবে। এটি delete করবেন না; GitHub-এ commit করবেন।

## নতুন Story

```bash
npm run content:new -- story saint-martin
```

তারপর edit করুন:

```text
src/content/stories/saint-martin/bn.mdx
src/content/stories/saint-martin/en.mdx
```

লেখা প্রস্তুত হওয়া পর্যন্ত:

```yaml
draft: true
```

রাখুন। Publish করার সময়:

```yaml
draft: false
```

এবং real public page হলে:

```yaml
seo:
  noIndex: false
```

করুন।

## নতুন Blog

```bash
npm run content:new -- blog saint-martin-guide
```

তারপর `src/content/blogs/saint-martin-guide/` folder-এর `bn.mdx` এবং `en.mdx` লিখুন।

## নতুন Photography collection

```bash
npm run content:new -- photography saint-martin-evening
```

ছবিগুলো একই folder-এ রাখুন। তারপর `images:` metadata-তে file name, alt text, caption এবং প্রয়োজন হলে credit দিন।

## Cover photo

Content folder-এ `cover.jpg` রাখলে metadata-তে লিখুন:

```yaml
cover: "./cover.jpg"
coverAlt: "ছবিতে কী দেখা যাচ্ছে তার অর্থপূর্ণ বর্ণনা"
```

## Story/Blog-এর ভেতরে ছবি

MDX file-এ frontmatter-এর পরে:

```mdx
import EditorialImage from '../../../components/EditorialImage.astro';
import myPhoto from './my-photo.jpg';
```

যেখানে ছবি চান:

```mdx
<EditorialImage
  src={myPhoto}
  alt="ছবিতে কী দেখা যাচ্ছে তার অর্থপূর্ণ বর্ণনা"
  caption="ঐচ্ছিক ক্যাপশন"
  layout="wide"
/>
```

`layout` হতে পারে:

```text
standard
wide
full
```

সাধারণত Story-তে `wide` ভালো কাজ করবে; `full` অল্প ব্যবহার করুন।

## Publish করার আগে

```bash
npm run check
npm run build
```

দুটো command সফল হলে:

```bash
git add .
git commit -m "Add new travel story"
git push
```

GitHub Actions website update করবে।

## কোথায় আপনার নিজের তথ্য দিতে হবে

Site name/social links দিতে:

```text
src/config/site.ts
```

আপনার real URL না পাওয়া পর্যন্ত placeholder রেখে দিন। কোনো URL অনুমান করে বসাবেন না।

## সবচেয়ে গুরুত্বপূর্ণ নিয়ম

নতুন Story/Blog/Photography publish করার জন্য Home page, archive page, navigation বা article template edit করার দরকার নেই। আপনার কাজ মূলত:

```text
content তৈরি → ছবি যোগ → local preview → draft false → check/build → git push
```

## Public launch-এর আগে নতুন QA ধাপ

Development-এর সময় চালান:

```bash
npm run qa
```

এটি placeholder থাকলে warning দেখাবে, কিন্তু development বন্ধ করবে না।

সাইট public করার ঠিক আগে চালান:

```bash
npm run qa:launch
```

এটি website title বা visible demo placeholder থাকলে error দিয়ে থামবে।

এরপর:

```bash
npm run build
```

`build` এখন আগে Astro/TypeScript/content check চালায়, তারপর static site build করে।

SEO-এর জন্য sitemap নিজে edit করবেন না। `/sitemap.xml` content থেকে স্বয়ংক্রিয়ভাবে তৈরি হয় এবং `draft: true` বা `seo.noIndex: true` content বাদ দেয়।
