import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const language = z.enum(['bn', 'en']);
const routeSlug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase kebab-case slug.');

const seoSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).max(180).optional(),
  ogImageAlt: z.string().min(1).optional(),
  noIndex: z.boolean().default(false)
});

const commonEditorialFields = {
  translationKey: z.string().min(1),
  lang: language,
  routeSlug,
  title: z.string().min(1),
  excerpt: z.string().min(1),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)).default([]),
  featured: z.boolean().default(false),
  featuredOrder: z.number().int().nonnegative().optional(),
  draft: z.boolean().default(false),
  imageCredit: z.string().min(1).optional(),
  readingMinutes: z.number().int().positive().optional(),
  seo: seoSchema.optional()
};

const stories = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/stories' }),
  schema: ({ image }) =>
    z.object({
      ...commonEditorialFields,
      subtitle: z.string().min(1).optional(),
      cover: image().optional(),
      coverAlt: z.string().min(1).optional(),
      location: z.string().min(1).optional(),
      relatedStories: z.array(z.string()).default([]),
      relatedBlogs: z.array(z.string()).default([]),
      relatedPhotography: z.array(z.string()).default([])
    }).superRefine((data, ctx) => {
      if (data.cover && !data.coverAlt) {
        ctx.addIssue({ code: 'custom', path: ['coverAlt'], message: 'coverAlt is required whenever a cover image is provided.' });
      }
    })
});

const blogs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blogs' }),
  schema: ({ image }) =>
    z.object({
      ...commonEditorialFields,
      cover: image().optional(),
      coverAlt: z.string().min(1).optional(),
      location: z.string().min(1).optional(),
      relatedStories: z.array(z.string()).default([]),
      relatedBlogs: z.array(z.string()).default([]),
      relatedPhotography: z.array(z.string()).default([])
    }).superRefine((data, ctx) => {
      if (data.cover && !data.coverAlt) {
        ctx.addIssue({ code: 'custom', path: ['coverAlt'], message: 'coverAlt is required whenever a cover image is provided.' });
      }
    })
});

const photography = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/photography' }),
  schema: ({ image }) =>
    z.object({
      translationKey: z.string().min(1),
      lang: language,
      routeSlug,
      title: z.string().min(1),
      description: z.string().min(1).optional(),
      location: z.string().min(1).optional(),
      photographedAt: z.coerce.date().optional(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      cover: image().optional(),
      coverAlt: z.string().min(1).optional(),
      images: z
        .array(
          z.object({
            image: image(),
            alt: z.string().min(1),
            caption: z.string().min(1).optional(),
            credit: z.string().min(1).optional()
          })
        )
        .default([]),
      category: z.string().min(1).optional(),
      tags: z.array(z.string().min(1)).default([]),
      featured: z.boolean().default(false),
      featuredOrder: z.number().int().nonnegative().optional(),
      draft: z.boolean().default(false),
      relatedStories: z.array(z.string()).default([]),
      relatedBlogs: z.array(z.string()).default([]),
      seo: seoSchema.optional()
    }).superRefine((data, ctx) => {
      if (data.cover && !data.coverAlt) {
        ctx.addIssue({ code: 'custom', path: ['coverAlt'], message: 'coverAlt is required whenever a cover image is provided.' });
      }
    })
});

export const collections = { stories, blogs, photography };
