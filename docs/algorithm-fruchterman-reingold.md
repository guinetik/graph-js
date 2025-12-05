---
title: "Fruchterman-Reingold Algorithm"
created: "2025-01-03"
tags: [algorithm, fruchterman-reingold, force-directed, physics]
category: "algorithms"
related: ["[[layout-force-directed]]", "[[layouts-overview]]"]
status: "complete"
aliases: ["fruchterman-reingold", "fr-algorithm"]
---

# Fruchterman-Reingold Algorithm

Force-directed layout algorithm that simulates physical forces to position nodes.

## Overview

Fruchterman-Reingold models nodes as particles with:
- **Repulsive forces**: Between all node pairs (like electrical charges)
- **Attractive forces**: Between connected nodes (like springs)

## Force Equations

**Repulsion** (between all pairs):
```
f_rep = k² / distance
```

**Attraction** (between connected nodes):
```
f_att = distance² / k
```

Where `k` is the optimal distance between nodes.

## Algorithm

1. Initialize random positions
2. For each iteration:
   - Calculate repulsive forces
   - Calculate attractive forces
   - Update positions
   - Reduce temperature (cooling)
3. Repeat until convergence

## Cooling Schedule

Temperature decreases over iterations to allow convergence:
```
temperature = initial_temp × (1 - iteration / max_iterations)
```

## Complexity

- **Time**: O(iterations × n²) - Quadratic in nodes
- **Space**: O(n²)

## Parameters

- `iterations`: Number of iterations (default: 50)
- `k`: Optimal distance (default: auto-calculated)
- `threshold`: Convergence threshold (default: 1e-4)

## Use Cases

- **Force-Directed Layout**: Primary use case
- **General Graphs**: Works well for most graph types
- **Interactive Visualization**: Smooth, organic layouts

## Related Notes

- [[layout-force-directed]] - ForceDirectedLayout implementation
- [[layouts-overview]] - All layout algorithms


