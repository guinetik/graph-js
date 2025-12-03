---
title: "Degree Centrality"
created: "2025-01-03"
tags: [metric, centrality, degree, node-level]
category: "metrics"
related: ["[[statistics-overview]]", "[[metric-betweenness]]", "[[graph-stat-average-degree]]"]
status: "complete"
aliases: ["degree", "degree-centrality"]
---

# Degree Centrality

The simplest centrality measure: counts the number of edges connected to each node.

## Overview

Degree centrality measures how connected a node is by counting its direct connections. It's the fastest metric to compute and is useful for identifying highly connected nodes (hubs).

## Formula

For node `v`:
```
degree(v) = |neighbors(v)|
```

For weighted graphs, degree is the sum of edge weights:
```
degree(v) = Σ weight(v, neighbor)
```

## Complexity

- **Time**: O(V) - Single pass through all nodes
- **Space**: O(V) - Store degree for each node

## Use Cases

- **Hub Identification**: Find nodes with most connections
- **Network Structure**: Understand connection patterns
- **Quick Analysis**: Fastest metric for initial exploration
- **Layout Algorithms**: Used by [[layout-shell]] for shell layout

## Example

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
const network = [
  { source: 'A', target: 'B' },
  { source: 'A', target: 'C' },
  { source: 'B', target: 'D' }
];

const results = await analyzer.analyze(network, ['degree']);

console.log(results);
// [
//   { id: 'A', degree: 2 },
//   { id: 'B', degree: 2 },
//   { id: 'C', degree: 1 },
//   { id: 'D', degree: 1 }
// ]
```

## Interpretation

- **High degree**: Node is a hub, central to many connections
- **Low degree**: Node is peripheral, few connections
- **Zero degree**: Isolated node (no connections)

## Related Metrics

- [[metric-betweenness]] - Measures shortest path centrality
- [[metric-eigenvector]] - Measures influence based on neighbor importance
- [[graph-stat-average-degree]] - Average degree across all nodes

## Related Notes

- [[statistics-overview]] - All available metrics
- [[layout-shell]] - Uses degree for shell layout
- [[graph-stat-average-degree]] - Graph-level average degree

