/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      name: 'Parchment',
      entry: './src/parchment.ts',
      formats: ['es', 'umd'],
    },
    sourcemap: true,
  },
  test: {
    include: ['./test/unit/*'],
    browser: {
      enabled: true,
      provider: 'playwright',
      name: 'chromium',
    },
  },
});
