import { defineConfig } from 'vite';

export default defineConfig({
  root: './web',         // tells Vite where your `index.html` is
  build: {
    outDir: '../dist',   // output directory for builds
    emptyOutDir: true
  }
});

