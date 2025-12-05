---
title: "Spectral Layout"
created: "2025-01-03"
tags: [layout, spectral, eigenvector]
category: "layouts"
related: ["[[layouts-overview]]", "[[metric-eigenvector-laplacian]]"]
status: "complete"
aliases: ["spectral-layout"]
---

# Spectral Layout

Uses eigenvectors of the graph Laplacian to position nodes. Excellent for visualizing community structure.

## Overview

SpectralLayout uses the 2nd and 3rd smallest eigenvectors of the graph Laplacian matrix to position nodes in 2D space. Nodes in the same community tend to cluster together.

## Requirements

**Requires pre-computed `eigenvector-laplacian` statistic** (see [[metric-eigenvector-laplacian]]).

## Complexity

- **Time**: O(n) - Uses pre-computed eigenvectors
- **Space**: O(n)

## Usage

```javascript
import { Graph, SpectralLayout } from '@guinetik/graph-js';
import NetworkStats from '@guinetik/graph-js';

// 1. Compute eigenvector-laplacian statistics
const analyzer = new NetworkStats();
const nodeStats = await analyzer.analyze(network, ['eigenvector-laplacian']);

// 2. Create graph
const graph = new Graph();
// ... add nodes and edges

// 3. Create layout with eigenvector stats
const layout = new SpectralLayout(graph, {
  nodeStats: nodeStats,  // Eigenvector-laplacian statistics
  center: { x: 0, y: 0 }
});

const positions = await layout.getPositions();
```

## Options

- `nodeStats` (Array): Node statistics with eigenvector-laplacian values (required)
- `center` (Object): Center point `{x, y}` (default: `{x: 0, y: 0}`)

## Use Cases

- **Community Detection**: Visualize community structure
- **Spectral Clustering**: Spectral analysis visualization
- **Graph Partitioning**: Visualize natural graph cuts
- **Network Analysis**: Understand spectral properties

## How It Works

1. Compute graph Laplacian matrix `L = D - A`
2. Find 2nd and 3rd smallest eigenvectors
3. Use eigenvectors as x and y coordinates
4. Nodes in same community cluster together

## Related Notes

- [[layouts-overview]] - All layout algorithms
- [[metric-eigenvector-laplacian]] - Laplacian eigenvector metric


