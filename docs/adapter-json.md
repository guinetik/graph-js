---
title: "JSON Adapter"
created: "2025-01-03"
tags: [adapter, json, d3, cytoscape, data-import]
category: "adapters"
related: ["[[adapters-overview]]", "[[adapter-csv]]"]
status: "complete"
aliases: ["json-adapter", "json"]
---

# JSON Adapter

Converts between JSON formats (D3, Cytoscape) and graph-js format.

## Overview

JSONAdapter supports multiple JSON formats:
- **D3.js format**: `{nodes: [...], links: [...]}`
- **Cytoscape format**: `{elements: {nodes: [...], edges: [...]}}`
- **Custom formats**: Flexible conversion

## Usage

### From D3 Format

```javascript
import { JSONAdapter } from '@guinetik/graph-js';

const d3Data = {
  nodes: [{id: 'A'}, {id: 'B'}],
  links: [{source: 'A', target: 'B'}]
};

const graphData = JSONAdapter.fromD3(d3Data);
```

### To D3 Format

```javascript
const graphData = [
  { source: 'A', target: 'B', weight: 1 }
];

const d3Data = JSONAdapter.toD3(graphData);
// { nodes: [{id: 'A'}, {id: 'B'}], links: [{source: 'A', target: 'B'}] }
```

### From Cytoscape Format

```javascript
const cytoscapeData = {
  elements: {
    nodes: [{data: {id: 'A'}}],
    edges: [{data: {source: 'A', target: 'B'}}]
  }
};

const graphData = JSONAdapter.fromCytoscape(cytoscapeData);
```

## Formats

### D3 Format
```javascript
{
  nodes: [{id: 'A'}, {id: 'B'}],
  links: [{source: 'A', target: 'B', value: 1}]
}
```

### Cytoscape Format
```javascript
{
  elements: {
    nodes: [{data: {id: 'A'}}],
    edges: [{data: {id: 'e1', source: 'A', target: 'B', weight: 1}}]
  }
}
```

## Related Notes

- [[adapters-overview]] - All adapters
- [[adapter-csv]] - CSV adapter

