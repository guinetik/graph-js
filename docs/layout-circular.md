---
title: "Circular Layout"
created: "2025-01-03"
tags: [layout, circular, simple]
category: "layouts"
related: ["[[layouts-overview]]", "[[layout-spiral]]"]
status: "complete"
aliases: ["circular-layout"]
---

# Circular Layout

Places nodes in a circle. Ideal for symmetric graphs and ring structures.

## Overview

CircularLayout arranges nodes evenly around a circle. Perfect for:
- Ring networks
- Symmetric graphs
- Regular structures
- Small to medium graphs

## Complexity

- **Time**: O(n) - Single pass through nodes
- **Space**: O(n)

## Usage

```javascript
import { Graph, CircularLayout } from '@guinetik/graph-js';

const graph = new Graph();
graph.addNodesFrom(['A', 'B', 'C', 'D', 'E']);

const layout = new CircularLayout(graph, {
  radius: 100,       // Circle radius
  center: { x: 0, y: 0 }
});

const positions = await layout.getPositions();
```

## Options

- `radius` (number): Circle radius (default: auto-calculated)
- `center` (Object): Center point `{x, y}` (default: `{x: 0, y: 0}`)

## Use Cases

- **Ring Networks**: Circular network topologies
- **Symmetric Graphs**: Graphs with rotational symmetry
- **Small Graphs**: Clear visualization of small networks
- **Regular Structures**: Regular graph patterns

## Related Notes

- [[layouts-overview]] - All layout algorithms
- [[layout-spiral]] - Alternative circular arrangement


