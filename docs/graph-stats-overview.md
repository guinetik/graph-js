---
title: "Graph Statistics Overview"
created: "2025-01-03"
tags: [statistics, graph-level, overview]
category: "metrics"
related: ["[[statistics-overview]]", "[[networkstats-class]]"]
status: "complete"
aliases: ["graph-statistics", "graph-metrics"]
---

# Graph Statistics Overview

Overview of all graph-level statistics available in graph-js.

## Available Statistics

graph-js provides 6 graph-level statistics for analyzing overall network properties:

| Statistic | Description | Complexity |
|-----------|-------------|------------|
| [[graph-stat-density]] | Edge density (0-1) | O(1) |
| [[graph-stat-diameter]] | Longest shortest path | O(V³) |
| [[graph-stat-average-clustering]] | Mean clustering coefficient | O(V·d²) |
| [[graph-stat-average-shortest-path]] | Mean distance between nodes | O(V² + VE) |
| [[graph-stat-connected-components]] | Number of disconnected subgraphs | O(V + E) |
| [[graph-stat-average-degree]] | Mean degree across all nodes | O(V) |

## Usage

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
const results = await analyzer.analyze(network, ['degree'], {
  includeGraphStats: true,
  graphStats: ['density', 'diameter', 'average_clustering']
});

console.log(results.graph);
// { density: 0.67, diameter: 3, average_clustering: 0.45 }
```

## Accessing All Graph Stats

```javascript
const allStats = NetworkStats.GRAPH_STATS.ALL;
// ['density', 'diameter', 'average_clustering', ...]
```

## Complexity Guide

**Fast (O(1) or O(V)):**
- [[graph-stat-density]] - O(1)
- [[graph-stat-average-degree]] - O(V)
- [[graph-stat-connected-components]] - O(V + E)

**Medium (O(V²) to O(V³)):**
- [[graph-stat-average-clustering]] - O(V·d²)
- [[graph-stat-average-shortest-path]] - O(V² + VE)
- [[graph-stat-diameter]] - O(V³)

## Related Notes

- [[statistics-overview]] - Node-level metrics
- [[networkstats-class]] - How to use graph statistics
- [[graph-stat-density]] - Edge density details
- [[graph-stat-diameter]] - Graph diameter details
- [[graph-stat-average-clustering]] - Average clustering details
- [[graph-stat-average-shortest-path]] - Average path length details
- [[graph-stat-connected-components]] - Component analysis details
- [[graph-stat-average-degree]] - Average degree details


