/**
 * SigmaAdapter - Convert between graph-js and Sigma.js/Graphology formats
 *
 * Sigma.js is a WebGL-based graph renderer that uses Graphology as its data layer.
 * This adapter converts graph-js GraphData to Graphology format for rendering with Sigma.
 *
 * @module adapters/sigma
 *
 * @example
 * import { SigmaAdapter } from '@guinetik/graph-js';
 * import Sigma from 'sigma';
 *
 * // Convert graph-js data to Graphology for Sigma
 * const { graph, settings } = SigmaAdapter.toGraphology(graphData, {
 *   positions: layoutPositions,
 *   nodeStats: analysisResults,
 *   sizeBy: 'degree',
 *   colorBy: 'community'
 * });
 *
 * // Create Sigma instance
 * const sigma = new Sigma(graph, container, settings);
 */

import Graph from 'graphology';
import { Adapter } from './adapter.js';
import { createLogger } from '@guinetik/logger';

const log = createLogger({
  prefix: 'SigmaAdapter',
  level: 'info'
});

/**
 * Default color schemes for node coloring
 */
const COLOR_SCHEMES = {
  category10: [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
  ],
  pastel: [
    '#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6',
    '#ffff99', '#b15928', '#66c2a5', '#fc8d62', '#8da0cb'
  ],
  viridis: [
    '#440154', '#482878', '#3e4989', '#31688e', '#26828e',
    '#1f9e89', '#35b779', '#6ece58', '#b5de2b', '#fde725'
  ]
};

/**
 * Default Sigma.js settings optimized for graph-js integration
 */
const DEFAULT_SIGMA_SETTINGS = {
  allowInvalidContainer: true,
  renderLabels: true,
  labelRenderedSizeThreshold: 6,
  labelFont: 'Arial',
  labelSize: 12,
  labelWeight: 'normal',
  defaultNodeColor: '#999',
  defaultEdgeColor: '#ccc',
  defaultNodeType: 'circle',
  defaultEdgeType: 'line',
  minCameraRatio: 0.1,
  maxCameraRatio: 10
};

/**
 * SigmaAdapter - Convert between graph-js and Graphology/Sigma formats
 *
 * @extends Adapter
 */
export class SigmaAdapter extends Adapter {
  /**
   * Convert graph-js GraphData to Graphology format for Sigma.js
   *
   * @param {import('../models/types.js').GraphData} graphData - Standard graph data
   * @param {Object} [options={}] - Conversion options
   * @param {Object} [options.positions] - Node positions { nodeId: { x, y } }
   * @param {Array} [options.nodeStats] - Node statistics from analysis [{ id, degree, ... }]
   * @param {string} [options.sizeBy] - Property to map to node size
   * @param {number} [options.minSize=3] - Minimum node size
   * @param {number} [options.maxSize=15] - Maximum node size
   * @param {string} [options.colorBy] - Property to map to node color
   * @param {string} [options.colorScheme='category10'] - Color scheme name
   * @param {Object} [options.sigmaSettings] - Custom Sigma settings to merge
   * @returns {{ graph: Graph, settings: Object }} Graphology graph and Sigma settings
   *
   * @example
   * const { graph, settings } = SigmaAdapter.toGraphology(graphData, {
   *   positions: { 'A': { x: 100, y: 200 } },
   *   nodeStats: [{ id: 'A', degree: 5, eigenvector: 0.45 }],
   *   sizeBy: 'degree',
   *   colorBy: 'community'
   * });
   */
  static toGraphology(graphData, options = {}) {
    this.validateGraphData(graphData);

    const {
      positions = {},
      nodeStats = [],
      sizeBy = null,
      minSize = 3,
      maxSize = 15,
      colorBy = null,
      colorScheme = 'category10',
      sigmaSettings = {}
    } = options;

    // Create Graphology graph
    const graph = new Graph({ type: 'undirected', allowSelfLoops: false });

    // Create stats lookup map for O(1) access
    const statsMap = new Map();
    for (const stat of nodeStats) {
      statsMap.set(String(stat.id), stat);
    }

    // Compute size scale if needed
    let sizeScale = null;
    if (sizeBy && nodeStats.length > 0) {
      sizeScale = this._computeSizeScale(nodeStats, sizeBy, minSize, maxSize);
    }

    // Compute color map if needed
    let colorMap = null;
    if (colorBy && nodeStats.length > 0) {
      colorMap = this._computeColorMap(nodeStats, colorBy, colorScheme);
    }

    // Add nodes
    for (const node of graphData.nodes) {
      const nodeId = String(node.id);
      const pos = positions[nodeId] || { x: Math.random() * 100, y: Math.random() * 100 };
      const stats = statsMap.get(nodeId) || {};

      const attrs = {
        x: pos.x,
        y: pos.y,
        label: String(node.label || node.id),
        size: sizeScale && stats[sizeBy] !== undefined
          ? sizeScale(stats[sizeBy])
          : 5,
        color: colorMap && stats[colorBy] !== undefined
          ? colorMap(stats[colorBy])
          : COLOR_SCHEMES.category10[0],
        // Preserve original node properties
        ...node,
        // Add computed stats
        ...stats
      };

      graph.addNode(nodeId, attrs);
    }

    // Add edges
    for (const edge of graphData.edges) {
      const sourceId = String(edge.source);
      const targetId = String(edge.target);

      // Skip self-loops and duplicates
      if (sourceId === targetId) continue;
      if (graph.hasEdge(sourceId, targetId)) continue;

      try {
        graph.addEdge(sourceId, targetId, {
          weight: edge.weight || 1,
          size: Math.max(1, Math.log(edge.weight || 1) + 1),
          color: '#ccc',
          ...edge
        });
      } catch (err) {
        log.debug('Skipping edge', { source: sourceId, target: targetId, error: err.message });
      }
    }

    log.info('Created Graphology graph', {
      nodes: graph.order,
      edges: graph.size
    });

    return {
      graph,
      settings: { ...DEFAULT_SIGMA_SETTINGS, ...sigmaSettings }
    };
  }

  /**
   * Convert Graphology graph back to graph-js GraphData format
   *
   * @param {Graph} graphologyGraph - Graphology graph instance
   * @returns {import('../models/types.js').GraphData} Standard graph data
   *
   * @example
   * const graphData = SigmaAdapter.fromGraphology(sigmaGraph);
   */
  static fromGraphology(graphologyGraph) {
    const nodes = [];
    const edges = [];

    graphologyGraph.forEachNode((id, attrs) => {
      nodes.push({
        id: String(id),
        ...attrs
      });
    });

    graphologyGraph.forEachEdge((edgeId, attrs, source, target) => {
      edges.push({
        source: String(source),
        target: String(target),
        weight: attrs.weight || 1,
        ...attrs
      });
    });

    return { nodes, edges };
  }

  /**
   * Update node attributes in a Graphology graph
   * Useful for updating positions or stats after analysis
   *
   * @param {Graph} graph - Graphology graph instance
   * @param {Object} updates - Node updates { nodeId: { x, y, size, color, ... } }
   *
   * @example
   * SigmaAdapter.updateNodes(graph, {
   *   'A': { x: 150, y: 250, size: 10 }
   * });
   */
  static updateNodes(graph, updates) {
    for (const [nodeId, attrs] of Object.entries(updates)) {
      if (graph.hasNode(nodeId)) {
        graph.updateNodeAttributes(nodeId, prevAttrs => ({
          ...prevAttrs,
          ...attrs
        }));
      }
    }
  }

  /**
   * Apply layout positions to a Graphology graph
   *
   * @param {Graph} graph - Graphology graph instance
   * @param {Object} positions - Positions { nodeId: { x, y } }
   * @param {boolean} [animate=false] - Whether to smoothly transition (requires Sigma refresh)
   *
   * @example
   * SigmaAdapter.applyLayout(graph, layoutPositions);
   */
  static applyLayout(graph, positions, animate = false) {
    for (const [nodeId, pos] of Object.entries(positions)) {
      if (graph.hasNode(nodeId)) {
        graph.setNodeAttribute(nodeId, 'x', pos.x);
        graph.setNodeAttribute(nodeId, 'y', pos.y);
      }
    }
  }

  /**
   * Update visual encoding (size/color) based on node statistics
   *
   * @param {Graph} graph - Graphology graph instance
   * @param {Array} nodeStats - Node statistics array
   * @param {Object} options - Encoding options
   * @param {string} [options.sizeBy] - Property for size
   * @param {string} [options.colorBy] - Property for color
   * @param {string} [options.colorScheme='category10'] - Color scheme
   * @param {number} [options.minSize=3] - Minimum size
   * @param {number} [options.maxSize=15] - Maximum size
   */
  static updateVisualEncoding(graph, nodeStats, options = {}) {
    const {
      sizeBy = null,
      colorBy = null,
      colorScheme = 'category10',
      minSize = 3,
      maxSize = 15
    } = options;

    // Compute scales
    const sizeScale = sizeBy ? this._computeSizeScale(nodeStats, sizeBy, minSize, maxSize) : null;
    const colorMap = colorBy ? this._computeColorMap(nodeStats, colorBy, colorScheme) : null;

    // Create stats lookup
    const statsMap = new Map();
    for (const stat of nodeStats) {
      statsMap.set(String(stat.id), stat);
    }

    // Update each node
    graph.forEachNode((nodeId) => {
      const stats = statsMap.get(nodeId);
      if (!stats) return;

      if (sizeScale && stats[sizeBy] !== undefined) {
        graph.setNodeAttribute(nodeId, 'size', sizeScale(stats[sizeBy]));
      }

      if (colorMap && stats[colorBy] !== undefined) {
        graph.setNodeAttribute(nodeId, 'color', colorMap(stats[colorBy]));
      }
    });
  }

  /**
   * Compute size scale function
   * @private
   */
  static _computeSizeScale(nodeStats, property, minSize, maxSize) {
    const values = nodeStats
      .map(s => s[property])
      .filter(v => v !== undefined && v !== null && !isNaN(v));

    if (values.length === 0) {
      return () => (minSize + maxSize) / 2;
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return (value) => {
      const normalized = (value - min) / range;
      // Use sqrt scale for better visual perception
      return minSize + Math.sqrt(normalized) * (maxSize - minSize);
    };
  }

  /**
   * Compute color map function
   * @private
   */
  static _computeColorMap(nodeStats, property, schemeName) {
    const scheme = COLOR_SCHEMES[schemeName] || COLOR_SCHEMES.category10;
    const values = nodeStats
      .map(s => s[property])
      .filter(v => v !== undefined && v !== null);

    const uniqueValues = [...new Set(values)];
    const isNumeric = uniqueValues.every(v => typeof v === 'number');

    if (isNumeric && uniqueValues.length > scheme.length) {
      // Continuous scale for many numeric values
      const min = Math.min(...uniqueValues);
      const max = Math.max(...uniqueValues);
      const range = max - min || 1;

      return (value) => {
        const normalized = (value - min) / range;
        const index = Math.floor(normalized * (scheme.length - 1));
        return scheme[Math.min(index, scheme.length - 1)];
      };
    } else {
      // Categorical: assign colors to unique values
      const colorAssignment = new Map();
      uniqueValues.forEach((val, idx) => {
        colorAssignment.set(val, scheme[idx % scheme.length]);
      });

      return (value) => colorAssignment.get(value) || scheme[0];
    }
  }

  /**
   * Get available color schemes
   *
   * @returns {string[]} Array of color scheme names
   */
  static getColorSchemes() {
    return Object.keys(COLOR_SCHEMES);
  }

  /**
   * Get default Sigma settings
   *
   * @returns {Object} Default settings object
   */
  static getDefaultSettings() {
    return { ...DEFAULT_SIGMA_SETTINGS };
  }
}

export default SigmaAdapter;
