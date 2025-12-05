/**
 * WorkerPool - Manages a pool of workers for parallel computation
 *
 * Features:
 * - Auto-scaling based on CPU cores
 * - Task queueing and distribution
 * - Worker lifecycle management
 * - Progress tracking
 * - Error recovery
 *
 * @module WorkerPool
 */

import { WorkerAdapter } from './WorkerAdapter.js';
import { createLogger } from '@guinetik/logger';

/**
 * Pool of workers for parallel task execution
 *
 * @example
 * const pool = new WorkerPool({
 *   maxWorkers: 4,
 *   workerScript: './network-worker.js'
 * });
 *
 * await pool.initialize();
 *
 * const result = await pool.execute({
 *   type: 'betweenness',
 *   graphData: { nodes: [...], edges: [...] }
 * }, {
 *   onProgress: (p) => console.log(`${Math.round(p*100)}%`)
 * });
 *
 * await pool.terminate();
 */
export class WorkerPool {
  /**
   * Create a new worker pool
   *
   * @param {Object} options - Configuration options
   * @param {number} [options.maxWorkers] - Maximum number of workers (default: CPU count)
   * @param {string} [options.workerScript] - Path to worker script
   * @param {number} [options.taskTimeout] - Task timeout in ms (default: 60000)
   * @param {boolean} [options.verbose] - Enable verbose logging
   * @param {boolean} [options.enableAffinity=true] - Enable worker affinity (route same algorithm to same worker)
   * @param {number} [options.affinityCacheLimit=50] - Max cached function keys per worker
   */
  constructor(options = {}) {
    this.maxWorkers = options.maxWorkers || this.detectCPUCount();
    this.workerScript = options.workerScript || this.getDefaultWorkerScript();
    this.taskTimeout = options.taskTimeout || 60000; // 60 seconds
    this.verbose = options.verbose || false;

    // Affinity configuration
    this.affinityCacheLimit = options.affinityCacheLimit || 50;
    this.enableAffinity = options.enableAffinity !== false; // default: true

    this.workers = [];
    this.availableWorkers = [];
    this.taskQueue = [];
    this.activeTasks = new Map(); // taskId -> { resolve, reject, onProgress, timeout, task }
    this.taskIdCounter = 0;
    this.initialized = false;

    // Affinity metrics
    this.affinityMetrics = {
      hits: 0,
      misses: 0
    };

    // Initialize logger
    this.log = createLogger({
      prefix: 'WorkerPool',
      level: this.verbose ? 'debug' : 'info'
    });
  }

  /**
   * Detect number of CPU cores
   * @private
   * @returns {number} CPU count
   */
  detectCPUCount() {
    // Browser
    if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) {
      return navigator.hardwareConcurrency;
    }

    // Node.js
    if (typeof require !== 'undefined') {
      try {
        const os = require('os');
        return os.cpus().length;
      } catch (e) {
        // Ignore
      }
    }

    return 4; // Safe default
  }

  /**
   * Get default worker script path
   * @private
   * @returns {string} Worker script path
   */
  getDefaultWorkerScript() {
    // In browser: relative to main script
    if (typeof window !== 'undefined') {
      return new URL('./network-worker.js', import.meta.url).href;
    }

    // In Node.js: relative to this file
    if (typeof require !== 'undefined') {
      const path = require('path');
      return path.join(__dirname, 'network-worker.js');
    }

    return './network-worker.js';
  }

  /**
   * Initialize worker pool
   *
   * @returns {Promise<void>}
   * @throws {Error} If workers are not supported
   */
  async initialize() {
    if (this.initialized) {
      return;
    }

    if (!WorkerAdapter.isSupported()) {
      throw new Error('Workers not supported in this environment');
    }

    this.log.debug('Initializing worker pool', { maxWorkers: this.maxWorkers });

    try {
      for (let i = 0; i < this.maxWorkers; i++) {
        const worker = await this.createWorker(i);
        this.workers.push(worker);
        this.availableWorkers.push(worker);
      }

      this.initialized = true;
      this.log.info('Worker pool initialized successfully', { workerCount: this.maxWorkers });
    } catch (error) {
      this.log.error('Failed to initialize worker pool', { 
        error: error.message, 
        stack: error.stack 
      });
      // Clean up any workers that were created
      await this.terminate();
      throw error;
    }
  }

  /**
   * Create a worker with message and error handlers
   * @private
   * @param {number} id - Worker ID for logging
   * @returns {WorkerAdapter} Configured worker
   */
  async createWorker(id) {
    const worker = WorkerAdapter.create(this.workerScript);
    worker.id = id;
    worker.currentTaskId = null;

    // Affinity tracking metadata
    worker.cachedFunctions = new Set();  // tracks module:functionName keys
    worker.tasksExecuted = 0;            // for least-loaded selection
    worker.lastTaskTime = 0;             // for metrics/debugging

    worker.onMessage((message) => {
      this.handleWorkerMessage(worker, message);
    });

    worker.onError((error) => {
      this.handleWorkerError(worker, error);
    });

    this.log.debug('Worker created', { workerId: id });
    return worker;
  }

  /**
   * Execute task on worker pool
   *
   * @param {Object} task - Task to execute
   * @param {string} task.type - Task type (algorithm name)
   * @param {Object} [options] - Execution options
   * @param {Function} [options.onProgress] - Progress callback (0-1)
   * @param {number} [options.timeout] - Task timeout in ms
   * @returns {Promise<any>} Task result
   *
   * @example
   * const result = await pool.execute({
   *   type: 'degree',
   *   graphData: { nodes: [...], edges: [...] },
   *   nodeIds: ['a', 'b', 'c']
   * }, {
   *   onProgress: (progress) => console.log(`${progress * 100}%`),
   *   timeout: 30000
   * });
   */
  async execute(task, options = {}) {
    if (!this.initialized) {
      throw new Error('Worker pool not initialized. Call initialize() first.');
    }

    return new Promise((resolve, reject) => {
      const taskId = `task_${this.taskIdCounter++}`;
      const taskWithId = { id: taskId, ...task };
      const timeout = options.timeout || this.taskTimeout;

      // Set up timeout
      const timeoutId = setTimeout(() => {
        this.handleTaskTimeout(taskId);
      }, timeout);

      // Store task info (including task for affinity key extraction on completion)
      this.activeTasks.set(taskId, {
        resolve,
        reject,
        onProgress: options.onProgress,
        timeoutId,
        startTime: Date.now(),
        task: taskWithId  // Store task for affinity tracking
      });

      // Try to assign to available worker using affinity-aware selection
      const worker = this._selectWorker(taskWithId);
      if (worker) {
        this.assignTask(worker, taskWithId);
        const affinityKey = this._getAffinityKey(taskWithId);
        const affinityMatch = affinityKey && worker.cachedFunctions.has(affinityKey);
        this.log.debug('Task assigned to worker', {
          taskId,
          workerId: worker.id,
          affinityMatch
        });
      } else {
        // Queue task if no workers available
        this.taskQueue.push(taskWithId);
        this.log.debug('Task queued', { taskId, queueLength: this.taskQueue.length });
      }
    });
  }

  /**
   * Assign task to worker
   * @private
   * @param {WorkerAdapter} worker - Worker to assign to
   * @param {Object} task - Task to execute
   */
  assignTask(worker, task) {
    worker.currentTaskId = task.id;
    worker.postMessage(task);
  }

  // ============================================================================
  // WORKER AFFINITY METHODS
  // ============================================================================

  /**
   * Generate affinity key from task
   * @private
   * @param {Object} task - Task with module and functionName
   * @returns {string|null} Affinity key or null if not applicable
   */
  _getAffinityKey(task) {
    if (task && task.module && task.functionName) {
      return `${task.module}:${task.functionName}`;
    }
    return null;
  }

  /**
   * Select optimal worker for task using affinity-aware algorithm
   * @private
   * @param {Object} task - Task to assign
   * @returns {WorkerAdapter|null} Selected worker or null if none available
   */
  _selectWorker(task) {
    if (this.availableWorkers.length === 0) {
      return null;
    }

    // If affinity is disabled, use simple FIFO
    if (!this.enableAffinity) {
      return this.availableWorkers.pop();
    }

    const affinityKey = this._getAffinityKey(task);

    // Priority 1: Find worker with affinity match (same algorithm previously run)
    if (affinityKey) {
      const affinityMatch = this.availableWorkers.find(
        w => w.cachedFunctions.has(affinityKey)
      );
      if (affinityMatch) {
        this._recordAffinityHit();
        return this._removeFromAvailable(affinityMatch);
      }
      this._recordAffinityMiss();
    }

    // Priority 2: Find worker with fewest tasks executed (cold start optimization)
    const leastLoaded = this.availableWorkers.reduce((min, w) =>
      w.tasksExecuted < min.tasksExecuted ? w : min
    );

    return this._removeFromAvailable(leastLoaded);
  }

  /**
   * Remove worker from available pool and return it
   * @private
   * @param {WorkerAdapter} worker - Worker to remove
   * @returns {WorkerAdapter} The removed worker
   */
  _removeFromAvailable(worker) {
    const index = this.availableWorkers.indexOf(worker);
    if (index > -1) {
      this.availableWorkers.splice(index, 1);
    }
    return worker;
  }

  /**
   * Record affinity cache hit
   * @private
   */
  _recordAffinityHit() {
    this.affinityMetrics.hits++;
  }

  /**
   * Record affinity cache miss
   * @private
   */
  _recordAffinityMiss() {
    this.affinityMetrics.misses++;
  }

  /**
   * Update worker's affinity cache after task completion
   * @private
   * @param {WorkerAdapter} worker - Worker that completed task
   * @param {Object} task - Completed task
   */
  _updateWorkerAffinity(worker, task) {
    const affinityKey = this._getAffinityKey(task);
    if (!affinityKey) return;

    // Add to cache
    worker.cachedFunctions.add(affinityKey);
    worker.tasksExecuted++;
    worker.lastTaskTime = Date.now();

    // Enforce cache size limit
    if (worker.cachedFunctions.size > this.affinityCacheLimit) {
      this._evictAffinityEntries(worker);
    }
  }

  /**
   * Evict oldest entries from worker's affinity cache
   * @private
   * @param {WorkerAdapter} worker - Worker to evict entries from
   */
  _evictAffinityEntries(worker) {
    // Simple strategy: clear half the entries
    const entries = Array.from(worker.cachedFunctions);
    const toRemove = entries.slice(0, Math.floor(entries.length / 2));
    toRemove.forEach(key => worker.cachedFunctions.delete(key));

    this.log.debug('Evicted affinity entries', {
      workerId: worker.id,
      evicted: toRemove.length,
      remaining: worker.cachedFunctions.size
    });
  }

  // ============================================================================
  // END WORKER AFFINITY METHODS
  // ============================================================================

  /**
   * Handle message from worker
   * @private
   * @param {WorkerAdapter} worker - Worker that sent message
   * @param {Object} message - Message from worker
   */
  handleWorkerMessage(worker, message) {
    const { id, status, result, progress, error } = message;
    const taskInfo = this.activeTasks.get(id);

    if (!taskInfo) {
      this.log.warn('Received message for unknown task', { taskId: id });
      return;
    }

    if (status === 'progress') {
      // Progress update
      if (taskInfo.onProgress) {
        taskInfo.onProgress(progress);
      }
      this.log.debug('Task progress', { taskId: id, progress: Math.round(progress * 100) });
    } else if (status === 'complete') {
      // Task completed successfully
      const duration = Date.now() - taskInfo.startTime;
      this.log.debug('Task completed', { taskId: id, duration });

      clearTimeout(taskInfo.timeoutId);
      taskInfo.resolve(result);

      // Update worker's affinity cache with completed task
      if (taskInfo.task) {
        this._updateWorkerAffinity(worker, taskInfo.task);
      }

      this.activeTasks.delete(id);
      this.freeWorker(worker);
    } else if (status === 'error') {
      // Task failed
      this.log.error('Task failed', { taskId: id, error });

      clearTimeout(taskInfo.timeoutId);
      taskInfo.reject(new Error(error));
      this.activeTasks.delete(id);
      this.freeWorker(worker);
    }
  }

  /**
   * Handle worker error
   * @private
   * @param {WorkerAdapter} worker - Worker that errored
   * @param {Error} error - Error object
   */
  handleWorkerError(worker, error) {
    this.log.error('Worker error', { 
      workerId: worker.id, 
      error: error.message, 
      stack: error.stack 
    });

    // Reject current task if any
    if (worker.currentTaskId) {
      const taskInfo = this.activeTasks.get(worker.currentTaskId);
      if (taskInfo) {
        clearTimeout(taskInfo.timeoutId);
        taskInfo.reject(error);
        this.activeTasks.delete(worker.currentTaskId);
      }
    }

    // Restart worker
    this.restartWorker(worker);
  }

  /**
   * Handle task timeout
   * @private
   * @param {string} taskId - Task that timed out
   */
  handleTaskTimeout(taskId) {
    const taskInfo = this.activeTasks.get(taskId);
    if (!taskInfo) return;

    this.log.warn('Task timed out', { taskId, timeout: this.taskTimeout });

    taskInfo.reject(new Error(`Task timed out after ${this.taskTimeout}ms`));
    this.activeTasks.delete(taskId);

    // Find and restart the worker running this task
    const worker = this.workers.find(w => w.currentTaskId === taskId);
    if (worker) {
      this.restartWorker(worker);
    }
  }

  /**
   * Free worker and assign next queued task
   * @private
   * @param {WorkerAdapter} worker - Worker to free
   */
  freeWorker(worker) {
    worker.currentTaskId = null;

    if (this.taskQueue.length > 0) {
      // Assign next queued task
      const nextTask = this.taskQueue.shift();
      this.assignTask(worker, nextTask);
      this.log.debug('Task assigned from queue', { taskId: nextTask.id, workerId: worker.id });
    } else {
      // Return to available pool
      this.availableWorkers.push(worker);
    }
  }

  /**
   * Restart failed worker
   * @private
   * @param {WorkerAdapter} oldWorker - Worker to restart
   */
  async restartWorker(oldWorker) {
    const index = this.workers.indexOf(oldWorker);
    if (index === -1) return;

    this.log.debug('Restarting worker', { workerId: oldWorker.id });

    try {
      // Terminate old worker
      oldWorker.terminate();

      // Create new worker
      const newWorker = await this.createWorker(oldWorker.id);
      this.workers[index] = newWorker;
      this.availableWorkers.push(newWorker);

      this.log.info('Worker restarted successfully', {
        workerId: oldWorker.id,
        lostAffinityEntries: oldWorker.cachedFunctions?.size || 0
      });
    } catch (error) {
      this.log.error('Failed to restart worker', { 
        workerId: oldWorker.id, 
        error: error.message, 
        stack: error.stack 
      });
      // Remove from workers array if can't restart
      this.workers.splice(index, 1);
    }
  }

  /**
   * Wait for active tasks to complete
   *
   * @param {number} [timeout=5000] - Max time to wait in ms
   * @returns {Promise<void>}
   */
  async waitForActiveTasks(timeout = 5000) {
    if (this.activeTasks.size === 0) {
      return;
    }

    this.log.debug('Waiting for active tasks', { taskCount: this.activeTasks.size, timeout });

    return new Promise((resolve) => {
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (this.activeTasks.size === 0 || Date.now() - startTime > timeout) {
          clearInterval(checkInterval);
          this.log.debug('Wait complete', { remainingTasks: this.activeTasks.size });
          resolve();
        }
      }, 100);
    });
  }

  /**
   * Terminate all workers and clean up
   *
   * @param {boolean} [force=false] - Force termination without waiting
   * @returns {Promise<void>}
   */
  async terminate(force = false) {
    if (!this.initialized) {
      return;
    }

    this.log.info('Terminating worker pool', { force });

    // Wait for tasks to complete unless forced
    if (!force) {
      await this.waitForActiveTasks(5000);
    }

    // Reject any remaining active tasks
    this.activeTasks.forEach((taskInfo, taskId) => {
      clearTimeout(taskInfo.timeoutId);
      taskInfo.reject(new Error('Worker pool terminated'));
    });
    this.activeTasks.clear();

    // Terminate all workers
    this.workers.forEach(worker => {
      try {
        worker.terminate();
      } catch (e) {
        this.log.error('Error terminating worker', { 
          workerId: worker.id, 
          error: e.message 
        });
      }
    });

    this.workers = [];
    this.availableWorkers = [];
    this.taskQueue = [];
    this.initialized = false;

    this.log.info('Worker pool terminated');
  }

  /**
   * Get current pool status
   *
   * @returns {Object} Status information
   *
   * @example
   * const status = pool.getStatus();
   * console.log(`Workers: ${status.availableWorkers}/${status.totalWorkers}`);
   * console.log(`Queue: ${status.queuedTasks}, Active: ${status.activeTasks}`);
   */
  getStatus() {
    const affinityStats = this.getAffinityStats();
    return {
      initialized: this.initialized,
      totalWorkers: this.workers.length,
      availableWorkers: this.availableWorkers.length,
      busyWorkers: this.workers.length - this.availableWorkers.length,
      activeTasks: this.activeTasks.size,
      queuedTasks: this.taskQueue.length,
      // Affinity info
      affinity: {
        enabled: this.enableAffinity,
        cacheLimit: this.affinityCacheLimit,
        hitRate: affinityStats.hitRate
      }
    };
  }

  /**
   * Get detailed affinity statistics
   *
   * @returns {Object} Affinity metrics including per-worker cache info
   *
   * @example
   * const stats = pool.getAffinityStats();
   * console.log(`Affinity hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
   * console.log(`Hits: ${stats.hits}, Misses: ${stats.misses}`);
   */
  getAffinityStats() {
    const total = this.affinityMetrics.hits + this.affinityMetrics.misses;
    return {
      hits: this.affinityMetrics.hits,
      misses: this.affinityMetrics.misses,
      hitRate: total > 0 ? this.affinityMetrics.hits / total : 0,
      workerCaches: this.workers.map(w => ({
        workerId: w.id,
        cachedFunctions: Array.from(w.cachedFunctions || []),
        tasksExecuted: w.tasksExecuted || 0
      }))
    };
  }

}

export default WorkerPool;
