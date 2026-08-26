# Content Field Reference

This is a compact reference for the frontmatter used by Story, Blog, and Photography files.

## Shared editorial fields

| Field | Required? | Purpose |
|---|---|---|
| `translationKey` | Yes | Connects Bengali and English versions of the same item. |
| `lang` | Yes | `bn` or `en`. |
| `routeSlug` | Yes | URL-safe lowercase kebab-case identifier. |
| `title` | Yes | Page/article title in the file's language. |
| `excerpt` | Story/Blog: Yes | Short card/metadata description. |
| `publishedAt` | Yes | ISO publication date (`YYYY-MM-DD`). |
| `updatedAt` | No | ISO date when materially updated. |
| `category` | No | Primary editorial category. |
| `tags` | No | Extendable list of tags. |
| `featured` | No | Makes an item eligible for featured treatment. Default: `false`. |
| `featuredOrder` | No | Optional non-negative number for featured ordering. |
| `draft` | No | Hidden from public collection queries when `true`. Default: `false`. |
| `readingMinutes` | No | Manual override; otherwise reading time is calculated. |
| `seo.description` | No | Page-specific description, maximum 180 characters. |
| `seo.noIndex` | No | Adds `noindex,nofollow` when `true`. |

## Story-only / Story-focused fields

| Field | Required? | Purpose |
|---|---|---|
| `subtitle` | No | Deck/subtitle below the Story title. |
| `cover` | No | Local cover image. |
| `coverAlt` | Recommended with cover | Accessible description of the cover. |
| `location` | No | Story location. |
| `relatedStories` | No | List of Story `translationKey` values. |
| `relatedBlogs` | No | List of Blog `translationKey` values. |
| `relatedPhotography` | No | List of Photography `translationKey` values. |

## Blog fields

Blog uses the shared editorial fields plus optional `cover`, `coverAlt`, `location`, and the same three related-content lists.

## Photography fields

| Field | Required? | Purpose |
|---|---|---|
| `description` | No | Short description of the collection. |
| `location` | No | Where the collection was photographed. |
| `photographedAt` | No | When the photographs were taken. |
| `cover` | No | Collection cover image. |
| `coverAlt` | Recommended with cover | Accessible description of cover. |
| `images` | No | Gallery image objects; defaults to an empty list. |
| `relatedStories` | No | Related Story translation keys. |
| `relatedBlogs` | No | Related Blog translation keys. |

Each gallery image can contain:

```yaml
- image: "./photo-01.jpg"
  alt: "Required meaningful image description"
  caption: "Optional caption"
  credit: "Optional credit"
```

## Slugs and translation keys

Prefer using the same value for both:

```yaml
translationKey: saint-martin
routeSlug: saint-martin
```

Keep `translationKey` stable even if you later decide to change a visible title.

## SEO fields

Story, Blog and Photography content can use:

```yaml
seo:
  title: "Optional search/social title"
  description: "Unique description, maximum 180 characters"
  ogImageAlt: "Optional description for the social preview image"
  noIndex: false
```

- `seo.title` changes only the browser/search/social title. It does not replace the visible article heading.
- `seo.description` is used for description metadata and social previews.
- `seo.ogImageAlt` can describe the cover image specifically for social preview metadata.
- `seo.noIndex: true` prevents indexing and also removes that content item from the generated sitemap.
