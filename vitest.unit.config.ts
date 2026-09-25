import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'unit',
    environment: 'jsdom',
    include: ['test/unittests/**/*.test.ts', 'test/unittests/**/*.test.tsx'],
  },
});
