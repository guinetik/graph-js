---
title: "Graph Density"
created: "2025-01-03"
tags: [graph-stat, density, graph-level]
category: "metrics"
related: ["[[graph-stats-overview]]", "[[graph-stat-average-degree]]"]
status: "complete"
aliases: ["density", "edge-density"]
---

# Graph Density

Measures how close the network is to being complete. Ratio of actual edges to possible edges.

## Overview

Graph density quantifies overall network connectivity. A complete graph (all nodes connected) has density 1.0, while a sparse graph has density close to 0.

## Formula

For undirected graph with `n` nodes and `m` edges:
```
density = 2m / (n × (n - 1))
```

For directed graphs:
```
density = m / (n × (n - 1))
```

## Range

- **0**: No edges (empty graph)
- **1**: Complete graph (all nodes connected)
- **0.5**: Half of possible edges exist

## Complexity

- **Time**: O(1) - Just counting edges and nodes
- **Space**: O(1)

## Use Cases

- **Network Connectivity**: Measure overall network structure
- **Comparison**: Compare density across different networks
- **Sparsity Analysis**: Identify sparse vs dense networks
- **Graph Classification**: Categorize graph types

## Example

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
const network = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' },
  { source: 'C', target: 'A' }
  // 3 edges, 3 nodes: density = 2×3 / (3×2) = 1.0 (complete triangle)
];

const results = await analyzer.analyze(network, [], {
  includeGraphStats: true,
  graphStats: ['density']
});

console.log(results.graph.density); // 1.0
```

## Interpretation

- **High density (>0.5)**: Dense network, many connections
- **Low density (<0.1)**: Sparse network, few connections
- **Density = 1**: Complete graph

## Related Statistics

- [[graph-stat-average-degree]] - Average connections per node
- [[graph-stat-connected-components]] - Component analysis

## Related Notes

- [[graph-stats-overview]] - All graph-level statistics
- [[graph-stat-average-degree]] - Average degree statistic

