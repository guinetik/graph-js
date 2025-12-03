---
title: "TypeScript Support"
created: "2025-01-03"
tags: [typescript, types, type-definitions]
category: "advanced"
related: ["[[networkstats-class]]"]
status: "complete"
aliases: ["typescript", "types"]
---

# TypeScript Support

graph-js includes full TypeScript definitions for type safety and IDE support.

## Installation

TypeScript definitions are included automatically with the package:

```bash
npm install @guinetik/graph-js
```

## Usage

```typescript
import NetworkStats, { Graph, CommunityDetection } from '@guinetik/graph-js';

interface Edge {
  source: string;
  target: string;
  weight?: number;
}

const network: Edge[] = [
  { source: 'A', target: 'B', weight: 1 }
];

const analyzer = new NetworkStats({ verbose: false });
const results = await analyzer.analyze(network, ['degree']);
// results is typed as Array<{ id: string, [metric: string]: number }>
```

## Type Definitions

Type definitions are located in `types/index.d.ts` and include:
- NetworkStats class
- Graph class
- Layout classes
- Adapter classes
- Type interfaces

## Related Notes

- [[networkstats-class]] - Main API class

