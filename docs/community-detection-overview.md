---
title: "Community Detection Overview"
created: "2025-01-03"
tags: [community-detection, clustering, overview]
category: "algorithms"
related: ["[[algorithm-louvain]]", "[[networkstats-class]]"]
status: "complete"
aliases: ["community-detection", "clustering"]
---

# Community Detection Overview

Community detection identifies groups of nodes that are more densely connected to each other than to the rest of the network.

## Overview

Communities (also called clusters or modules) are groups of nodes with:
- **High internal connectivity**: Many edges within the community
- **Low external connectivity**: Few edges to other communities

## Available Algorithms

Currently, graph-js provides one community detection algorithm:

- [[algorithm-louvain]] - Louvain method for modularity optimization

## Usage

### Via NetworkStats

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
const network = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' },
  { source: 'D', target: 'E' }
];

const results = await analyzer.analyze(network, ['modularity']);

console.log(results);
// [{ id: 'A', modularity: 0 }, { id: 'B', modularity: 0 }, ...]
```

### Via CommunityDetection Class

```javascript
import { CommunityDetection, LouvainAlgorithm, Graph } from '@guinetik/graph-js';

const graph = new Graph();
// ... add nodes and edges

const detector = new CommunityDetection(graph);
const algorithm = new LouvainAlgorithm({ resolution: 1.0 });

const result = await detector.detectCommunities(algorithm, {
  onProgress: (p) => console.log(`${Math.round(p * 100)}%`)
});

console.log(result.communities);     // { 'A': 0, 'B': 0, 'C': 1 }
console.log(result.modularity);      // 0.42
console.log(result.numCommunities);  // 2
```

## Modularity

Modularity measures the quality of a community partition:
- **High modularity (>0.3)**: Strong community structure
- **Low modularity (<0.1)**: Weak or no community structure
- **Zero modularity**: Random partition

## Related Notes

- [[algorithm-louvain]] - Louvain algorithm details
- [[networkstats-class]] - Using community detection via NetworkStats

