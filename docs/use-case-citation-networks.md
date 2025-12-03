---
title: "Citation Network Analysis Use Case"
created: "2025-01-03"
tags: [use-case, citations, research]
category: "examples"
related: ["[[metric-eigenvector]]", "[[metric-betweenness]]"]
status: "complete"
aliases: ["citations", "citation-analysis"]
---

# Citation Network Analysis Use Case

Example use case: Analyzing citation networks to find important papers and research communities.

## Scenario

Analyze a citation network to:
1. Find highly cited papers (high degree)
2. Identify influential papers (high eigenvector)
3. Discover research communities

## Implementation

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();

// Citation network (paper A cites paper B)
const citations = [
  { source: 'Paper1', target: 'Paper2' },
  { source: 'Paper2', target: 'Paper3' },
  { source: 'Paper3', target: 'Paper4' },
  { source: 'Paper1', target: 'Paper5' }
];

// Analyze network
const results = await analyzer.analyze(citations, [
  'degree',           // Citation count
  'eigenvector',      // Influence (cited by important papers)
  'betweenness',      // Bridge papers
  'modularity'        // Research communities
]);

// Find highly cited papers
const highlyCited = results
  .sort((a, b) => b.degree - a.degree)
  .slice(0, 10);

console.log('Most cited papers:', highlyCited);

// Find influential papers (cited by important papers)
const influential = results
  .sort((a, b) => b.eigenvector - a.eigenvector)
  .slice(0, 10);

console.log('Most influential papers:', influential);
```

## Related Notes

- [[metric-degree]] - Citation count
- [[metric-eigenvector]] - Influence measurement
- [[algorithm-louvain]] - Research community detection

