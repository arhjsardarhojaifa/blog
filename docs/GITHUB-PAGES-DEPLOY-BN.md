# GitHub Pages Deployment — আপনার project-এর জন্য

এই project ইতোমধ্যে নিচের তথ্য দিয়ে configure করা:

- Website: **Arhj Sardar Hojaifa Travel Blog**
- GitHub username: **arhjsardarhojaifa**
- Repository: **blog**
- Expected live URL: **https://arhjsardarhojaifa.github.io/blog/**

## 1. ZIP extract করুন

Phase 8 ZIP extract করে folder-এর ভেতরে Terminal খুলুন।

## 2. Node.js এবং dependencies

Node.js install থাকার পর:

```bash
npm install
```

এরপর:

```bash
npm run qa
npm run check
npm run build
```

Placeholder demo content থাকার সময় `npm run qa` warning দেখাতে পারে। Real content দিয়ে public launch করার আগে:

```bash
npm run qa:launch
```

## 3. Git repository initialize করুন

এই repository বর্তমানে empty, তাই local project-টিই initial codebase হিসেবে push করতে পারবেন।

```bash
git init
git add .
git commit -m "Initial Arhj Sardar Hojaifa Travel Blog"
git branch -M main
git remote add origin https://github.com/arhjsardarhojaifa/blog.git
git push -u origin main
```

যদি `remote origin already exists` দেখায়:

```bash
git remote set-url origin https://github.com/arhjsardarhojaifa/blog.git
git push -u origin main
```

## 4. GitHub Pages enable করুন

GitHub-এ যান:

`arhjsardarhojaifa/blog` → **Settings** → **Pages**

**Build and deployment**-এ Source হিসেবে **GitHub Actions** নির্বাচন করুন।

Project-এর `.github/workflows/deploy.yml` push হলেই Astro build ও Pages deploy চালাবে।

## 5. Actions দেখুন

Repository → **Actions** → **Deploy to GitHub Pages**

সবুজ check mark হলে deploy সফল।

Expected URL:

```text
https://arhjsardarhojaifa.github.io/blog/
```

বাংলা homepage:

```text
https://arhjsardarhojaifa.github.io/blog/bn/
```

English homepage:

```text
https://arhjsardarhojaifa.github.io/blog/en/
```

Root URL `/blog/` visitor-কে language entry route-এ নিয়ে যাবে।

## 6. এরপর নতুন Story publish

```bash
npm run content:new -- story saint-martin
```

লেখা ও ছবি যোগ করুন, `draft: false` করুন, তারপর:

```bash
npm run qa
npm run build
git add .
git commit -m "Add Saint Martin story"
git push
```

GitHub Actions automatically site update করবে।

## 7. এখনও যেগুলো placeholder

Real value পেলে `src/config/site.ts`-এ replace করবেন অথবা আমাকে দিলে আমি করে দেব:

- `SOCIAL_INSTAGRAM_URL`
- `SOCIAL_FACEBOOK_URL`
- `SOCIAL_YOUTUBE_URL`
- `PROFESSIONAL_PORTFOLIO_URL`

এগুলো না থাকলেও site build/deploy হবে।

## 8. Launch-এর আগে সবচেয়ে গুরুত্বপূর্ণ

Placeholder Story/Blog/Photography entries real content দিয়ে replace করুন বা `draft: true` রাখুন। তারপর:

```bash
npm run qa:launch
npm run build
```

দুটো command successful হলেই public launch করা নিরাপদ।
