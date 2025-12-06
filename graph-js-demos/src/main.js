/**
 * Main Application Entry Point
 * Vue.js app initialization
 */

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createLogger } from '@guinetik/logger';
import { WorkerManager } from '@guinetik/graph-js';
import { initializeAnalytics } from './composables/useAnalytics';

// Import styles
import '../styles/main.css';

// Create logger for main app
const log = createLogger({
  prefix: 'App',
  level: import.meta.env.DEV ? 'debug' : 'info'
});

// Initialize Google Analytics
initializeAnalytics();

// Expose WorkerManager to window for console debugging (dev only)
if (import.meta.env.DEV) {
  window.WorkerManager = WorkerManager;
  log.debug('WorkerManager exposed to window for debugging');
}

// Create and mount the Vue app
const app = createApp(App);

app.use(router);

app.mount('#app');

log.info('Vue app started');
