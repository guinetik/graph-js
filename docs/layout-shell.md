---
title: "Shell Layout"
created: "2025-01-03"
tags: [layout, shell, hierarchical, simple]
category: "layouts"
related: ["[[layouts-overview]]", "[[metric-degree]]"]
status: "complete"
aliases: ["shell-layout"]
---

# Shell Layout

Arranges nodes in concentric shells based on degree. High-degree nodes in center, low-degree nodes in outer shells.

## Overview

ShellLayout groups nodes by degree into concentric circles:
- **Center**: Highest degree nodes (hubs)
- **Outer shells**: Lower degree nodes

## Requirements

**Optionally uses pre-computed `degree` statistic** for grouping (see [[metric-degree]]). If not provided, degree is computed automatically from edges.

## Complexity

- **Time**: O(n) - Single pass through nodes
- **Space**: O(n)

## Usage

```javascript
import { Graph, ShellLayout } from '@guinetik/graph-js';

const graph = new Graph();
graph.addNodesFrom(['A', 'B', 'C', 'D', 'E']);
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('A', 'D');

// Basic usage - auto-groups by degree
const layout = new ShellLayout(graph, {
  scale: 200
});

// Or with explicit shell grouping
const layoutCustom = new ShellLayout(graph, {
  scale: 200,
  nlist: [['A'], ['B', 'C', 'D', 'E']]  // Define custom shells
});

const positions = await layout.getPositions();
```

## Options

- `scale` (number): Scale factor for positions (default: 100)
- `center` (Object): Center point `{x, y}` (default: `{x: 0, y: 0}`)
- `nlist` (Array<Array<string>>): Pre-defined node shells - overrides auto-grouping (optional)
- `rotate` (number|null): Rotation offset between shells (default: π/num_shells)
- `nodeProperties` (Map): Map of node ID to properties with degree values (optional)

## Use Cases

- **Hub Networks**: Networks with clear hub structure
- **Scale-Free Networks**: Power-law degree distributions
- **Centrality Visualization**: Visualize degree centrality
- **Star Networks**: Networks with central hubs

## Related Notes

- [[layouts-overview]] - All layout algorithms
- [[metric-degree]] - Degree centrality metric

