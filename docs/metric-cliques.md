---
title: "Maximal Cliques"
created: "2025-01-03"
tags: [metric, cliques, node-level, exponential]
category: "metrics"
related: ["[[statistics-overview]]", "[[metric-clustering]]"]
status: "complete"
aliases: ["cliques", "maximal-cliques"]
---

# Maximal Cliques

Finds maximal complete subgraphs (cliques) in the network. A clique is a subset of nodes where every pair is connected.

## Overview

A clique is a complete subgraph - every node is connected to every other node. Maximal cliques are cliques that cannot be extended by adding more nodes.

## Definition

- **Clique**: Complete subgraph (all nodes connected)
- **Maximal Clique**: Clique that cannot be extended
- **Maximum Clique**: Largest clique in the graph

## Complexity

- **Time**: O(3^(V/3)) - Exponential in worst case
- **Space**: O(V + E)

**Warning**: This is computationally expensive. Use only on small graphs (<100 nodes) or with patience.

## Use Cases

- **Dense Communities**: Find tightly-knit groups
- **Social Networks**: Identify complete friend groups
- **Co-authorship**: Find groups where everyone collaborated
- **Graph Analysis**: Understand dense subgraph structure

## Example

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
// Triangle clique: A-B-C (all connected)
const network = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' },
  { source: 'C', target: 'A' },
  { source: 'A', target: 'D' }  // D not in clique
];

const results = await analyzer.analyze(network, ['cliques']);

console.log(results);
// Returns maximal cliques containing each node
```

## Performance Considerations

Due to exponential complexity:
- **Small graphs**: Works well (<50 nodes)
- **Medium graphs**: May be slow (50-100 nodes)
- **Large graphs**: Not recommended (>100 nodes)

Use progress callbacks for long-running computations.

## Related Metrics

- [[metric-clustering]] - Measures triangle density (related concept)
- [[metric-ego-density]] - Ego network density

## Related Notes

- [[statistics-overview]] - All available metrics
- [[metric-clustering]] - Related clustering measure

