---
title: "Bipartite Layout"
created: "2025-01-03"
tags: [layout, bipartite, hierarchical]
category: "layouts"
related: ["[[layouts-overview]]", "[[layout-multipartite]]"]
status: "complete"
aliases: ["bipartite-layout"]
---

# Bipartite Layout

Two-layer layout for bipartite graphs. Places nodes in two horizontal layers.

## Overview

BipartiteLayout arranges nodes in two layers:
- **Top layer**: First partition
- **Bottom layer**: Second partition

Perfect for bipartite graphs where nodes belong to two distinct sets.

## Complexity

- **Time**: O(n) - Single pass through nodes
- **Space**: O(n)

## Usage

```javascript
import { Graph, BipartiteLayout } from '@guinetik/graph-js';

const graph = new Graph();
// Add nodes and edges for bipartite graph

const layout = new BipartiteLayout(graph, {
  layerSeparation: 100,  // Distance between layers
  nodeSpacing: 50        // Spacing between nodes in same layer
});

const positions = await layout.getPositions();
```

## Options

- `layerSeparation` (number): Vertical distance between layers (default: 100)
- `nodeSpacing` (number): Horizontal spacing between nodes (default: 50)

## Use Cases

- **Bipartite Graphs**: Two-set networks
- **Two-Layer Networks**: Hierarchical two-level structures
- **Matching Problems**: Assignment visualizations
- **Bipartite Analysis**: Bipartite network exploration

## Related Notes

- [[layouts-overview]] - All layout algorithms
- [[layout-multipartite]] - Multi-layer extension


