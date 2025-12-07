/**
 * Utility functions for graph layouts
 * (matches NetworkX approach)
 *
 * @module layout-utils
 */

/**
 * Rescale layout positions to fit in [-scale, scale] range
 * Matches NetworkX's rescale_layout function
 *
 * The function:
 * 1. Centers positions by subtracting the mean
 * 2. Finds the maximum absolute coordinate value
 * 3. Scales all positions so max coordinate equals scale
 * 4. Adds the center offset
 *
 * @param {Object} positions - Node positions map (nodeId -> {x, y})
 * @param {Array} nodes - List of node IDs
 * @param {number} scale - Scale factor (positions will fit in [-scale, scale])
 * @param {Object} center - Center point {x, y}
 * @returns {Object} Rescaled positions (nodeId -> {x, y})
 * @example
 * const positions = {
 *   'A': { x: 0, y: 0 },
 *   'B': { x: 2, y: 2 },
 *   'C': { x: 1, y: 1 }
 * };
 * const rescaled = rescaleLayout(positions, ['A', 'B', 'C'], 100, {x: 0, y: 0});
 * // Result: positions scaled so max coordinate is 100
 */
export function rescaleLayout(positions, nodes, scale = 1, center = { x: 0, y: 0 }) {
  if (nodes.length === 0) return positions;

  // Find centroid (mean position)
  let sumX = 0, sumY = 0;
  nodes.forEach(nodeId => {
    sumX += positions[nodeId].x;
    sumY += positions[nodeId].y;
  });
  const meanX = sumX / nodes.length;
  const meanY = sumY / nodes.length;

  // Center positions (subtract mean)
  const centered = {};
  nodes.forEach(nodeId => {
    centered[nodeId] = {
      x: positions[nodeId].x - meanX,
      y: positions[nodeId].y - meanY
    };
  });

  // Find max absolute coordinate across all dimensions
  let maxCoord = 0;
  nodes.forEach(nodeId => {
    const absX = Math.abs(centered[nodeId].x);
    const absY = Math.abs(centered[nodeId].y);
    maxCoord = Math.max(maxCoord, absX, absY);
  });

  // Rescale to [-scale, scale] and add center offset
  const rescaled = {};
  if (maxCoord > 0) {
    const scaleFactor = scale / maxCoord;
    nodes.forEach(nodeId => {
      rescaled[nodeId] = {
        x: centered[nodeId].x * scaleFactor + center.x,
        y: centered[nodeId].y * scaleFactor + center.y
      };
    });
  } else {
    // All nodes at same position - place at center
    nodes.forEach(nodeId => {
      rescaled[nodeId] = { x: center.x, y: center.y };
    });
  }

  return rescaled;
}

/**
 * Generate random initial positions for nodes
 * Uses uniform random distribution in [0, 1] range
 *
 * @param {Array} nodes - List of node IDs
 * @param {number} dim - Number of dimensions (default: 2)
 * @returns {Object} Random positions (nodeId -> {x, y})
 * @example
 * const positions = randomLayout(['A', 'B', 'C']);
 * // positions = { 'A': {x: 0.42, y: 0.73}, 'B': {x: 0.15, y: 0.89}, ... }
 */
export function randomLayout(nodes, dim = 2) {
  const positions = {};
  nodes.forEach(nodeId => {
    if (dim === 2) {
      positions[nodeId] = {
        x: Math.random(),
        y: Math.random()
      };
    } else {
      // For future 3D support
      const coords = {};
      for (let i = 0; i < dim; i++) {
        coords[i] = Math.random();
      }
      positions[nodeId] = coords;
    }
  });
  return positions;
}

/**
 * Calculate the bounding box of a set of positions
 *
 * @param {Object} positions - Node positions map
 * @param {Array} nodes - List of node IDs
 * @returns {Object} Bounding box {minX, maxX, minY, maxY}
 */
export function getBoundingBox(positions, nodes) {
  if (nodes.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  }

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  nodes.forEach(nodeId => {
    const pos = positions[nodeId];
    minX = Math.min(minX, pos.x);
    maxX = Math.max(maxX, pos.x);
    minY = Math.min(minY, pos.y);
    maxY = Math.max(maxY, pos.y);
  });

  return { minX, maxX, minY, maxY };
}

/**
 * Calculate distance between two points
 *
 * @param {Object} p1 - First point {x, y}
 * @param {Object} p2 - Second point {x, y}
 * @returns {number} Euclidean distance
 */
export function distance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

//=============================================================================
// 3D LAYOUT UTILITIES
//=============================================================================

/**
 * Calculate 3D distance between two points
 *
 * @param {Object} p1 - First point {x, y, z}
 * @param {Object} p2 - Second point {x, y, z}
 * @returns {number} Euclidean distance in 3D
 */
export function distance3D(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = p1.z - p2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Generate random 3D positions for nodes
 * Uses uniform random distribution in [0, 1] range for each axis
 *
 * @param {Array} nodes - List of node IDs
 * @returns {Object} Random 3D positions (nodeId -> {x, y, z})
 * @example
 * const positions = randomLayout3D(['A', 'B', 'C']);
 * // positions = { 'A': {x: 0.42, y: 0.73, z: 0.15}, ... }
 */
export function randomLayout3D(nodes) {
  const positions = {};
  nodes.forEach(nodeId => {
    positions[nodeId] = {
      x: Math.random(),
      y: Math.random(),
      z: Math.random()
    };
  });
  return positions;
}

/**
 * Rescale 3D layout positions to fit in [-scale, scale] range
 * 3D version of rescaleLayout
 *
 * @param {Object} positions - Node positions map (nodeId -> {x, y, z})
 * @param {Array} nodes - List of node IDs
 * @param {number} scale - Scale factor (positions will fit in [-scale, scale])
 * @param {Object} center - Center point {x, y, z}
 * @returns {Object} Rescaled positions (nodeId -> {x, y, z})
 */
export function rescaleLayout3D(positions, nodes, scale = 1, center = { x: 0, y: 0, z: 0 }) {
  if (nodes.length === 0) return positions;

  // Find centroid (mean position)
  let sumX = 0, sumY = 0, sumZ = 0;
  nodes.forEach(nodeId => {
    sumX += positions[nodeId].x;
    sumY += positions[nodeId].y;
    sumZ += positions[nodeId].z;
  });
  const meanX = sumX / nodes.length;
  const meanY = sumY / nodes.length;
  const meanZ = sumZ / nodes.length;

  // Center positions (subtract mean)
  const centered = {};
  nodes.forEach(nodeId => {
    centered[nodeId] = {
      x: positions[nodeId].x - meanX,
      y: positions[nodeId].y - meanY,
      z: positions[nodeId].z - meanZ
    };
  });

  // Find max absolute coordinate across all dimensions
  let maxCoord = 0;
  nodes.forEach(nodeId => {
    const absX = Math.abs(centered[nodeId].x);
    const absY = Math.abs(centered[nodeId].y);
    const absZ = Math.abs(centered[nodeId].z);
    maxCoord = Math.max(maxCoord, absX, absY, absZ);
  });

  // Rescale to [-scale, scale] and add center offset
  const rescaled = {};
  if (maxCoord > 0) {
    const scaleFactor = scale / maxCoord;
    nodes.forEach(nodeId => {
      rescaled[nodeId] = {
        x: centered[nodeId].x * scaleFactor + center.x,
        y: centered[nodeId].y * scaleFactor + center.y,
        z: centered[nodeId].z * scaleFactor + center.z
      };
    });
  } else {
    // All nodes at same position - place at center
    nodes.forEach(nodeId => {
      rescaled[nodeId] = { x: center.x, y: center.y, z: center.z };
    });
  }

  return rescaled;
}

/**
 * Calculate the 3D bounding box of a set of positions
 *
 * @param {Object} positions - Node positions map (nodeId -> {x, y, z})
 * @param {Array} nodes - List of node IDs
 * @returns {Object} Bounding box {minX, maxX, minY, maxY, minZ, maxZ}
 */
export function getBoundingBox3D(positions, nodes) {
  if (nodes.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0 };
  }

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  nodes.forEach(nodeId => {
    const pos = positions[nodeId];
    minX = Math.min(minX, pos.x);
    maxX = Math.max(maxX, pos.x);
    minY = Math.min(minY, pos.y);
    maxY = Math.max(maxY, pos.y);
    minZ = Math.min(minZ, pos.z);
    maxZ = Math.max(maxZ, pos.z);
  });

  return { minX, maxX, minY, maxY, minZ, maxZ };
}

export default {
  rescaleLayout,
  randomLayout,
  getBoundingBox,
  distance,
  // 3D utilities
  distance3D,
  randomLayout3D,
  rescaleLayout3D,
  getBoundingBox3D
};
