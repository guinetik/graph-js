---
title: "Average Clustering Coefficient"
created: "2025-01-03"
tags: [graph-stat, clustering, graph-level]
category: "metrics"
related: ["[[graph-stats-overview]]", "[[metric-clustering]]"]
status: "complete"
aliases: ["average-clustering", "mean-clustering"]
---

# Average Clustering Coefficient

Mean of all node clustering coefficients in the graph. Measures overall tendency to form clusters.

## Overview

Average clustering coefficient is the mean of all individual node clustering coefficients. It quantifies how much the network tends to form triangles and local clusters.

## Formula

```
average_clustering = (1/n) × Σ clustering(v)
```

Where:
- `n` = number of nodes
- `clustering(v)` = clustering coefficient of node `v` (see [[metric-clustering]])

## Range

- **0**: No triangles, no clustering
- **1**: Complete clustering, all triangles exist

## Complexity

- **Time**: O(V · k²) where k is average degree
- **Space**: O(V + E)

## Use Cases

- **Community Structure**: Measure overall clustering tendency
- **Social Networks**: Quantify friend-of-friend connections
- **Network Analysis**: Understand clustering patterns
- **Graph Comparison**: Compare clustering across networks

## Example

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
// Network with triangles
const network = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' },
  { source: 'C', target: 'A' },  // Triangle
  { source: 'D', target: 'E' }
];

const results = await analyzer.analyze(network, [], {
  includeGraphStats: true,
  graphStats: ['average_clustering']
});

console.log(results.graph.average_clustering);
// Average of all node clustering coefficients
```

## Interpretation

- **High (>0.5)**: Strong clustering tendency
- **Low (<0.2)**: Weak clustering, more tree-like
- **Zero**: No triangles

## Related Statistics

- [[metric-clustering]] - Individual node clustering coefficients

## Related Notes

- [[graph-stats-overview]] - All graph-level statistics
- [[metric-clustering]] - Node-level clustering coefficient

