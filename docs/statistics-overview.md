---
title: "Statistics Overview"
created: "2025-01-03"
tags: [statistics, metrics, overview, centrality]
category: "metrics"
related: ["[[networkstats-class]]", "[[graph-stats-overview]]"]
status: "complete"
aliases: ["metrics-overview", "node-metrics"]
---

# Statistics Overview

Overview of all node-level metrics available in graph-js.

## Available Metrics

graph-js provides 8 node-level metrics for analyzing network centrality and structure:

| Metric | Description | Complexity | Best For |
|--------|-------------|------------|----------|
| [[metric-degree]] | Number of connections | O(V) | Hub identification |
| [[metric-betweenness]] | Shortest path centrality | O(V³) | Bridge detection |
| [[metric-clustering]] | Triangle density | O(V·d²) | Community structure |
| [[metric-eigenvector]] | Influence based on connections | O(V²) | Prestige/influence |
| [[metric-eigenvector-laplacian]] | Laplacian eigenvector centrality | O(V²) | Spectral analysis |
| [[metric-closeness]] | Average distance to all nodes | O(V²) | Network accessibility |
| [[metric-cliques]] | Maximal complete subgraphs | O(3^(V/3)) | Dense communities |
| [[metric-ego-density]] | Neighborhood density | O(V·d²) | Local cohesion |

## Usage

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
const results = await analyzer.analyze(network, [
  'degree',
  'betweenness',
  'clustering',
  'eigenvector'
]);
```

## Accessing All Metrics

```javascript
const allMetrics = NetworkStats.FEATURES.ALL;
// ['degree', 'betweenness', 'clustering', 'eigenvector', ...]
```

## Complexity Guide

**Fast (O(V) or O(V²)):**
- [[metric-degree]] - O(V)
- [[metric-eigenvector-laplacian]] - O(V²)

**Medium (O(V²) to O(V³)):**
- [[metric-clustering]] - O(V·d²)
- [[metric-eigenvector]] - O(V²)
- [[metric-closeness]] - O(V²)
- [[metric-ego-density]] - O(V·d²)

**Slow (O(V³) or exponential):**
- [[metric-betweenness]] - O(V³)
- [[metric-cliques]] - O(3^(V/3))

## Related Notes

- [[graph-stats-overview]] - Graph-level statistics
- [[networkstats-class]] - How to use metrics
- [[metric-degree]] - Degree centrality details
- [[metric-betweenness]] - Betweenness centrality details
- [[metric-clustering]] - Clustering coefficient details
- [[metric-eigenvector]] - Eigenvector centrality details
- [[metric-eigenvector-laplacian]] - Laplacian eigenvector details
- [[metric-closeness]] - Closeness centrality details
- [[metric-cliques]] - Maximal cliques details
- [[metric-ego-density]] - Ego density details


