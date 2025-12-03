---
title: "Graph Data Structure"
created: "2025-01-03"
tags: [core, data-structure, graph]
category: "core"
related: ["[[networkstats-class]]", "[[layouts-overview]]", "[[community-detection-overview]]"]
status: "complete"
aliases: ["graph", "graph-class"]
---

# Graph Data Structure

The `Graph` class is the core data structure representing an undirected, weighted graph.

## Overview

The Graph class uses an **adjacency map** for O(1) neighbor lookups, making it efficient for graph operations.

## Data Structure

```javascript
class Graph {
  nodes: Set<string|number>           // Set of all node IDs
  edges: Array<{u, v, weight}>       // Array of all edges
  adjacencyMap: Map<node, Map<neighbor, weight>>  // Adjacency map
}
```

## Key Operations

### Adding Nodes

```javascript
const graph = new Graph();

// Add single node
graph.addNode('A');

// Add multiple nodes
graph.addNodesFrom(['A', 'B', 'C']);
```

### Adding Edges

```javascript
// Add edge with default weight (1)
graph.addEdge('A', 'B');

// Add edge with custom weight
graph.addEdge('A', 'B', 2.5);
```

### Querying Graph

```javascript
// Get neighbors
const neighbors = graph.getNeighbors('A'); // ['B', 'C']

// Get edge weight
const weight = graph.getEdgeWeight('A', 'B'); // 2.5

// Check if edge exists
const exists = graph.hasEdge('A', 'B'); // true

// Get node degree
const degree = graph.degree('A'); // 2
```

### Removing Elements

```javascript
// Remove edge
graph.removeEdge('A', 'B');

// Remove node (and all connected edges)
graph.removeNode('A');
```

## Complexity Analysis

| Operation | Complexity | Notes |
|-----------|------------|-------|
| `addNode()` | O(1) | Set insertion |
| `addEdge()` | O(1) | Map operations |
| `getNeighbors()` | O(1) | Map lookup |
| `getEdgeWeight()` | O(1) | Map lookup |
| `removeNode()` | O(V + E) | Must remove all edges |
| `removeEdge()` | O(1) | Map deletion |

## Use Cases

The Graph class is used throughout the library:

- **NetworkStats**: Builds graph from edge list (see [[networkstats-class]])
- **Layouts**: All layout algorithms operate on Graph instances (see [[layouts-overview]])
- **Community Detection**: Community algorithms use Graph (see [[community-detection-overview]])
- **Statistics**: All metrics compute on Graph structure (see [[statistics-overview]])

## Example

```javascript
import { Graph } from '@guinetik/graph-js';

const graph = new Graph();

// Build a simple network
graph.addNodesFrom(['Alice', 'Bob', 'Carol']);
graph.addEdge('Alice', 'Bob', 1);
graph.addEdge('Bob', 'Carol', 2);
graph.addEdge('Carol', 'Alice', 1);

// Query
console.log(graph.getNeighbors('Bob')); // ['Alice', 'Carol']
console.log(graph.degree('Bob')); // 2
console.log(graph.edges.length); // 3
```

## Related Notes

- [[networkstats-class]] - How NetworkStats uses Graph
- [[layouts-overview]] - Layout algorithms using Graph
- [[community-detection-overview]] - Community detection with Graph
- [[statistics-overview]] - Statistics computed on Graph

