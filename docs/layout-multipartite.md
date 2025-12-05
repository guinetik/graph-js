---
title: "Multipartite Layout"
created: "2025-01-03"
tags: [layout, multipartite, hierarchical, dag]
category: "layouts"
related: ["[[layouts-overview]]", "[[layout-bipartite]]", "[[layout-bfs]]"]
status: "complete"
aliases: ["multipartite-layout"]
---

# Multipartite Layout

Multi-layer layout for hierarchical graphs and DAGs. Places nodes in multiple horizontal layers.

## Overview

MultipartiteLayout arranges nodes in multiple layers based on their position in a hierarchy:
- **Top layer**: Source nodes
- **Middle layers**: Intermediate nodes
- **Bottom layer**: Sink nodes

Perfect for DAGs and hierarchical structures.

## Complexity

- **Time**: O(n + m) - Graph traversal
- **Space**: O(n)

## Usage

```javascript
import { Graph, MultipartiteLayout } from '@guinetik/graph-js';

const graph = new Graph();
// Add nodes and edges for hierarchical graph

const layout = new MultipartiteLayout(graph, {
  layerSeparation: 100,  // Distance between layers
  nodeSpacing: 50        // Spacing between nodes in same layer
});

const positions = await layout.getPositions();
```

## Options

- `layerSeparation` (number): Vertical distance between layers (default: 100)
- `nodeSpacing` (number): Horizontal spacing between nodes (default: 50)

## Use Cases

- **DAGs**: Directed acyclic graphs
- **Hierarchies**: Organizational charts
- **Multi-Layer Networks**: Layered network structures
- **Dependency Graphs**: Dependency visualization

## Related Notes

- [[layouts-overview]] - All layout algorithms
- [[layout-bipartite]] - Two-layer variant
- [[layout-bfs]] - BFS-based hierarchical layout


