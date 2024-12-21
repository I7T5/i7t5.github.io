// @ts-check
import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro'


export default defineConfig({
  // TODO: site: "",
  integrations: [
    UnoCSS({
      injectReset: true
    }),
  ],
})
