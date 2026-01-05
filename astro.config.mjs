// @ts-check
import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro'
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";


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
      remarkMath,
    ],
    rehypePlugins: [rehypeKatex],
  },
})
