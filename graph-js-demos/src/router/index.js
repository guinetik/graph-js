/**
 * Vue Router Configuration
 * Defines all application routes
 */

import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import ShowcasePage from '../views/ShowcasePage.vue';
import ExplorerPage from '../views/ExplorerPage.vue';
import FamilyPage from '../views/FamilyPage.vue';
import DocsPage from '../views/DocsPage.vue';
import { useAnalytics } from '../composables/useAnalytics';
import { ROUTE_TITLES } from '../lib/analytics/AnalyticsEvents.js';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/showcase',
    name: 'showcase',
    component: ShowcasePage
  },
  {
    path: '/explorer',
    name: 'explorer',
    component: ExplorerPage
  },
  {
    path: '/family',
    name: 'family',
    component: FamilyPage
  },
  {
    path: '/docs',
    name: 'docs',
    component: DocsPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Track page views on navigation
router.afterEach((to) => {
  const { trackPageView } = useAnalytics();
  const pageTitle = ROUTE_TITLES[to.name] || to.name || 'Unknown';
  trackPageView(to.fullPath, pageTitle);
});

export default router;
