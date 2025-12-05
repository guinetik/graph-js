---
title: "Family Tree Analysis Use Case"
created: "2025-01-03"
tags: [use-case, family-trees, genealogy]
category: "examples"
related: ["[[layout-bfs]]", "[[layout-multipartite]]"]
status: "complete"
aliases: ["family-trees", "genealogy"]
---

# Family Tree Analysis Use Case

Example use case: Building and visualizing family relationship trees.

## Scenario

Build a family tree and:
1. Visualize relationships
2. Analyze family structure
3. Find central family members

## Implementation

```javascript
import NetworkStats, { Graph, BFSLayout } from '@guinetik/graph-js';

const analyzer = new NetworkStats();

// Family relationships
const relationships = [
  { source: 'Grandpa', target: 'Dad' },
  { source: 'Grandma', target: 'Dad' },
  { source: 'Dad', target: 'Child1' },
  { source: 'Mom', target: 'Child1' },
  { source: 'Dad', target: 'Child2' },
  { source: 'Mom', target: 'Child2' }
];

// Analyze family network
const results = await analyzer.analyze(relationships, [
  'degree',           // Number of relatives
  'betweenness',       // Central family members
  'closeness'         // Family accessibility
]);

// Build graph for visualization
const graph = new Graph();
relationships.forEach(rel => {
  graph.addNode(rel.source);
  graph.addNode(rel.target);
  graph.addEdge(rel.source, rel.target);
});

// Use BFS layout for hierarchical visualization
const layout = new BFSLayout(graph, {
  root: 'Grandpa',
  layerSeparation: 150,
  nodeSpacing: 100
});

const positions = await layout.getPositions();

// Combine metrics and positions
const familyData = results.map(member => ({
  ...member,
  ...positions[member.id]
}));

console.log('Family structure:', familyData);
```

## Related Notes

- [[layout-bfs]] - BFS layout for trees
- [[layout-multipartite]] - Multi-layer layout
- [[metric-betweenness]] - Central family members


