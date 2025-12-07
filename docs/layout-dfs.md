---
title: "DFS Layout"
created: "2025-01-03"
tags: [layout, dfs, hierarchical, tree]
category: "layouts"
related: ["[[layouts-overview]]", "[[layout-bfs]]"]
status: "complete"
aliases: ["dfs-layout", "depth-first-layout"]
---

# DFS Layout

Nested tree layout based on depth-first search traversal. Creates hierarchical visualizations where children are positioned below (or beside) their parent.

## Overview

DFSLayout arranges nodes as a nested tree based on DFS traversal:
- **Root node**: Starting point at top (or left in horizontal mode)
- **Children**: Positioned below parent, spread horizontally
- **Grandchildren**: Positioned at next depth level
- **Disconnected components**: Handled as separate trees

Unlike [[layout-bfs]] which creates horizontal layers by distance, DFS creates a tree structure following depth-first exploration paths.

## Complexity

- **Time**: O(n + m) - DFS traversal + O(n) positioning
- **Space**: O(n + m)

## Usage

```javascript
import { Graph, DFSLayout } from '@guinetik/graph-js';

const graph = new Graph();
graph.addNodesFrom(['A', 'B', 'C', 'D', 'E']);
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');
graph.addEdge('C', 'E');

const layout = new DFSLayout(graph, {
  startNode: 'A',       // Starting node for DFS (default: first node)
  align: 'vertical',    // 'vertical' (tree grows down) or 'horizontal' (grows right)
  scale: 200            // Scale factor for positions
});

const positions = await layout.getPositions();
```

## Options

- `startNode` (string|number): Starting node for DFS traversal (default: first node)
- `align` (string): Tree orientation - `'vertical'` (grows down) or `'horizontal'` (grows right) (default: `'vertical'`)
- `scale` (number): Scale factor for final positions (default: 1)
- `center` (Object): Center point `{x, y}` (default: `{x: 0, y: 0}`)
- `horizontalSpacing` (number): Spacing between sibling nodes (default: 1)
- `verticalSpacing` (number): Spacing between depth levels (default: 1)

## Algorithm Details

1. **DFS Traversal**: Uses iterative DFS (stack-based, worker-safe) to build a spanning tree
2. **Tree Building**: Records parent-child relationships as edges are discovered
3. **Layer Grouping**: Nodes are grouped by their DFS depth level
4. **Horizontal Positioning**: Nodes at same depth spread evenly, sorted by parent position
5. **Normalization**: Positions scaled to fit viewport with independent X/Y scaling

## DFS vs BFS Layout

| Aspect | DFS | BFS |
|--------|-----|-----|
| Traversal | Depth-first (stack) | Breadth-first (queue) |
| Layer meaning | Discovery depth | Distance from root |
| Visual style | Nested tree | Horizontal layers |
| Best for | Tree structures, call graphs | Distance visualization |

## Use Cases

- **Tree Structures**: Filesystem hierarchies, org charts
- **Call Graphs**: Function call relationships
- **Recursive Patterns**: Algorithm visualization
- **Dependency Trees**: Package dependencies
- **Genealogy**: Family tree structures

## Related Notes

- [[layouts-overview]] - All layout algorithms
- [[layout-bfs]] - BFS-based layer layout
- [[layout-multipartite]] - Multi-layer hierarchical layout


