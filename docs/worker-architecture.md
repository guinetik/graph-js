---
title: "Worker Architecture"
created: "2025-01-03"
tags: [architecture, workers, performance, parallel]
category: "core"
related: ["[[00-architecture-overview]]", "[[networkstats-class]]", "[[performance-optimization]]"]
status: "complete"
aliases: ["workers", "worker-pool", "parallel-computation"]
---

# Worker Architecture

graph-js uses a **worker-first architecture** where all computational work happens in Web Workers for optimal performance and non-blocking UI operations.

## Overview

The worker system consists of three main components:

1. **WorkerManager** - Singleton manager that initializes and manages the worker pool
2. **WorkerPool** - Pool of worker threads that execute tasks
3. **WorkerAdapter** - Adapter that handles task serialization and execution

## Architecture Flow

```
Main Thread                Worker Pool
-----------                -----------
NetworkStats  ──(task)──>  Worker 1
                          Worker 2
                          Worker 3
              <─(result)──
```

## Key Components

### WorkerManager

Singleton that manages the lifecycle of the worker pool:

- **Initialization**: Creates worker pool on first use
- **Task Distribution**: Routes tasks to available workers
- **Resource Management**: Handles worker lifecycle and cleanup
- **Progress Tracking**: Manages progress callbacks

### WorkerPool

Manages a pool of worker threads:

- **Auto-sizing**: Automatically detects CPU cores
- **Task Queue**: Queues tasks when all workers are busy
- **Load Balancing**: Distributes tasks across workers
- **Timeout Handling**: Prevents hanging tasks

### WorkerAdapter

Handles communication between main thread and workers:

- **Serialization**: Converts graph data to transferable format
- **Deserialization**: Converts results back to JavaScript objects
- **Error Handling**: Catches and reports worker errors
- **Progress Forwarding**: Forwards progress updates to callbacks

## Worker Affinity System

graph-js includes an intelligent **worker affinity system** (inspired by [BeeThreads](https://github.com/samsantosb/BeeThreads)) that routes repeated algorithm calls to the same worker, leveraging JavaScript's JIT (Just-In-Time) compilation for better performance.

### How It Works

```
Task: eigenvector          Task: eigenvector (again)
      │                          │
      ▼                          ▼
┌─────────────┐            ┌─────────────┐
│ Select      │            │ Affinity    │
│ least-loaded│            │ Match! 🎯   │
│ Worker 2    │            │ Worker 2    │
└─────────────┘            └─────────────┘
      │                          │
      ▼                          ▼
   Worker 2                   Worker 2
   (cold start)               (JIT optimized)
```

When a worker executes an algorithm:
1. The function code is JIT-compiled by the JavaScript engine
2. The worker's cached functions are tracked
3. Future calls for the same algorithm are routed to that worker
4. The "hot" JIT-optimized code path is reused (10-30% faster)

### Selection Algorithm

The affinity-aware worker selection follows this priority:

1. **Affinity Match**: Find available worker that previously ran the same algorithm
2. **Least Loaded**: If no affinity match, select worker with fewest tasks executed
3. **FIFO Fallback**: If affinity disabled, use simple first-available selection

### Configuration

```javascript
const analyzer = new NetworkStats({
  enableAffinity: true,       // Enable worker affinity (default: true)
  affinityCacheLimit: 50,     // Max cached functions per worker (default: 50)
  verbose: true               // See affinity logs: 🎯 hits, 📦 cache updates
});
```

### Monitoring Affinity

```javascript
import WorkerManager from '@guinetik/graph-js';

// Get affinity statistics
const stats = WorkerManager.getAffinityStats();
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
console.log(`Hits: ${stats.hits}, Misses: ${stats.misses}`);

// Per-worker cache info
stats.workerCaches.forEach(w => {
  console.log(`Worker ${w.workerId}: ${w.cachedFunctions.length} cached functions`);
});
```

### Cache Eviction

When a worker's cache exceeds `affinityCacheLimit`:
- Half of the oldest entries are evicted
- This prevents unbounded memory growth
- Frequently-used algorithms remain cached

## Benefits

### Performance

- **Parallel Processing**: Multiple workers process independent tasks simultaneously
- **CPU Utilization**: Automatically uses all available CPU cores
- **2-3x Speedup**: Measured performance improvement on large graphs
- **JIT Optimization**: Affinity system leverages JavaScript engine optimization

### User Experience

- **Non-blocking UI**: Heavy computation doesn't freeze the browser
- **Progress Tracking**: Built-in progress callbacks for long operations
- **Responsive**: UI remains interactive during analysis

## Configuration

```javascript
const analyzer = new NetworkStats({
  maxWorkers: 4,           // Maximum workers (default: auto-detect)
  taskTimeout: 60000,       // Task timeout in ms
  workerScript: './worker.js', // Custom worker script (for bundlers)
  verbose: true            // Enable logging
});
```

## Bundle Integration

For Vite, Webpack, or Rollup:

```javascript
import NetworkStats from '@guinetik/graph-js';
import workerUrl from '@guinetik/graph-js/worker-url';

const analyzer = new NetworkStats({
  workerScript: workerUrl
});
```

## Cleanup

Always dispose of analyzers to terminate workers:

```javascript
await analyzer.dispose();
```

## Related Notes

- [[00-architecture-overview]] - High-level architecture
- [[networkstats-class]] - Main API using workers
- [[performance-optimization]] - Performance tips
- [[bundle-integration]] - Bundler setup details

