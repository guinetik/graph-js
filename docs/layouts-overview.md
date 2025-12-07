---
title: "Layout Algorithms Overview"
created: "2025-01-03"
tags: [layouts, visualization, overview]
category: "layouts"
related: ["[[graph-data-structure]]", "[[networkstats-class]]"]
status: "complete"
aliases: ["layouts", "layout-algorithms"]
---

# Layout Algorithms Overview

graph-js provides 13 layout algorithms for computing node positions for visualization.

## Available Layouts

| Layout | Category | Complexity | Best For |
|--------|----------|------------|----------|
| None (D3 Physics) | Physics | O(iterations) | Interactive exploration, general graphs |
| [[layout-random]] | Simple | O(n) | Testing, initialization |
| [[layout-circular]] | Simple | O(n) | Symmetric graphs, rings |
| [[layout-spiral]] | Simple | O(n) | Linear structures |
| [[layout-shell]] | Simple | O(n) | Hub networks (requires degree) |
| [[layout-spectral]] | Spectral | O(n) | Communities (requires eigenvector-laplacian) |
| [[layout-force-directed]] | Physics | O(iter·n²) | General graphs |
| [[layout-kamada-kawai]] | Energy | O(n³ + iter·n²) | Small-medium graphs, trees |
| [[layout-bipartite]] | Hierarchical | O(n) | Two-layer graphs |
| [[layout-multipartite]] | Hierarchical | O(n) | DAGs, hierarchies |
| [[layout-bfs]] | Hierarchical | O(n + m) | Trees, exploration |
| [[layout-dfs]] | Hierarchical | O(n + m) | Tree structures, call graphs |
| [[layout-radial]] | Hierarchical | O(n + m) | Ego networks, star topology |

> **Note:** "None" uses D3's built-in force simulation instead of a custom layout algorithm.

## Usage Pattern

```javascript
import { Graph, ForceDirectedLayout } from '@guinetik/graph-js';

// 1. Create graph
const graph = new Graph();
graph.addNodesFrom(['A', 'B', 'C']);
graph.addEdge('A', 'B');
graph.addEdge('B', 'C');

// 2. Create layout
const layout = new ForceDirectedLayout(graph, {
  iterations: 100,
  scale: 200
});

// 3. Compute positions (async!)
const positions = await layout.getPositions();

console.log(positions);
// { 'A': { x: 120, y: 240 }, 'B': { x: 310, y: 150 }, ... }
```

## Layout Registry

Use `LAYOUT_REGISTRY` to discover layouts programmatically:

```javascript
import { LAYOUT_REGISTRY } from '@guinetik/graph-js';

// Get all layouts
const allLayouts = LAYOUT_REGISTRY.getAll();

// Get physics-based layouts
const physicsLayouts = LAYOUT_REGISTRY.byCategory('physics');

// Get layouts without stat requirements
const simpleLayouts = LAYOUT_REGISTRY.withoutStatRequirements();
```

## Categories

- **Simple**: Fast, no computation required
- **Physics**: Force-directed simulation
- **Energy**: Energy minimization
- **Spectral**: Eigenvalue-based
- **Hierarchical**: Tree/DAG layouts

## Stat Requirements

Some layouts require pre-computed statistics:

- [[layout-shell]] - Requires `degree`
- [[layout-spectral]] - Requires `eigenvector-laplacian`

## Selection Guide

- **General purpose**: [[layout-force-directed]]
- **Small graphs**: [[layout-kamada-kawai]]
- **Symmetric graphs**: [[layout-circular]]
- **Communities**: [[layout-spectral]]
- **Trees**: [[layout-bfs]], [[layout-dfs]], or [[layout-kamada-kawai]]
- **Hierarchies**: [[layout-multipartite]]
- **Ego networks**: [[layout-radial]]
- **Call graphs**: [[layout-dfs]]

## Related Notes

- [[graph-data-structure]] - Graph class used by layouts
- [[layout-random]] - RandomLayout details
- [[layout-circular]] - CircularLayout details
- [[layout-spiral]] - SpiralLayout details
- [[layout-shell]] - ShellLayout details
- [[layout-spectral]] - SpectralLayout details
- [[layout-force-directed]] - ForceDirectedLayout details
- [[layout-kamada-kawai]] - KamadaKawaiLayout details
- [[layout-bipartite]] - BipartiteLayout details
- [[layout-multipartite]] - MultipartiteLayout details
- [[layout-bfs]] - BFSLayout details
- [[layout-dfs]] - DFSLayout details
- [[layout-radial]] - RadialLayout details


