import { defineConfig } from 'vite';

export default defineConfig({
  root: 'nandart-3d',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    open: true
  }
});

