<template>
  <DemoLayout>
    <template #controls>
      <!-- Header -->
      <div class="demo-controls-header">
        <h1 class="demo-controls-title">
          {{ t('showcase.header.title') }}
        </h1>
        <p class="demo-controls-description">
          {{ t('showcase.header.subtitle') }}
        </p>
      </div>

      <!-- What is this? -->
      <div class="info-box-blue mb-4">
        <h2 class="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
          {{ t('showcase.whatIs.title') }}
        </h2>
        <p class="text-sm text-blue-800 dark:text-blue-200" v-html="t('showcase.whatIs.description')">
        </p>
      </div>

      <!-- Status Section - Fixed at top when scrolling -->
      <div class="sticky top-0 z-20 bg-white/98 dark:bg-gray-800/98 backdrop-blur-md border-b border-[var(--color-border)] pb-4 mb-4 -mx-6 px-6 pt-4 -mt-2 overflow-x-hidden">
        <h2 class="demo-controls-section-title mb-3">{{ t('showcase.status.title') }}</h2>

        <div class="bg-[var(--color-bg-secondary)] rounded-md p-4 text-sm shadow-sm border border-[var(--color-border)]">
          <div v-if="!statusMessage" class="text-secondary text-center py-2">
            <div class="text-xs">{{ t('showcase.status.ready') }}</div>
            <div class="text-xs mt-1 opacity-60">{{ t('showcase.status.hover') }}</div>
          </div>
          <div v-else class="space-y-2">
            <div :class="{
              'flex items-start space-x-2': true,
              'text-green-600 dark:text-green-400': statusType === 'success',
              'text-red-600 dark:text-red-400': statusType === 'error',
              'text-blue-600 dark:text-blue-400': statusType === 'info'
            }">
              <div class="flex-shrink-0 mt-0.5">
                <span v-if="statusType === 'success'">✅</span>
                <span v-else-if="statusType === 'error'">❌</span>
                <span v-else>ℹ️</span>
              </div>
              <div class="flex-1 break-words">{{ statusMessage }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls Section -->
      <div class="demo-controls-section border-t border-[var(--color-border)] pt-4">
        <h2 class="demo-controls-section-title">{{ t('showcase.controls.title') }}</h2>
        <div class="grid grid-cols-3 gap-2">
          <button
            @click="handleAddRandomNode"
            class="btn-primary text-sm px-2 py-2 whitespace-nowrap"
            :title="t('showcase.controls.addRandom')"
          >
            ➕ {{ t('showcase.buttons.add') }}
          </button>

          <button
            @click="handleAddToSelected"
            class="btn-secondary text-sm px-2 py-2 whitespace-nowrap"
            :disabled="!getSelectedNode()"
            :title="getSelectedNode() ? t('showcase.controls.addToSelected').replace('{name}', getSelectedNode().id) : t('showcase.controls.selectNodeFirst')"
          >
            🔗 {{ t('showcase.buttons.toSelected') }}
          </button>

          <button
            @click="handleRemoveRandomNode"
            class="btn-primary bg-red-600 hover:bg-red-700 text-sm px-2 py-2 whitespace-nowrap"
            :title="t('showcase.controls.removeRandom')"
          >
            ➖ {{ t('showcase.buttons.remove') }}
          </button>
        </div>
      </div>

      <!-- Data Loading Section -->
      <div class="demo-controls-section border-t border-[var(--color-border)] pt-4">
        <h2 class="demo-controls-section-title">{{ t('showcase.dataLoading.title') }}</h2>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-secondary">
            {{ t('showcase.dataLoading.choose') }}
          </label>
          <select
            v-model="selectedDataset"
            class="w-full bg-secondary text-primary border border-color px-3 py-2 rounded-md"
          >
            <option value="default">{{ t('showcase.dataLoading.default') }}</option>
            <option value="karate">{{ t('showcase.dataLoading.karate') }}</option>
            <option value="miserables">{{ t('showcase.dataLoading.miserables') }}</option>
          </select>
        </div>

        <button
          @click="handleLoadDataset"
          :disabled="loading"
          class="w-full btn-primary mt-3"
        >
          <span v-if="!loading">{{ t('showcase.dataLoading.loadButton') }}</span>
          <span v-else>{{ t('showcase.dataLoading.loading') }}</span>
        </button>
      </div>

      <!-- Network Analysis Section -->
      <div class="demo-controls-section border-t border-[var(--color-border)] pt-4">
        <h2 class="demo-controls-section-title">{{ t('showcase.networkAnalysis.title') }}</h2>

        <NetworkAnalysis
          v-model:selected-metrics="selectedFeatures"
          v-model:size-metric="selectedSizeMetric"
          :analyzing="loading"
          :progress="analysisProgress"
          @analyze="handleAnalyzeGraph"
        />

        <div class="info-box-green mt-3">
          <p class="text-xs text-green-800 dark:text-green-200" v-html="t('showcase.networkAnalysis.description')">
          </p>
        </div>
      </div>
      <!-- Layout Algorithm Section -->
      <div class="demo-controls-section border-t border-[var(--color-border)] pt-4">
        <h2 class="demo-controls-section-title">{{ t('showcase.layoutAlgorithm.title') }}</h2>

        <LayoutPicker
          v-model="selectedLayout"
          :available-layouts="availableLayouts"
          :loading="loading"
          @apply="handleApplyLayout"
        />
      </div>

      <!-- Community Detection Section -->
      <div class="demo-controls-section border-t border-[var(--color-border)] pt-4">
        <h2 class="demo-controls-section-title">{{ t('showcase.communityDetection.title') }}</h2>

        <CommunityPicker
          v-model="selectedCommunityAlgorithm"
          :available-algorithms="availableCommunityAlgorithms"
          :detecting="loading"
          @detect="handleDetectCommunities"
        >
          <template #results>
            <div v-if="communityResult" class="info-box-green mt-3">
              <p class="text-sm text-green-800 dark:text-green-200 space-y-1">
                <div><strong>{{ t('showcase.communityDetection.communitiesFound') }}</strong> {{ communityResult.numCommunities }}</div>
                <div><strong>{{ t('showcase.communityDetection.modularity') }}</strong> {{ communityResult.modularity.toFixed(3) }}</div>
                <div class="text-xs mt-2">{{ t('showcase.communityDetection.nodeColorsAssignments') }}</div>
              </p>
            </div>

            <div v-if="availableCommunityAlgorithms.length > 0 && !communityResult" class="info-box-yellow mt-3">
              <p class="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>{{ availableCommunityAlgorithms.find(a => a.id === selectedCommunityAlgorithm)?.name }}:</strong>
                {{ availableCommunityAlgorithms.find(a => a.id === selectedCommunityAlgorithm)?.description }}
              </p>
            </div>
          </template>
        </CommunityPicker>
      </div>

      <!-- Instructions Box -->
      <div class="info-box-purple">
        <h3 class="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2">
          {{ t('showcase.instructions.title') }}
        </h3>
        <ul class="text-sm text-purple-800 dark:text-purple-200 space-y-1">
          <li v-html="t('showcase.instructions.dragNodes')"></li>
          <li v-html="t('showcase.instructions.scroll')"></li>
          <li v-html="t('showcase.instructions.dragBackground')"></li>
          <li v-html="t('showcase.instructions.hoverNodes')"></li>
          <li v-html="t('showcase.instructions.nodeSize')"></li>
          <li v-html="t('showcase.instructions.color')"></li>
        </ul>
      </div>
    </template>

    <template #graph>
      <!-- Loading Overlay -->
      <div
        v-if="loading"
        class="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 z-10"
      >
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
          <p class="text-secondary">{{ loadingMessage }}</p>
        </div>
      </div>

      <!-- D3 Graph Container -->
      <div ref="graphContainer" class="w-full h-full"></div>
    </template>
  </DemoLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import DemoLayout from '../components/DemoLayout.vue';
import LayoutPicker from '../components/LayoutPicker.vue';
import CommunityPicker from '../components/CommunityPicker.vue';
import NetworkAnalysis from '../components/NetworkAnalysis.vue';
import { useNetworkGraph } from '../composables/useNetworkGraph';
import { useI18n } from '../composables/useI18n';
import { ShowcaseController } from '../lib/ShowcaseController';

/**
 * Use i18n for translations
 */
const { t } = useI18n();

// Use the network graph composable (must be at top level)
const graphComposable = useNetworkGraph();
const {
  graphContainer,
  graphInstance,
  loading,
  loadData,
  addNode,
  removeNode,
  hasNode,
  getNodeIds,
  analysisProgress,
  analyzeGraph,
  applyLayout,
  getAvailableLayouts,
  detectCommunities,
  getAvailableCommunityAlgorithms,
  getSelectedNode,
  unlockPositions
} = graphComposable;

// Local state (Vue-specific reactive data)
const selectedDataset = ref('default');
const selectedLayout = ref('none');
const availableLayouts = ref([]);
const selectedCommunityAlgorithm = ref('louvain');
const availableCommunityAlgorithms = ref([]);
const communityResult = ref(null);
const selectedFeatures = ref(['degree', 'eigenvector', 'betweenness']);
const selectedSizeMetric = ref('');
const statusMessage = ref('');
const statusType = ref('info');
const loadingMessage = ref('');

// Controller instance (business logic)
let controller = null;

/**
 * Status change callback for the controller
 * 
 * @param {string} message - Status message
 * @param {string} type - Status type
 */
const handleStatusChange = (message, type) => {
  statusMessage.value = message;
  statusType.value = type;
  setTimeout(() => { statusMessage.value = ''; }, type === 'error' ? 5000 : 3000);
};


/**
 * Initialize controller and load initial data
 */
const initializeShowcase = () => {
  // Create controller with graph manager using the composable functions
  const graphManager = {
    graphInstance,
    loadData,
    addNode,
    removeNode,
    hasNode,
    getNodeIds,
    analyzeGraph,
    applyLayout,
    getAvailableLayouts,
    detectCommunities,
    getAvailableCommunityAlgorithms,
    getSelectedNode,
    unlockPositions
  };

  controller = new ShowcaseController({
    graphManager,
    onStatusChange: handleStatusChange,
    translate: (key, replacements) => t(key, replacements)
  });

  // Load initial data
  const initialData = controller.getInitialDataset();
  loadingMessage.value = t('showcase.messages.loadingGraph');
  loadData(initialData.nodes, initialData.links);

  // Get available layouts and community algorithms
  availableLayouts.value = controller.getAvailableLayouts();
  availableCommunityAlgorithms.value = controller.getAvailableCommunityAlgorithms();
  
  console.log('Initial data loaded', { 
    layouts: availableLayouts.value.length,
    communityAlgorithms: availableCommunityAlgorithms.value.length,
    nodes: initialData.nodes.length 
  });
};

/**
 * Add a random node connected to another random node
 */
const handleAddRandomNode = () => {
  if (!controller) return;
  controller.addRandomNode();
};

/**
 * Add a node connected to the selected node
 */
const handleAddToSelected = () => {
  if (!controller) return;
  controller.addNodeToSelected();
};

/**
 * Remove a random node from the graph
 */
const handleRemoveRandomNode = () => {
  if (!controller) return;
  controller.removeRandomNode();
};

/**
 * Load selected dataset
 */
const handleLoadDataset = async () => {
  if (!controller) return;

  try {
    loadingMessage.value = t('showcase.messages.loadingDataset').replace('{dataset}', selectedDataset.value);
    const result = await controller.loadDataset(selectedDataset.value);

    if (result.success) {
      loadingMessage.value = t('showcase.messages.loadingDatasetName').replace('{name}', result.name);
    }
  } catch (err) {
    console.error('Failed to load dataset:', err);
    loading.value = false; // Only clear on error
  }
  // Don't clear loading here - let the composable's loadData handle it via the 'ready' event
};

/**
 * Run analysis on current graph
 */
const handleAnalyzeGraph = async () => {
  if (!controller) return;

  try {
    loadingMessage.value = t('showcase.messages.analyzing');
    await controller.analyzeGraph(selectedFeatures.value);
  } catch (err) {
    console.error('Analysis error:', err);
  }
};

/**
 * Apply selected layout algorithm
 */
const handleApplyLayout = async () => {
  if (!controller) return;

  try {
    loadingMessage.value = t('showcase.messages.applyingLayout').replace('{layout}', selectedLayout.value);
    await controller.applyLayout(selectedLayout.value);
  } catch (err) {
    console.error('Layout error:', err);
  }
};

/**
 * Detect communities in the graph
 */
const handleDetectCommunities = async () => {
  if (!controller) return;

  try {
    loadingMessage.value = t('showcase.messages.detectingCommunities').replace('{algorithm}', selectedCommunityAlgorithm.value);
    const result = await controller.detectCommunities(selectedCommunityAlgorithm.value);
    
    if (result) {
      communityResult.value = result;
    }
  } catch (err) {
    console.error('Community detection error:', err);
  }
};

// Watch for graph instance to be ready, then initialize
watch(graphInstance, (newInstance) => {
  if (newInstance && !controller) {
    initializeShowcase();
  }
}, { immediate: true });
</script>
