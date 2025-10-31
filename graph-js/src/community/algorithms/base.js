/**
 * Abstract base class for community detection algorithms.
 * All community detection algorithms delegate computation to web workers for performance.
 *
 * **NEW: Worker-First Architecture**
 * - All computation happens in workers
 * - All methods are async
 * - No duplicate logic in main thread
 *
 * @abstract
 * @class
 * @example
 * class MyAlgorithm extends CommunityAlgorithm {
 *   constructor(options = {}) {
 *     super('my-algorithm', 'My Custom Algorithm', 'my_worker_type');
 *     this.options = options;
 *   }
 *
 *   // detect() is already implemented to delegate to workers!
 *   // No need to override unless you need custom behavior
 * }
 */

import WorkerManager from '../../compute/WorkerManager.js';

export class CommunityAlgorithm {
  /**
   * Create a community detection algorithm
   *
   * @param {string} name - Algorithm identifier (e.g., 'louvain', 'label-propagation')
   * @param {string} description - Human-readable description of the algorithm
   * @param {Object} computeConfig - Compute function configuration
   * @param {string} computeConfig.module - Module path containing compute function
   * @param {string} computeConfig.functionName - Name of compute function to call
   */
  constructor(name, description = '', computeConfig = null) {
    if (new.target === CommunityAlgorithm) {
      throw new Error('CommunityAlgorithm is abstract and cannot be instantiated directly');
    }

    if (!computeConfig || !computeConfig.module || !computeConfig.functionName) {
      throw new Error('computeConfig with module and functionName is required');
    }

    /**
     * Algorithm identifier
     * @type {string}
     */
    this.name = name;

    /**
     * Algorithm description
     * @type {string}
     */
    this.description = description;

    /**
     * Compute function configuration
     * @type {Object}
     */
    this.computeConfig = computeConfig;

    /**
     * Algorithm-specific options
     * @type {Object}
     */
    this.options = {};
  }

  /**
   * Detect communities in a graph.
   * Delegates computation to web workers for performance.
   *
   * **ASYNC**: All community detection is asynchronous
   *
   * @param {Graph} graph - The graph to analyze
   * @param {Object} [execOptions={}] - Execution options
   * @param {Function} [execOptions.onProgress] - Progress callback (0-1)
   * @param {number} [execOptions.timeout] - Task timeout override
   * @returns {Promise<Object>} Community detection results
   * {
   *   communities: { nodeId: communityId },
   *   modularity: number,
   *   numCommunities: number,
   *   algorithm: string,
   *   ...
   * }
   */
  async detect(graph, execOptions = {}) {
    // Serialize graph for worker
    const graphData = WorkerManager.serializeGraph(graph);

    // Prepare task for dynamic import worker
    const task = {
      module: this.computeConfig.module,
      functionName: this.computeConfig.functionName,
      args: [graphData, this.options]
    };

    // Execute in worker
    const result = await WorkerManager.execute(task, execOptions);

    // Add algorithm name to result
    return {
      ...result,
      algorithm: this.name
    };
  }

  /**
   * Get algorithm metadata
   *
   * @returns {Object} Algorithm information
   */
  getInfo() {
    return {
      name: this.name,
      description: this.description
    };
  }
}

export default CommunityAlgorithm;
