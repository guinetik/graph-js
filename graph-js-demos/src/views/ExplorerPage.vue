<template>
  <DemoLayout>
    <template #controls>
      <!-- Header -->
      <div class="demo-controls-header">
        <h1 class="demo-controls-title">
          {{ t('explorer.header.title') }}
        </h1>
        <p class="demo-controls-description">
          {{ t('explorer.header.subtitle') }}
        </p>
      </div>

      <!-- What is this? -->
      <div class="info-box-blue mb-4">
        <h2 class="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
          {{ t('explorer.parallelComputation.title') }}
        </h2>
        <p class="text-sm text-blue-800 dark:text-blue-200 mb-3" v-html="t('explorer.parallelComputation.description')">
        </p>
        <div class="flex items-center gap-2 text-xs">
          <span :class="workerInfo.supported ? 'badge badge-green' : 'badge badge-red'">
            <span v-if="workerInfo.supported">{{ t('explorer.parallelComputation.workersSupported') }}</span>
            <span v-else>{{ t('explorer.parallelComputation.workersNotSupported') }}</span>
          </span>
          <span v-if="workerInfo.supported" class="badge badge-yellow">
            {{ workerInfo.count }} {{ t('explorer.parallelComputation.cores') }}
          </span>
        </div>
      </div>

      <!-- Renderer Selection -->
      <div class="demo-controls-section mb-4">
        <h2 class="demo-controls-section-title">{{ t('explorer.renderer.title') }}</h2>
        <div class="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            @click="handleRendererSwitch('d3')"
            :disabled="loading"
            :class="[
              'flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              currentRenderer === 'd3'
                ? 'bg-white dark:bg-gray-700 shadow text-purple-700 dark:text-purple-300'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            ]"
          >
            {{ t('explorer.renderer.d3') }}
          </button>
          <button
            @click="handleRendererSwitch('sigma')"
            :disabled="loading"
            :class="[
              'flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              currentRenderer === 'sigma'
                ? 'bg-white dark:bg-gray-700 shadow text-purple-700 dark:text-purple-300'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            ]"
          >
            {{ t('explorer.renderer.sigma') }}
          </button>
        </div>
        <p class="text-xs text-secondary mt-2">
          {{ currentRenderer === 'd3' ? t('explorer.renderer.d3Description') : t('explorer.renderer.sigmaDescription') }}
        </p>
      </div>

      <!-- Status Section - Fixed at top when scrolling -->
      <div class="sticky top-0 z-20 bg-white/98 dark:bg-gray-800/98 backdrop-blur-md border-b border-[var(--color-border)] pb-4 mb-4 -mx-6 px-6 pt-4 -mt-2 shadow-sm">
        <h2 class="demo-controls-section-title mb-3">{{ t('explorer.status.title') }}</h2>

        <div class="bg-[var(--color-bg-secondary)] rounded-md p-4 text-sm shadow-sm border border-[var(--color-border)]">
          <div v-if="!statusMessage" class="text-secondary text-center py-2">
            <div class="text-xs">{{ t('explorer.status.ready') }}</div>
            <div class="text-xs mt-1 opacity-60">{{ t('explorer.status.loadNetwork') }}</div>
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

      <!-- Data Loading Section -->
      <div class="demo-controls-section border-t border-[var(--color-border)] pt-4">
        <h2 class="demo-controls-section-title">{{ t('explorer.dataLoading.title') }}</h2>

        <!-- Tab Selection -->
        <div class="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-4">
          <button
            @click="dataLoadMode = 'sample'"
            :class="dataLoadMode === 'sample' ? 'bg-white dark:bg-gray-700 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-700'"
            class="flex-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
          >
            {{ t('explorer.dataLoading.sampleNetworks') }}
          </button>
          <button
            @click="dataLoadMode = 'upload'"
            :class="dataLoadMode === 'upload' ? 'bg-white dark:bg-gray-700 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-700'"
            class="flex-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
          >
            {{ t('explorer.dataLoading.uploadFile') }}
          </button>
        </div>

        <!-- Sample Networks Tab -->
        <div v-show="dataLoadMode === 'sample'" class="space-y-2">
          <label class="block text-sm font-medium text-secondary">
            {{ t('explorer.dataLoading.chooseNetwork') }}
          </label>
          <select
            v-model="selectedNetwork"
            class="w-full bg-secondary text-primary border border-color px-3 py-2 rounded-md"
          >
            <option value="">{{ t('explorer.dataLoading.chooseCity') }}</option>
            <option value="karate">{{ t('explorer.dataLoading.karate') }}</option>
            <option value="miserables">{{ t('explorer.dataLoading.miserables') }}</option>
            <option value="caruaru">{{ t('explorer.dataLoading.caruaru') }}</option>
            <option value="rj">{{ t('explorer.dataLoading.rj') }}</option>
            <option value="niteroi">{{ t('explorer.dataLoading.niteroi') }}</option>
          </select>

          <button
            @click="handleLoadSampleNetwork"
            :disabled="!selectedNetwork || loading"
            class="w-full btn-primary mt-3"
          >
            <span v-if="!loading">{{ t('explorer.dataLoading.loadNetwork') }}</span>
            <span v-else>{{ t('explorer.dataLoading.loading') }}</span>
          </button>
        </div>

        <!-- Upload File Tab -->
        <div v-show="dataLoadMode === 'upload'" class="space-y-3">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-secondary">
              {{ t('explorer.dataLoading.fileFormat') }}
            </label>
            <select
              v-model="uploadFormat"
              class="w-full bg-secondary text-primary border border-color px-3 py-2 rounded-md"
            >
              <option value="json">{{ t('explorer.dataLoading.formatJSON') }}</option>
              <option value="csv">{{ t('explorer.dataLoading.formatCSV') }}</option>
              <option value="networkx">{{ t('explorer.dataLoading.formatNetworkX') }}</option>
            </select>
          </div>

          <!-- CSV requires edges file + optional nodes file -->
          <div v-show="uploadFormat === 'csv'" class="space-y-2">
            <label class="block text-sm font-medium text-secondary">
              {{ t('explorer.dataLoading.edgesCSV') }}
            </label>
            <input
              type="file"
              accept=".csv"
              @change="uploadEdgesFile = $event.target.files[0]"
              class="w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-purple-900/30 dark:file:text-purple-300"
            />

            <label class="block text-sm font-medium text-secondary mt-2">
              {{ t('explorer.dataLoading.nodesCSV') }}
            </label>
            <input
              type="file"
              accept=".csv"
              @change="uploadNodesFile = $event.target.files[0]"
              class="w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-purple-900/30 dark:file:text-purple-300"
            />

            <div class="text-xs text-secondary bg-[var(--color-bg-secondary)] rounded p-2" v-html="t('explorer.dataLoading.edgeCSVFormat')">
            </div>
          </div>

          <!-- JSON/NetworkX require single file -->
          <div v-show="uploadFormat === 'json' || uploadFormat === 'networkx'" class="space-y-2">
            <label class="block text-sm font-medium text-secondary">
              <span v-if="uploadFormat === 'json'">{{ t('explorer.dataLoading.jsonFile') }}</span>
              <span v-else>{{ t('explorer.dataLoading.networkxFile') }}</span>
            </label>
            <input
              type="file"
              accept=".json"
              @change="uploadDataFile = $event.target.files[0]"
              class="w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-purple-900/30 dark:file:text-purple-300"
            />

            <div v-if="uploadFormat === 'json'" class="text-xs text-secondary bg-[var(--color-bg-secondary)] rounded p-2">
              {{ t('explorer.dataLoading.jsonSupports') }}
            </div>
            <div v-else class="text-xs text-secondary bg-[var(--color-bg-secondary)] rounded p-2">
              {{ t('explorer.dataLoading.networkxSupports') }}
            </div>
          </div>

          <button
            @click="handleLoadUploadedNetwork"
            :disabled="!canLoadUpload || loading"
            class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-md font-semibold transition-colors mt-3"
          >
            <span v-if="!loading">{{ t('explorer.dataLoading.loadUploadedFile') }}</span>
            <span v-else>{{ t('explorer.dataLoading.loading') }}</span>
          </button>
        </div>
      </div>

      <!-- Network Analysis Section -->
      <div class="demo-controls-section border-t border-[var(--color-border)] pt-4">
        <h2 class="demo-controls-section-title">{{ t('explorer.networkAnalysis.title') }}</h2>

        <NetworkAnalysis
          v-model:selected-metrics="selectedFeatures"
          v-model:size-metric="selectedSizeMetric"
          v-model:show-clique-edges="showCliqueEdges"
          :analyzing="analyzing"
          :disabled="!networkLoaded"
          :progress="analysisProgress"
          :show-spectral-metric="true"
          :has-cliques="hasCliques"
          @analyze="handleAnalyzeGraph"
        />
      </div>

      <!-- Network Statistics -->
      <div v-if="networkLoaded" class="demo-controls-section border-t border-[var(--color-border)] pt-4">
        <h2 class="demo-controls-section-title">{{ t('explorer.networkStats.title') }}</h2>

        <div class="metrics-grid-row mb-3">
          <div class="metric-card">
            <div class="text-xs text-secondary">{{ t('explorer.networkStats.nodes') }}</div>
            <div class="text-xl font-bold text-purple-600 dark:text-purple-400">{{ stats.nodes }}</div>
          </div>
          <div class="metric-card">
            <div class="text-xs text-secondary">{{ t('explorer.networkStats.edges') }}</div>
            <div class="text-xl font-bold text-pink-600 dark:text-pink-400">{{ stats.edges }}</div>
          </div>
          <div class="metric-card">
            <div class="text-xs text-secondary">{{ t('explorer.networkStats.avgDegree') }}</div>
            <div class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ stats.avgDegree }}</div>
          </div>
          <div class="metric-card">
            <div class="text-xs text-secondary">{{ t('explorer.networkStats.analysisTime') }}</div>
            <div class="text-xl font-bold text-green-600 dark:text-green-400">{{ stats.analysisTime }}</div>
          </div>
          <div v-if="stats.communities" class="metric-card">
            <div class="text-xs text-secondary">{{ t('explorer.networkStats.communities') }}</div>
            <div class="text-xl font-bold text-orange-600 dark:text-orange-400">{{ stats.communities }}</div>
          </div>
          <div v-if="stats.modularity" class="metric-card">
            <div class="text-xs text-secondary">{{ t('explorer.networkStats.modularity') }}</div>
            <div class="text-xl font-bold text-cyan-600 dark:text-cyan-400">{{ stats.modularity }}</div>
          </div>
          <!-- Graph-Level Statistics Cards -->
          <div v-if="graphStats?.density !== undefined" class="metric-card">
            <div class="text-xs text-secondary">{{ t('explorer.graphStats.density') }}</div>
            <div class="text-xl font-bold text-indigo-600 dark:text-indigo-400">{{ graphStats.density?.toFixed(4) || '-' }}</div>
          </div>
          <div v-if="graphStats?.diameter !== undefined" class="metric-card">
            <div class="text-xs text-secondary">{{ t('explorer.graphStats.diameter') }}</div>
            <div class="text-xl font-bold text-violet-600 dark:text-violet-400">
              {{ graphStats.diameter === Infinity ? '∞' : (graphStats.diameter || '-') }}
            </div>
          </div>
          <div v-if="graphStats?.['average_clustering'] !== undefined" class="metric-card">
            <div class="text-xs text-secondary">{{ t('explorer.graphStats.avgClustering') }}</div>
            <div class="text-xl font-bold text-fuchsia-600 dark:text-fuchsia-400">
              {{ graphStats['average_clustering']?.toFixed(4) || '-' }}
            </div>
          </div>
          <div v-if="graphStats?.['average_shortest_path'] !== undefined" class="metric-card">
            <div class="text-xs text-secondary">{{ t('explorer.graphStats.avgPathLength') }}</div>
            <div class="text-xl font-bold text-rose-600 dark:text-rose-400">
              {{ graphStats['average_shortest_path'] === Infinity ? '∞' : (graphStats['average_shortest_path']?.toFixed(2) || '-') }}
            </div>
          </div>
          <div v-if="graphStats?.['connected_components'] !== undefined" class="metric-card">
            <div class="text-xs text-secondary">{{ t('explorer.graphStats.connectedComponents') }}</div>
            <div class="text-xl font-bold text-sky-600 dark:text-sky-400">
              {{ graphStats['connected_components']?.count ?? '-' }}
            </div>
          </div>
        </div>

        <div v-if="useWorkers" class="info-box-green text-xs">
          <span class="font-semibold text-green-800 dark:text-green-300">
            {{ t('explorer.networkStats.usingParallel') }}
          </span>
          <span class="text-green-700 dark:text-green-400">
            - {{ workerInfo.count }} {{ t('explorer.networkStats.workersActive') }}
          </span>
        </div>

        <div v-if="!useWorkers && networkLoaded" class="info-box-yellow text-xs">
          <span class="font-semibold text-yellow-800 dark:text-yellow-300">
            {{ t('explorer.networkStats.singleThreaded') }}
          </span>
          <span class="text-yellow-700 dark:text-yellow-400">
            - {{ t('explorer.networkStats.networkTooSmall') }}
          </span>
        </div>
      </div>

      <!-- Layout Algorithm Section -->
      <div class="demo-controls-section border-t border-[var(--color-border)] pt-4">
        <h2 class="demo-controls-section-title">{{ t('explorer.layoutAlgorithm.title') }}</h2>

        <LayoutPicker
          v-model="selectedLayout"
          :available-layouts="availableLayouts"
          :loading="loading"
          :disabled="!networkLoaded"
          @apply="handleApplyLayout"
        />

        <div class="info-box-yellow mt-3">
          <p class="text-xs text-yellow-800 dark:text-yellow-200">
            <template v-for="layout in availableLayouts" :key="layout.id">
              <div>
                <strong>{{ layout.name }}:</strong>
                {{ layout.description }}
                <span v-if="layout.requiresStats" class="italic"> ({{ t('explorer.layoutAlgorithm.requiresAnalysis') }})</span>
                <br>
              </div>
            </template>
          </p>
        </div>
      </div>


      <!-- Community Detection Section -->
      <div class="demo-controls-section border-t border-[var(--color-border)] pt-4">
        <h2 class="demo-controls-section-title">{{ t('explorer.communityDetection.title') }}</h2>

        <CommunityPicker
          v-model="selectedCommunityAlgorithm"
          :available-algorithms="availableCommunityAlgorithms"
          :detecting="detectingCommunities"
          :disabled="!networkLoaded"
          :label="t('explorer.communityDetection.algorithm')"
          @detect="handleDetectCommunities"
        />
      </div>

      <!-- Community Detection Results (Persistent) -->
      <div v-if="hasCommunities" class="demo-controls-section border-t border-[var(--color-border)] pt-4">
        <div class="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/30 dark:to-pink-900/30 rounded-lg p-4 border-2 border-orange-200 dark:border-orange-700">
          <h3 class="text-sm font-semibold text-orange-900 dark:text-orange-300 mb-3 flex items-center gap-2">
            {{ t('explorer.communityResults.title') }}
          </h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-orange-800 dark:text-orange-200">{{ t('explorer.communityResults.communitiesFound') }}</span>
              <span class="text-lg font-bold text-orange-600 dark:text-orange-400">{{ communityResult?.numCommunities || '-' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-orange-800 dark:text-orange-200">{{ t('explorer.communityResults.modularityScore') }}</span>
              <span class="text-lg font-bold text-orange-600 dark:text-orange-400">
                {{ communityResult?.modularity?.toFixed(3) || '-' }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-orange-800 dark:text-orange-200">{{ t('explorer.communityResults.computationTime') }}</span>
              <span class="text-sm font-semibold text-orange-600 dark:text-orange-400">{{ communityTime || '-' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-orange-800 dark:text-orange-200">{{ t('explorer.communityResults.algorithm') }}</span>
              <span class="text-sm font-semibold text-orange-600 dark:text-orange-400">{{ selectedCommunityAlgorithm }}</span>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-orange-200 dark:border-orange-700">
            <p class="text-xs text-orange-700 dark:text-orange-300">
              {{ t('explorer.communityResults.nodeColorsRepresent') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="info-box-purple">
        <h3 class="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2">{{ t('explorer.instructions.title') }}</h3>
        <ul class="text-sm text-purple-800 dark:text-purple-200 space-y-1">
          <li v-html="t('explorer.instructions.dragNodes')"></li>
          <li v-html="t('explorer.instructions.scroll')"></li>
          <li v-html="t('explorer.instructions.dragBackground')"></li>
          <li v-html="t('explorer.instructions.hoverNodes')"></li>
          <li v-html="t('explorer.instructions.nodeSize')"></li>
          <li v-html="t('explorer.instructions.color')"></li>
        </ul>
      </div>
    </template>

    <template #graph>
      <!-- Loading Overlay -->
      <div
        v-if="loading"
        class="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-10"
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
import { ref, onMounted, watch, computed } from 'vue';
import DemoLayout from '../components/DemoLayout.vue';
import LayoutPicker from '../components/LayoutPicker.vue';
import CommunityPicker from '../components/CommunityPicker.vue';
import NetworkAnalysis from '../components/NetworkAnalysis.vue';
import { useNetworkGraph } from '../composables/useNetworkGraph';
import { useI18n } from '../composables/useI18n';
import { useAnalytics } from '../composables/useAnalytics';
import { ExplorerController } from '../lib/ExplorerController';
import { DATA_EVENTS, ANALYSIS_EVENTS, GRAPH_EVENTS } from '../lib/analytics/AnalyticsEvents.js';
import { createLogger } from '@guinetik/logger';

const log = createLogger({
  prefix: 'ExplorerPage',
  level: import.meta.env.DEV ? 'debug' : 'info'
});

/**
 * Use i18n for translations
 */
const { t } = useI18n();

// Analytics tracking
const { trackDataAction, trackAnalysis, trackGraphInteraction } = useAnalytics();

// Use the network graph composable
const graphComposable = useNetworkGraph();
const {
  graphContainer,
  graphInstance,
  loading,
  loadData,
  analysisProgress,
  analyzeGraph,
  applyLayout,
  getAvailableLayouts,
  detectCommunities,
  getAvailableCommunityAlgorithms,
  updateVisualEncoding,
  getNodeIds,
  unlockPositions,
  currentRenderer,
  switchRenderer
} = graphComposable;

// Local state
const dataLoadMode = ref('sample'); // 'sample' or 'upload'
const selectedNetwork = ref('');
const uploadFormat = ref('json');
const uploadEdgesFile = ref(null);
const uploadNodesFile = ref(null);
const uploadDataFile = ref(null);
const selectedLayout = ref('none');
const availableLayouts = ref([]);
const selectedFeatures = ref([]);
const selectedSizeMetric = ref('');
const showCliqueEdges = ref(false);
const hasCliques = ref(false);
const selectedCommunityAlgorithm = ref('louvain');
const availableCommunityAlgorithms = ref([]);
const networkLoaded = ref(false);
const analyzing = ref(false);
const detectingCommunities = ref(false);
const statusMessage = ref('');
const statusType = ref('info');
const loadingMessage = ref('Loading graph...');
const communityResult = ref(null);
const communityTime = ref('-');
const hasCommunities = ref(false);
const graphStats = ref(null);
const hasGraphStats = ref(false);
const useWorkers = ref(false);

// Stats
const stats = ref({
  nodes: 0,
  edges: 0,
  avgDegree: 0,
  analysisTime: '-',
  communities: null,
  modularity: null
});

// Node info
const nodeInfo = ref({
  type: 'default',
  message: 'Select a network to begin...',
  details: null
});

// Controller instance
let controller = null;

// Worker info
const workerInfo = ref({
  supported: typeof Worker !== 'undefined',
  count: navigator.hardwareConcurrency || 4
});

// Computed: Can load uploaded file?
const canLoadUpload = computed(() => {
  if (uploadFormat.value === 'csv') {
    return uploadEdgesFile.value !== null;
  } else {
    return uploadDataFile.value !== null;
  }
});

/**
 * Status change callback for the controller
 */
const handleStatusChange = (message, type) => {
  statusMessage.value = message;
  statusType.value = type;
  // Status persists - user sees it until next action
};

/**
 * Set node info display
 */
const setNodeInfo = (type, message, details = null) => {
  nodeInfo.value = { type, message, details };
};

/**
 * Initialize controller and setup event handlers
 */
const initializeExplorer = () => {
  const graphManager = {
    graphInstance,
    loadData,
    analyzeGraph,
    applyLayout,
    getAvailableLayouts,
    detectCommunities,
    getAvailableCommunityAlgorithms,
    updateVisualEncoding,
    getNodeIds,
    unlockPositions
  };

  controller = new ExplorerController({
    graphManager,
    onStatusChange: handleStatusChange,
    translate: (key, replacements) => t(key, replacements)
  });

  // Get available layouts and community algorithms
  availableLayouts.value = controller.getAvailableLayouts();
  availableCommunityAlgorithms.value = controller.getAvailableCommunityAlgorithms();

  // Setup node hover handlers
  if (graphInstance.value) {
    graphInstance.value.on('nodeHover', (node) => {
      setNodeInfo('node-hover', `Node: ${node.id}`, {
        id: node.id,
        group: node.group || 1,
        community: hasCommunities.value ? node.community : null,
        centrality: node.centrality?.toFixed(4) || 'N/A',
        degree: node.degree || 'N/A',
        betweenness: node.betweenness?.toFixed(4),
        clustering: node.clustering?.toFixed(3),
        eigenvector: node.eigenvector?.toFixed(4),
        closeness: node.closeness?.toFixed(4),
        egoDensity: node['ego-density']?.toFixed(3),
        cliques: node.cliques
      });
    });

    graphInstance.value.on('nodeLeave', () => {
      if (!networkLoaded.value) {
        setNodeInfo('default', 'Select a network to begin...');
      } else {
        setNodeInfo('default', 'Hover over a node to see details...');
      }
    });
  }

  // Load default showcase dataset on initialization
  loadDefaultDataset();
};

/**
 * Load the default showcase dataset
 */
const loadDefaultDataset = () => {
  const initialData = {
    nodes: [
      { id: 'Alice', group: 1 },
      { id: 'Bob', group: 1 },
      { id: 'Charlie', group: 2 },
      { id: 'David', group: 2 },
      { id: 'Eve', group: 3 },
      { id: 'Frank', group: 3 },
      { id: 'Grace', group: 1 },
      { id: 'Henry', group: 2 },
      { id: 'Isabel', group: 4 },
      { id: 'John', group: 4 },
      { id: 'Kate', group: 5 },
      { id: 'Luke', group: 5 },
      { id: 'Mary', group: 6 },
      { id: 'Nick', group: 6 },
      { id: 'Oliver', group: 7 }
    ],
    links: [
      { source: 'Alice', target: 'Bob' },
      { source: 'Alice', target: 'Charlie' },
      { source: 'Bob', target: 'Charlie' },
      { source: 'Charlie', target: 'David' },
      { source: 'Eve', target: 'Frank' },
      { source: 'Eve', target: 'Alice' },
      { source: 'Grace', target: 'Alice' },
      { source: 'Henry', target: 'Bob' },
      { source: 'Henry', target: 'Eve' },
      { source: 'Isabel', target: 'John' },
      { source: 'Isabel', target: 'Kate' },
      { source: 'John', target: 'Luke' },
      { source: 'Kate', target: 'Mary' },
      { source: 'Luke', target: 'Nick' },
      { source: 'Mary', target: 'Oliver' },
      { source: 'Nick', target: 'Oliver' },
      { source: 'Oliver', target: 'Alice' },
      { source: 'Frank', target: 'Mary' },
      { source: 'David', target: 'Isabel' },
      { source: 'Grace', target: 'Kate' }
    ]
  };

  loadData(initialData.nodes, initialData.links);
  networkLoaded.value = true;
  // Reset analysis-related state for new network
  selectedFeatures.value = [];
  selectedSizeMetric.value = '';
  showCliqueEdges.value = false;
  hasCliques.value = false;
  // Disable clique edge coloring on graph instance if it was enabled
  if (graphInstance.value && typeof graphInstance.value.updateCliqueEdgeColors === 'function') {
    graphInstance.value.updateCliqueEdgeColors(false);
  }
  stats.value = {
    nodes: initialData.nodes.length,
    edges: initialData.links.length,
    avgDegree: (2 * initialData.links.length / initialData.nodes.length).toFixed(2),
    analysisTime: '-',
    communities: null,
    modularity: null
  };
  setNodeInfo('default', 'Default network loaded. Hover over a node to see details...');
};

/**
 * Load sample network
 */
const handleLoadSampleNetwork = async () => {
  if (!controller || !selectedNetwork.value) return;
  trackDataAction(DATA_EVENTS.SAMPLE_NETWORK_LOAD, { network: selectedNetwork.value });

  try {
    loading.value = true;
    loadingMessage.value = `Loading ${selectedNetwork.value} network...`;
    setNodeInfo('loading', 'Loading network data...');

    const result = await controller.loadSampleNetwork(selectedNetwork.value);

    if (result.success) {
      networkLoaded.value = true;
      useWorkers.value = result.useWorkers || false;
      // Reset to default layout (simulation running)
      selectedLayout.value = 'none';
      // Reset analysis-related state for new network
      selectedFeatures.value = [];
      selectedSizeMetric.value = '';
      showCliqueEdges.value = false;
      hasCliques.value = false;
      // Disable clique edge coloring on graph instance if it was enabled
      if (graphInstance.value && typeof graphInstance.value.updateCliqueEdgeColors === 'function') {
        graphInstance.value.updateCliqueEdgeColors(false);
      }
      stats.value = {
        nodes: result.nodeCount,
        edges: result.edgeCount,
        avgDegree: (2 * result.edgeCount / result.nodeCount).toFixed(2),
        analysisTime: '-',
        communities: null,
        modularity: null
      };
      setNodeInfo('success', `Loaded: ${result.name}`, {
        nodes: result.nodeCount,
        edges: result.edgeCount,
        description: result.description
      });
      // Loading will be set to false by the 'ready' event from the graph
    } else {
      // Error case - set loading to false since ready event won't fire
      loading.value = false;
      setNodeInfo('error', `Failed to load network: ${result.error || 'Unknown error'}`);
    }
  } catch (err) {
    log.error('Failed to load sample network', { error: err.message, stack: err.stack });
    loading.value = false;
    setNodeInfo('error', `Failed to load network: ${err.message}`);
  }
};

/**
 * Load uploaded network
 */
const handleLoadUploadedNetwork = async () => {
  if (!controller || !canLoadUpload.value) return;
  trackDataAction(DATA_EVENTS.FILE_UPLOAD, { format: uploadFormat.value });

  try {
    loading.value = true;
    loadingMessage.value = 'Loading uploaded file...';
    setNodeInfo('loading', 'Loading uploaded file...');

    const result = await controller.loadUploadedNetwork(
      uploadFormat.value,
      uploadEdgesFile.value,
      uploadNodesFile.value,
      uploadDataFile.value
    );

    if (result.success) {
      networkLoaded.value = true;
      useWorkers.value = result.useWorkers || false;
      // Reset to default layout (simulation running)
      selectedLayout.value = 'none';
      // Reset analysis-related state for new network
      selectedFeatures.value = [];
      selectedSizeMetric.value = '';
      showCliqueEdges.value = false;
      hasCliques.value = false;
      // Disable clique edge coloring on graph instance if it was enabled
      if (graphInstance.value && typeof graphInstance.value.updateCliqueEdgeColors === 'function') {
        graphInstance.value.updateCliqueEdgeColors(false);
      }
      stats.value = {
        nodes: result.nodeCount,
        edges: result.edgeCount,
        avgDegree: (2 * result.edgeCount / result.nodeCount).toFixed(2),
        analysisTime: '-',
        communities: null,
        modularity: null
      };
      setNodeInfo('success', `Loaded: ${result.name}`, {
        nodes: result.nodeCount,
        edges: result.edgeCount,
        description: result.description
      });
      // Loading will be set to false by the 'ready' event from the graph
    } else {
      // Error case - set loading to false since ready event won't fire
      loading.value = false;
      setNodeInfo('error', `Failed to load file: ${result.error || 'Unknown error'}`);
    }
  } catch (err) {
    log.error('Failed to load uploaded network', { error: err.message, stack: err.stack });
    loading.value = false;
    setNodeInfo('error', `Failed to load file: ${err.message}`);
  }
};

/**
 * Run analysis on current graph
 */
const handleAnalyzeGraph = async () => {
  if (!controller || !networkLoaded.value) return;
  trackAnalysis(ANALYSIS_EVENTS.ANALYSIS_RUN, { metrics: selectedFeatures.value.join(',') });

  try {
    analyzing.value = true;
    loadingMessage.value = 'Analyzing network using workers...';
    setNodeInfo('loading', 'Running network analysis...');

    const startTime = performance.now();
    const result = await controller.analyzeGraph(selectedFeatures.value, selectedSizeMetric.value);
    const duration = performance.now() - startTime;

    // Always record analysis time
    stats.value.analysisTime = `${(duration / 1000).toFixed(2)}s`;

    if (result.success) {
      // Check if cliques were calculated
      hasCliques.value = selectedFeatures.value.includes('cliques');
      
      if (result.graphStats) {
        graphStats.value = result.graphStats;
        hasGraphStats.value = true;
      }
      setNodeInfo('success', 'Analysis complete', {
        nodes: result.nodeCount,
        edges: result.linkCount,
        time: stats.value.analysisTime,
        metric: selectedSizeMetric.value || selectedFeatures.value[0]
      });
    } else {
      log.warn('Analysis completed but returned unsuccessful', { result });
    }
  } catch (err) {
    log.error('Analysis error', { error: err.message, stack: err.stack });
    setNodeInfo('error', `Analysis failed: ${err.message}`);
  } finally {
    analyzing.value = false;
  }
};

/**
 * Apply selected layout algorithm
 */
const handleApplyLayout = async () => {
  if (!controller || !networkLoaded.value) return;
  trackAnalysis(ANALYSIS_EVENTS.LAYOUT_CHANGE, { layout: selectedLayout.value });

  try {
    loadingMessage.value = `Applying ${selectedLayout.value} layout...`;
    statusMessage.value = `Applying ${selectedLayout.value} layout...`;
    statusType.value = 'info';
    
    const result = await controller.applyLayout(selectedLayout.value);

    if (result.success) {
      statusMessage.value = `✅ Applied ${selectedLayout.value} layout`;
      statusType.value = 'success';
      setNodeInfo('layout-applied', `Layout Applied: ${selectedLayout.value}`, {
        description: selectedLayout.value === 'none'
          ? "Using D3's built-in force simulation"
          : 'Nodes fixed in position (D3 physics disabled)'
      });
    } else {
      const errorMsg = result.error || 'Layout application failed';
      statusMessage.value = `❌ ${errorMsg}`;
      statusType.value = 'error';
      setNodeInfo('error', `Layout failed: ${errorMsg}`);
    }
  } catch (err) {
    log.error('Layout error', { error: err.message, stack: err.stack });
    const errorMsg = err.message || 'Layout failed';
    statusMessage.value = `❌ ${errorMsg}`;
    statusType.value = 'error';
    setNodeInfo('error', `Layout failed: ${errorMsg}`);
  }
};

/**
 * Detect communities in the graph
 */
const handleDetectCommunities = async () => {
  if (!controller || !networkLoaded.value) return;
  trackAnalysis(ANALYSIS_EVENTS.COMMUNITY_DETECTION, { algorithm: selectedCommunityAlgorithm.value });

  try {
    detectingCommunities.value = true;
    loadingMessage.value = `Detecting communities using ${selectedCommunityAlgorithm.value}...`;
    setNodeInfo('loading', 'Detecting communities...');

    const startTime = performance.now();
    const result = await controller.detectCommunities(selectedCommunityAlgorithm.value);
    const duration = performance.now() - startTime;

    if (result) {
      communityResult.value = result;
      communityTime.value = `${(duration / 1000).toFixed(2)}s`;
      hasCommunities.value = true;
      stats.value.communities = result.numCommunities;
      stats.value.modularity = result.modularity.toFixed(3);
      setNodeInfo('default', 'Hover over a node to see details...');
    }
  } catch (err) {
    log.error('Community detection error', { error: err.message, stack: err.stack });
    setNodeInfo('error', `Community detection failed: ${err.message}`);
  } finally {
    detectingCommunities.value = false;
  }
};

/**
 * Switch between D3 and Sigma renderers
 */
const handleRendererSwitch = async (rendererType) => {
  if (rendererType === currentRenderer.value) return;
  trackGraphInteraction(GRAPH_EVENTS.RENDERER_SWITCH, { renderer: rendererType });

  try {
    loadingMessage.value = `Switching to ${rendererType === 'd3' ? 'D3.js (SVG)' : 'Sigma.js (WebGL)'} renderer...`;
    statusMessage.value = loadingMessage.value;
    statusType.value = 'info';

    const success = await switchRenderer(rendererType);

    if (success) {
      statusMessage.value = `Switched to ${rendererType === 'd3' ? 'D3.js (SVG)' : 'Sigma.js (WebGL)'} renderer`;
      statusType.value = 'success';

      // Re-setup event handlers after renderer switch
      if (graphInstance.value) {
        graphInstance.value.on('nodeHover', (node) => {
          setNodeInfo('node-hover', `Node: ${node.id}`, {
            id: node.id,
            group: node.group || 1,
            community: hasCommunities.value ? node.community : null,
            centrality: node.centrality?.toFixed(4) || 'N/A',
            degree: node.degree || 'N/A',
            betweenness: node.betweenness?.toFixed(4),
            clustering: node.clustering?.toFixed(3),
            eigenvector: node.eigenvector?.toFixed(4),
            closeness: node.closeness?.toFixed(4),
            egoDensity: node['ego-density']?.toFixed(3),
            cliques: node.cliques
          });
        });

        graphInstance.value.on('nodeLeave', () => {
          if (!networkLoaded.value) {
            setNodeInfo('default', 'Select a network to begin...');
          } else {
            setNodeInfo('default', 'Hover over a node to see details...');
          }
        });

        // Restore clique edge coloring if it was enabled
        if (showCliqueEdges.value && hasCliques.value && typeof graphInstance.value.updateCliqueEdgeColors === 'function') {
          // Use setTimeout to ensure graph is fully initialized
          setTimeout(() => {
            graphInstance.value.updateCliqueEdgeColors(true);
          }, 100);
        }
      }
    } else {
      statusMessage.value = 'Failed to switch renderer';
      statusType.value = 'error';
    }
  } catch (err) {
    log.error('Renderer switch error', { error: err.message, stack: err.stack });
    statusMessage.value = `Failed to switch renderer: ${err.message}`;
    statusType.value = 'error';
  }
};

// Watch for clique edge coloring toggle
watch(showCliqueEdges, (enabled) => {
  if (graphInstance.value && hasCliques.value && typeof graphInstance.value.updateCliqueEdgeColors === 'function') {
    graphInstance.value.updateCliqueEdgeColors(enabled);
  }
});

// Watch for size metric changes to update visualization without re-analyzing
watch(selectedSizeMetric, (newMetric) => {
  if (newMetric && graphInstance.value) {
    log.debug('Size metric changed', { metric: newMetric });
    updateVisualEncoding({
      sizeBy: newMetric,
      minRadius: 5,
      maxRadius: 30
    });
  }
});

// Watch for graph instance changes and restore clique edge coloring if needed
watch(graphInstance, (newInstance, oldInstance) => {
  // Initialize controller when graph instance is first created
  if (newInstance && !controller) {
    initializeExplorer();
  }
  
  // Restore clique edge coloring when renderer switches
  if (newInstance && showCliqueEdges.value && hasCliques.value && typeof newInstance.updateCliqueEdgeColors === 'function') {
    // Use setTimeout to ensure graph is fully initialized
    setTimeout(() => {
      newInstance.updateCliqueEdgeColors(true);
    }, 100);
  }
}, { immediate: true });
</script>

<style scoped>
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}

.metrics-grid-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 0.5rem;
}

.metrics-grid-row .metric-card {
  min-width: 0; /* Allow cards to shrink below min-width if needed */
}

.metric-card {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.dark .metric-card {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
  border-color: rgba(139, 92, 246, 0.3);
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.25rem;
}

.badge-green {
  background-color: #dcfce7;
  color: #166534;
}

.dark .badge-green {
  background-color: rgba(22, 101, 52, 0.3);
  color: #86efac;
}

.badge-yellow {
  background-color: #fef3c7;
  color: #92400e;
}

.dark .badge-yellow {
  background-color: rgba(146, 64, 14, 0.3);
  color: #fde047;
}

.badge-red {
  background-color: #fee2e2;
  color: #991b1b;
}

.dark .badge-red {
  background-color: rgba(153, 27, 27, 0.3);
  color: #fca5a5;
}
</style>
