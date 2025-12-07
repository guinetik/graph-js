/**
 * 3D Force-directed layout algorithm
 *
 * This module contains:
 * 1. Thin OOP wrapper (export as class)
 * 2. Pure compute function (exported for workers)
 *
 * Workers dynamically import the compute function.
 *
 * @module force-directed-3d
 */

import { Layout } from './layout.js';
import { reconstructGraph, reportProgress } from '../compute/compute-utils.js';
import { rescaleLayout3D, randomLayout3D } from './layout-utils.js';

/**
 * 3D Force-directed layout using Fruchterman-Reingold algorithm.
 *
 * Creates a visually pleasing 3D layout by simulating physical forces:
 * - Repulsive forces between all node pairs (like electrical charges)
 * - Attractive forces between connected nodes (like springs)
 * - Gravitational force pulling nodes toward center (prevents drift in 3D)
 *
 * **Time Complexity**: O(iterations * V²)
 * **Use Case**: 3D visualization, VR/AR exploration, large network overview
 *
 * @extends Layout
 * @class
 * @example
 * import { Graph } from '../graph.js';
 * import { ForceDirected3DLayout } from './force-directed-3d.js';
 *
 * const graph = new Graph();
 * graph.addNodesFrom(['A', 'B', 'C', 'D']);
 * graph.addEdge('A', 'B');
 * graph.addEdge('B', 'C');
 * graph.addEdge('C', 'D');
 *
 * const layout = new ForceDirected3DLayout(graph, {
 *   iterations: 50,
 *   gravity: 1,
 *   scale: 100
 * });
 *
 * const positions = await layout.getPositions();
 * // positions = { 'A': {x: 10, y: -20, z: 5}, ... }
 */
export class ForceDirected3DLayout extends Layout {
  /**
   * Create a 3D force-directed layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {number} [options.iterations=50] - Number of iterations to run
   * @param {number} [options.k=null] - Optimal distance between nodes (auto-calculated if null)
   * @param {number} [options.scale=1] - Scale factor for positions
   * @param {Object} [options.center={x:0, y:0, z:0}] - Center point in 3D space
   * @param {Object} [options.initialPositions=null] - Initial node positions (can be 2D or 3D)
   * @param {number} [options.threshold=1e-4] - Convergence threshold
   * @param {number} [options.gravity=1] - Gravitational pull toward center (prevents drift)
   */
  constructor(graph, options = {}) {
    super(graph, {
      iterations: 50,
      k: null,
      scale: 1,
      center: { x: 0, y: 0, z: 0 },
      initialPositions: null,
      threshold: 1e-4,
      gravity: 1,
      ...options
    }, {
      module: '../layouts/force-directed-3d.js',
      functionName: 'forceDirected3DCompute'
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}

export default ForceDirected3DLayout;

//=============================================================================
// COMPUTE FUNCTION (for workers)
//=============================================================================

/**
 * Compute 3D force-directed layout using Fruchterman-Reingold algorithm
 *
 * Based on the reference implementation with:
 * - Repulsive forces: k²/distance between all node pairs
 * - Attractive forces: distance²/k between connected nodes
 * - Gravitational force: pulls nodes toward center
 * - Temperature-based cooling for convergence
 *
 * @param {Object} graphData - Serialized graph data
 * @param {Object} options - Layout options
 * @param {number} options.iterations - Number of iterations (default: 50)
 * @param {number} options.k - Optimal distance between nodes (default: auto-calculated)
 * @param {number} options.scale - Scale factor for final positions (default: 1)
 * @param {Object} options.center - Center point {x, y, z} (default: {x: 0, y: 0, z: 0})
 * @param {Object} options.initialPositions - Initial positions (2D or 3D)
 * @param {number} options.threshold - Convergence threshold (default: 1e-4)
 * @param {number} options.gravity - Gravitational strength (default: 1)
 * @param {Function} progressCallback - Progress reporting callback
 * @returns {Object} Node ID -> { x, y, z }
 */
export async function forceDirected3DCompute(graphData, options, progressCallback) {
  const graph = reconstructGraph(graphData);
  const {
    iterations = 50,
    k = null,
    scale = 1,
    center = { x: 0, y: 0, z: 0 },
    initialPositions = null,
    threshold = 1e-4,
    gravity = 1
  } = options || {};

  const nodes = Array.from(graph.nodes);
  const n = nodes.length;

  // Handle edge cases
  if (n === 0) {
    reportProgress(progressCallback, 1.0);
    return {};
  }

  if (n === 1) {
    const positions = { [nodes[0]]: { x: center.x, y: center.y, z: center.z } };
    reportProgress(progressCallback, 1.0);
    return positions;
  }

  reportProgress(progressCallback, 0.05);

  // Initialize positions
  let positions = {};
  if (initialPositions) {
    // Support warm-start from 2D positions (add random z)
    nodes.forEach(nodeId => {
      const initPos = initialPositions[nodeId];
      if (initPos) {
        positions[nodeId] = {
          x: initPos.x,
          y: initPos.y,
          z: initPos.z !== undefined ? initPos.z : Math.random()
        };
      } else {
        positions[nodeId] = {
          x: Math.random(),
          y: Math.random(),
          z: Math.random()
        };
      }
    });
  } else {
    // Random 3D initial positions
    positions = randomLayout3D(nodes);
  }

  // Calculate optimal distance k
  // Based on reference: k = (area / (n + 1))^(1/3) where area = scale * n²
  const area = scale * n * n;
  const optimalK = k !== null ? k : Math.pow(area / (n + 1), 1 / 3);

  // Temperature for simulated annealing (starts at sqrt(n))
  let temperature = Math.sqrt(n);
  const cooling = temperature / (iterations + 1);

  // Epsilon to prevent division by zero
  const EPSILON = 0.01;

  // Build adjacency set for O(1) edge lookup
  const adjacency = new Map();
  nodes.forEach(nodeId => {
    const neighbors = new Set(graph.getNeighbors(nodeId));
    adjacency.set(nodeId, neighbors);
  });

  reportProgress(progressCallback, 0.1);

  // Main iteration loop
  for (let iter = 0; iter < iterations; iter++) {
    // Initialize displacements
    const displacement = {};
    nodes.forEach(nodeId => {
      displacement[nodeId] = { x: 0, y: 0, z: 0 };
    });

    // Calculate repulsive forces between ALL node pairs O(n²)
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];
        const posA = positions[nodeA];
        const posB = positions[nodeB];

        const dx = posA.x - posB.x;
        const dy = posA.y - posB.y;
        const dz = posA.z - posB.z;

        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + EPSILON;

        // Repulsive force: k² / distance
        const repForce = (optimalK * optimalK) / dist;

        // Normalized direction * force
        const fx = (dx / dist) * repForce;
        const fy = (dy / dist) * repForce;
        const fz = (dz / dist) * repForce;

        // Apply to both nodes (Newton's 3rd law)
        displacement[nodeA].x += fx;
        displacement[nodeA].y += fy;
        displacement[nodeA].z += fz;
        displacement[nodeB].x -= fx;
        displacement[nodeB].y -= fy;
        displacement[nodeB].z -= fz;
      }
    }

    // Calculate attractive forces for edges O(m)
    graph.edges.forEach(edge => {
      const posU = positions[edge.u];
      const posV = positions[edge.v];

      const dx = posV.x - posU.x;
      const dy = posV.y - posU.y;
      const dz = posV.z - posU.z;

      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + EPSILON;

      // Attractive force: distance² / k
      const attrForce = (dist * dist) / optimalK;

      // Normalized direction * force
      const fx = (dx / dist) * attrForce;
      const fy = (dy / dist) * attrForce;
      const fz = (dz / dist) * attrForce;

      // Pull nodes toward each other
      displacement[edge.u].x += fx;
      displacement[edge.u].y += fy;
      displacement[edge.u].z += fz;
      displacement[edge.v].x -= fx;
      displacement[edge.v].y -= fy;
      displacement[edge.v].z -= fz;
    });

    // Calculate gravitational force toward center O(n)
    if (gravity > 0) {
      nodes.forEach(nodeId => {
        const pos = positions[nodeId];
        const dx = center.x - pos.x;
        const dy = center.y - pos.y;
        const dz = center.z - pos.z;

        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + EPSILON;

        // Gravity force: 0.1 * k * gravity
        const gravForce = 0.1 * optimalK * gravity;

        displacement[nodeId].x += (dx / dist) * gravForce;
        displacement[nodeId].y += (dy / dist) * gravForce;
        displacement[nodeId].z += (dz / dist) * gravForce;
      });
    }

    // Apply displacements with temperature limiting
    let totalDisplacement = 0;
    nodes.forEach(nodeId => {
      const disp = displacement[nodeId];
      const dispMag = Math.sqrt(disp.x * disp.x + disp.y * disp.y + disp.z * disp.z) + EPSILON;

      // Limit displacement by temperature
      const limitFactor = Math.min(dispMag, temperature) / dispMag;

      positions[nodeId].x += disp.x * limitFactor;
      positions[nodeId].y += disp.y * limitFactor;
      positions[nodeId].z += disp.z * limitFactor;

      totalDisplacement += dispMag;
    });

    // Cool temperature
    temperature -= cooling;

    // Check convergence
    if ((totalDisplacement / n) < threshold) {
      reportProgress(progressCallback, 1.0);
      break;
    }

    // Report progress every 10 iterations
    if (iter % 10 === 0) {
      reportProgress(progressCallback, 0.1 + 0.8 * (iter / iterations));
    }
  }

  // Rescale layout to fit in [-scale, scale]
  const rescaledPositions = rescaleLayout3D(positions, nodes, scale, center);

  reportProgress(progressCallback, 1.0);
  return rescaledPositions;
}
