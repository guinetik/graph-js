---
title: "Brandes Algorithm"
created: "2025-01-03"
tags: [algorithm, brandes, betweenness, shortest-paths]
category: "algorithms"
related: ["[[metric-betweenness]]", "[[statistics-overview]]"]
status: "complete"
aliases: ["brandes", "brandes-algorithm"]
---

# Brandes Algorithm

Efficient algorithm for computing betweenness centrality. Reduces complexity from O(V³) to O(V·E) for unweighted graphs.

## Overview

The Brandes algorithm computes betweenness centrality by:
1. Running BFS from each node
2. Counting shortest paths
3. Accumulating dependencies
4. Avoiding redundant path counting

## Algorithm Steps

For each node `s`:
1. Run BFS from `s` to find shortest paths
2. Build dependency tree
3. Accumulate dependencies bottom-up
4. Add to betweenness scores

## Complexity

- **Time**: O(V·E) for unweighted graphs
- **Time**: O(V·E + V² log V) for weighted graphs (using Dijkstra)
- **Space**: O(V + E)

## Comparison

| Method | Complexity | Notes |
|--------|------------|-------|
| Naive | O(V³) | Count all paths explicitly |
| Brandes | O(V·E) | Efficient dependency accumulation |

## Implementation

Used internally by [[metric-betweenness]] for efficient computation.

## Use Cases

- **Betweenness Centrality**: Primary use case
- **Shortest Path Analysis**: Path counting
- **Network Analysis**: Bridge detection

## Related Notes

- [[metric-betweenness]] - Betweenness centrality metric
- [[statistics-overview]] - All metrics


