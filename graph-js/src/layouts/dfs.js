/**
 * DFS (Depth-First Search) layout algorithm
 *
 * This module contains:
 * 1. Thin OOP wrapper (export as class)
 * 2. Pure compute function (exported for workers)
 *
 * Workers dynamically import the compute function.
 *
 * @module dfs
 */

import { Layout } from './layout.js';
import { reconstructGraph, reportProgress } from '../compute/compute-utils.js';
import { rescaleLayout } from './layout-utils.js';

/**
 * DFS layout algorithm.
 *
 * Creates a nested tree layout based on depth-first search traversal.
 * Unlike BFS which creates horizontal layers, DFS creates a tree where
 * children are positioned below and centered under their parent.
 *
 * **Time Complexity**: O(n + m) for DFS + O(n) for positioning
 * **Use Case**: Tree structures, call graphs, recursive patterns, hierarchies
 *
 * @extends Layout
 * @class
 * @example
 * import { Graph } from '../graph.js';
 * import { DFSLayout } from './dfs.js';
 *
 * const graph = new Graph();
 * graph.addNodesFrom(['A', 'B', 'C', 'D', 'E']);
 * graph.addEdge('A', 'B');
 * graph.addEdge('A', 'C');
 * graph.addEdge('B', 'D');
 * graph.addEdge('C', 'E');
 *
 * const layout = new DFSLayout(graph, {
 *   startNode: 'A',
 *   align: 'vertical',
 *   scale: 200
 * });
 *
 * const positions = await layout.getPositions(); // NOW ASYNC!
 */
export class DFSLayout extends Layout {
  /**
   * Create a DFS layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {string} [options.startNode=null] - Starting node for DFS (first node if null)
   * @param {string} [options.align='vertical'] - 'vertical' (tree grows down) or 'horizontal' (tree grows right)
   * @param {number} [options.scale=1] - Scale factor for positions
   * @param {Object} [options.center={x:0, y:0}] - Center point
   * @param {number} [options.horizontalSpacing=1] - Spacing between sibling nodes
   * @param {number} [options.verticalSpacing=1] - Spacing between depth levels
   */
  constructor(graph, options = {}) {
    super(graph, {
      startNode: null,
      align: 'vertical',
      scale: 1,
      center: { x: 0, y: 0 },
      horizontalSpacing: 1,
      verticalSpacing: 1,
      ...options
    }, {
      module: '../layouts/dfs.js',
      functionName: 'dfsCompute'
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}

export default DFSLayout;

//=============================================================================
// COMPUTE FUNCTION (for workers)
//=============================================================================

/**
 * Compute DFS layout with nested tree positioning
 *
 * @param {Object} graphData - Serialized graph data
 * @param {Object} options - Layout options
 * @param {string} options.startNode - Starting node for DFS
 * @param {string} options.align - 'vertical' or 'horizontal'
 * @param {number} options.scale - Scale factor for final positions
 * @param {Object} options.center - Center point {x, y}
 * @param {number} options.horizontalSpacing - Spacing between siblings
 * @param {number} options.verticalSpacing - Spacing between levels
 * @param {Function} progressCallback - Progress reporting callback
 * @returns {Object} Node ID -> { x, y }
 */
export async function dfsCompute(graphData, options, progressCallback) {
  const graph = reconstructGraph(graphData);
  const {
    startNode = null,
    align = 'vertical',
    scale = 1,
    center = { x: 0, y: 0 },
    horizontalSpacing = 1,
    verticalSpacing = 1
  } = options || {};

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

  // Determine start node
  let start = startNode;
  if (!start || !nodes.includes(start)) {
    start = nodes[0];
  }

  reportProgress(progressCallback, 0.2);

  // Build DFS tree structure
  const { tree, roots, depths, maxDepth } = buildDFSTree(graph, start, nodes);

  reportProgress(progressCallback, 0.5);

  // Calculate subtree widths (bottom-up)
  const subtreeWidths = calculateSubtreeWidths(tree, roots);

  reportProgress(progressCallback, 0.7);

  // Position nodes using nested tree algorithm
  const positions = positionNodes(tree, roots, depths, maxDepth, subtreeWidths, {
    horizontalSpacing,
    verticalSpacing
  });

  reportProgress(progressCallback, 0.85);

  // Convert to array format for rescaling
  const nodeOrder = Object.keys(positions);
  const positionsDict = {};
  nodeOrder.forEach(node => {
    positionsDict[node] = positions[node];
  });

  // Rescale to fit within scale and center
  const rescaledDict = rescaleLayout(positionsDict, nodeOrder, scale, center);

  reportProgress(progressCallback, 0.95);

  // Handle horizontal/vertical swap
  if (align === 'horizontal') {
    Object.keys(rescaledDict).forEach(node => {
      const temp = rescaledDict[node].x;
      rescaledDict[node].x = rescaledDict[node].y;
      rescaledDict[node].y = temp;
    });
  }

  reportProgress(progressCallback, 1.0);
  return rescaledDict;
}

/**
 * Build DFS tree from graph
 * Uses iterative DFS with explicit stack (worker-safe, no recursion)
 *
 * @param {Object} graph - Graph object
 * @param {string} startNode - Starting node
 * @param {Array} allNodes - All nodes in graph
 * @returns {Object} Tree structure with parent-children relationships
 */
function buildDFSTree(graph, startNode, allNodes) {
  const tree = new Map(); // node -> { parent, children }
  const visited = new Set();
  const depths = new Map();
  const roots = [];
  let maxDepth = 0;

  // Initialize tree structure for all nodes
  allNodes.forEach(node => {
    tree.set(node, { parent: null, children: [] });
  });

  // Process starting node first
  const nodesToProcess = [startNode];

  // Add remaining nodes to handle disconnected components
  allNodes.forEach(node => {
    if (node !== startNode) {
      nodesToProcess.push(node);
    }
  });

  // Process each potential root
  for (const rootCandidate of nodesToProcess) {
    if (visited.has(rootCandidate)) continue;

    // This is a root of a tree (either startNode or disconnected component)
    roots.push(rootCandidate);

    // Iterative DFS using explicit stack
    // Stack entries: [node, depth]
    const stack = [[rootCandidate, 0]];

    while (stack.length > 0) {
      const [node, depth] = stack.pop();

      if (visited.has(node)) continue;
      visited.add(node);
      depths.set(node, depth);
      maxDepth = Math.max(maxDepth, depth);

      // Get unvisited neighbors
      const neighbors = graph.getNeighbors(node) || [];
      const unvisitedNeighbors = neighbors.filter(n => !visited.has(n));

      // Add unvisited neighbors as children
      // Reverse to maintain consistent ordering (first neighbor processed first)
      for (let i = unvisitedNeighbors.length - 1; i >= 0; i--) {
        const neighbor = unvisitedNeighbors[i];
        // Set parent-child relationship
        tree.get(node).children.push(neighbor);
        tree.get(neighbor).parent = node;
        stack.push([neighbor, depth + 1]);
      }
    }
  }

  return { tree, roots, depths, maxDepth };
}

/**
 * Calculate subtree widths (number of leaf positions needed)
 * A leaf node has width 1, a parent has width = sum of children widths
 *
 * @param {Map} tree - Tree structure
 * @param {Array} roots - Root nodes
 * @returns {Map} Node -> subtree width
 */
function calculateSubtreeWidths(tree, roots) {
  const widths = new Map();

  // Post-order traversal to calculate widths bottom-up
  function calculateWidth(node) {
    const nodeData = tree.get(node);
    const children = nodeData.children;

    if (children.length === 0) {
      // Leaf node
      widths.set(node, 1);
      return 1;
    }

    // Parent node: sum of children widths
    let totalWidth = 0;
    for (const child of children) {
      totalWidth += calculateWidth(child);
    }
    widths.set(node, totalWidth);
    return totalWidth;
  }

  // Calculate for each tree
  for (const root of roots) {
    calculateWidth(root);
  }

  return widths;
}

/**
 * Position nodes using layer-based approach
 * Nodes are grouped by DFS depth and spread horizontally
 *
 * @param {Map} tree - Tree structure
 * @param {Array} roots - Root nodes
 * @param {Map} depths - Node depths
 * @param {number} maxDepth - Maximum depth
 * @param {Map} widths - Subtree widths
 * @param {Object} spacing - Spacing options
 * @returns {Object} Node ID -> {x, y}
 */
function positionNodes(tree, roots, depths, maxDepth, widths, spacing) {
  const positions = {};
  const { horizontalSpacing, verticalSpacing } = spacing;

  // Group nodes by depth level
  const nodesByDepth = new Map();
  for (const [node, depth] of depths.entries()) {
    if (!nodesByDepth.has(depth)) {
      nodesByDepth.set(depth, []);
    }
    nodesByDepth.get(depth).push(node);
  }

  // Calculate effective spacing
  const effectiveVerticalSpacing = verticalSpacing * 2;
  const effectiveHorizontalSpacing = horizontalSpacing;

  // Position nodes layer by layer
  for (let depth = 0; depth <= maxDepth; depth++) {
    const nodesAtDepth = nodesByDepth.get(depth) || [];
    const numNodes = nodesAtDepth.length;

    if (numNodes === 0) continue;

    // Sort nodes by parent position for visual coherence
    nodesAtDepth.sort((a, b) => {
      const parentA = tree.get(a).parent;
      const parentB = tree.get(b).parent;
      if (parentA === parentB) return 0;
      if (!parentA) return -1;
      if (!parentB) return 1;
      const posA = positions[parentA];
      const posB = positions[parentB];
      if (posA && posB) return posA.x - posB.x;
      return 0;
    });

    // Spread nodes horizontally
    nodesAtDepth.forEach((node, idx) => {
      const x = (idx - (numNodes - 1) / 2) * effectiveHorizontalSpacing;
      const y = depth * effectiveVerticalSpacing;
      positions[node] = { x, y };
    });
  }

  // Normalize positions to [-1, 1] range
  const allX = Object.values(positions).map(p => p.x);
  const allY = Object.values(positions).map(p => p.y);

  if (allX.length === 0) return positions;

  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const rangeX = (maxX - minX) || 1;
  const rangeY = (maxY - minY) || 1;

  // Scale X and Y independently to fill viewport
  Object.keys(positions).forEach(node => {
    positions[node] = {
      x: (positions[node].x - centerX) / (rangeX / 2),
      y: (positions[node].y - centerY) / (rangeY / 2)
    };
  });

  return positions;
}
