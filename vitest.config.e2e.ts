import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
  ],
  test: {
    silent: false,
    printConsoleTrace: true,
    globals: true,
    environment: 'node',
    include: ['test/e2e/**/*.spec.ts'],
    alias: {
      src: resolve(__dirname, 'src'),
      'test-utils': resolve(__dirname, 'test-utils'),
      test: resolve(__dirname, 'test'),
    },
  },
});
