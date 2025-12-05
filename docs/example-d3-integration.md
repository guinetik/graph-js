---
title: "D3.js Integration Example"
created: "2025-01-03"
tags: [example, d3, visualization, integration]
category: "examples"
related: ["[[example-layout-visualization]]", "[[layouts-overview]]"]
status: "complete"
aliases: ["d3-example", "d3-integration"]
---

# D3.js Integration Example

Example of integrating graph-js with D3.js for visualization.

## Complete Example

```javascript
import * as d3 from 'd3';
import NetworkStats, { Graph, ForceDirectedLayout } from '@guinetik/graph-js';

// 1. Analyze network
const analyzer = new NetworkStats();
const network = [
  { source: 'Alice', target: 'Bob' },
  { source: 'Bob', target: 'Carol' },
  { source: 'Carol', target: 'Alice' }
];

const nodeMetrics = await analyzer.analyze(network, [
  'degree',
  'eigenvector'
]);

// 2. Build graph and compute layout
const graph = new Graph();
network.forEach(edge => {
  graph.addNode(edge.source);
  graph.addNode(edge.target);
  graph.addEdge(edge.source, edge.target);
});

const layout = new ForceDirectedLayout(graph, { iterations: 100 });
const positions = await layout.getPositions();

// 3. Prepare D3 data
const nodes = nodeMetrics.map(node => ({
  id: node.id,
  ...node,
  ...positions[node.id]
}));

const links = network.map(edge => ({
  source: edge.source,
  target: edge.target
}));

// 4. Create D3 visualization
const svg = d3.select('svg');
const width = 800;
const height = 600;

// Size scale based on eigenvector
const sizeScale = d3.scaleSqrt()
  .domain(d3.extent(nodes, d => d.eigenvector))
  .range([5, 20]);

// Color scale based on degree
const colorScale = d3.scaleOrdinal()
  .domain([1, 2, 3])
  .range(['#ff6b6b', '#4ecdc4', '#45b7d1']);

// Draw links
const link = svg.append('g')
  .selectAll('line')
  .data(links)
  .enter()
  .append('line')
  .attr('stroke', '#999')
  .attr('stroke-width', 2);

// Draw nodes
const node = svg.append('g')
  .selectAll('circle')
  .data(nodes)
  .enter()
  .append('circle')
  .attr('r', d => sizeScale(d.eigenvector))
  .attr('fill', d => colorScale(d.degree))
  .attr('cx', d => d.x)
  .attr('cy', d => d.y);

// Add labels
const label = svg.append('g')
  .selectAll('text')
  .data(nodes)
  .enter()
  .append('text')
  .text(d => d.id)
  .attr('x', d => d.x)
  .attr('y', d => d.y - 25)
  .attr('text-anchor', 'middle');
```

## Related Notes

- [[example-layout-visualization]] - Layout computation
- [[layouts-overview]] - All layout algorithms


