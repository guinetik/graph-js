---
title: "Community Detection Example"
created: "2025-01-03"
tags: [example, community-detection, louvain]
category: "examples"
related: ["[[community-detection-overview]]", "[[algorithm-louvain]]"]
status: "complete"
aliases: ["community-example"]
---

# Community Detection Example

Example of detecting communities in a network.

## Via NetworkStats

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
const network = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' },
  { source: 'C', target: 'A' },  // Triangle (community 1)
  { source: 'D', target: 'E' },
  { source: 'E', target: 'F' },
  { source: 'F', target: 'D' }    // Triangle (community 2)
];

const results = await analyzer.analyze(network, ['modularity']);

console.log(results);
// [
//   { id: 'A', modularity: 0 },
//   { id: 'B', modularity: 0 },
//   { id: 'C', modularity: 0 },
//   { id: 'D', modularity: 1 },
//   { id: 'E', modularity: 1 },
//   { id: 'F', modularity: 1 }
// ]
```

## Via CommunityDetection Class

```javascript
import { CommunityDetection, LouvainAlgorithm, Graph } from '@guinetik/graph-js';

const graph = new Graph();
graph.addNodesFrom(['A', 'B', 'C', 'D', 'E', 'F']);
graph.addEdge('A', 'B', 1);
graph.addEdge('B', 'C', 1);
graph.addEdge('C', 'A', 1);
graph.addEdge('D', 'E', 1);
graph.addEdge('E', 'F', 1);
graph.addEdge('F', 'D', 1);

const detector = new CommunityDetection(graph);
const algorithm = new LouvainAlgorithm({
  resolution: 1.0,
  maxIterations: 100
});

const result = await detector.detectCommunities(algorithm, {
  onProgress: (p) => console.log(`${Math.round(p * 100)}%`)
});

console.log(result.communities);     // { 'A': 0, 'B': 0, 'C': 0, 'D': 1, 'E': 1, 'F': 1 }
console.log(result.modularity);      // 0.5
console.log(result.numCommunities);  // 2
```

## Related Notes

- [[community-detection-overview]] - Community detection overview
- [[algorithm-louvain]] - Louvain algorithm details


