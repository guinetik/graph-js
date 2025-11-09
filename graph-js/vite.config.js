/**
 * Vite configuration for @guinetik/graph-js library build
 *
 * Two-stage build:
 * 1. Main library + worker-url (externalized deps)
 * 2. Worker file (all dependencies bundled)
 */

import { defineConfig } from 'vite';
import { resolve } from 'path';

// Check if building worker only
const buildWorker = process.env.BUILD_WORKER === 'true';

const workerConfig = {
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/compute/network-worker.js'),
      formats: ['es'],
      fileName: () => 'network-worker.js'
    },
    rollupOptions: {
      external: [], // Bundle everything
      output: {
        preserveModules: false,
        inlineDynamicImports: true
      }
    },
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: false // Don't delete existing dist files
  }
};

const mainConfig = {
  build: {
    target: 'esnext',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.js'),
        'worker-url': resolve(__dirname, 'src/worker-url.js')
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`
    },
    rollupOptions: {
      external: ['@guinetik/logger'],
      output: {
        preserveModules: false
      }
    },
    sourcemap: true,
    outDir: 'dist'
  }
};

// Export the appropriate config
export default defineConfig(buildWorker ? workerConfig : mainConfig);
