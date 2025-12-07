/**
 * Radial layout algorithm
 *
 * This module contains:
 * 1. Thin OOP wrapper (export as class)
 * 2. Pure compute function (exported for workers)
 *
 * Workers dynamically import the compute function.
 *
 * @module radial
 */

import { Layout } from './layout.js';
import { reconstructGraph, reportProgress } from '../compute/compute-utils.js';

/**
 * Radial layout algorithm.
 *
 * Positions nodes in concentric circles based on breadth-first search distance
 * from a center node. The center node is placed at the origin, and nodes at
 * increasing distances are placed in larger circles.
 *
 * This layout is ideal for:
 * - Star networks (one central hub with many spokes)
 * - Ego networks (social network around a focal person)
 * - Any graph with a natural "center" node (like Kevin Bacon in a movie network)
 *
 * **Time Complexity**: O(n + m) for BFS + O(n) for positioning
 * **Use Case**: Ego networks, star topology, hierarchical radial visualization
 *
 * @extends Layout
 * @class
 * @example
 * import { Graph } from '../graph.js';
 * import { RadialLayout } from './radial.js';
 *
 * const graph = new Graph();
 * graph.addNodesFrom(['Kevin', 'Movie1', 'Actor1', 'Movie2', 'Actor2']);
 * graph.addEdge('Kevin', 'Movie1');
 * graph.addEdge('Kevin', 'Movie2');
 * graph.addEdge('Movie1', 'Actor1');
 * graph.addEdge('Movie2', 'Actor2');
 *
 * const layout = new RadialLayout(graph, {
 *   centerNode: 'Kevin',
 *   scale: 300
 * });
 *
 * const positions = await layout.getPositions();
 */
export class RadialLayout extends Layout {
  /**
   * Create a Radial layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {string} [options.centerNode=null] - Center node (first node if null, or highest degree)
   * @param {number} [options.scale=1] - Scale factor for positions (radius of outermost ring)
   * @param {Object} [options.center={x:0, y:0}] - Center point
   * @param {number} [options.startAngle=0] - Starting angle in radians (0 = right, PI/2 = top)
   * @param {boolean} [options.sortByDegree=true] - Sort nodes within rings by degree
   */
  constructor(graph, options = {}) {
    super(graph, {
      centerNode: null,
      scale: 1,
      center: { x: 0, y: 0 },
      startAngle: -Math.PI / 2, // Start from top
      sortByDegree: true,
      ...options
    }, {
      module: '../layouts/radial.js',
      functionName: 'radialCompute'
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}

export default RadialLayout;

//=============================================================================
// COMPUTE FUNCTION (for workers)
//=============================================================================

/**
 * Compute Radial layout
 *
 * @param {Object} graphData - Serialized graph data
 * @param {Object} options - Layout options
 * @param {string} options.centerNode - Center node for the layout
 * @param {number} options.scale - Scale factor for final positions (max radius)
 * @param {Object} options.center - Center point {x, y}
 * @param {number} options.startAngle - Starting angle in radians
 * @param {boolean} options.sortByDegree - Sort nodes within rings by degree
 * @param {Object} options.nodeSizes - Map of node ID -> size (for size-aware spacing)
 * @param {number} options.defaultNodeSize - Default node size if not in nodeSizes (default: 8)
 * @param {number} options.nodePadding - Extra padding between nodes (default: 4)
 * @param {Function} progressCallback - Progress reporting callback
 * @returns {Object} Node ID -> { x, y }
 */
export async function radialCompute(graphData, options, progressCallback) {
  const graph = reconstructGraph(graphData);
  const {
    centerNode = null,
    scale = 1,
    center = { x: 0, y: 0 },
    startAngle = -Math.PI / 2,
    sortByDegree = true,
    nodeSizes = {},           // Node ID -> size mapping
    defaultNodeSize = 8,      // Default size for nodes not in nodeSizes
    nodePadding = 4           // Extra space between nodes
  } = options || {};

  // Debug: Log received options
  const nodeSizeCount = Object.keys(nodeSizes).length;
  const sampleSizes = Object.entries(nodeSizes).slice(0, 3);
  console.log('[radialCompute] Options received:', {
    scale,
    nodeSizeCount,
    defaultNodeSize,
    nodePadding,
    sampleSizes: sampleSizes.map(([id, size]) => `${id}: ${size}`)
  });

  const nodes = Array.from(graph.nodes);
  const n = nodes.length;

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

  reportProgress(progressCallback, 0.1);

  // Determine center node - use provided, or find highest degree node
  let centerNodeId = centerNode;
  if (!centerNodeId || !nodes.includes(centerNodeId)) {
    // Find node with highest degree
    let maxDegree = -1;
    nodes.forEach(node => {
      const degree = (graph.getNeighbors(node) || []).length;
      if (degree > maxDegree) {
        maxDegree = degree;
        centerNodeId = node;
      }
    });
  }

  reportProgress(progressCallback, 0.2);

  // Perform BFS to get rings (nodes at same distance)
  const rings = bfsRings(graph, centerNodeId);

  reportProgress(progressCallback, 0.5);

  // Handle unreachable nodes (put in outermost ring)
  const allNodesInRings = new Set();
  rings.forEach(ring => {
    ring.forEach(node => allNodesInRings.add(node));
  });

  if (allNodesInRings.size !== n) {
    const unreachable = nodes.filter(node => !allNodesInRings.has(node));
    if (unreachable.length > 0) {
      rings.push(unreachable);
    }
  }

  reportProgress(progressCallback, 0.6);

  // Calculate degree for each node (for sorting within rings)
  const nodeDegrees = new Map();
  nodes.forEach(node => {
    nodeDegrees.set(node, (graph.getNeighbors(node) || []).length);
  });

  // Sort nodes within each ring by degree (optional) for better visual grouping
  if (sortByDegree) {
    rings.forEach(ring => {
      ring.sort((a, b) => nodeDegrees.get(b) - nodeDegrees.get(a));
    });
  }

  reportProgress(progressCallback, 0.7);

  // Position nodes in concentric circles
  const positions = {};
  const numRings = rings.length;

  // Center node is at the center
  positions[centerNodeId] = { x: center.x, y: center.y };

  // Spacing parameters - designed to work with any graph
  const minFirstRingRadius = scale * 0.5;   // First ring must be at least 50% of scale from center
  const minRingGap = scale * 0.3;      // Minimum 30% gap between consecutive rings

  // Helper to get node size
  const getNodeSize = (nodeId) => nodeSizes[nodeId] || defaultNodeSize;

  let previousRadius = 0;

  // Position each ring
  rings.forEach((ring, ringIdx) => {
    if (ringIdx === 0) {
      // Ring 0 is just the center node, already positioned
      return;
    }

    const nodesInRing = ring.length;

    // Calculate total arc length needed for all nodes in this ring
    // Each node needs space for its diameter plus padding to next node
    // totalArc = sum of (diameter + padding) for all nodes
    const totalArcNeeded = ring.reduce((sum, nodeId) => {
      const nodeSize = getNodeSize(nodeId);
      const diameter = nodeSize * 2;  // Full diameter
      return sum + diameter + nodePadding;
    }, 0);

    // Calculate minimum radius needed: circumference = 2 * PI * radius
    // We need circumference >= totalArcNeeded
    // So: radius >= totalArcNeeded / (2 * PI)
    const radiusForSpacing = totalArcNeeded / (2 * Math.PI);

    // Minimum radius based on ring index (ensures spacing from center and previous rings)
    const minRadiusForPosition = ringIdx === 1
      ? minFirstRingRadius  // First ring: use minimum first ring radius
      : previousRadius + minRingGap;  // Other rings: at least minRingGap from previous

    // Use the LARGER of: position-based minimum OR spacing-based minimum
    const radius = Math.max(minRadiusForPosition, radiusForSpacing);

    // Debug: Log ring calculations
    if (ringIdx <= 4) {  // Only log first few rings
      console.log(`[radialCompute] Ring ${ringIdx}:`, {
        nodesInRing,
        totalArcNeeded: Math.round(totalArcNeeded),
        radiusForSpacing: Math.round(radiusForSpacing),
        minRadiusForPosition: Math.round(minRadiusForPosition),
        finalRadius: Math.round(radius)
      });
    }

    previousRadius = radius;

    // Spread nodes evenly around the circle
    ring.forEach((node, nodeIdx) => {
      const angle = startAngle + (2 * Math.PI * nodeIdx) / nodesInRing;
      positions[node] = {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle)
      };
    });
  });

  reportProgress(progressCallback, 0.95);

  // Verify all nodes have positions
  nodes.forEach(node => {
    if (!positions[node]) {
      // Fallback - shouldn't happen but just in case
      positions[node] = { x: center.x, y: center.y };
    }
  });

  reportProgress(progressCallback, 1.0);
  return positions;
}

/**
 * Perform BFS from a center node and return nodes grouped by distance (rings)
 *
 * @param {Graph} graph - Graph with adjacency structure
 * @param {string} centerNode - Center node
 * @returns {Array<Array<string>>} Array of rings, where ring[i] contains nodes at distance i
 */
function bfsRings(graph, centerNode) {
  const rings = [];
  const distance = new Map();
  const queue = [centerNode];
  let queueIdx = 0;

  distance.set(centerNode, 0);
  let currentDist = 0;
  let currentRing = [];

  while (queueIdx < queue.length) {
    const node = queue[queueIdx];
    const nodeDist = distance.get(node);

    // If we've moved to a new distance level, save current ring and start new one
    if (nodeDist > currentDist) {
      if (currentRing.length > 0) {
        rings.push([...currentRing]);
        currentRing = [];
      }
      currentDist = nodeDist;
    }

    currentRing.push(node);

    // Add unvisited neighbors to queue
    const neighbors = graph.getNeighbors(node) || [];
    neighbors.forEach(neighbor => {
      if (!distance.has(neighbor)) {
        distance.set(neighbor, nodeDist + 1);
        queue.push(neighbor);
      }
    });

    queueIdx++;
  }

  // Don't forget the last ring
  if (currentRing.length > 0) {
    rings.push([...currentRing]);
  }

  return rings;
}
