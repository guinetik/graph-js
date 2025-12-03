---
title: "Quick Start Guide"
created: "2025-01-03"
tags: [guide, quick-start, tutorial]
category: "core"
related: ["[[networkstats-class]]", "[[graph-data-structure]]", "[[example-basic-analysis]]"]
status: "complete"
aliases: ["getting-started", "tutorial"]
---

# Quick Start Guide

Get up and running with graph-js in minutes.

## Installation

```bash
npm install @guinetik/graph-js
```

## Basic Usage

```javascript
import NetworkStats from '@guinetik/graph-js';

// Create analyzer instance
const analyzer = new NetworkStats({ verbose: true });

// Define your network as edges
const network = [
  { source: 'Alice', target: 'Bob', weight: 1 },
  { source: 'Bob', target: 'Carol', weight: 2 },
  { source: 'Carol', target: 'Alice', weight: 1 },
  { source: 'David', target: 'Carol', weight: 1 }
];

// Analyze network (runs in worker)
const results = await analyzer.analyze(network, ['degree', 'betweenness', 'eigenvector']);

console.log(results);
// [
//   { id: 'Alice', degree: 2, betweenness: 0.33, eigenvector: 0.55 },
//   { id: 'Bob', degree: 2, betweenness: 0.33, eigenvector: 0.55 },
//   { id: 'Carol', degree: 3, betweenness: 0.67, eigenvector: 0.78 },
//   { id: 'David', degree: 1, betweenness: 0, eigenvector: 0.32 }
// ]

// Clean up
await analyzer.dispose();
```

## Key Concepts

1. **NetworkStats** - Main API class for analysis (see [[networkstats-class]])
2. **Graph** - Core data structure (see [[graph-data-structure]])
3. **Workers** - All computation runs in background workers (see [[worker-architecture]])

## Next Steps

- Read [[networkstats-class]] for detailed API documentation
- Explore [[statistics-overview]] for available metrics
- Check out [[example-basic-analysis]] for more examples
- See [[00-architecture-overview]] to understand the architecture

## Related Notes

- [[networkstats-class]] - Main API reference
- [[graph-data-structure]] - Graph class documentation
- [[worker-architecture]] - Worker-first design
- [[example-basic-analysis]] - More examples

