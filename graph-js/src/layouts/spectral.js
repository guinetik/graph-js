/**
 * Spectral layout algorithm
 *
 * This module contains:
 * 1. Thin OOP wrapper (export as class)
 * 2. Pure compute function (exported for workers)
 *
 * Workers dynamically import the compute function.
 *
 * @module spectral
 */

import { Layout } from './layout.js';
import { reportProgress } from '../compute/compute-utils.js';

/**
 * Spectral layout - arranges nodes using Laplacian eigenvectors.
 *
 * Uses the 2nd and 3rd smallest eigenvectors of the graph Laplacian as X,Y coordinates.
 * This layout respects the graph's structural properties and creates layouts that
 * naturally reveal community structure and graph topology.
 *
 * **REQUIRES**: eigenvector-laplacian statistic must be computed on graph nodes
 *
 * The laplacian_x and laplacian_y values MUST be present on each node object.
 * Throw an error if they are missing.
 *
 * **Time Complexity**: O(V) (just using pre-computed eigenvectors)
 * **Use Case**: Community detection visualization, graph topology exploration
 *
 * @extends Layout
 * @class
 * @example
 * import { Graph } from '../graph.js';
 * import { SpectralLayout } from './spectral.js';
 * import { NetworkStats } from '../index.js';
 *
 * const graph = new Graph();
 * graph.addNodesFrom(['A', 'B', 'C', 'D', 'E']);
 * graph.addEdge('A', 'B');
 * graph.addEdge('B', 'C');
 *
 * // First compute eigenvector-laplacian stat
 * const stats = new NetworkStats();
 * const edges = [{ source: 'A', target: 'B' }, ...];
 * const results = await stats.analyze(edges, ['eigenvector-laplacian']);
 * // Apply results to graph nodes...
 *
 * const layout = new SpectralLayout(graph, {
 *   scale: 200
 * });
 *
 * const positions = await layout.getPositions(); // NOW ASYNC!
 */
export class SpectralLayout extends Layout {
  /**
   * Create a spectral layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {number} [options.scale=100] - Scale factor for positions
   * @param {Object} [options.center={x:0, y:0}] - Center point
   */
  constructor(graph, options = {}) {
    super(graph, {
      scale: 100,
      center: { x: 0, y: 0 },
      ...options
    }, {
      module: '../layouts/spectral.js',
      functionName: 'spectralCompute'
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}

export default SpectralLayout;

//=============================================================================
// COMPUTE FUNCTION (for workers)
//=============================================================================

/**
 * Compute spectral layout using Laplacian eigenvectors
 *
 * @param {Object} graphData - Serialized graph data with laplacian_x, laplacian_y on nodes
 * @param {Object} options - Layout options
 * @param {number} options.scale - Scale factor for positions (default: 1)
 * @param {Object} options.center - Center point {x, y} (default: {x: 0, y: 0})
 * @param {Function} progressCallback - Progress reporting callback
 * @returns {Object} Node ID -> { x, y }
 * @throws {Error} If eigenvector-laplacian data is not present on nodes
 */
export async function spectralCompute(graphData, options, progressCallback) {
  const nodes = Array.from(graphData.nodes || []);
  const n = nodes.length;

  console.log('[spectralCompute] Starting with', n, 'nodes');
  console.log('[spectralCompute] Raw options:', options);
  console.log('[spectralCompute] Raw options keys:', options ? Object.keys(options) : 'null');
  console.log('[spectralCompute] nodeProperties in options:', options?.nodeProperties);

  const {
    scale = 1,
    center = { x: 0, y: 0 },
    nodeProperties = null  // Map or Object of node ID -> {laplacian_x, laplacian_y}
  } = options || {};

  // Handle nodeProperties as either Map or plain Object (for worker transfer compatibility)
  // Maps may lose their prototype during structured cloning in some environments
  const isMap = nodeProperties instanceof Map;
  const isObject = nodeProperties && typeof nodeProperties === 'object' && !isMap;
  const hasNodeProps = isMap ? nodeProperties.size > 0 :
                       isObject ? Object.keys(nodeProperties).length > 0 : false;

  console.log('[spectralCompute] nodeProperties:',
    isMap ? `Map with ${nodeProperties.size} entries` :
    isObject ? `Object with ${Object.keys(nodeProperties).length} entries` : 'null');

  // Handle edge cases
  if (n === 0) {
    reportProgress(progressCallback, 1.0);
    return {};
  }

  if (n === 1) {
    const positions = { [nodes[0]]: { x: center.x, y: center.y } };
    reportProgress(progressCallback, 1.0);
    return positions;
  }

  // Extract eigenvector coordinates from node data
  const positions = {};
  const coords = [];  // Array of [x, y] for rescaling

  // Helper to get node properties (works with both Map and Object)
  const getNodeProps = (nodeId) => {
    if (isMap) return nodeProperties.get(nodeId);
    if (isObject) return nodeProperties[nodeId];
    return null;
  };

  console.log('[spectralCompute] Processing', n, 'nodes for eigenvector extraction');

  // Track nodes without laplacian data for fallback positioning
  const missingNodes = [];

  for (const node of nodes) {
    let x, y;

    // Try to get from nodeProperties first (DRY principle - pre-computed)
    if (hasNodeProps) {
      const props = getNodeProps(node);
      if (props && props.laplacian_x !== undefined && props.laplacian_y !== undefined) {
        x = props.laplacian_x;
        y = props.laplacian_y;
      } else {
        // Node missing laplacian data (likely disconnected or in separate component)
        // Use fallback position - will be placed near center with random offset
        missingNodes.push(node);
        x = (Math.random() - 0.5) * 0.1;  // Small random offset
        y = (Math.random() - 0.5) * 0.1;
        console.log(`[spectralCompute] Node "${node}" missing laplacian data, using fallback position`);
      }
    } else {
      throw new Error(
        `Spectral layout requires eigenvector-laplacian stat. ` +
        `Include 'eigenvector-laplacian' in analyze() features.`
      );
    }

    coords.push([x, y]);
  }

  if (missingNodes.length > 0) {
    console.log(`[spectralCompute] ${missingNodes.length} nodes missing laplacian data, used fallback positions`);
  }

  console.log('[spectralCompute] Extracted', coords.length, 'coordinates. Sample:', coords[0]);

  reportProgress(progressCallback, 0.5);

  // Rescale to fit in [-scale, scale]
  console.log('[spectralCompute] Starting rescaleLayout...');
  const rescaled = rescaleLayout(coords, scale);
  console.log('[spectralCompute] Rescaled. Sample:', rescaled[0]);

  reportProgress(progressCallback, 0.99);

  // Convert to position dictionary with center offset
  nodes.forEach((nodeId, i) => {
    positions[nodeId] = {
      x: rescaled[i][0] + center.x,
      y: rescaled[i][1] + center.y
    };
  });

  console.log('[spectralCompute] Created positions for', Object.keys(positions).length, 'nodes');

  reportProgress(progressCallback, 1.0);
  console.log('[spectralCompute] Completed successfully');
  return positions;
}

/**
 * Helper: Rescale layout positions to fit in [-scale, scale]
 * @param {Array} coords - Array of [x, y] positions
 * @param {number} scale - Target scale
 * @returns {Array} Rescaled positions
 */
function rescaleLayout(coords, scale = 1) {
  if (coords.length === 0) return coords;

  // Find bounding box
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  for (const [x, y] of coords) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  const width = maxX - minX || 1;
  const height = maxY - minY || 1;
  const maxDim = Math.max(width, height);

  // Rescale to [-scale, scale]
  const scaleFactor = (2 * scale) / maxDim;

  return coords.map(([x, y]) => [
    (x - minX - width / 2) * scaleFactor + scale,
    (y - minY - height / 2) * scaleFactor + scale
  ]);
}
