<template>
  <div class="code-block-wrapper">
    <div v-if="isLoading" class="bg-gray-900 dark:bg-gray-950 rounded-lg p-4">
      <div class="animate-pulse">
        <div class="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    <div
      v-else
      v-html="highlightedCode"
      class="code-block rounded-lg overflow-x-auto"
      :class="customClass"
    ></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useSyntaxHighlight } from '../composables/useSyntaxHighlight';
import { useDarkMode } from '../composables/useDarkMode';

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'javascript'
  },
  customClass: {
    type: String,
    default: ''
  }
});

const { highlight } = useSyntaxHighlight();
const { darkMode } = useDarkMode();
const highlightedCode = ref('');
const isLoading = ref(true);

const currentTheme = computed(() => darkMode.value ? 'github-dark' : 'github-light');

async function updateHighlight() {
  isLoading.value = true;
  try {
    highlightedCode.value = await highlight(props.code, props.language, currentTheme.value);
  } catch (error) {
    console.error('Failed to highlight code:', error);
    // Fallback to plain code
    highlightedCode.value = `<pre class="bg-gray-900 rounded-lg p-4"><code>${props.code}</code></pre>`;
  } finally {
    isLoading.value = false;
  }
}

watch([() => props.code, () => props.language, currentTheme], updateHighlight);

onMounted(updateHighlight);
</script>

<style scoped>
.code-block-wrapper {
  margin: 0;
}

.code-block :deep(pre) {
  margin: 0;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.code-block :deep(code) {
  font-size: 0.875rem;
  line-height: 1.5;
  font-family: 'Monaco', 'Courier New', monospace;
}

/* Ensure proper scrolling on small screens */
.code-block {
  max-width: 100%;
}

/* Loading animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
