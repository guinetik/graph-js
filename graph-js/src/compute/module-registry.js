/**
 * Module Registry - Shared registry of compute modules
 *
 * Used by both the worker and MockWorkerAdapter for testing
 */

// Statistics algorithms (node-level and graph-level)
import * as nodeStatsCompute from '../statistics/algorithms/node-stats.js';
import * as graphStatsCompute from '../statistics/algorithms/graph-stats.js';

// Community detection algorithms
import * as louvainCompute from '../community/algorithms/louvain.js';

// Layout algorithms
import * as randomCompute from '../layouts/random.js';
import * as circularCompute from '../layouts/circular.js';
import * as spiralCompute from '../layouts/spiral.js';
import * as shellCompute from '../layouts/shell.js';
import * as spectralCompute from '../layouts/spectral.js';
import * as forceDirectedCompute from '../layouts/force-directed.js';
import * as kamadaKawaiCompute from '../layouts/kamada-kawai.js';
import * as bipartiteCompute from '../layouts/bipartite.js';
import * as multipartiteCompute from '../layouts/multipartite.js';
import * as bfsCompute from '../layouts/bfs.js';

/**
 * Registry mapping module paths to their exports
 */
export const MODULE_REGISTRY = {
  // Node-level statistics (all in one file)
  '../statistics/algorithms/node-stats.js': nodeStatsCompute,

  // Graph-level statistics
  '../statistics/algorithms/graph-stats.js': graphStatsCompute,

  // Community
  '../community/algorithms/louvain.js': louvainCompute,

  // Layouts
  '../layouts/random.js': randomCompute,
  '../layouts/circular.js': circularCompute,
  '../layouts/spiral.js': spiralCompute,
  '../layouts/shell.js': shellCompute,
  '../layouts/spectral.js': spectralCompute,
  '../layouts/force-directed.js': forceDirectedCompute,
  '../layouts/kamada-kawai.js': kamadaKawaiCompute,
  '../layouts/bipartite.js': bipartiteCompute,
  '../layouts/multipartite.js': multipartiteCompute,
  '../layouts/bfs.js': bfsCompute
};

/**
 * Execute a compute task synchronously (for testing)
 *
 * @param {Object} task - Task to execute
 * @param {string} task.module - Module path
 * @param {string} task.functionName - Function name to call
 * @param {Array} task.args - Arguments to pass
 * @returns {Promise<any>} Task result
 */
export async function executeTask(task) {
  const { module, functionName, args = [] } = task;

  // Validate message format
  if (!module || !functionName) {
    throw new Error('Invalid task: module and functionName are required');
  }

  // Look up algorithm module from registry
  const algorithmModule = MODULE_REGISTRY[module];

  if (!algorithmModule) {
    throw new Error(
      `Module '${module}' not found in registry. ` +
      `Available modules: ${Object.keys(MODULE_REGISTRY).join(', ')}`
    );
  }

  // Get the compute function
  const computeFunction = algorithmModule[functionName];

  if (!computeFunction || typeof computeFunction !== 'function') {
    throw new Error(
      `Function '${functionName}' not found in module '${module}'. ` +
      `Available functions: ${Object.keys(algorithmModule).join(', ')}`
    );
  }

  // Create no-op progress callback for sync execution
  const progressCallback = () => {};

  // Execute the compute function
  // Last arg is always the progress callback
  const result = await computeFunction(...args, progressCallback);

  return result;
}
