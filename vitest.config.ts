import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

import { resolve } from 'path';

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      'canvas-confetti': resolve(__dirname, '__mocks__/canvas-confetti.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    passWithNoTests: true,
  },
});
