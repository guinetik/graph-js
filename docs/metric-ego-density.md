---
title: "Ego Network Density"
created: "2025-01-03"
tags: [metric, ego-density, node-level, local]
category: "metrics"
related: ["[[statistics-overview]]", "[[metric-clustering]]"]
status: "complete"
aliases: ["ego-density", "ego-network-density"]
---

# Ego Network Density

Measures the density of connections among a node's immediate neighbors. Quantifies local cohesion around a node.

## Overview

The ego network of a node consists of the node itself and all its neighbors. Ego density measures how many edges exist among the neighbors (excluding edges to the ego node itself).

## Formula

For node `v` with neighbors `N(v)`:
```
ego-density(v) = actual_edges(N(v)) / possible_edges(N(v))
```

Where:
- `actual_edges(N(v))` = edges among neighbors
- `possible_edges(N(v))` = k × (k - 1) / 2 for k neighbors

## Range

- **0**: No connections among neighbors
- **1**: Complete graph among neighbors (all neighbors connected)

## Complexity

- **Time**: O(V · k²) where k is average degree
- **Space**: O(V + E)

## Use Cases

- **Local Cohesion**: Measure how tightly-knit a node's neighborhood is
- **Community Structure**: Identify nodes embedded in dense communities
- **Social Networks**: Find people whose friends know each other
- **Graph Analysis**: Understand local clustering patterns

## Example

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
// Node A's neighbors (B, C) are connected
const network = [
  { source: 'A', target: 'B' },
  { source: 'A', target: 'C' },
  { source: 'B', target: 'C' },  // Neighbors connected
  { source: 'A', target: 'D' }
];

const results = await analyzer.analyze(network, ['ego-density']);

console.log(results);
// A has high ego-density (B and C are connected)
```

## Interpretation

- **High ego-density (>0.5)**: Neighbors form tight cluster
- **Low ego-density (<0.3)**: Neighbors are loosely connected
- **Zero ego-density**: No connections among neighbors

## Related Metrics

- [[metric-clustering]] - Triangle-based clustering (related concept)
- [[metric-cliques]] - Maximal complete subgraphs

## Related Notes

- [[statistics-overview]] - All available metrics
- [[metric-clustering]] - Related clustering measure

