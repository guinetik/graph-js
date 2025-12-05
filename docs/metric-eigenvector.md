---
title: "Eigenvector Centrality"
created: "2025-01-03"
tags: [metric, centrality, eigenvector, node-level]
category: "metrics"
related: ["[[statistics-overview]]", "[[algorithm-power-iteration]]", "[[metric-eigenvector-laplacian]]"]
status: "complete"
aliases: ["eigenvector", "eigenvector-centrality"]
---

# Eigenvector Centrality

Measures node importance based on the importance of its neighbors. Uses the power iteration method to compute the principal eigenvector of the adjacency matrix.

## Overview

Eigenvector centrality assigns high scores to nodes that are connected to other highly connected nodes. It's useful for identifying influential nodes in networks where connections to important nodes matter more than just having many connections.

## Formula

For node `v`, eigenvector centrality `x_v` satisfies:
```
x_v = (1/λ) × Σ A_uv × x_u
```

Where:
- `λ` = largest eigenvalue of adjacency matrix
- `A_uv` = adjacency matrix entry
- `x_u` = eigenvector centrality of neighbor `u`

## Algorithm

Uses **power iteration** (see [[algorithm-power-iteration]]):
1. Initialize random vector
2. Iteratively multiply by adjacency matrix
3. Normalize and check convergence
4. Repeat until convergence

## Complexity

- **Time**: O(k × (V + E)) where k is iterations (typically 50-100)
- **Space**: O(V)

## Use Cases

- **Social Networks**: Find influential people connected to other influencers
- **Citation Networks**: Identify important papers cited by important papers
- **Web Graphs**: PageRank-like importance scoring
- **Prestige Measurement**: Nodes with prestigious connections

## Example

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
const network = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' },
  { source: 'B', target: 'D' },
  { source: 'C', target: 'E' }
];

const results = await analyzer.analyze(network, ['eigenvector']);

console.log(results);
// Nodes connected to highly connected nodes get higher scores
```

## Configuration

```javascript
const analyzer = new NetworkStats({
  maxIter: 100,      // Maximum iterations (default: 100)
  tolerance: 1e-6    // Convergence threshold (default: 1e-6)
});
```

## Interpretation

- **High eigenvector**: Node connected to important nodes
- **Low eigenvector**: Node connected to less important nodes
- **Zero eigenvector**: Isolated or disconnected node

## Related Metrics

- [[metric-degree]] - Simple connection count
- [[metric-eigenvector-laplacian]] - Laplacian-based eigenvector
- [[metric-betweenness]] - Path-based centrality

## Related Notes

- [[algorithm-power-iteration]] - Power iteration algorithm details
- [[statistics-overview]] - All available metrics
- [[metric-eigenvector-laplacian]] - Laplacian eigenvector variant


