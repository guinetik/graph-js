---
title: "Force-Directed Layout"
created: "2025-01-03"
tags: [layout, force-directed, physics, fruchterman-reingold]
category: "layouts"
related: ["[[layouts-overview]]", "[[algorithm-fruchterman-reingold]]"]
status: "complete"
aliases: ["force-directed-layout", "fruchterman-reingold"]
---

# Force-Directed Layout

Spring-electrical model using Fruchterman-Reingold algorithm. General-purpose layout for most graph types.

## Overview

ForceDirectedLayout simulates physical forces:
- **Repulsive forces**: Between all node pairs (like electrical charges)
- **Attractive forces**: Between connected nodes (like springs)

The algorithm iteratively adjusts positions to minimize energy.

## Algorithm

Uses **Fruchterman-Reingold algorithm** (see [[algorithm-fruchterman-reingold]]):
- Repulsion: `k² / distance`
- Attraction: `distance² / k`
- Cooling: Temperature decreases over iterations

## Complexity

- **Time**: O(iterations × n²) - Quadratic in nodes
- **Space**: O(n²)

## Usage

```javascript
import { Graph, ForceDirectedLayout } from '@guinetik/graph-js';

const graph = new Graph();
graph.addNodesFrom(['A', 'B', 'C', 'D']);
graph.addEdge('A', 'B');
graph.addEdge('B', 'C');

const layout = new ForceDirectedLayout(graph, {
  iterations: 100,      // Number of iterations
  k: null,              // Optimal distance (auto-calculated)
  scale: 200,           // Scale factor
  center: { x: 0, y: 0 },
  threshold: 1e-4       // Convergence threshold
});

const positions = await layout.getPositions();
```

## Options

- `iterations` (number): Number of iterations (default: 50)
- `k` (number): Optimal distance between nodes (default: auto-calculated)
- `scale` (number): Scale factor (default: 1)
- `center` (Object): Center point `{x, y}` (default: `{x: 0, y: 0}`)
- `threshold` (number): Convergence threshold (default: 1e-4)

## Use Cases

- **General Graphs**: Works well for most graph types
- **Medium Graphs**: Good for 100-1000 nodes
- **Interactive Visualization**: Smooth, organic layouts
- **Network Exploration**: Exploratory graph analysis

## Performance

- **Small graphs (<100 nodes)**: Very fast
- **Medium graphs (100-1000 nodes)**: Good performance
- **Large graphs (>1000 nodes)**: May be slow, consider fewer iterations

## Related Notes

- [[layouts-overview]] - All layout algorithms
- [[algorithm-fruchterman-reingold]] - Algorithm details
- [[layout-kamada-kawai]] - Alternative energy-based layout


