<template>
  <div class="network-analysis">
    <!-- Metrics Selection -->
    <div class="bg-[var(--color-bg-secondary)] rounded-md p-4 space-y-2 mb-3">
      <h3 class="text-sm font-semibold text-primary">
        {{ t('showcase.networkAnalysis.metricsTitle') }}
      </h3>
      <div class="space-y-2">
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            :checked="selectedMetrics.includes('degree')"
            @change="updateMetrics('degree', $event.target.checked)"
            class="rounded"
          >
          <span class="text-secondary">{{ t('showcase.networkAnalysis.degreeCentrality') }}</span>
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            :checked="selectedMetrics.includes('betweenness')"
            @change="updateMetrics('betweenness', $event.target.checked)"
            class="rounded"
          >
          <span class="text-secondary">{{ t('showcase.networkAnalysis.betweennessCentrality') }}</span>
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            :checked="selectedMetrics.includes('clustering')"
            @change="updateMetrics('clustering', $event.target.checked)"
            class="rounded"
          >
          <span class="text-secondary">{{ t('showcase.networkAnalysis.clusteringCoefficient') }}</span>
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            :checked="selectedMetrics.includes('eigenvector')"
            @change="updateMetrics('eigenvector', $event.target.checked)"
            class="rounded"
          >
          <span class="text-secondary">{{ t('showcase.networkAnalysis.eigenvectorCentrality') }}</span>
        </label>
        <label v-if="showSpectralMetric" class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            :checked="selectedMetrics.includes('eigenvector-laplacian')"
            @change="updateMetrics('eigenvector-laplacian', $event.target.checked)"
            class="rounded"
          >
          <span class="text-secondary">{{ t('showcase.networkAnalysis.eigenvectorLaplacian') }}</span>
        </label>
      </div>
    </div>

    <!-- Size Metric Selection -->
    <div class="space-y-2 mb-3">
      <label class="block text-sm font-medium text-secondary">
        {{ t('showcase.networkAnalysis.nodeSizeLabel') }}
      </label>
      <select
        :value="sizeMetric"
        @input="$emit('update:sizeMetric', $event.target.value)"
        :disabled="disabled || selectedMetrics.length === 0"
        class="w-full bg-secondary text-primary border border-color px-3 py-2 rounded-md disabled:opacity-50"
      >
        <option value="">{{ t('showcase.networkAnalysis.selectMetric') }}</option>
        <option v-if="selectedMetrics.includes('degree')" value="degree">{{ t('showcase.networkAnalysis.degreeName') }}</option>
        <option v-if="selectedMetrics.includes('betweenness')" value="betweenness">{{ t('showcase.networkAnalysis.betweennessName') }}</option>
        <option v-if="selectedMetrics.includes('clustering')" value="clustering">{{ t('showcase.networkAnalysis.clusteringName') }}</option>
        <option v-if="selectedMetrics.includes('eigenvector')" value="eigenvector">{{ t('showcase.networkAnalysis.eigenvectorName') }}</option>
      </select>
    </div>

    <!-- Analyze Button -->
    <button
      @click="$emit('analyze')"
      :disabled="disabled || analyzing || selectedMetrics.length === 0"
      class="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-md font-semibold transition-colors"
    >
      <span v-if="!analyzing">{{ t('showcase.networkAnalysis.analyzeButton') }}</span>
      <span v-else>{{ t('showcase.networkAnalysis.analyzingButton') }}</span>
    </button>

    <!-- Progress Bar -->
    <div v-if="analyzing && progress > 0" class="mt-2">
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          class="bg-purple-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${progress * 100}%` }"
        ></div>
      </div>
      <p class="text-xs text-secondary mt-1 text-center">
        {{ Math.round(progress * 100) }}%
      </p>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '../composables/useI18n';

/**
 * Use i18n for translations
 */
const { t } = useI18n();

const props = defineProps({
  selectedMetrics: {
    type: Array,
    required: true
  },
  sizeMetric: {
    type: String,
    default: ''
  },
  analyzing: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  showSpectralMetric: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:selectedMetrics', 'update:sizeMetric', 'analyze']);

const updateMetrics = (metric, checked) => {
  let newMetrics = [...props.selectedMetrics];
  if (checked) {
    if (!newMetrics.includes(metric)) {
      newMetrics.push(metric);
    }
  } else {
    newMetrics = newMetrics.filter(m => m !== metric);
  }
  emit('update:selectedMetrics', newMetrics);
};
</script>

<style scoped>
.network-analysis {
  /* Component styles are inherited from parent */
}
</style>
