import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kikienchrist.vercel.app',
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  prefetch: true,
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
});