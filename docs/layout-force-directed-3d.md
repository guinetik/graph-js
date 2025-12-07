---
title: "Force-Directed 3D Layout"
created: "2025-01-03"
tags: [layout, force-directed, physics, 3d, fruchterman-reingold]
category: "layouts"
related: ["[[layouts-overview]]", "[[layout-force-directed]]", "[[algorithm-fruchterman-reingold]]"]
status: "complete"
aliases: ["force-directed-3d", "3d-force-layout", "fruchterman-reingold-3d"]
---

# Force-Directed 3D Layout

3D Fruchterman-Reingold force-directed layout. Positions nodes in 3D space using simulated physical forces. Outputs `{x, y, z}` coordinates for use with Three.js, WebGL, or other 3D renderers.

## Overview

ForceDirected3DLayout extends the classic Fruchterman-Reingold algorithm to 3D:
- **Repulsive forces**: All node pairs repel (like electrical charges)
- **Attractive forces**: Connected nodes attract (like springs)
- **Gravitational force**: Pulls nodes toward center (prevents drift in 3D space)

## Algorithm

Based on **Fruchterman-Reingold** with 3D extensions:
- Repulsion: `k² / distance` between all node pairs
- Attraction: `distance² / k` between connected nodes
- Gravity: `0.1 × k × gravity` toward center
- Cooling: Temperature decreases linearly over iterations

## Complexity

- **Time**: O(iterations × n²) - Quadratic in nodes
- **Space**: O(n)

## Usage

```javascript
import { Graph, ForceDirected3DLayout } from '@guinetik/graph-js';

const graph = new Graph();
graph.addNodesFrom(['A', 'B', 'C', 'D']);
graph.addEdge('A', 'B');
graph.addEdge('B', 'C');
graph.addEdge('C', 'D');

const layout = new ForceDirected3DLayout(graph, {
  iterations: 50,
  scale: 100,
  gravity: 1
});

const positions = await layout.getPositions();
// positions = { 'A': {x: 10, y: -20, z: 5}, ... }
```

## Options

- `iterations` (number): Number of iterations (default: 50)
- `k` (number|null): Optimal distance between nodes (default: auto-calculated)
- `scale` (number): Scale factor for final positions (default: 1)
- `center` (Object): Center point `{x, y, z}` (default: `{x: 0, y: 0, z: 0}`)
- `threshold` (number): Convergence threshold (default: 1e-4)
- `gravity` (number): Gravitational pull toward center (default: 1)
- `initialPositions` (Object|null): Warm-start from existing positions

## Warm-Start from 2D

You can initialize from 2D positions - the algorithm adds random z coordinates:

```javascript
// Get 2D positions first
const layout2D = new ForceDirectedLayout(graph, { iterations: 50 });
const positions2D = await layout2D.getPositions();

// Extend to 3D
const layout3D = new ForceDirected3DLayout(graph, {
  initialPositions: positions2D  // z will be random
});
const positions3D = await layout3D.getPositions();
```

## Output Format

Returns positions with z coordinate:

```javascript
{
  "node1": { x: 0.5, y: -0.3, z: 0.8 },
  "node2": { x: -0.2, y: 0.1, z: -0.4 },
  // ...
}
```

## Use Cases

- **3D Network Visualization**: With Three.js, WebGL, or similar
- **VR/AR Graph Exploration**: Immersive data exploration
- **Large Network Overview**: 3D spreads nodes better than 2D
- **Spatial Data**: Networks with inherent 3D structure

## Three.js Integration Example

```javascript
import * as THREE from 'three';
import { Graph, ForceDirected3DLayout } from '@guinetik/graph-js';

// Compute layout
const layout = new ForceDirected3DLayout(graph, { scale: 100 });
const positions = await layout.getPositions();

// Create Three.js meshes
const scene = new THREE.Scene();
Object.entries(positions).forEach(([nodeId, pos]) => {
  const geometry = new THREE.SphereGeometry(2, 16, 16);
  const material = new THREE.MeshLambertMaterial({ color: 0x3498db });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(pos.x, pos.y, pos.z);
  scene.add(mesh);
});
```

## Performance

- **Small graphs (<100 nodes)**: Very fast
- **Medium graphs (100-500 nodes)**: Good performance
- **Large graphs (>500 nodes)**: May be slow due to O(n²) complexity

## Related Notes

- [[layouts-overview]] - All layout algorithms
- [[layout-force-directed]] - 2D version
- [[algorithm-fruchterman-reingold]] - Algorithm details


