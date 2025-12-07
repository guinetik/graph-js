---
title: "Radial Layout"
created: "2025-01-03"
tags: [layout, radial, hierarchical, ego-network]
category: "layouts"
related: ["[[layouts-overview]]", "[[layout-shell]]", "[[layout-bfs]]"]
status: "complete"
aliases: ["radial-layout", "ego-layout"]
---

# Radial Layout

Positions nodes in concentric circles based on BFS distance from a center node. The center node is placed at the origin, with connected nodes radiating outward.

## Overview

RadialLayout creates a "target" or "bullseye" visualization:
- **Center**: The focal node (highest degree or user-specified)
- **Ring 1**: Direct neighbors of center node
- **Ring 2**: Neighbors of Ring 1 nodes
- **Outer rings**: Progressively distant nodes

This is particularly effective for **ego networks** - visualizations centered on a specific entity (like "Kevin Bacon" in a movie network).

## Complexity

- **Time**: O(n + m) - BFS traversal + O(n) positioning
- **Space**: O(n + m)

## Usage

```javascript
import { Graph, RadialLayout } from '@guinetik/graph-js';

const graph = new Graph();
graph.addNodesFrom(['Kevin', 'Movie1', 'Actor1', 'Movie2', 'Actor2']);
graph.addEdge('Kevin', 'Movie1');
graph.addEdge('Kevin', 'Movie2');
graph.addEdge('Movie1', 'Actor1');
graph.addEdge('Movie2', 'Actor2');

const layout = new RadialLayout(graph, {
  centerNode: 'Kevin',  // Focal point of the radial layout
  scale: 300,           // Radius of the outermost ring
  sortByDegree: true    // Sort nodes within rings by degree
});

const positions = await layout.getPositions();
```

## Options

- `centerNode` (string|number): Center node for the layout (default: highest degree node)
- `scale` (number): Scale factor - determines maximum radius (default: 1)
- `center` (Object): Center point `{x, y}` (default: `{x: 0, y: 0}`)
- `startAngle` (number): Starting angle in radians (default: -PI/2, i.e., top)
- `sortByDegree` (boolean): Sort nodes within rings by degree for visual grouping (default: true)
- `nodeSizes` (Object): Map of node ID to size for size-aware spacing (optional)
- `defaultNodeSize` (number): Default node size if not in nodeSizes (default: 8)
- `nodePadding` (number): Extra padding between nodes (default: 4)

## Algorithm Details

1. **Center Selection**: Uses provided centerNode, or finds highest-degree node
2. **BFS Traversal**: Groups nodes into "rings" by BFS distance from center
3. **Unreachable Handling**: Disconnected nodes placed in outermost ring
4. **Degree Sorting**: Optional sorting of nodes within rings by degree
5. **Size-Aware Spacing**: Ring radius expands to accommodate node sizes
6. **Angular Distribution**: Nodes evenly distributed around each ring

## Size-Aware Ring Spacing

The layout intelligently calculates ring radius based on node sizes:

```
Minimum circumference needed = sum of (node_diameter + padding)
Ring radius = max(position-based minimum, circumference / 2PI)
```

This ensures nodes don't overlap even when they have varying sizes.

## Radial vs Shell Layout

| Aspect | Radial | Shell |
|--------|--------|-------|
| Ring assignment | BFS distance from center | Degree (high degree = inner) |
| Center node | User-specified or highest degree | Implicitly highest degree |
| Best for | Ego networks, distance visualization | Hub networks, centrality |

## Use Cases

- **Ego Networks**: Social network around a focal person
- **Six Degrees**: Movie/actor networks (Kevin Bacon)
- **Star Topology**: Central server with clients
- **Influence Visualization**: Show reach from a central entity
- **Network Hops**: Visualize "distance" in a network

## Visual Example

```
        Node5
       /     \
  Node4       Node6
     \       /
      Ring 2
        |
  Node2---Node3
     \   /
      Ring 1
        |
     [CENTER]
```

## Related Notes

- [[layouts-overview]] - All layout algorithms
- [[layout-shell]] - Shell layout (groups by degree)
- [[layout-bfs]] - BFS layer layout
- [[layout-circular]] - Simple circular layout


