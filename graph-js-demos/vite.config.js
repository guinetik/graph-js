import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Plugin to copy the worker file from node_modules to dist
const copyWorkerPlugin = () => ({
  name: 'copy-graph-worker',
  closeBundle() {
    // Copy the worker file from node_modules to dist/assets
    const workerSource = path.resolve(__dirname, 'node_modules/@guinetik/graph-js/dist/network-worker.js');
    const workerDest = path.resolve(__dirname, 'dist/assets/network-worker.js');

    try {
      if (fs.existsSync(workerSource)) {
        fs.copyFileSync(workerSource, workerDest);
        console.log('✓ Copied network-worker.js to dist/assets/');
      }
    } catch (err) {
      console.error('Failed to copy worker file:', err.message);
    }
  }
});

export default defineConfig({
  plugins: [vue(), copyWorkerPlugin()],
  root: './',
  server: {
    port: 3001,
    open: true,
    fs: {
      // Allow serving files from the monorepo root
      // Needed for @guinetik/graph-js and worker files
      allow: ['..']
    }
  },
  build: {
    target: 'esnext', // Match library target for private class fields
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  // Worker support for graph-js
  worker: {
    format: 'es',
    plugins: () => []
  },
  optimizeDeps: {
    exclude: ['@guinetik/graph-js']
  },
  esbuild: {
    target: 'esnext' // Ensure esbuild doesn't downlevel private fields
  }
  // NO ALIASES! Let package.json exports do their job!
});
