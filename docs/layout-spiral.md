---
title: "Spiral Layout"
created: "2025-01-03"
tags: [layout, spiral, simple]
category: "layouts"
related: ["[[layouts-overview]]", "[[layout-circular]]"]
status: "complete"
aliases: ["spiral-layout"]
---

# Spiral Layout

Arranges nodes in a spiral pattern. Useful for linear structures and sequential data.

## Overview

SpiralLayout places nodes along a spiral curve. Good for:
- Linear sequences
- Time-series networks
- Sequential data visualization
- Long chains

## Complexity

- **Time**: O(n) - Single pass through nodes
- **Space**: O(n)

## Usage

```javascript
import { Graph, SpiralLayout } from '@guinetik/graph-js';

const graph = new Graph();
graph.addNodesFrom(['A', 'B', 'C', 'D', 'E']);

const layout = new SpiralLayout(graph, {
  scale: 200,
  center: { x: 0, y: 0 }
});

const positions = await layout.getPositions();
```

## Options

- `scale` (number): Spiral scale (default: 1)
- `center` (Object): Center point `{x, y}` (default: `{x: 0, y: 0}`)

## Use Cases

- **Linear Structures**: Sequential node arrangements
- **Time Series**: Temporal network visualization
- **Chains**: Long chain structures
- **Sequential Data**: Ordered node sequences

## Related Notes

- [[layouts-overview]] - All layout algorithms
- [[layout-circular]] - Alternative circular arrangement

