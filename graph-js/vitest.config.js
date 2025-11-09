import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
    globals: true,
    setupFiles: ['./src/test-setup.js']
  },
  resolve: {
    extensions: ['.js']
  },
  esbuild: {
    target: 'es2020'
  }
}); 