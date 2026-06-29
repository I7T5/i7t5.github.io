// Tutorial: https://docs.astro.build/en/guides/content-collections

// Import the glob loader
import { glob } from "astro/loaders";
// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
// Collection names (single source of truth)
import { COLLECTION } from "./collections";
// Define a `loader` and `schema` for each collection
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: `./src/writings/${COLLECTION.blog}` }),
  schema: z.object({
    // all these are "data"
    title: z.string(),
    pubDate: z.date(),
    lastEditDate: z.date().optional(), 
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

const research = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: `./src/writings/${COLLECTION.research}` }),
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

const software = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: `./src/writings/${COLLECTION.software}` }),
  schema: z.object({
    name: z.string(),
    slug: z.string().optional(),
    authors: z.array(z.string()).optional(),
    description: z.string(),
    createDate: z.date(),
    tools: z.array(z.string()),
    repository: z.string().url().optional(),
    enableLink: z.boolean()
  })
});

// Export a single `collections` object to register your collection(s)
export const collections = {
  [COLLECTION.blog]: blog,
  [COLLECTION.research]: research,
  [COLLECTION.software]: software,
};
