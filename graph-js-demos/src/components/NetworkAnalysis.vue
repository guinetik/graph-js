<template>
  <div class="network-analysis">
    <!-- Metrics Selection -->
    <div class="bg-[var(--color-bg-secondary)] rounded-md p-4 space-y-2 mb-3">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-semibold text-primary">
          {{ t('showcase.networkAnalysis.metricsTitle') }}
        </h3>
        <button
          @click="toggleSelectAll"
          class="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
        >
          {{ allSelected ? t('showcase.networkAnalysis.unselectAll') : t('showcase.networkAnalysis.selectAll') }}
        </button>
      </div>
      <div class="space-y-2">
        <label 
          class="metric-checkbox-label"
          @mouseenter="showTooltipAt($event, t('showcase.networkAnalysis.degreeDescription'))"
          @mouseleave="hideTooltip"
        >
          <input
            type="checkbox"
            :checked="selectedMetrics.includes('degree')"
            @change="updateMetrics('degree', $event.target.checked)"
            class="metric-checkbox"
          >
          <span class="metric-checkbox-custom"></span>
          <span class="text-secondary">{{ t('showcase.networkAnalysis.degreeCentrality') }}</span>
        </label>
        <label 
          class="metric-checkbox-label tooltip-container"
          @mouseenter="showTooltipAt($event, t('showcase.networkAnalysis.betweennessDescription'))"
          @mouseleave="hideTooltip"
        >
          <input
            type="checkbox"
            :checked="selectedMetrics.includes('betweenness')"
            @change="updateMetrics('betweenness', $event.target.checked)"
            class="metric-checkbox"
          >
          <span class="metric-checkbox-custom"></span>
          <span class="text-secondary">{{ t('showcase.networkAnalysis.betweennessCentrality') }}</span>
        </label>
        <label 
          class="metric-checkbox-label"
          @mouseenter="showTooltipAt($event, t('showcase.networkAnalysis.clusteringDescription'))"
          @mouseleave="hideTooltip"
        >
          <input
            type="checkbox"
            :checked="selectedMetrics.includes('clustering')"
            @change="updateMetrics('clustering', $event.target.checked)"
            class="metric-checkbox"
          >
          <span class="metric-checkbox-custom"></span>
          <span class="text-secondary">{{ t('showcase.networkAnalysis.clusteringCoefficient') }}</span>
        </label>
        <label 
          class="metric-checkbox-label"
          @mouseenter="showTooltipAt($event, t('showcase.networkAnalysis.eigenvectorDescription'))"
          @mouseleave="hideTooltip"
        >
          <input
            type="checkbox"
            :checked="selectedMetrics.includes('eigenvector')"
            @change="updateMetrics('eigenvector', $event.target.checked)"
            class="metric-checkbox"
          >
          <span class="metric-checkbox-custom"></span>
          <span class="text-secondary">{{ t('showcase.networkAnalysis.eigenvectorCentrality') }}</span>
        </label>
        <label 
          class="metric-checkbox-label"
          @mouseenter="showTooltipAt($event, t('showcase.networkAnalysis.pagerankDescription'))"
          @mouseleave="hideTooltip"
        >
          <input
            type="checkbox"
            :checked="selectedMetrics.includes('pagerank')"
            @change="updateMetrics('pagerank', $event.target.checked)"
            class="metric-checkbox"
          >
          <span class="metric-checkbox-custom"></span>
          <span class="text-secondary">{{ t('showcase.networkAnalysis.pageRankCentrality') }}</span>
        </label>
        <label 
          class="metric-checkbox-label"
          @mouseenter="showTooltipAt($event, t('showcase.networkAnalysis.cliquesDescription'))"
          @mouseleave="hideTooltip"
        >
          <input
            type="checkbox"
            :checked="selectedMetrics.includes('cliques')"
            @change="updateMetrics('cliques', $event.target.checked)"
            class="metric-checkbox"
          >
          <span class="metric-checkbox-custom"></span>
          <span class="text-secondary">{{ t('showcase.networkAnalysis.cliqueCount') }}</span>
        </label>
        <label 
          class="metric-checkbox-label"
          @mouseenter="showTooltipAt($event, t('showcase.networkAnalysis.closenessDescription'))"
          @mouseleave="hideTooltip"
        >
          <input
            type="checkbox"
            :checked="selectedMetrics.includes('closeness')"
            @change="updateMetrics('closeness', $event.target.checked)"
            class="metric-checkbox"
          >
          <span class="metric-checkbox-custom"></span>
          <span class="text-secondary">{{ t('showcase.networkAnalysis.closenessCentrality') }}</span>
        </label>
        <label 
          class="metric-checkbox-label"
          @mouseenter="showTooltipAt($event, t('showcase.networkAnalysis.egoDensityDescription'))"
          @mouseleave="hideTooltip"
        >
          <input
            type="checkbox"
            :checked="selectedMetrics.includes('ego-density')"
            @change="updateMetrics('ego-density', $event.target.checked)"
            class="metric-checkbox"
          >
          <span class="metric-checkbox-custom"></span>
          <span class="text-secondary">{{ t('showcase.networkAnalysis.egoDensity') }}</span>
        </label>
        <label 
          v-if="showSpectralMetric" 
          class="metric-checkbox-label"
          @mouseenter="showTooltipAt($event, t('showcase.networkAnalysis.eigenvectorLaplacianDescription'))"
          @mouseleave="hideTooltip"
        >
          <input
            type="checkbox"
            :checked="selectedMetrics.includes('eigenvector-laplacian')"
            @change="updateMetrics('eigenvector-laplacian', $event.target.checked)"
            class="metric-checkbox"
          >
          <span class="metric-checkbox-custom"></span>
          <span class="text-secondary">{{ t('showcase.networkAnalysis.eigenvectorLaplacian') }}</span>
        </label>
      </div>
    </div>

    <!-- Size Metric Selection -->
    <div class="space-y-2 mb-3">
      <label class="block text-sm font-medium text-secondary">
        {{ t('showcase.networkAnalysis.nodeSizeLabel') }}
      </label>
      <CustomDropdown
        :model-value="sizeMetric"
        @update:model-value="$emit('update:sizeMetric', $event)"
        :options="sizeMetricOptions"
        :disabled="disabled || selectedMetrics.length === 0"
        :placeholder="t('showcase.networkAnalysis.selectMetric')"
      />
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

    <!-- Clique Edge Coloring Toggle -->
    <div v-if="hasCliques" class="mt-3 pt-3 border-t border-[var(--color-border)]">
      <label class="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          :checked="showCliqueEdges"
          @change="$emit('update:showCliqueEdges', $event.target.checked)"
          class="rounded"
        >
        <span class="text-secondary">{{ t('showcase.networkAnalysis.highlightCliqueEdges') }}</span>
      </label>
      <p class="text-xs text-secondary mt-1 ml-6">{{ t('showcase.networkAnalysis.cliqueEdgesDescription') }}</p>
    </div>

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
import { computed } from 'vue';
import { useI18n } from '../composables/useI18n';
import { useTooltip } from '../composables/useTooltip';
import CustomDropdown from './CustomDropdown.vue';

/**
 * Use i18n for translations
 */
const { t } = useI18n();

/**
 * Use global tooltip composable
 */
const { showTooltipAt, hideTooltip } = useTooltip();

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
  },
  hasCliques: {
    type: Boolean,
    default: false
  },
  showCliqueEdges: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:selectedMetrics', 'update:sizeMetric', 'update:showCliqueEdges', 'analyze']);

/**
 * All available metrics
 */
const allMetrics = computed(() => {
  const metrics = ['degree', 'betweenness', 'clustering', 'eigenvector', 'pagerank', 'cliques', 'closeness', 'ego-density'];
  if (props.showSpectralMetric) {
    metrics.push('eigenvector-laplacian');
  }
  return metrics;
});

/**
 * Check if all metrics are selected
 */
const allSelected = computed(() => {
  return allMetrics.value.every(metric => props.selectedMetrics.includes(metric));
});

/**
 * Toggle select/unselect all metrics
 */
const toggleSelectAll = () => {
  if (allSelected.value) {
    emit('update:selectedMetrics', []);
  } else {
    emit('update:selectedMetrics', [...allMetrics.value]);
  }
};

/**
 * Available size metric options based on selected metrics
 */
const sizeMetricOptions = computed(() => {
  const options = [];
  const metricMap = {
    'degree': t('showcase.networkAnalysis.degreeName'),
    'betweenness': t('showcase.networkAnalysis.betweennessName'),
    'clustering': t('showcase.networkAnalysis.clusteringName'),
    'eigenvector': t('showcase.networkAnalysis.eigenvectorName'),
    'pagerank': t('showcase.networkAnalysis.pageRankName'),
    'cliques': t('showcase.networkAnalysis.cliquesName'),
    'closeness': t('showcase.networkAnalysis.closenessName'),
    'ego-density': t('showcase.networkAnalysis.egoDensityName')
  };

  // Only include metrics that are selected
  Object.keys(metricMap).forEach(key => {
    if (props.selectedMetrics.includes(key)) {
      options.push({ value: key, label: metricMap[key] });
    }
  });

  return options;
});

/**
 * Update a single metric
 */
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

.metric-checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.375rem;
  transition: background-color 0.15s ease;
}

.metric-checkbox-label:hover {
  background-color: var(--color-bg-primary);
}

.metric-checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.metric-checkbox-custom {
  position: relative;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--color-border);
  border-radius: 0.375rem;
  background-color: var(--color-bg-primary);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.metric-checkbox-label:hover .metric-checkbox-custom {
  border-color: #9333ea;
  box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.1);
}

.metric-checkbox:checked + .metric-checkbox-custom {
  background-color: #9333ea;
  border-color: #9333ea;
}

.metric-checkbox:checked + .metric-checkbox-custom::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 0.375rem;
  height: 0.625rem;
  border: solid white;
  border-width: 0 2px 2px 0;
}

.metric-checkbox:focus + .metric-checkbox-custom {
  outline: 2px solid #9333ea;
  outline-offset: 2px;
}

.metric-checkbox:disabled + .metric-checkbox-custom {
  opacity: 0.5;
  cursor: not-allowed;
}

</style>
