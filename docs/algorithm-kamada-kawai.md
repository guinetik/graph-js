---
title: "Kamada-Kawai Algorithm"
created: "2025-01-03"
tags: [algorithm, kamada-kawai, energy-minimization, optimization]
category: "algorithms"
related: ["[[layout-kamada-kawai]]", "[[layouts-overview]]"]
status: "complete"
aliases: ["kamada-kawai", "kk-algorithm"]
---

# Kamada-Kawai Algorithm

Energy minimization algorithm for graph layout. Positions nodes such that Euclidean distance matches graph-theoretic distance.

## Overview

Kamada-Kawai minimizes an energy function:
```
E = Σ Σ k_ij × (d_ij - l_ij)²
```

Where:
- `d_ij` = Euclidean distance between nodes i and j
- `l_ij` = Graph-theoretic distance (shortest path)
- `k_ij` = Spring constant

## Algorithm

1. Compute all-pairs shortest paths
2. Calculate target distances `l_ij`
3. Initialize positions
4. For each iteration:
   - Find node with maximum energy
   - Minimize energy for that node (gradient descent)
   - Update position
5. Repeat until convergence

## Energy Minimization

For each node, minimize:
```
E_i = Σ k_ij × (d_ij - l_ij)²
```

Using gradient descent with Newton's method.

## Complexity

- **Time**: O(n³) for shortest paths + O(iterations × n²) for optimization
- **Space**: O(n²)

## Parameters

- `iterations`: Number of iterations (default: 1000)
- `scale`: Scale factor (default: 1)
- `threshold`: Convergence threshold (default: 1e-4)
- `K`: Spring constant scaling (default: auto-calculated)

## Use Cases

- **Small-Medium Graphs**: Excellent for <500 nodes
- **Trees**: Perfect for tree structures
- **Aesthetic Layouts**: Produces visually pleasing layouts
- **Planar Graphs**: Works well for planar graphs

## Related Notes

- [[layout-kamada-kawai]] - KamadaKawaiLayout implementation
- [[layouts-overview]] - All layout algorithms

