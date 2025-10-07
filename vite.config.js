import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'bundle.css',
        entryFileNames: 'bundle.js',
      },
    },
  },
  base: './',
});