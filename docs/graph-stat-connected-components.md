---
title: "Connected Components"
created: "2025-01-03"
tags: [graph-stat, components, graph-level, connectivity]
category: "metrics"
related: ["[[graph-stats-overview]]", "[[graph-stat-density]]"]
status: "complete"
aliases: ["connected-components", "components"]
---

# Connected Components

Counts the number of disconnected subgraphs. Identifies network fragmentation.

## Overview

A connected component is a maximal set of nodes where every pair is reachable. The connected components statistic counts how many such components exist in the graph.

## Definition

- **Connected Component**: Maximal set of nodes where all pairs are reachable
- **Count**: Number of disconnected components
- **Mapping**: Node ID → component ID

## Complexity

- **Time**: O(V + E) using BFS/DFS
- **Space**: O(V + E)

## Use Cases

- **Network Fragmentation**: Identify disconnected parts
- **Graph Analysis**: Understand network structure
- **Connectivity**: Measure network connectivity
- **Component Analysis**: Analyze individual components

## Return Value

Returns an object with:
- `count`: Number of components
- `components`: Map of node ID → component ID

## Example

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
// Two disconnected components: A-B and C-D
const network = [
  { source: 'A', target: 'B' },
  { source: 'C', target: 'D' }
];

const results = await analyzer.analyze(network, [], {
  includeGraphStats: true,
  graphStats: ['connected_components']
});

console.log(results.graph.connected_components);
// { count: 2, components: { 'A': 0, 'B': 0, 'C': 1, 'D': 1 } }
```

## Interpretation

- **count = 1**: Fully connected graph
- **count > 1**: Disconnected graph, multiple components
- **count = V**: No edges, all isolated nodes

## Related Statistics

- [[graph-stat-density]] - Edge density
- [[graph-stat-diameter]] - Diameter (Infinity for disconnected graphs)

## Related Notes

- [[graph-stats-overview]] - All graph-level statistics
- [[graph-stat-density]] - Edge density statistic

