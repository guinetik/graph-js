/**
 * NetworkAnalyzer - Integration wrapper for @guinetik/graph-js
 *
 * This class bridges the D3 visualization with the network analysis library.
 * It handles:
 * - Converting D3 graph data to library format
 * - Running analysis using web workers
 * - Converting results back to D3 format
 * - Applying layout algorithms
 *
 * @example
 * const analyzer = new NetworkAnalyzer();
 *
 * // Analyze graph and enrich nodes with metrics
 * const enrichedData = await analyzer.analyzeGraph(nodes, links, {
 *   features: ['degree', 'eigenvector', 'betweenness'],
 *   onProgress: (p) => console.log(`${Math.round(p * 100)}%`)
 * });
 *
 * // Apply layout algorithm
 * const positions = await analyzer.applyLayout('kamada-kawai', nodes, links, {
 *   width: 800,
 *   height: 600
 * });
 */

import { 
  NetworkStats, 
  Graph, 
  WorkerManager,
  LAYOUT_REGISTRY,
  COMMUNITY_REGISTRY,
  CommunityDetection,
  LouvainAlgorithm
} from '@guinetik/graph-js';
import {
  RandomLayout,
  CircularLayout,
  SpiralLayout,
  ShellLayout,
  SpectralLayout,
  ForceDirectedLayout,
  KamadaKawaiLayout,
  BipartiteLayout,
  MultipartiteLayout,
  BFSLayout,
  DFSLayout,
  RadialLayout
} from '@guinetik/graph-js';

import { createLogger } from '@guinetik/logger';

// Construct worker URL based on environment
// In production, the worker file is copied to /assets/network-worker.js by Vite plugin
// In dev, we use the library's worker-url export
const getWorkerUrl = async () => {
  if (import.meta.env.PROD) {
    // Production: Use the copied worker file as a plain string path
    // This avoids Vite trying to inline it as a data URI
    const base = import.meta.env.BASE_URL || '/';
    return base + 'assets/network-worker.js';
  } else {
    // Development: Import from library
    const { default: workerUrl } = await import('@guinetik/graph-js/worker-url');
    return workerUrl;
  }
};

export class NetworkAnalyzer {
  constructor() {
    this.analyzer = null;
    this.initPromise = null;
    this.lastAnalysisResults = null;
    this.workerUrl = null;
    this.log = createLogger({
      prefix: 'NetworkAnalyzer',
      level: import.meta.env.DEV ? 'debug' : 'info'
    });
  }

  /**
   * Initialize the analyzer (must be called before analysis)
   * @private
   */
  async _ensureInitialized() {
    if (this.analyzer) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      // Get worker URL based on environment
      this.workerUrl = await getWorkerUrl();
      this.log.debug('Initializing with worker', { workerUrl: this.workerUrl });

      // Pass the worker URL to NetworkStats
      // This tells it exactly where to find the worker file
      this.analyzer = new NetworkStats({
        verbose: true,
        workerScript: this.workerUrl
      });

      // SPECIAL CASE: NetworkStats constructor triggers async worker initialization
      // but doesn't provide a ready callback or promise. This setTimeout is necessary
      // to ensure workers are fully initialized before use. This is an acceptable
      // use case for setTimeout as it's waiting for third-party library initialization.
      // TODO: Consider polling for worker readiness or requesting a ready event from the library
      await new Promise(resolve => setTimeout(resolve, 500));
      this.log.info('Initialized successfully');
    })();

    await this.initPromise;
  }

  /**
   * Convert D3 graph data to library edge list format
   * @private
   */
  _toEdgeList(nodes, links) {
    return links.map(link => ({
      source: typeof link.source === 'object' ? link.source.id : link.source,
      target: typeof link.target === 'object' ? link.target.id : link.target,
      weight: link.weight || 1
    }));
  }

  /**
   * Build Graph object from nodes and links
   * @private
   */
  _buildGraph(nodes, links) {
    const graph = new Graph();

    // Add all nodes
    nodes.forEach(node => {
      graph.addNode(node.id);
    });

    // Add all edges
    links.forEach(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      graph.addEdge(sourceId, targetId, link.weight || 1);
    });

    return graph;
  }

  /**
   * Analyze a graph and compute network metrics
   *
   * @param {Array} nodes - Array of node objects with {id, group}
   * @param {Array} links - Array of link objects with {source, target, weight?}
   * @param {Object} options - Analysis options
   * @param {Array} options.features - Metrics to compute (default: ['degree', 'eigenvector'])
   * @param {Function} options.onProgress - Progress callback (0-1)
   * @param {boolean} options.includeGraphStats - Include graph-level statistics
   * @param {Array} options.graphStats - Specific graph stats to calculate
   * @returns {Promise<Object>} {nodes, links, graphStats?} with enriched nodes
   */
  async analyzeGraph(nodes, links, options = {}) {
    // Ensure analyzer is initialized
    await this._ensureInitialized();

    this.log.debug('Starting analysis', {
      nodeCount: nodes.length,
      linkCount: links.length,
      features: options.features,
      includeGraphStats: options.includeGraphStats
    });

    // Convert to edge list format
    const edgeList = this._toEdgeList(nodes, links);

    // Use the library to analyze (runs in workers!)
    const features = options.features || ['degree', 'eigenvector'];
    const analysisOptions = {
      onProgress: options.onProgress
    };

    // Include graph-level stats if requested
    if (options.includeGraphStats) {
      analysisOptions.includeGraphStats = true;
      analysisOptions.graphStats = options.graphStats || [
        'density',
        'diameter',
        'average_clustering',
        'average_shortest_path',
        'connected_components',
        'average_degree'
      ];
    }

    const results = await this.analyzer.analyze(edgeList, features, analysisOptions);

    // Handle both array format and object format (with graph stats)
    let nodeResults;
    let graphStats = null;

    if (Array.isArray(results)) {
      nodeResults = results;
    } else if (results.nodes && results.graph) {
      nodeResults = results.nodes;
      graphStats = results.graph;
    } else {
      nodeResults = results;
    }

    this.log.info('Analysis complete', { 
      resultsCount: nodeResults.length,
      hasGraphStats: graphStats !== null
    });

    // Store results for later use (e.g., layouts that need stats)
    this.lastAnalysisResults = nodeResults;

    // IMPORTANT: Mutate existing node objects instead of creating new ones
    // D3's force simulation stores references to these objects in links
    nodes.forEach(node => {
      // Use string comparison to handle numeric IDs (e.g., movie "54", "1900", "1917")
      const nodeIdStr = String(node.id);
      const stats = nodeResults.find(r => String(r.id) === nodeIdStr);
      if (!stats) {
        this.log.warn('No stats found for node', { nodeId: node.id });
        node.centrality = 0.5;
        return;
      }

      // Use eigenvector centrality for node sizing (or degree as fallback)
      const centrality = stats.eigenvector !== undefined ? stats.eigenvector :
                        (stats.degree !== undefined ? stats.degree / 10 : 0.5);

      // Merge stats into existing node object (preserve D3's x, y, vx, vy)
      Object.assign(node, stats, { centrality });
    });

    this.log.debug('Nodes enriched', { sampleNode: nodes[0] });

    const returnValue = {
      nodes, // Return original array with mutated objects
      links // Return original links (they still reference the same node objects)
    };

    // Include graph stats if available
    if (graphStats) {
      returnValue.graphStats = graphStats;
    }

    return returnValue;
  }

  /**
   * Apply a layout algorithm to position nodes
   *
   * @param {String} layoutId - Layout algorithm ID from LAYOUT_REGISTRY
   * @param {Array} nodes - Array of nodes (possibly with analysis results)
   * @param {Array} links - Array of links
   * @param {Object} options - Layout options
   * @param {Number} options.width - Canvas width
   * @param {Number} options.height - Canvas height
   * @param {Function} options.onProgress - Progress callback
   * @returns {Promise<Object>} Map of nodeId -> {x, y}
   */
  async applyLayout(layoutId, nodes, links, options = {}) {
    // Ensure analyzer is initialized
    await this._ensureInitialized();

    this.log.debug('Applying layout', { layoutId });

    const width = options.width || 800;
    const height = options.height || 600;
    // Use provided scale, or compute from viewport
    // Larger scale = more spread out
    const scale = options.scale || Math.min(width, height) / 1.2;
    const center = options.center || { x: width / 2, y: height / 2 };

    this.log.info('Layout scale', { providedScale: options.scale, computedScale: scale, width, height });

    // Build graph
    const graph = this._buildGraph(nodes, links);

    // Create layout instance
    let layout;
    const layoutConfig = { scale, center };

    switch (layoutId) {
      case 'random':
        layout = new RandomLayout(graph, layoutConfig);
        break;

      case 'circular':
        layout = new CircularLayout(graph, layoutConfig);
        break;

      case 'spiral':
        layout = new SpiralLayout(graph, {
          ...layoutConfig,
          resolution: 0.15
        });
        break;

      case 'shell':
        // Build nodeProperties object from nodes if they have degree
        // Use plain Object instead of Map for safer worker transfer
        const nodeProps = {};
        let hasNodeProps = false;
        nodes.forEach(node => {
          if (node.degree !== undefined) {
            nodeProps[node.id] = { degree: node.degree };
            hasNodeProps = true;
          }
        });
        layout = new ShellLayout(graph, {
          ...layoutConfig,
          nodeProperties: hasNodeProps ? nodeProps : null
        });
        break;

      case 'spectral':
        // Check if we have the required eigenvector-laplacian stat
        // The stat is stored as node['eigenvector-laplacian'] = {laplacian_x, laplacian_y}
        const hasLaplacianData = nodes.some(n => {
          const laplacian = n['eigenvector-laplacian'];
          return laplacian && typeof laplacian === 'object' &&
                 laplacian.laplacian_x !== undefined &&
                 laplacian.laplacian_y !== undefined;
        });

        if (!hasLaplacianData) {
          throw new Error('Spectral layout requires eigenvector-laplacian analysis. Please run analysis with ["eigenvector-laplacian"] first.');
        }

        // Use plain Object instead of Map for safer worker transfer
        // (Maps can lose their prototype during structured cloning in some environments)
        const spectralProps = {};
        nodes.forEach(node => {
          const laplacian = node['eigenvector-laplacian'];
          if (laplacian && typeof laplacian === 'object' &&
              laplacian.laplacian_x !== undefined &&
              laplacian.laplacian_y !== undefined) {
            spectralProps[node.id] = {
              laplacian_x: laplacian.laplacian_x,
              laplacian_y: laplacian.laplacian_y
            };
          }
        });

        this.log.debug('Spectral layout nodeProperties:', {
          propCount: Object.keys(spectralProps).length,
          sampleKey: Object.keys(spectralProps)[0],
          sampleValue: spectralProps[Object.keys(spectralProps)[0]]
        });

        layout = new SpectralLayout(graph, {
          ...layoutConfig,
          nodeProperties: spectralProps
        });
        break;

      case 'force-directed':
        // Calculate optimal k for better node spacing
        // k is normalized (used during force calculation), then positions are rescaled
        // Using a larger multiplier (2.5x) to prevent condensation and spread nodes better
        const nodeCount = nodes.length;
        const optimalK = Math.sqrt(1.0 / nodeCount) * 2.5;
        
        layout = new ForceDirectedLayout(graph, {
          iterations: 50,
          k: optimalK,
          ...layoutConfig
        });
        break;

      case 'kamada-kawai':
        layout = new KamadaKawaiLayout(graph, {
          iterations: 300,
          ...layoutConfig
        });
        break;

      case 'bipartite':
        layout = new BipartiteLayout(graph, {
          align: 'vertical',
          ...layoutConfig
        });
        break;

      case 'multipartite':
        layout = new MultipartiteLayout(graph, {
          align: 'vertical',
          ...layoutConfig
        });
        break;

      case 'bfs':
        // Use first node as start
        const startNode = nodes[0]?.id || Array.from(graph.nodes)[0];
        layout = new BFSLayout(graph, {
          startNode,
          align: 'vertical',
          ...layoutConfig
        });
        break;

      case 'dfs':
        // Use first node as start for DFS tree
        const dfsStartNode = nodes[0]?.id || Array.from(graph.nodes)[0];
        layout = new DFSLayout(graph, {
          startNode: dfsStartNode,
          align: 'vertical',
          ...layoutConfig
        });
        break;

      case 'radial':
        // Find center node - use 'centerNode' from options, or find highest degree node
        let radialCenter = options.centerNode;
        if (!radialCenter) {
          // Find node with highest degree
          let maxDegree = -1;
          nodes.forEach(node => {
            // Count connections to this node
            const degree = links.filter(
              l => String(l.source) === String(node.id) || String(l.target) === String(node.id)
            ).length;
            if (degree > maxDegree) {
              maxDegree = degree;
              radialCenter = node.id;
            }
          });
        }
        // Extract size-aware spacing options
        const { nodeSizes, defaultNodeSize, nodePadding } = options;
        layout = new RadialLayout(graph, {
          centerNode: radialCenter,
          nodeSizes,           // Node ID -> size mapping for size-aware spacing
          defaultNodeSize,     // Default size for nodes not in nodeSizes
          nodePadding,         // Extra padding between nodes
          ...layoutConfig
        });
        break;

      default:
        throw new Error(`Unknown layout: ${layoutId}`);
    }

    // Compute positions (may use workers for complex layouts)
    const positions = await layout.getPositions({
      onProgress: options.onProgress
    });

    this.log.info('Layout complete', {
      positionCount: Object.keys(positions).length
    });

    return positions;
  }

  /**
   * Get available layouts
   * @returns {Array} Array of layout metadata
   */
  getAvailableLayouts() {
    return LAYOUT_REGISTRY.getAll();
  }

  /**
   * Get available community detection algorithms
   * @returns {Array} Array of algorithm metadata
   */
  getAvailableCommunityAlgorithms() {
    return COMMUNITY_REGISTRY.getAll();
  }

  /**
   * Detect communities in the graph
   *
   * @param {String} algorithmId - Algorithm ID from COMMUNITY_REGISTRY
   * @param {Array} nodes - Array of nodes
   * @param {Array} links - Array of links
   * @param {Object} options - Detection options
   * @param {Function} options.onProgress - Progress callback
   * @returns {Promise<Object>} {communities: {nodeId: communityId}, modularity, numCommunities}
   */
  async detectCommunities(algorithmId, nodes, links, options = {}) {
    // Ensure analyzer is initialized
    await this._ensureInitialized();

    this.log.debug('Detecting communities', { algorithmId });

    // Build graph
    const graph = this._buildGraph(nodes, links);

    // Get algorithm metadata
    const algorithmMeta = COMMUNITY_REGISTRY.get(algorithmId);
    if (!algorithmMeta) {
      throw new Error(`Unknown community detection algorithm: ${algorithmId}`);
    }

    // Create algorithm instance based on ID
    let algorithm;
    switch (algorithmId) {
      case 'louvain':
        algorithm = new LouvainAlgorithm(algorithmMeta.defaultOptions);
        break;
      default:
        throw new Error(`Unsupported algorithm: ${algorithmId}`);
    }

    // Run community detection
    const detector = new CommunityDetection(graph);
    const result = await detector.detectCommunities(algorithm, {
      onProgress: options.onProgress
    });

    this.log.info('Community detection complete', {
      numCommunities: result.numCommunities,
      modularity: result.modularity
    });

    // Mutate nodes to add community assignments
    nodes.forEach(node => {
      const communityId = result.communities[node.id];
      if (communityId !== undefined) {
        node.community = communityId;
      }
    });

    return result;
  }

  /**
   * Get worker affinity statistics
   * Useful for debugging and monitoring worker performance
   *
   * @returns {Object|null} Affinity stats or null if not initialized
   *
   * @example
   * const stats = analyzer.getAffinityStats();
   * console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
   * console.log(`Hits: ${stats.hits}, Misses: ${stats.misses}`);
   */
  getAffinityStats() {
    return WorkerManager.getAffinityStats();
  }

  /**
   * Get worker pool status
   *
   * @returns {Object|null} Worker pool status or null if not initialized
   */
  getWorkerStatus() {
    return WorkerManager.getStatus();
  }

  /**
   * Cleanup resources
   */
  async dispose() {
    if (this.analyzer) {
      try {
        await this.analyzer.dispose();
        this.analyzer = null;
      } catch (err) {
        this.log.warn('Error disposing analyzer', { error: err.message });
        this.analyzer = null;
      }
    }
  }
}

export default NetworkAnalyzer;
