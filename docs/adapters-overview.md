---
title: "Data Adapters Overview"
created: "2025-01-03"
tags: [adapters, data-import, overview]
category: "adapters"
related: ["[[adapter-csv]]", "[[adapter-json]]", "[[adapter-networkx]]"]
status: "complete"
aliases: ["adapters", "data-adapters"]
---

# Data Adapters Overview

Data adapters convert between various graph formats and the standard graph-js format.

## Available Adapters

graph-js provides three adapters for common formats:

- [[adapter-csv]] - CSV edge list format
- [[adapter-json]] - JSON formats (D3, Cytoscape, etc.)
- [[adapter-networkx]] - NetworkX (Python) format

## Standard Format

All adapters convert to/from the standard graph-js format:

```javascript
[
  { source: 'A', target: 'B', weight: 1 },
  { source: 'B', target: 'C', weight: 2 }
]
```

## Usage Pattern

```javascript
import { CSVAdapter } from '@guinetik/graph-js';

// Load from URL
const graphData = await CSVAdapter.loadFromURL('./edges.csv');

// Use with NetworkStats
const analyzer = new NetworkStats();
const results = await analyzer.analyze(graphData, ['degree']);
```

## Related Notes

- [[adapter-csv]] - CSV adapter details
- [[adapter-json]] - JSON adapter details
- [[adapter-networkx]] - NetworkX adapter details


