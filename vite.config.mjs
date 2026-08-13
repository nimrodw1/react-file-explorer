import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages serves the app from /<repo>/; local/preview keep '/'.
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },

  resolve: {
    tsconfigPaths: true,
  },
});
