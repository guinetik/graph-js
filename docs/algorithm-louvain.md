---
title: "Louvain Algorithm"
created: "2025-01-03"
tags: [algorithm, louvain, community-detection, modularity]
category: "algorithms"
related: ["[[community-detection-overview]]", "[[networkstats-class]]"]
status: "complete"
aliases: ["louvain", "louvain-method"]
---

# Louvain Algorithm

Greedy optimization method for community detection using modularity optimization. One of the most popular community detection algorithms.

## Overview

The Louvain method is a fast, greedy algorithm that optimizes modularity to find communities. It works in two phases:
1. **Modularity Optimization**: Move nodes to maximize modularity gain
2. **Community Aggregation**: Merge communities and repeat

## Algorithm

1. Start with each node in its own community
2. For each node, try moving it to neighboring communities
3. Calculate modularity gain for each move
4. Move node to community with highest gain (if positive)
5. Repeat until no improvement possible
6. Aggregate communities into super-nodes
7. Repeat on aggregated graph

## Complexity

- **Time**: O(n log n) where n is number of nodes
- **Space**: O(n + m) where m is number of edges

## Usage

```javascript
import { CommunityDetection, LouvainAlgorithm, Graph } from '@guinetik/graph-js';

const graph = new Graph();
graph.addNodesFrom(['A', 'B', 'C', 'D']);
graph.addEdge('A', 'B', 1);
graph.addEdge('B', 'C', 1);
graph.addEdge('C', 'D', 1);

const detector = new CommunityDetection(graph);
const algorithm = new LouvainAlgorithm({
  resolution: 1.0,        // Resolution parameter
  maxIterations: 100      // Maximum iterations
});

const result = await detector.detectCommunities(algorithm, {
  onProgress: (p) => console.log(`${Math.round(p * 100)}%`)
});

console.log(result.communities);     // { 'A': 0, 'B': 0, 'C': 1, 'D': 1 }
console.log(result.modularity);      // 0.42
console.log(result.numCommunities);  // 2
```

## Options

- `resolution` (number): Resolution parameter for modularity (default: 1.0)
  - Higher resolution → more communities
  - Lower resolution → fewer communities
- `maxIterations` (number): Maximum iterations (default: 100)

## Modularity

Modularity measures partition quality:
```
Q = (1/2m) × Σ [A_ij - (k_i × k_j / 2m)] × δ(c_i, c_j)
```

Where:
- `A_ij` = adjacency matrix
- `k_i` = degree of node i
- `m` = total edges
- `δ(c_i, c_j)` = 1 if nodes in same community, 0 otherwise

## Use Cases

- **Social Networks**: Find friend groups, communities
- **Citation Networks**: Identify research communities
- **Biological Networks**: Find protein complexes
- **Web Graphs**: Identify topic communities

## Performance

- **Small graphs (<1000 nodes)**: Very fast (<1 second)
- **Medium graphs (1000-10000 nodes)**: Fast (<10 seconds)
- **Large graphs (>10000 nodes)**: Good performance (<1 minute)

## Related Notes

- [[community-detection-overview]] - Community detection overview
- [[networkstats-class]] - Using via NetworkStats API

