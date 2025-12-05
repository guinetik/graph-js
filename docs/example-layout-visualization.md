---
title: "Layout Visualization Example"
created: "2025-01-03"
tags: [example, layout, visualization]
category: "examples"
related: ["[[layouts-overview]]", "[[networkstats-class]]"]
status: "complete"
aliases: ["layout-example", "visualization-example"]
---

# Layout Visualization Example

Example of combining metrics and layouts for visualization.

## Complete Workflow

```javascript
import NetworkStats, { Graph, ForceDirectedLayout } from '@guinetik/graph-js';

// 1. Analyze network
const analyzer = new NetworkStats();
const network = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' },
  { source: 'C', target: 'A' }
];

const nodeMetrics = await analyzer.analyze(network, [
  'degree',
  'betweenness',
  'eigenvector'
]);

// 2. Build graph for layout
const graph = new Graph();
for (const edge of network) {
  graph.addNode(edge.source);
  graph.addNode(edge.target);
  graph.addEdge(edge.source, edge.target, edge.weight || 1);
}

// 3. Compute layout
const layout = new ForceDirectedLayout(graph, {
  iterations: 100,
  scale: 200
});

const positions = await layout.getPositions();

// 4. Merge metrics and positions
const visualizationData = nodeMetrics.map(node => ({
  ...node,
  x: positions[node.id].x,
  y: positions[node.id].y
}));

console.log(visualizationData);
// [
//   { id: 'A', degree: 2, betweenness: 0.33, eigenvector: 0.58, x: 120, y: 240 },
//   { id: 'B', degree: 2, betweenness: 0.33, eigenvector: 0.58, x: 310, y: 150 },
//   ...
// ]
```

## Related Notes

- [[layouts-overview]] - All layout algorithms
- [[networkstats-class]] - NetworkStats API
- [[example-d3-integration]] - D3.js visualization


