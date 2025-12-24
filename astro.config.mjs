// @ts-check
import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro'
import remarkGfm from "remark-gfm";


export default defineConfig({
  site: "https://i7t5.com",
  integrations: [
    UnoCSS({
      injectReset: true
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkGfm, // footnotes, tables, strikethrough, autolinks, task lists
    ],
  },
})
