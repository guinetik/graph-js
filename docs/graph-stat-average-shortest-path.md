---
title: "Average Shortest Path Length"
created: "2025-01-03"
tags: [graph-stat, path-length, graph-level]
category: "metrics"
related: ["[[graph-stats-overview]]", "[[graph-stat-diameter]]", "[[metric-closeness]]"]
status: "complete"
aliases: ["average-shortest-path", "mean-path-length"]
---

# Average Shortest Path Length

Mean of all pairwise shortest path lengths. Measures typical separation between nodes.

## Overview

Average shortest path length is the mean distance between all pairs of nodes. It provides insight into how "close" nodes typically are to each other.

## Formula

```
average_shortest_path = (1 / (n × (n - 1))) × Σ d(u, v)
```

Where:
- `n` = number of nodes
- `d(u, v)` = shortest path distance from `u` to `v`
- Sum is over all node pairs

## Disconnected Graphs

For disconnected graphs, only connected pairs are considered. Pairs in different components are excluded.

## Complexity

- **Time**: O(V² + VE) using repeated BFS
- **Space**: O(V + E)

## Use Cases

- **Network Proximity**: Measure typical node separation
- **Small World Analysis**: Identify small-world networks
- **Graph Structure**: Understand network topology
- **Performance**: Estimate average path lengths

## Example

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
const network = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' },
  { source: 'C', target: 'D' }
];

const results = await analyzer.analyze(network, [], {
  includeGraphStats: true,
  graphStats: ['average_shortest_path']
});

console.log(results.graph.average_shortest_path);
// Average distance between all node pairs
```

## Interpretation

- **Low (<3)**: Nodes are typically close (small-world)
- **High (>5)**: Nodes are typically far apart
- **Related to diameter**: Average path ≤ diameter

## Related Statistics

- [[graph-stat-diameter]] - Maximum path length
- [[metric-closeness]] - Node-level closeness centrality

## Related Notes

- [[graph-stats-overview]] - All graph-level statistics
- [[graph-stat-diameter]] - Graph diameter statistic
- [[metric-closeness]] - Closeness centrality metric


