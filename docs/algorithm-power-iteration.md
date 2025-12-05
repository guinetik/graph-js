---
title: "Power Iteration"
created: "2025-01-03"
tags: [algorithm, power-iteration, eigenvector, linear-algebra]
category: "algorithms"
related: ["[[metric-eigenvector]]", "[[statistics-overview]]"]
status: "complete"
aliases: ["power-iteration", "power-method"]
---

# Power Iteration

Iterative method for computing the principal eigenvector of a matrix. Used for eigenvector centrality.

## Overview

Power iteration computes the largest eigenvector by repeatedly multiplying a vector by the matrix and normalizing.

## Algorithm

1. Initialize random vector `v₀`
2. For each iteration:
   - `vₖ₊₁ = A × vₖ` (multiply by adjacency matrix)
   - `vₖ₊₁ = vₖ₊₁ / ||vₖ₊₁||` (normalize)
3. Check convergence: `||vₖ₊₁ - vₖ|| < tolerance`
4. Repeat until convergence

## Convergence

- Converges to principal eigenvector
- Convergence rate depends on eigenvalue gap
- Typically converges in 50-100 iterations

## Complexity

- **Time**: O(k × (V + E)) where k is iterations
- **Space**: O(V)

## Configuration

```javascript
const analyzer = new NetworkStats({
  maxIter: 100,      // Maximum iterations
  tolerance: 1e-6    // Convergence threshold
});
```

## Use Cases

- **Eigenvector Centrality**: Primary use case
- **PageRank**: Similar algorithm
- **Spectral Analysis**: Principal eigenvector computation

## Related Notes

- [[metric-eigenvector]] - Eigenvector centrality metric
- [[statistics-overview]] - All metrics


