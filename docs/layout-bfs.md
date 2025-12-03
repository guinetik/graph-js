---
title: "BFS Layout"
created: "2025-01-03"
tags: [layout, bfs, hierarchical, tree]
category: "layouts"
related: ["[[layouts-overview]]", "[[layout-multipartite]]"]
status: "complete"
aliases: ["bfs-layout", "breadth-first-layout"]
---

# BFS Layout

Layer layout based on breadth-first search. Excellent for trees and exploration-based visualization.

## Overview

BFSLayout arranges nodes in layers based on BFS traversal:
- **Layer 0**: Root node(s)
- **Layer 1**: Nodes at distance 1
- **Layer 2**: Nodes at distance 2
- etc.

## Complexity

- **Time**: O(n + m) - BFS traversal
- **Space**: O(n + m)

## Usage

```javascript
import { Graph, BFSLayout } from '@guinetik/graph-js';

const graph = new Graph();
graph.addNodesFrom(['A', 'B', 'C', 'D']);
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');

const layout = new BFSLayout(graph, {
  startNode: 'A',       // Starting node for BFS (default: first node)
  align: 'vertical',    // 'vertical' or 'horizontal' layer orientation
  scale: 200            // Scale factor for positions
});

const positions = await layout.getPositions();
```

## Options

- `startNode` (string|number): Starting node for BFS traversal (default: first node)
- `align` (string): Layer orientation - `'vertical'` or `'horizontal'` (default: `'vertical'`)
- `scale` (number): Scale factor for final positions (default: 1)
- `center` (Object): Center point `{x, y}` (default: `{x: 0, y: 0}`)

## Use Cases

- **Trees**: Perfect for tree structures
- **Exploration**: BFS-based exploration visualization
- **Hierarchies**: Hierarchical tree visualization
- **Distance Visualization**: Visualize distance from root

## Related Notes

- [[layouts-overview]] - All layout algorithms
- [[layout-multipartite]] - Multi-layer hierarchical layout

