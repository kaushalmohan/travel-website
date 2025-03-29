// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  // Performance optimizations (simplified)
  build: {
    // Basic options that are well-supported
    inlineStylesheets: 'auto'
  },
  vite: {
    // Basic optimizations that are well-supported
    build: {
      cssMinify: true,
      minify: 'terser',
      sourcemap: false
    }
  }
});