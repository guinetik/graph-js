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

## Benefits

### Performance

- **Parallel Processing**: Multiple workers process independent tasks simultaneously
- **CPU Utilization**: Automatically uses all available CPU cores
- **2-3x Speedup**: Measured performance improvement on large graphs

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

