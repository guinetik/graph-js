---
title: "Random Layout"
created: "2025-01-03"
tags: [layout, random, simple]
category: "layouts"
related: ["[[layouts-overview]]", "[[layout-circular]]"]
status: "complete"
aliases: ["random-layout"]
---

# Random Layout

Places nodes at random positions. Fast initialization layout for testing and starting positions.

## Overview

RandomLayout assigns random (x, y) coordinates to each node. Useful for:
- Testing and debugging
- Initial positions for iterative layouts
- Quick visualization when layout quality doesn't matter

## Complexity

- **Time**: O(n) - Single pass through nodes
- **Space**: O(n)

## Usage

```javascript
import { Graph, RandomLayout } from '@guinetik/graph-js';

const graph = new Graph();
graph.addNodesFrom(['A', 'B', 'C']);
graph.addEdge('A', 'B');

const layout = new RandomLayout(graph, {
  scale: 200,        // Bounding box size
  center: { x: 0, y: 0 }
});

const positions = await layout.getPositions();
```

## Options

- `scale` (number): Bounding box size (default: 1)
- `center` (Object): Center point `{x, y}` (default: `{x: 0, y: 0}`)

## Use Cases

- **Testing**: Quick layout for testing visualizations
- **Initialization**: Starting positions for iterative algorithms
- **Random Sampling**: Random graph exploration

## Related Notes

- [[layouts-overview]] - All layout algorithms
- [[layout-circular]] - Alternative simple layout

