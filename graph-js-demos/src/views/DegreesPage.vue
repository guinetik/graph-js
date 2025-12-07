<template>
  <div class="degrees-page">
    <DemoLayout>
      <template #controls>
        <!-- Header -->
        <div class="demo-controls-header">
          <h1 class="demo-controls-title">
            {{ t('degrees.header.title') }}
          </h1>
          <p class="demo-controls-description">
            {{ t('degrees.header.subtitle') }}
          </p>
        </div>

        <!-- What is this? -->
        <div class="info-box-green mb-4">
          <h2 class="info-box-title-green">
            {{ t('degrees.whatIs.title') }}
          </h2>
          <p class="info-box-text-green" v-html="t('degrees.whatIs.description')">
          </p>
        </div>

        <!-- Status Section -->
        <div class="status-section">
          <h2 class="demo-controls-section-title mb-3">{{ t('degrees.status.title') }}</h2>

          <div class="status-box">
            <div v-if="!statusMessage" class="status-empty">
              <div class="text-xs">{{ t('degrees.status.ready') }}</div>
            </div>
            <div v-else class="space-y-2">
              <div :class="{
                'status-message-success': statusType === 'success',
                'status-message-error': statusType === 'error',
                'status-message-info': statusType === 'info'
              }">
                <div class="status-icon">
                  <span v-if="statusType === 'success'">✅</span>
                  <span v-else-if="statusType === 'error'">❌</span>
                  <span v-else>ℹ️</span>
                </div>
                <div class="status-text">{{ statusMessage }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Network Stats -->
        <div class="controls-section-bordered" v-if="networkLoaded">
          <h2 class="demo-controls-section-title">{{ t('degrees.stats.title') }}</h2>

          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="stat-box">
              <div class="stat-value">{{ nodeCount }}</div>
              <div class="stat-label">{{ t('degrees.stats.nodes') }}</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">{{ edgeCount }}</div>
              <div class="stat-label">{{ t('degrees.stats.edges') }}</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">{{ movieCount }}</div>
              <div class="stat-label">{{ t('degrees.stats.movies') }}</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">{{ actorCount }}</div>
              <div class="stat-label">{{ t('degrees.stats.actors') }}</div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="controls-section-bordered">
          <h3 class="legend-title">
            {{ t('degrees.legend.title') }}
          </h3>
          <div class="legend-list">
            <div class="legend-item">
              <div class="legend-dot legend-dot-kevin" style="background-color: #ff6600;"></div>
              <span class="legend-text"><strong>{{ t('degrees.legend.kevinBacon') }}</strong></span>
            </div>
            <div class="legend-item">
              <div class="legend-dot" style="background-color: #3b82f6;"></div>
              <span class="legend-text">{{ t('degrees.legend.actors') }}</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot" style="background-color: #10b981;"></div>
              <span class="legend-text">{{ t('degrees.legend.movies') }}</span>
            </div>
          </div>

          <div class="mt-3 text-xs text-secondary">
            <p><strong>{{ t('degrees.legend.degree1') }}:</strong> {{ t('degrees.legend.degree1Desc') }}</p>
            <p><strong>{{ t('degrees.legend.degree2') }}:</strong> {{ t('degrees.legend.degree2Desc') }}</p>
          </div>
        </div>

        <!-- Bacon Number Finder -->
        <div class="controls-section-bordered" v-if="networkLoaded">
          <BaconFinder
            :nodes="graphNodes"
            :edges="graphEdges"
            center-node="Kevin Bacon"
            :title="t('degrees.baconFinder.title')"
            :placeholder="t('degrees.baconFinder.placeholder')"
            @path-found="handlePathFound"
            @path-cleared="handlePathCleared"
          />
        </div>

        <!-- Layout Algorithm Section -->
        <div class="controls-section-bordered">
          <h2 class="demo-controls-section-title">{{ t('degrees.layout.title') }}</h2>

          <LayoutPicker
            v-model="selectedLayout"
            :available-layouts="availableLayouts"
            :loading="loading || applyingLayout"
            @apply="handleApplyLayout"
          />
        </div>

        <!-- Network Analysis Section -->
        <div class="controls-section-bordered">
          <h2 class="demo-controls-section-title">{{ t('degrees.analysis.title') }}</h2>

          <NetworkAnalysis
            v-model:selected-metrics="selectedMetrics"
            v-model:size-metric="selectedSizeMetric"
            :analyzing="analyzing"
            :progress="analysisProgress"
            :show-spectral-metric="true"
            @analyze="handleAnalyzeGraph"
          />
        </div>

        <!-- Instructions -->
        <div class="info-box-blue">
          <h3 class="info-box-title-blue">
            {{ t('degrees.instructions.title') }}
          </h3>
          <ul class="info-box-text-blue space-y-1">
            <li v-html="t('degrees.instructions.hover')"></li>
            <li v-html="t('degrees.instructions.drag')"></li>
            <li v-html="t('degrees.instructions.zoom')"></li>
          </ul>
        </div>
      </template>

      <template #graph>
        <!-- Loading Overlay -->
        <div v-if="loading" class="loading-overlay">
          <div class="text-center">
            <div class="loading-spinner"></div>
            <p class="text-secondary">{{ loadingMessage }}</p>
          </div>
        </div>

        <!-- Sigma Graph Container -->
        <div ref="graphContainer" class="w-full h-full"></div>
      </template>
    </DemoLayout>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import DemoLayout from '../components/DemoLayout.vue';
import LayoutPicker from '../components/LayoutPicker.vue';
import NetworkAnalysis from '../components/NetworkAnalysis.vue';
import BaconFinder from '../components/BaconFinder.vue';
import { useNetworkGraph } from '../composables/useNetworkGraph';
import { useI18n } from '../composables/useI18n';
import { CSVAdapter } from '@guinetik/graph-js';
import { createLogger } from '@guinetik/logger';

const log = createLogger({
  prefix: 'DegreesPage',
  level: import.meta.env.DEV ? 'debug' : 'info'
});

// Use i18n for translations
const { t } = useI18n();

// Use the network graph composable with Sigma renderer
// CRAZY SPREAD settings for the Kevin Bacon network - ego networks need room!
const graphComposable = useNetworkGraph({
  renderer: 'sigma',
  colorBy: 'category',
  colorScheme: 'categorical',
  showLabels: true,
  // D3 Force simulation params tuned for maximum spread
  chargeStrength: -3000,       // STRONG repulsion (default -300)
  linkDistance: 100,          // LONG links (default 100)
  linkStrength: 0.1,          // WEAK edge pull (default 0.5)
  collisionPadding: 10,       // MORE space around nodes (default 2)
  collisionStrength: 2,       // HARD collision (default 0.7)
  centerStrength: 1,          // WEAK center pull (default 1)
  // Curved edges look great with radial layouts!
  curvedEdges: true,
  edgeCurvature: 0.2          // Subtle curve (0-1, default 0.25)
});

const {
  graphContainer,
  graphInstance,
  loading,
  loadData,
  applyLayout,
  getAvailableLayouts,
  analyzeGraph,
  analysisProgress,
  updateVisualEncoding
} = graphComposable;

// Local state
const statusMessage = ref('');
const statusType = ref('info');
const loadingMessage = ref('Loading Six Degrees network...');
const networkLoaded = ref(false);
const analyzing = ref(false);
const applyingLayout = ref(false);
const selectedLayout = ref('none');
const availableLayouts = ref([]);
const selectedMetrics = ref(['degree', 'betweenness', 'eigenvector', 'eigenvector-laplacian']);
const selectedSizeMetric = ref('degree');

// Network stats
const nodeCount = ref(0);
const edgeCount = ref(0);
const movieCount = ref(0);
const actorCount = ref(0);

// Graph data for BaconFinder
const graphNodes = ref([]);
const graphEdges = ref([]);

// Path highlighting state
const highlightedPath = ref(null);
const originalNodeAttrs = ref(new Map());  // Store full attrs for restore
const originalEdgeAttrs = ref(new Map());

// Path highlighting colors
const PATH_NODE_COLOR = '#f59e0b';  // Amber for path nodes
const PATH_EDGE_COLOR = '#f59e0b';  // Amber for path edges
const PATH_EDGE_SIZE = 5;           // Thicker edges for path

// Kevin Bacon special styling
const KEVIN_BACON_COLOR = '#ff6600';  // Bright orange
const KEVIN_BACON_SIZE = 25;          // Much larger than other nodes
const KEVIN_BACON_ZINDEX = 999;       // Always on top

/**
 * Highlight Kevin Bacon as the center of the network
 */
const highlightKevinBacon = () => {
  if (!graphInstance.value) return;

  try {
    const graph = graphInstance.value.getGraph();
    if (graph && graph.hasNode('Kevin Bacon')) {
      graph.setNodeAttribute('Kevin Bacon', 'color', KEVIN_BACON_COLOR);
      graph.setNodeAttribute('Kevin Bacon', 'size', KEVIN_BACON_SIZE);
      graph.setNodeAttribute('Kevin Bacon', 'zIndex', KEVIN_BACON_ZINDEX);
      graph.setNodeAttribute('Kevin Bacon', 'forceLabel', true);   // Always show label
      graph.setNodeAttribute('Kevin Bacon', 'highlighted', true);
      graph.setNodeAttribute('Kevin Bacon', 'lockedColor', true);  // Prevent color override
      graph.setNodeAttribute('Kevin Bacon', 'lockedSize', true);   // Prevent size override
      log.debug('Kevin Bacon highlighted as network center');
    }
  } catch (err) {
    log.warn('Could not highlight Kevin Bacon', { error: err.message });
  }
};

/**
 * Toggle labels visibility on the graph
 */
const setLabelsVisible = (visible) => {
  if (!graphInstance.value?.sigma) return;

  try {
    graphInstance.value.sigma.setSetting('renderLabels', visible);
    log.debug('Labels visibility set to', visible);
  } catch (err) {
    log.warn('Could not toggle labels', { error: err.message });
  }
};

/**
 * Handle path found from BaconFinder - highlight the path on the graph
 * Hides all non-path nodes/edges to make the path clearly visible
 */
const handlePathFound = ({ sourceNode, path, pathEdges, baconNumber }) => {
  if (!graphInstance.value) return;

  try {
    const graph = graphInstance.value.getGraph();
    if (!graph) return;

    // Clear any existing highlights first
    handlePathCleared();

    // Store path for reference
    highlightedPath.value = { sourceNode, path, pathEdges, baconNumber };

    // Get path node IDs as a Set for quick lookup
    const pathNodeIds = new Set(path.map(n => n.id));

    // Get path edges as a Set of "source-target" keys
    const pathEdgeKeys = new Set();
    pathEdges.forEach(e => {
      pathEdgeKeys.add(`${e.source}-${e.target}`);
      pathEdgeKeys.add(`${e.target}-${e.source}`);  // Both directions
    });

    // Hide all non-path nodes, keep path nodes with their original colors
    graph.forEachNode((nodeId, attrs) => {
      // Store original attributes for restore
      originalNodeAttrs.value.set(nodeId, {
        color: attrs.color,
        size: attrs.size,
        hidden: attrs.hidden,
        forceLabel: attrs.forceLabel,
        zIndex: attrs.zIndex
      });

      if (pathNodeIds.has(nodeId)) {
        // Path node - keep original color (movie=green, actor=blue, Kevin=orange)
        // Just make sure it's visible and labeled
        graph.setNodeAttribute(nodeId, 'hidden', false);
        graph.setNodeAttribute(nodeId, 'zIndex', 100);
        graph.setNodeAttribute(nodeId, 'forceLabel', true);
      } else {
        // Non-path node - HIDE it completely
        graph.setNodeAttribute(nodeId, 'hidden', true);
      }
    });

    // Hide all non-path edges, highlight path edges with amber
    graph.forEachEdge((edgeId, attrs, source, target) => {
      // Store original attributes
      originalEdgeAttrs.value.set(edgeId, {
        color: attrs.color,
        size: attrs.size,
        hidden: attrs.hidden,
        zIndex: attrs.zIndex
      });

      const edgeKey = `${source}-${target}`;
      if (pathEdgeKeys.has(edgeKey)) {
        // Path edge - highlight with amber color and thicker line
        graph.setEdgeAttribute(edgeId, 'color', PATH_EDGE_COLOR);
        graph.setEdgeAttribute(edgeId, 'size', PATH_EDGE_SIZE);
        graph.setEdgeAttribute(edgeId, 'hidden', false);
        graph.setEdgeAttribute(edgeId, 'zIndex', 100);
      } else {
        // Non-path edge - HIDE it completely
        graph.setEdgeAttribute(edgeId, 'hidden', true);
      }
    });

    // Force refresh
    if (graphInstance.value.sigma) {
      graphInstance.value.sigma.refresh();
    }

    statusMessage.value = `Found path! Bacon Number: ${baconNumber}`;
    statusType.value = 'success';
    log.debug('Path highlighted', { sourceNode, baconNumber, pathLength: path.length });

  } catch (err) {
    log.error('Failed to highlight path', { error: err.message });
  }
};

/**
 * Clear path highlighting and restore all nodes/edges
 */
const handlePathCleared = () => {
  if (!graphInstance.value) return;

  try {
    const graph = graphInstance.value.getGraph();
    if (!graph) return;

    // Restore original node attributes
    originalNodeAttrs.value.forEach((attrs, nodeId) => {
      if (graph.hasNode(nodeId)) {
        graph.setNodeAttribute(nodeId, 'color', attrs.color);
        graph.setNodeAttribute(nodeId, 'size', attrs.size);
        graph.setNodeAttribute(nodeId, 'hidden', false);  // Always unhide
        graph.setNodeAttribute(nodeId, 'zIndex', attrs.zIndex || 1);
        // Only clear forceLabel if not Kevin Bacon
        if (nodeId !== 'Kevin Bacon') {
          graph.setNodeAttribute(nodeId, 'forceLabel', attrs.forceLabel || false);
        }
      }
    });

    // Restore original edge attributes
    originalEdgeAttrs.value.forEach((attrs, edgeId) => {
      if (graph.hasEdge(edgeId)) {
        graph.setEdgeAttribute(edgeId, 'color', attrs.color || '#999');
        graph.setEdgeAttribute(edgeId, 'size', attrs.size || 1);
        graph.setEdgeAttribute(edgeId, 'hidden', false);  // Always unhide
        graph.setEdgeAttribute(edgeId, 'zIndex', attrs.zIndex || 1);
      }
    });

    // Clear stored values
    originalNodeAttrs.value.clear();
    originalEdgeAttrs.value.clear();
    highlightedPath.value = null;

    // Re-highlight Kevin Bacon
    highlightKevinBacon();

    // Force refresh
    if (graphInstance.value.sigma) {
      graphInstance.value.sigma.refresh();
    }

    log.debug('Path highlighting cleared');

  } catch (err) {
    log.error('Failed to clear path highlighting', { error: err.message });
  }
};

/**
 * Load the Six Degrees dataset
 */
const loadSixDegreesData = async () => {
  try {
    loadingMessage.value = 'Loading Six Degrees of Kevin Bacon...';
    statusMessage.value = 'Loading network data...';
    statusType.value = 'info';

    // Load both CSV files
    // Using smaller kevin_bacon dataset for faster testing - swap back to six_degrees for full graph
    /* const graphData = await CSVAdapter.loadFromURL(
      '/data/kevin_bacon_edges.csv',
      '/data/kevin_bacon_nodes.csv'
    ); */

    // Using six_degrees dataset for full graph
    const graphData = await CSVAdapter.loadFromURL(
      '/data/six_degrees_edges.csv',
      '/data/six_degrees_nodes.csv'
    );

    // Assign groups based on category
    const nodes = graphData.nodes.map(n => ({
      ...n,
      group: n.category === 'movie' ? 1 : 2
    }));

    // Store for BaconFinder component
    graphNodes.value = nodes;
    graphEdges.value = graphData.edges;

    // Calculate stats
    nodeCount.value = nodes.length;
    edgeCount.value = graphData.edges.length;
    movieCount.value = nodes.filter(n => n.category === 'movie').length;
    actorCount.value = nodes.filter(n => n.category === 'actor').length;

    // Load into graph - skipSimulation and keepLoading since we're applying radial layout immediately
    // This prevents the flash of force-directed layout before radial is applied
    // keepLoading keeps the spinner visible until radial layout is complete
    loadData(nodes, graphData.edges, { skipSimulation: true, keepLoading: true });

    // After load, compute statistics and apply radial layout with Kevin Bacon at center
    // This creates the beautiful star pattern for ego networks
    // Small delay to ensure Sigma has rendered the initial graph
    setTimeout(async () => {
      setLabelsVisible(false);

      // Apply color encoding
      updateVisualEncoding({
        colorBy: 'category',
        colorScheme: 'categorical'
      });

      // Step 1: Compute betweenness centrality to determine node importance/sizes
      loadingMessage.value = 'Computing node centrality...';
      statusMessage.value = 'Computing node centrality...';
      statusType.value = 'info';

      try {
        // Compute betweenness centrality - this determines node sizes
        await analyzeGraph(['betweenness']);

        // Update visual encoding to size by betweenness
        updateVisualEncoding({
          sizeBy: 'betweenness',
          minRadius: 4,
          maxRadius: 25
        });

        // Step 2: Build nodeSizes map from betweenness values
        // Calculate sizes directly from betweenness (same formula as updateVisualEncoding)
        const nodeSizes = {};
        const minRadius = 4;
        const maxRadius = 25;

        // Get min/max betweenness for normalization
        let minBetweenness = Infinity, maxBetweenness = 0;
        if (graphInstance.value?.data?.nodes) {
          graphInstance.value.data.nodes.forEach(node => {
            const betweenness = node.betweenness || 0;
            minBetweenness = Math.min(minBetweenness, betweenness);
            maxBetweenness = Math.max(maxBetweenness, betweenness);
          });
        }

        // Calculate sizes using same normalization as visual encoding
        const betweennessRange = maxBetweenness - minBetweenness || 1;
        let sizeCount = 0;
        if (graphInstance.value?.data?.nodes) {
          graphInstance.value.data.nodes.forEach(node => {
            const betweenness = node.betweenness || 0;
            const normalized = (betweenness - minBetweenness) / betweennessRange;
            const size = minRadius + normalized * (maxRadius - minRadius);
            nodeSizes[node.id] = size;
            sizeCount++;
          });
        }

        log.info('Node sizes calculated from betweenness', {
          count: sizeCount,
          minBetweenness,
          maxBetweenness,
          kevinBaconBetweenness: graphInstance.value?.data?.nodes?.find(n => n.id === 'Kevin Bacon')?.betweenness,
          kevinBaconSize: nodeSizes['Kevin Bacon'],
          sampleSizes: Object.entries(nodeSizes).slice(0, 5).map(([id, size]) => ({ id, size: size.toFixed(1) }))
        });

        // Step 3: Apply RADIAL layout with Kevin Bacon at center and node sizes
        loadingMessage.value = 'Applying radial layout...';
        statusMessage.value = 'Applying radial layout...';

        await applyLayout('radial', {
          centerNode: 'Kevin Bacon',
          nodeSizes: nodeSizes,      // Pass node sizes for size-aware spacing
          nodePadding: 6             // Extra padding between nodes
        });
        selectedLayout.value = 'radial';  // Update UI to show radial is selected

        setLabelsVisible(true);
        highlightKevinBacon();
        statusMessage.value = 'Radial layout applied - Kevin Bacon at center!';
        statusType.value = 'success';
      } catch (err) {
        log.error('Failed to apply radial layout', { error: err.message });
        // Fallback: just show with force simulation
        setLabelsVisible(true);
        highlightKevinBacon();
        statusMessage.value = 'Force layout applied';
        statusType.value = 'info';
      }
    }, 100);

    networkLoaded.value = true;

    log.info('Six Degrees network loaded', {
      nodes: nodeCount.value,
      edges: edgeCount.value,
      movies: movieCount.value,
      actors: actorCount.value
    });

  } catch (err) {
    log.error('Failed to load Six Degrees data', { error: err.message });
    statusMessage.value = `Failed to load: ${err.message}`;
    statusType.value = 'error';
  }
};

// Track if analysis has been run
const analysisComplete = ref(false);

/**
 * Apply selected layout
 */
const handleApplyLayout = async () => {
  if (!graphInstance.value) return;

  const layoutId = selectedLayout.value;
  if (!layoutId || layoutId === 'none') return;

  // Spectral layout requires eigenvector-laplacian analysis first
  if (layoutId === 'spectral' && !analysisComplete.value) {
    statusMessage.value = 'Spectral layout requires analysis first. Running analysis...';
    statusType.value = 'info';

    // Auto-run analysis with eigenvector-laplacian
    if (!selectedMetrics.value.includes('eigenvector-laplacian')) {
      selectedMetrics.value = [...selectedMetrics.value, 'eigenvector-laplacian'];
    }
    await handleAnalyzeGraph();
  }

  try {
    applyingLayout.value = true;
    statusMessage.value = `Applying ${layoutId} layout...`;
    statusType.value = 'info';

    await applyLayout(layoutId);

    // Re-highlight Kevin Bacon after layout
    highlightKevinBacon();

    statusMessage.value = `Applied ${layoutId} layout`;
    statusType.value = 'success';
  } catch (err) {
    statusMessage.value = `Layout failed: ${err.message}`;
    statusType.value = 'error';
  } finally {
    applyingLayout.value = false;
  }
};

/**
 * Analyze the graph
 */
const handleAnalyzeGraph = async () => {
  if (!graphInstance.value) return;

  try {
    analyzing.value = true;
    statusMessage.value = 'Analyzing network...';
    statusType.value = 'info';

    await analyzeGraph(selectedMetrics.value);

    // Update visual encoding to size by selected metric
    if (selectedSizeMetric.value) {
      updateVisualEncoding({
        sizeBy: selectedSizeMetric.value,
        minRadius: 3,
        maxRadius: 20
      });
    }

    // Re-highlight Kevin Bacon after analysis (keep him prominent)
    highlightKevinBacon();

    analysisComplete.value = true;
    statusMessage.value = 'Analysis complete';
    statusType.value = 'success';
  } catch (err) {
    statusMessage.value = `Analysis failed: ${err.message}`;
    statusType.value = 'error';
  } finally {
    analyzing.value = false;
  }
};

// Initialize on mount
onMounted(async () => {
  // Load the Six Degrees dataset first (initializes the analyzer)
  await loadSixDegreesData();

  // Get available layouts after graph is loaded
  availableLayouts.value = getAvailableLayouts();
});
</script>

<style scoped>
.degrees-page {
  height: 100%;
}

.stat-box {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 0.75rem;
  text-align: center;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}

.legend-dot-kevin {
  width: 14px;
  height: 14px;
  box-shadow: 0 0 6px rgba(255, 102, 0, 0.6);
}
</style>
