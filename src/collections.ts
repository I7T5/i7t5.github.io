// Single source of truth for content collection names.
// A collection's name is also the folder name under `src/writings/` and the
// string passed to `getCollection(...)`. To rename a schema, change it here
// (and rename the matching `src/writings/<name>` folder).
export const COLLECTION = {
  blog: "blog",
  research: "research",
  software: "software",
} as const;
