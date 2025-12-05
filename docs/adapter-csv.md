---
title: "CSV Adapter"
created: "2025-01-03"
tags: [adapter, csv, data-import]
category: "adapters"
related: ["[[adapters-overview]]", "[[adapter-json]]"]
status: "complete"
aliases: ["csv-adapter", "csv"]
---

# CSV Adapter

Loads and exports graph data from/to CSV files. Supports edge list and node properties formats.

## Overview

CSVAdapter reads CSV files containing edge lists. Expected format:
- **source, target, weight**: Columns in positional order (weight is optional)

## Usage

### Load from URL

```javascript
import { CSVAdapter } from '@guinetik/graph-js';

// Load edges only
const graphData = await CSVAdapter.loadFromURL('./edges.csv');

// Load edges and nodes
const graphData = await CSVAdapter.loadFromURL('./edges.csv', './nodes.csv');
```

### Load from File Objects

```javascript
const edgeFile = document.querySelector('#edges').files[0];
const nodeFile = document.querySelector('#nodes').files[0];

// Load edges only
const graphData = await CSVAdapter.loadFromFiles(edgeFile);

// Load edges and nodes
const graphData = await CSVAdapter.loadFromFiles(edgeFile, nodeFile);
```

### Parse from Text

```javascript
const csvText = `source,target,weight
A,B,1
B,C,2`;

const graphData = CSVAdapter.fromEdgeList(csvText);
```

### Export to CSV

```javascript
// Export edges to CSV
const edgesCsv = CSVAdapter.toEdgeList(graphData);

// Export nodes to CSV
const nodesCsv = CSVAdapter.toNodes(graphData);

// Export both
const { edges, nodes } = CSVAdapter.toFormat(graphData);
```

## CSV Format

Expected edge list format (positional columns):
```csv
source,target,weight
A,B,1
B,C,2
C,A,1
```

## Options

- `header` (boolean): CSV has header row (default: true)
- `delimiter` (string): Column delimiter (default: ',')
- `weighted` (boolean): Parse weight from third column (default: true)

## Related Notes

- [[adapters-overview]] - All adapters
- [[adapter-json]] - JSON adapter


