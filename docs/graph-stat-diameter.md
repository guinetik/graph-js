---
title: "Graph Diameter"
created: "2025-01-03"
tags: [graph-stat, diameter, graph-level, path]
category: "metrics"
related: ["[[graph-stats-overview]]", "[[graph-stat-average-shortest-path]]", "[[metric-closeness]]"]
status: "complete"
aliases: ["diameter"]
---

# Graph Diameter

The longest shortest path in the graph. Measures maximum separation between any two nodes.

## Overview

Graph diameter is the maximum distance between any pair of nodes in the graph. It provides insight into how "spread out" the network is.

## Definition

```
diameter = max(d(u, v)) for all node pairs (u, v)
```

Where `d(u, v)` is the shortest path distance between nodes `u` and `v`.

## Disconnected Graphs

For disconnected graphs, diameter is `Infinity` since some nodes are unreachable.

## Complexity

- **Time**: O(V³) using Floyd-Warshall or O(VE) using repeated BFS
- **Space**: O(V²)

## Use Cases

- **Network Spread**: Measure maximum separation
- **Small World Analysis**: Identify small-world networks (low diameter)
- **Graph Structure**: Understand network topology
- **Performance**: Estimate worst-case path lengths

## Example

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
// Linear chain: A-B-C-D (diameter = 3)
const network = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' },
  { source: 'C', target: 'D' }
];

const results = await analyzer.analyze(network, [], {
  includeGraphStats: true,
  graphStats: ['diameter']
});

console.log(results.graph.diameter); // 3
```

## Interpretation

- **Low diameter (<5)**: Small-world network, nodes are close
- **High diameter (>10)**: Network is spread out
- **Diameter = Infinity**: Disconnected graph

## Related Statistics

- [[graph-stat-average-shortest-path]] - Average path length
- [[metric-closeness]] - Node-level closeness centrality

## Related Notes

- [[graph-stats-overview]] - All graph-level statistics
- [[graph-stat-average-shortest-path]] - Average shortest path statistic

