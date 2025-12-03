---
title: "Architecture Overview"
created: "2025-01-03"
tags: [architecture, design, overview]
category: "core"
related: ["[[worker-architecture]]", "[[networkstats-class]]", "[[graph-data-structure]]"]
status: "complete"
aliases: ["architecture", "design"]
---

# Architecture Overview

graph-js is built with a **worker-first architecture** that ensures optimal performance and non-blocking UI operations.

## Core Design Principles

1. **Worker-First**: All computation happens in Web Workers
2. **Async Everything**: All methods are async/await
3. **Modular Design**: Clean separation of concerns
4. **TypeScript Support**: Full type definitions included

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│              Main Thread (UI)                   │
│  ┌──────────────────────────────────────────┐   │
│  │         NetworkStats API                 │   │
│  │         CommunityDetection               │   │
│  │         Layout Classes                   │   │
│  └────────────────┬─────────────────────────┘   │
│                   │ Tasks                       │
└───────────────────┼─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│            Worker Pool (Computation)            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │Worker 1 │  │Worker 2 │  │Worker 3 │ ...      │
│  └─────────┘  └─────────┘  └─────────┘          │
│                   │ Results                     │
└───────────────────┴─────────────────────────────┘
```

## Key Components

### Main Thread Components

- **NetworkStats** - Main API class (see [[networkstats-class]])
- **Graph** - Core data structure (see [[graph-data-structure]])
- **CommunityDetection** - Community detection API (see [[community-detection-overview]])
- **Layout Classes** - 11 layout algorithms (see [[layouts-overview]])

### Worker Components

- **WorkerManager** - Singleton manager for worker pool (see [[worker-architecture]])
- **WorkerPool** - Pool of worker threads
- **WorkerAdapter** - Adapter for task execution

## Data Flow

1. User calls API method (e.g., `analyzer.analyze()`)
2. Main thread serializes graph data
3. Task dispatched to worker pool
4. Worker executes computation function
5. Results serialized and returned to main thread
6. Main thread deserializes and returns to user

## Benefits

- **Non-blocking UI**: Heavy computation doesn't freeze the browser
- **Parallel Processing**: Multiple workers handle independent tasks
- **Scalability**: Automatically uses available CPU cores
- **Progress Tracking**: Built-in progress callbacks

## Related Notes

- [[worker-architecture]] - Detailed worker system documentation
- [[networkstats-class]] - Main API class
- [[graph-data-structure]] - Graph data structure
- [[performance-optimization]] - Performance tips

