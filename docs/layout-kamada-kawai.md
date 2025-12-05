---
title: "Kamada-Kawai Layout"
created: "2025-01-03"
tags: [layout, kamada-kawai, energy, optimization]
category: "layouts"
related: ["[[layouts-overview]]", "[[algorithm-kamada-kawai]]"]
status: "complete"
aliases: ["kamada-kawai-layout", "kk-layout"]
---

# Kamada-Kawai Layout

Energy minimization layout based on all-pairs shortest paths. Excellent for small to medium graphs and trees.

## Overview

KamadaKawaiLayout positions nodes such that their Euclidean distance matches the graph-theoretic distance. The algorithm minimizes energy by adjusting node positions.

## Algorithm

Uses energy minimization (see [[algorithm-kamada-kawai]]):
1. Compute all-pairs shortest paths
2. Define target distances based on shortest paths
3. Minimize energy function iteratively
4. Update positions using gradient descent

## Complexity

- **Time**: O(n³) for shortest paths + O(iterations × n²) for optimization
- **Space**: O(n²)

## Usage

```javascript
import { Graph, KamadaKawaiLayout } from '@guinetik/graph-js';

const graph = new Graph();
graph.addNodesFrom(['A', 'B', 'C', 'D']);
graph.addEdge('A', 'B');
graph.addEdge('B', 'C');

const layout = new KamadaKawaiLayout(graph, {
  iterations: 1000,    // Number of iterations
  scale: 200,          // Scale factor
  center: { x: 0, y: 0 },
  threshold: 1e-4,     // Convergence threshold
  K: null              // Spring constant (auto-calculated)
});

const positions = await layout.getPositions();
```

## Options

- `iterations` (number): Number of iterations (default: 1000)
- `scale` (number): Scale factor (default: 1)
- `center` (Object): Center point `{x, y}` (default: `{x: 0, y: 0}`)
- `threshold` (number): Convergence threshold (default: 1e-4)
- `K` (number): Spring constant scaling (default: auto-calculated)

## Use Cases

- **Small Graphs**: Excellent for <100 nodes
- **Medium Graphs**: Good for 100-500 nodes
- **Trees**: Perfect for tree structures
- **Planar Graphs**: Works well for planar graphs
- **Aesthetic Layouts**: Produces visually pleasing layouts

## Performance

- **Small graphs (<100 nodes)**: Fast
- **Medium graphs (100-500 nodes)**: Good performance
- **Large graphs (>500 nodes)**: May be slow due to O(n³) shortest paths

## Related Notes

- [[layouts-overview]] - All layout algorithms
- [[algorithm-kamada-kawai]] - Algorithm details
- [[layout-force-directed]] - Alternative physics-based layout


