---
title: "Basic Analysis Example"
created: "2025-01-03"
tags: [example, tutorial, basic]
category: "examples"
related: ["[[networkstats-class]]", "[[statistics-overview]]", "[[00-quick-start]]"]
status: "complete"
aliases: ["basic-example", "tutorial"]
---

# Basic Analysis Example

Complete example of basic network analysis using graph-js.

## Complete Example

```javascript
import NetworkStats from '@guinetik/graph-js';

// 1. Create analyzer
const analyzer = new NetworkStats({ verbose: true });

// 2. Define network
const network = [
  { source: 'Alice', target: 'Bob', weight: 1 },
  { source: 'Bob', target: 'Carol', weight: 2 },
  { source: 'Carol', target: 'Alice', weight: 1 },
  { source: 'David', target: 'Carol', weight: 1 }
];

// 3. Analyze network
const results = await analyzer.analyze(network, [
  'degree',
  'betweenness',
  'eigenvector',
  'clustering'
]);

// 4. Display results
console.log(results);
// [
//   { id: 'Alice', degree: 2, betweenness: 0.33, eigenvector: 0.55, clustering: 1.0 },
//   { id: 'Bob', degree: 2, betweenness: 0.33, eigenvector: 0.55, clustering: 1.0 },
//   { id: 'Carol', degree: 3, betweenness: 0.67, eigenvector: 0.78, clustering: 0.33 },
//   { id: 'David', degree: 1, betweenness: 0, eigenvector: 0.32, clustering: 0 }
// ]

// 5. Clean up
await analyzer.dispose();
```

## Step-by-Step Explanation

1. **Create Analyzer**: Initialize NetworkStats with options
2. **Define Network**: Array of edges with source, target, and optional weight
3. **Analyze**: Call `analyze()` with network and desired metrics
4. **Results**: Array of node objects with computed metrics
5. **Cleanup**: Dispose analyzer to terminate workers

## Related Notes

- [[networkstats-class]] - API reference
- [[statistics-overview]] - Available metrics
- [[00-quick-start]] - Quick start guide


