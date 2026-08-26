# Publishing Checklist

Use this before making a Story, Blog, or Photography collection public.

- [ ] Bengali title/content has been reviewed.
- [ ] English title/content has been reviewed, or the unfinished translation file has been intentionally withheld.
- [ ] `translationKey` correctly connects the two versions.
- [ ] Slug is lowercase kebab-case.
- [ ] Publication date is correct.
- [ ] Cover image path works, if a cover is used.
- [ ] Cover alt text meaningfully describes the photograph.
- [ ] Every inline/gallery image has meaningful alt text.
- [ ] Captions and credits are accurate where used.
- [ ] Related-content keys point to real content items.
- [ ] No placeholder biography, URLs, credits, locations, or personal information remains.
- [ ] `draft: false` is set only when the page is ready.
- [ ] `seo.noIndex: false` is set for a page intended to be indexed.
- [ ] `npm run check` succeeds.
- [ ] `npm run build` succeeds.
- [ ] Bengali page has been visually checked on mobile.
- [ ] English page has been visually checked on mobile.
- [ ] Language switcher goes to the matching translation where available.
- [ ] Images look correct and do not contain accidental private information.
- [ ] Commit message describes what is being published.
- [ ] Push to GitHub and confirm the GitHub Pages deployment succeeds.
