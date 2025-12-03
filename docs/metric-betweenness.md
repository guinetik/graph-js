---
title: "Betweenness Centrality"
created: "2025-01-03"
tags: [metric, centrality, betweenness, node-level]
category: "metrics"
related: ["[[statistics-overview]]", "[[algorithm-brandes]]", "[[metric-degree]]"]
status: "complete"
aliases: ["betweenness", "betweenness-centrality"]
---

# Betweenness Centrality

Measures how often a node appears on shortest paths between other nodes. Identifies bridge nodes and information bottlenecks.

## Overview

Betweenness centrality quantifies a node's role as an intermediary. Nodes with high betweenness are critical for information flow and act as bridges between different parts of the network.

## Formula

For node `v`:
```
betweenness(v) = Σ (σ_st(v) / σ_st)
```

Where:
- `σ_st` = number of shortest paths from `s` to `t`
- `σ_st(v)` = number of shortest paths from `s` to `t` that pass through `v`

## Algorithm

Uses the **Brandes algorithm** (see [[algorithm-brandes]]) for efficient computation:
- Time complexity: O(V·E) for unweighted graphs
- Space complexity: O(V + E)

## Complexity

- **Time**: O(V·E) for unweighted, O(V·E + V² log V) for weighted
- **Space**: O(V + E)

## Use Cases

- **Bridge Detection**: Find nodes connecting different communities
- **Information Flow**: Identify critical nodes for communication
- **Network Resilience**: Nodes with high betweenness are single points of failure
- **Social Networks**: Find influential intermediaries

## Example

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
const network = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' },
  { source: 'A', target: 'D' }
];

const results = await analyzer.analyze(network, ['betweenness']);

console.log(results);
// [
//   { id: 'A', betweenness: 0 },
//   { id: 'B', betweenness: 0.33 },  // Bridge between A-C and A-D
//   { id: 'C', betweenness: 0 },
//   { id: 'D', betweenness: 0 }
// ]
```

## Interpretation

- **High betweenness**: Node is a bridge, critical for connectivity
- **Low betweenness**: Node is peripheral, not on many paths
- **Zero betweenness**: Node is a leaf or isolated

## Performance Note

Betweenness is computationally expensive (O(V·E)). For large graphs:
- Use progress callbacks to track computation
- Consider sampling for very large networks
- May take significant time on graphs with thousands of nodes

## Related Notes

- [[algorithm-brandes]] - Brandes algorithm implementation details
- [[statistics-overview]] - All available metrics
- [[metric-degree]] - Simpler centrality measure
- [[metric-closeness]] - Related distance-based metric

