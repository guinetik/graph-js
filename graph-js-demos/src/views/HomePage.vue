<template>
  <div class="relative">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-container">
        <h1 class="hero-title">
          {{ t('home.hero.title') }}
        </h1>
        <p class="hero-subtitle">
          {{ t('home.hero.subtitle') }}
        </p>
        <p class="hero-description">
          {{ t('home.hero.description') }}
        </p>

        <div class="hero-cta">
          <router-link to="/showcase" class="btn-primary">
            🚀 {{ t('home.hero.cta') }}
          </router-link>
          <a href="https://github.com/guinetik/graph-js" target="_blank" class="btn-secondary">
            📚 {{ t('home.hero.github') }}
          </a>
        </div>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="features-section">
      <div class="features-grid">
        <div
          v-for="(feature, index) in t('home.features')"
          :key="index"
          class="feature-card"
        >
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
    </div>

    <!-- Code Example -->
    <div class="code-example-section">
      <div class="code-example-container">
        <div class="code-example-card">
          <div class="code-example-header">
            <span class="code-example-title">{{ t('home.code.title') }}</span>
            <div class="code-example-dots">
              <div class="code-dot-red"></div>
              <div class="code-dot-yellow"></div>
              <div class="code-dot-green"></div>
            </div>
          </div>
          <CodeBlock :code="codeExample" language="javascript" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '../composables/useI18n';
import CodeBlock from '../components/CodeBlock.vue';

const { t } = useI18n();

const codeExample = `npm install @guinetik/graph-js

import NetworkStats from '@guinetik/graph-js';

const network = [
  { source: 'Alice', target: 'Bob', weight: 1 },
  { source: 'Bob', target: 'Carol', weight: 2 },
  { source: 'Carol', target: 'Alice', weight: 1 }
];

const analyzer = new NetworkStats({ verbose: true });
const results = await analyzer.analyze(network, ['degree', 'eigenvector']);

console.log(results);
// Analysis runs in workers for optimal performance!`;
</script>
