---
title: "Social Network Analysis Use Case"
created: "2025-01-03"
tags: [use-case, social-networks, analysis]
category: "examples"
related: ["[[metric-degree]]", "[[metric-eigenvector]]", "[[algorithm-louvain]]"]
status: "complete"
aliases: ["social-networks", "social-analysis"]
---

# Social Network Analysis Use Case

Example use case: Analyzing social networks to find influencers and communities.

## Scenario

Analyze a social network to:
1. Identify influential users (high eigenvector centrality)
2. Find bridge users (high betweenness)
3. Detect friend groups (community detection)

## Implementation

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();

// Social network edges (friendships)
const friendships = [
  { source: 'Alice', target: 'Bob' },
  { source: 'Bob', target: 'Carol' },
  { source: 'Carol', target: 'David' },
  { source: 'Alice', target: 'Eve' },
  { source: 'Eve', target: 'Frank' }
];

// Analyze network
const results = await analyzer.analyze(friendships, [
  'degree',           // Number of friends
  'betweenness',      // Bridge users
  'eigenvector',      // Influential users
  'modularity'        // Friend groups
]);

// Find influencers (high eigenvector)
const influencers = results
  .filter(node => node.modularity !== undefined)
  .sort((a, b) => b.eigenvector - a.eigenvector)
  .slice(0, 5);

console.log('Top influencers:', influencers);

// Find bridges (high betweenness)
const bridges = results
  .sort((a, b) => b.betweenness - a.betweenness)
  .slice(0, 5);

console.log('Bridge users:', bridges);
```

## Related Notes

- [[metric-degree]] - Friend count
- [[metric-eigenvector]] - Influence measurement
- [[metric-betweenness]] - Bridge detection
- [[algorithm-louvain]] - Community detection


