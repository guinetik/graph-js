---
title: "Average Degree"
created: "2025-01-03"
tags: [graph-stat, degree, graph-level]
category: "metrics"
related: ["[[graph-stats-overview]]", "[[metric-degree]]", "[[graph-stat-density]]"]
status: "complete"
aliases: ["average-degree", "mean-degree"]
---

# Average Degree

Mean number of connections per node. Measures overall network connectivity.

## Overview

Average degree is the mean of all node degrees. It provides a simple measure of overall network connectivity.

## Formula

```
average_degree = (2m) / n
```

Where:
- `m` = number of edges
- `n` = number of nodes

For undirected graphs, factor of 2 accounts for each edge connecting two nodes.

## Complexity

- **Time**: O(V) - Single pass through nodes
- **Space**: O(1)

## Use Cases

- **Connectivity Measure**: Simple connectivity indicator
- **Network Comparison**: Compare connectivity across networks
- **Graph Analysis**: Understand network structure
- **Quick Analysis**: Fast connectivity check

## Example

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
const network = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' },
  { source: 'C', target: 'A' }
  // 3 edges, 3 nodes: average_degree = 2×3/3 = 2
];

const results = await analyzer.analyze(network, [], {
  includeGraphStats: true,
  graphStats: ['average_degree']
});

console.log(results.graph.average_degree); // 2.0
```

## Interpretation

- **Low (<2)**: Sparse network, few connections
- **Medium (2-5)**: Moderate connectivity
- **High (>5)**: Dense network, many connections

## Relationship to Density

Average degree is related to density:
- Higher average degree → higher density
- Lower average degree → lower density

## Related Statistics

- [[metric-degree]] - Individual node degrees
- [[graph-stat-density]] - Edge density

## Related Notes

- [[graph-stats-overview]] - All graph-level statistics
- [[metric-degree]] - Node-level degree metric
- [[graph-stat-density]] - Edge density statistic


