---
title: "Graph Statistics Example"
created: "2025-01-03"
tags: [example, graph-stats, graph-level]
category: "examples"
related: ["[[networkstats-class]]", "[[graph-stats-overview]]"]
status: "complete"
aliases: ["graph-stats-example"]
---

# Graph Statistics Example

Example of computing graph-level statistics.

## Basic Graph Statistics

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
const network = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' },
  { source: 'C', target: 'A' },
  { source: 'D', target: 'E' }
];

const results = await analyzer.analyze(network, ['degree'], {
  includeGraphStats: true,
  graphStats: ['density', 'diameter', 'average_clustering']
});

console.log(results.nodes);  // Node-level metrics
console.log(results.graph);  // Graph-level statistics
// {
//   density: 0.4,
//   diameter: 2,
//   average_clustering: 0.5
// }
```

## All Graph Statistics

```javascript
const results = await analyzer.analyze(network, ['degree'], {
  includeGraphStats: true
  // graphStats defaults to all statistics
});

console.log(results.graph);
// {
//   density: 0.4,
//   diameter: 2,
//   average_clustering: 0.5,
//   average_shortest_path: 1.5,
//   connected_components: { count: 2, components: {...} },
//   average_degree: 1.6
// }
```

## Related Notes

- [[networkstats-class]] - API reference
- [[graph-stats-overview]] - All graph statistics


