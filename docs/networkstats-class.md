---
title: "NetworkStats Class"
created: "2025-01-03"
tags: [api, core, class]
category: "core"
related: ["[[worker-architecture]]", "[[statistics-overview]]", "[[graph-stats-overview]]", "[[graph-data-structure]]"]
status: "complete"
aliases: ["networkstats", "main-api", "analyzer"]
---

# NetworkStats Class

The main API class for analyzing network graphs. All computation runs asynchronously in Web Workers.

## Overview

`NetworkStats` is the primary entry point for network analysis. It provides a clean, async API for computing node-level metrics and graph-level statistics.

## Constructor

```javascript
const analyzer = new NetworkStats(options);
```

### Options

- `verbose` (boolean): Enable detailed logging (default: `true`)
- `maxWorkers` (number): Maximum number of workers (default: auto-detect)
- `taskTimeout` (number): Task timeout in milliseconds (default: `60000`)
- `workerScript` (string): Custom worker script path (for bundlers)

## Main Method: analyze()

```javascript
const results = await analyzer.analyze(network, features, options);
```

### Parameters

**network** (Array): Array of edge objects
```javascript
[
  { source: 'A', target: 'B', weight: 1 },
  { source: 'B', target: 'C', weight: 2 }
]
```

**features** (Array|string): Features to compute
- Array: `['degree', 'betweenness']`
- String: `'degree'`
- Default: All features (see [[statistics-overview]])

**options** (Object): Analysis options
- `onProgress` (Function): Progress callback `(progress) => {}` where progress is 0-1
- `includeGraphStats` (boolean): Include graph-level statistics
- `graphStats` (Array): Specific graph stats to calculate (see [[graph-stats-overview]])

### Return Value

**Node stats only** (default):
```javascript
[
  { id: 'A', degree: 2, betweenness: 0.33 },
  { id: 'B', degree: 2, betweenness: 0.33 }
]
```

**With graph stats** (`includeGraphStats: true`):
```javascript
{
  nodes: [{ id: 'A', degree: 2 }, ...],
  graph: { density: 0.67, diameter: 3 }
}
```

## Available Features

Access via `NetworkStats.FEATURES`:

```javascript
NetworkStats.FEATURES.ALL
// ['degree', 'betweenness', 'clustering', 'eigenvector', ...]

NetworkStats.FEATURES.DEGREE
NetworkStats.FEATURES.BETWEENNESS
// ... etc
```

See [[statistics-overview]] for all available metrics.

## Available Graph Stats

Access via `NetworkStats.GRAPH_STATS`:

```javascript
NetworkStats.GRAPH_STATS.ALL
// ['density', 'diameter', 'average_clustering', ...]
```

See [[graph-stats-overview]] for all graph-level statistics.

## Examples

### Basic Usage

```javascript
const analyzer = new NetworkStats();
const network = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' }
];

const results = await analyzer.analyze(network, ['degree', 'betweenness']);
```

### Progress Tracking

```javascript
const results = await analyzer.analyze(network, ['betweenness'], {
  onProgress: (progress) => {
    console.log(`Progress: ${Math.round(progress * 100)}%`);
  }
});
```

### Graph-Level Statistics

```javascript
const results = await analyzer.analyze(network, ['degree'], {
  includeGraphStats: true,
  graphStats: ['density', 'diameter']
});

console.log(results.nodes);  // Node metrics
console.log(results.graph);  // Graph statistics
```

## Cleanup

Always dispose when done:

```javascript
await analyzer.dispose();
```

## Related Notes

- [[worker-architecture]] - How workers execute computation
- [[statistics-overview]] - All available node-level metrics
- [[graph-stats-overview]] - All graph-level statistics
- [[graph-data-structure]] - Graph data structure
- [[example-basic-analysis]] - More examples

