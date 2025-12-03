---
title: "Clustering Coefficient"
created: "2025-01-03"
tags: [metric, clustering, node-level, triangles]
category: "metrics"
related: ["[[statistics-overview]]", "[[graph-stat-average-clustering]]", "[[metric-ego-density]]"]
status: "complete"
aliases: ["clustering", "clustering-coefficient", "local-clustering"]
---

# Clustering Coefficient

Measures the degree to which a node's neighbors are connected to each other. Detects tightly-knit groups and local community structure.

## Overview

The clustering coefficient quantifies how "clustered" a node's neighborhood is. A high clustering coefficient indicates that the node's neighbors tend to form a clique (complete subgraph).

## Formula

For node `v` with degree `k`:
```
clustering(v) = (2 × triangles(v)) / (k × (k - 1))
```

Where:
- `triangles(v)` = number of triangles involving node `v`
- `k × (k - 1) / 2` = maximum possible triangles

## Range

- **0**: No triangles, neighbors are not connected
- **1**: Complete clique, all neighbors are connected
- **0.5**: Half of possible triangles exist

## Complexity

- **Time**: O(V · k²) where k is average degree
- **Space**: O(V + E)

## Use Cases

- **Community Detection**: Identify tightly-knit groups
- **Social Networks**: Find cohesive friend groups
- **Network Structure**: Understand local clustering patterns
- **Graph Analysis**: Measure tendency to form triangles

## Example

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
// Triangle: A-B-C-A
const network = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' },
  { source: 'C', target: 'A' },
  { source: 'A', target: 'D' }  // D is not part of triangle
];

const results = await analyzer.analyze(network, ['clustering']);

console.log(results);
// [
//   { id: 'A', clustering: 0.33 },  // Part of triangle A-B-C
//   { id: 'B', clustering: 1.0 },    // Complete triangle
//   { id: 'C', clustering: 1.0 },    // Complete triangle
//   { id: 'D', clustering: 0 }       // No triangles
// ]
```

## Interpretation

- **High clustering (>0.5)**: Node's neighbors form tight clusters
- **Low clustering (<0.3)**: Neighbors are loosely connected
- **Zero clustering**: No triangles, neighbors don't connect

## Related Metrics

- [[graph-stat-average-clustering]] - Average clustering across all nodes
- [[metric-ego-density]] - Density of ego network (related concept)
- [[metric-cliques]] - Maximal complete subgraphs

## Related Notes

- [[statistics-overview]] - All available metrics
- [[graph-stat-average-clustering]] - Graph-level average clustering
- [[metric-ego-density]] - Ego network density

