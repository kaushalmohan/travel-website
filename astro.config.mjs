// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  // Performance optimizations
  build: {
    // Enable better script optimization
    inlineStylesheets: 'auto',
    // Reduce CSS size with smaller classnames in production
    format: 'file'
  },
  vite: {
    // Enable better optimizations
    build: {
      cssMinify: true, // Use standard CSS minification instead of lightningcss
      minify: 'terser',
      sourcemap: false,
      assetsInlineLimit: 4096, // 4kb - inline small assets
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Split vendor code for better caching
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    },
    // Enable CSS optimization
    css: {
      devSourcemap: false
    },
    // Optimize assets
    optimizeDeps: {
      exclude: ['fsevents']
    }
  }
});