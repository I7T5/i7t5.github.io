// Tutorial: https://docs.astro.build/en/guides/content-collections

// Import the glob loader
import { glob } from "astro/loaders";
// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
// Define a `loader` and `schema` for each collection
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/blog" }),
  schema: z.object({
    // all these are "data"
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string(),
    // image: z.object({
    //   url: z.string(),
    //   alt: z.string()
    // }),
    tags: z.array(z.string()),
    isDraft: z.boolean()
  })
});

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/projects" }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()).optional(),
    affiliation: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    tools: z.array(z.string()),
    bullets: z.array(z.string()),
    repository: z.string().url().optional(),
    tags: z.array(z.string()),
    enableLink: z.boolean()
  })
});

// Export a single `collections` object to register your collection(s)
export const collections = { blog, projects };