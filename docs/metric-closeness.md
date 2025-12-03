---
title: "Closeness Centrality"
created: "2025-01-03"
tags: [metric, centrality, closeness, node-level]
category: "metrics"
related: ["[[statistics-overview]]", "[[metric-betweenness]]", "[[graph-stat-average-shortest-path]]"]
status: "complete"
aliases: ["closeness", "closeness-centrality"]
---

# Closeness Centrality

Measures how close a node is to all other nodes in the graph. Based on average shortest path length from the node to all others.

## Overview

Closeness centrality identifies nodes that can quickly reach the entire network. Nodes with high closeness have short average distances to all other nodes, making them central in terms of accessibility.

## Formula

For node `v`:
```
closeness(v) = (n - 1) / Σ d(v, u)
```

Where:
- `n` = number of nodes
- `d(v, u)` = shortest path distance from `v` to `u`
- Sum is over all reachable nodes

## Normalization

The formula uses `(n - 1)` to normalize, giving a value between 0 and 1 for connected graphs.

## Complexity

- **Time**: O(V² + VE) using BFS from each node
- **Space**: O(V + E)

## Use Cases

- **Network Accessibility**: Find nodes that can quickly reach others
- **Information Spreading**: Identify good starting points for broadcasts
- **Social Networks**: Find people who can quickly reach everyone
- **Infrastructure**: Locate facilities for optimal access

## Example

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
const network = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' },
  { source: 'C', target: 'D' },
  { source: 'A', target: 'E' }  // E is closer to center
];

const results = await analyzer.analyze(network, ['closeness']);

console.log(results);
// Central nodes (B, C) have higher closeness
```

## Interpretation

- **High closeness**: Node can quickly reach all other nodes
- **Low closeness**: Node is peripheral, far from others
- **Zero closeness**: Isolated node (unreachable)

## Disconnected Graphs

For disconnected graphs, closeness is computed only over reachable nodes. Nodes in different components have zero closeness to each other.

## Related Metrics

- [[metric-betweenness]] - Path-based centrality
- [[graph-stat-average-shortest-path]] - Average path length across all pairs
- [[metric-degree]] - Simple connection count

## Related Notes

- [[statistics-overview]] - All available metrics
- [[metric-betweenness]] - Related path-based metric
- [[graph-stat-average-shortest-path]] - Graph-level path statistics

