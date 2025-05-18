import { SITE } from "@config";
import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content_layer",
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      editPost: z
        .object({
          disabled: z.boolean().optional(),
          url: z.string().optional(),
          text: z.string().optional(),
          appendFilePath: z.boolean().optional(),
        })
        .optional(),
      slug: z.string(),
      old: z.boolean().optional(),
    }),
});

const carsCollection = defineCollection({
  type: 'content', // 'content' for Markdown, 'data' for JSON/YAML
  schema: z.object({
    name: z.string(),
    brand: z.string(),
    series: z.string().optional(),
    model_year: z.number().optional(),
    photo_gallery: z.array(z.object({
      image_url: z.string(), // Path to image in /public
      is_main: z.boolean().optional(),
    })).min(1), // Must have at least one image
    scale: z.string().default('1:64'),
    purchase_price: z.number().optional(), // Not displayed on site
    tags: z.array(z.string()).default([]),
    status: z.enum(['for_trade'/*, 'in_collection', 'wishlist'*/]).optional(), // Add more statuses later
    notes: z.string().optional(),
    // No need for 'body' here if all content is in frontmatter
  }),
});

export const collections = {
  blog,
  cars: carsCollection,
};
