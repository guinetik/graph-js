---
title: "NetworkX Adapter"
created: "2025-01-03"
tags: [adapter, networkx, python, data-import]
category: "adapters"
related: ["[[adapters-overview]]", "[[adapter-json]]"]
status: "complete"
aliases: ["networkx-adapter", "networkx"]
---

# NetworkX Adapter

Converts NetworkX (Python) graph formats to graph-js format. Enables Python-JavaScript interoperability.

## Overview

NetworkXAdapter supports NetworkX's node-link JSON format, allowing seamless data exchange between Python NetworkX and JavaScript graph-js.

## Usage

### From NetworkX Format

```javascript
import { NetworkXAdapter } from '@guinetik/graph-js';

const nxData = {
  directed: false,
  multigraph: false,
  nodes: [{id: 'A'}, {id: 'B'}],
  links: [{source: 'A', target: 'B', weight: 1}]
};

const graphData = NetworkXAdapter.fromNodeLink(nxData);
```

## NetworkX Format

NetworkX exports graphs in node-link JSON format:

```json
{
  "directed": false,
  "multigraph": false,
  "nodes": [
    {"id": "A"},
    {"id": "B"}
  ],
  "links": [
    {"source": "A", "target": "B", "weight": 1}
  ]
}
```

## Python Example

```python
import networkx as nx
import json

# Create graph in Python
G = nx.Graph()
G.add_edge('A', 'B', weight=1)

# Export to JSON
data = nx.node_link_data(G)
with open('graph.json', 'w') as f:
    json.dump(data, f)
```

Then load in JavaScript:

```javascript
import { NetworkXAdapter } from '@guinetik/graph-js';

const nxData = await fetch('./graph.json').then(r => r.json());
const graphData = NetworkXAdapter.fromNodeLink(nxData);
```

## Related Notes

- [[adapters-overview]] - All adapters
- [[adapter-json]] - JSON adapter

