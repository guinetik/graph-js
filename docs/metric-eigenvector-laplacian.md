---
title: "Laplacian Eigenvector Centrality"
created: "2025-01-03"
tags: [metric, eigenvector, laplacian, spectral, node-level]
category: "metrics"
related: ["[[statistics-overview]]", "[[metric-eigenvector]]", "[[layout-spectral]]"]
status: "complete"
aliases: ["eigenvector-laplacian", "laplacian-eigenvector", "spectral-centrality"]
---

# Laplacian Eigenvector Centrality

Computes eigenvectors of the graph Laplacian matrix. Used for spectral analysis and spectral layout visualization.

## Overview

The Laplacian eigenvector computes the 2nd and 3rd smallest eigenvectors of the graph Laplacian matrix `L = D - A`, where `D` is the degree matrix and `A` is the adjacency matrix.

## Formula

Laplacian matrix:
```
L = D - A
```

Where:
- `D` = diagonal degree matrix
- `A` = adjacency matrix

Eigenvectors are computed for the 2nd and 3rd smallest eigenvalues.

## Use Cases

- **Spectral Layout**: Used by [[layout-spectral]] for visualization
- **Spectral Clustering**: Community detection via spectral methods
- **Graph Partitioning**: Finding natural cuts in graphs
- **Spectral Analysis**: Understanding graph structure via eigenvalues

## Complexity

- **Time**: O(V²) - Eigenvalue decomposition
- **Space**: O(V²)

## Example

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
const network = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' },
  { source: 'C', target: 'D' }
];

const results = await analyzer.analyze(network, ['eigenvector-laplacian']);

console.log(results);
// Returns eigenvectors for spectral analysis
```

## Relationship to Spectral Layout

The Laplacian eigenvector is specifically designed for use with [[layout-spectral]], which uses these eigenvectors to position nodes in 2D space based on spectral properties.

## Related Metrics

- [[metric-eigenvector]] - Standard eigenvector centrality
- [[layout-spectral]] - Spectral layout using this metric

## Related Notes

- [[statistics-overview]] - All available metrics
- [[layout-spectral]] - Spectral layout algorithm
- [[metric-eigenvector]] - Standard eigenvector centrality

