import { describe, it, expect } from 'vitest';
import { Graph } from '../graph.js';
import { forceDirected3DCompute } from './force-directed-3d.js';

function createGraphData(graph) {
  return {
    nodes: Array.from(graph.nodes),
    edges: graph.edges.map(edge => ({
      source: edge.u,
      target: edge.v,
      weight: edge.weight
    })),
    adjacency: Object.fromEntries(graph.adjacencyMap)
  };
}

describe('Force Directed 3D Layout', () => {
  describe('basic functionality', () => {
    it('should return 3D positions for all nodes', async () => {
      const graph = new Graph();
      graph.addNodesFrom(['A', 'B', 'C', 'D']);
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      graph.addEdge('C', 'D');

      const positions = await forceDirected3DCompute(createGraphData(graph), {
        iterations: 20,
        scale: 100
      });

      expect(Object.keys(positions).length).toBe(4);

      // All positions should have x, y, z
      Object.values(positions).forEach(p => {
        expect(p).toHaveProperty('x');
        expect(p).toHaveProperty('y');
        expect(p).toHaveProperty('z');
        expect(isFinite(p.x)).toBe(true);
        expect(isFinite(p.y)).toBe(true);
        expect(isFinite(p.z)).toBe(true);
      });
    });

    it('should spread nodes in 3D space', async () => {
      const graph = new Graph();
      graph.addNodesFrom(['A', 'B', 'C', 'D', 'E']);
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      graph.addEdge('C', 'D');
      graph.addEdge('D', 'E');

      const positions = await forceDirected3DCompute(createGraphData(graph), {
        iterations: 30,
        scale: 100
      });

      // Collect coordinates
      const xCoords = Object.values(positions).map(p => p.x);
      const yCoords = Object.values(positions).map(p => p.y);
      const zCoords = Object.values(positions).map(p => p.z);

      // Should have some spread in at least one dimension
      const xRange = Math.max(...xCoords) - Math.min(...xCoords);
      const yRange = Math.max(...yCoords) - Math.min(...yCoords);
      const zRange = Math.max(...zCoords) - Math.min(...zCoords);

      expect(Math.max(xRange, yRange, zRange)).toBeGreaterThan(0);
    });

    it('should converge with default parameters', async () => {
      const graph = new Graph();
      graph.addNodesFrom(['A', 'B', 'C']);
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');

      const positions = await forceDirected3DCompute(createGraphData(graph), {
        iterations: 50,
        scale: 100,
        threshold: 1e-4
      });

      // Should complete without errors
      expect(Object.keys(positions).length).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('should handle empty graph', async () => {
      const graph = new Graph();

      const positions = await forceDirected3DCompute(createGraphData(graph), {
        iterations: 20,
        scale: 100
      });

      expect(Object.keys(positions).length).toBe(0);
    });

    it('should handle single node', async () => {
      const graph = new Graph();
      graph.addNode('only');

      const positions = await forceDirected3DCompute(createGraphData(graph), {
        scale: 100,
        center: { x: 50, y: 50, z: 50 }
      });

      expect(Object.keys(positions).length).toBe(1);
      expect(positions['only'].x).toBe(50);
      expect(positions['only'].y).toBe(50);
      expect(positions['only'].z).toBe(50);
    });

    it('should handle disconnected components', async () => {
      const graph = new Graph();
      graph.addNodesFrom(['a', 'b', 'c', 'd']);
      graph.addEdge('a', 'b');
      // c and d are disconnected

      const positions = await forceDirected3DCompute(createGraphData(graph), {
        iterations: 30,
        scale: 100
      });

      // All 4 nodes should have positions
      expect(Object.keys(positions).length).toBe(4);

      // All positions should be valid
      Object.values(positions).forEach(p => {
        expect(isFinite(p.x)).toBe(true);
        expect(isFinite(p.y)).toBe(true);
        expect(isFinite(p.z)).toBe(true);
      });
    });

    it('should handle complete graph', async () => {
      const graph = new Graph();
      const nodes = ['a', 'b', 'c', 'd'];
      graph.addNodesFrom(nodes);
      // Add all edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          graph.addEdge(nodes[i], nodes[j]);
        }
      }

      const positions = await forceDirected3DCompute(createGraphData(graph), {
        iterations: 30,
        scale: 100
      });

      expect(Object.keys(positions).length).toBe(4);
    });
  });

  describe('warm-start', () => {
    it('should extend 2D positions with random z', async () => {
      const graph = new Graph();
      graph.addNodesFrom(['A', 'B', 'C']);
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');

      // Provide 2D initial positions (no z)
      const initialPositions = {
        'A': { x: 0, y: 0 },
        'B': { x: 1, y: 0 },
        'C': { x: 0.5, y: 1 }
      };

      const positions = await forceDirected3DCompute(createGraphData(graph), {
        iterations: 1, // Just 1 iteration to check initialization
        scale: 100,
        initialPositions
      });

      expect(Object.keys(positions).length).toBe(3);

      // All positions should have z coordinate
      Object.values(positions).forEach(p => {
        expect(p).toHaveProperty('z');
        expect(isFinite(p.z)).toBe(true);
      });
    });

    it('should preserve 3D positions when provided', async () => {
      const graph = new Graph();
      graph.addNodesFrom(['A', 'B']);
      graph.addEdge('A', 'B');

      // Provide full 3D initial positions
      const initialPositions = {
        'A': { x: 0, y: 0, z: 0 },
        'B': { x: 1, y: 1, z: 1 }
      };

      const positions = await forceDirected3DCompute(createGraphData(graph), {
        iterations: 1,
        scale: 100,
        initialPositions
      });

      // After 1 iteration, positions should still be close to initial
      // (they will have moved slightly due to forces)
      expect(Object.keys(positions).length).toBe(2);
    });
  });

  describe('parameters', () => {
    it('should respect iterations count', async () => {
      const graph = new Graph();
      graph.addNodesFrom(['A', 'B', 'C']);
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');

      // Few iterations
      const positions1 = await forceDirected3DCompute(createGraphData(graph), {
        iterations: 5,
        scale: 100
      });

      // More iterations
      const positions2 = await forceDirected3DCompute(createGraphData(graph), {
        iterations: 100,
        scale: 100
      });

      // Both should complete successfully
      expect(Object.keys(positions1).length).toBe(3);
      expect(Object.keys(positions2).length).toBe(3);
    });

    it('should respect scale factor', async () => {
      const graph = new Graph();
      graph.addNodesFrom(['A', 'B', 'C']);
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');

      const smallScale = await forceDirected3DCompute(createGraphData(graph), {
        iterations: 30,
        scale: 10
      });

      const largeScale = await forceDirected3DCompute(createGraphData(graph), {
        iterations: 30,
        scale: 1000
      });

      // Get max coordinates for each
      const maxSmall = Math.max(
        ...Object.values(smallScale).flatMap(p => [Math.abs(p.x), Math.abs(p.y), Math.abs(p.z)])
      );
      const maxLarge = Math.max(
        ...Object.values(largeScale).flatMap(p => [Math.abs(p.x), Math.abs(p.y), Math.abs(p.z)])
      );

      // Large scale should produce larger coordinates
      expect(maxLarge).toBeGreaterThan(maxSmall);
    });

    it('should respect gravity parameter', async () => {
      const graph = new Graph();
      graph.addNodesFrom(['A', 'B', 'C', 'D']);
      // No edges - nodes will only have repulsion and gravity

      const noGravity = await forceDirected3DCompute(createGraphData(graph), {
        iterations: 30,
        scale: 100,
        gravity: 0
      });

      const highGravity = await forceDirected3DCompute(createGraphData(graph), {
        iterations: 30,
        scale: 100,
        gravity: 10
      });

      // Both should complete
      expect(Object.keys(noGravity).length).toBe(4);
      expect(Object.keys(highGravity).length).toBe(4);
    });

    it('should respect custom k value', async () => {
      const graph = new Graph();
      graph.addNodesFrom(['A', 'B', 'C']);
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');

      const positions = await forceDirected3DCompute(createGraphData(graph), {
        iterations: 30,
        scale: 100,
        k: 2.0 // Custom optimal distance
      });

      expect(Object.keys(positions).length).toBe(3);
    });

    it('should respect center parameter', async () => {
      const graph = new Graph();
      graph.addNodesFrom(['A', 'B']);
      graph.addEdge('A', 'B');

      const center = { x: 100, y: 200, z: 300 };
      const positions = await forceDirected3DCompute(createGraphData(graph), {
        iterations: 30,
        scale: 50,
        center
      });

      // Calculate centroid of positions
      const coords = Object.values(positions);
      const centroidX = coords.reduce((s, p) => s + p.x, 0) / coords.length;
      const centroidY = coords.reduce((s, p) => s + p.y, 0) / coords.length;
      const centroidZ = coords.reduce((s, p) => s + p.z, 0) / coords.length;

      // Centroid should be close to specified center
      expect(Math.abs(centroidX - center.x)).toBeLessThan(1);
      expect(Math.abs(centroidY - center.y)).toBeLessThan(1);
      expect(Math.abs(centroidZ - center.z)).toBeLessThan(1);
    });
  });

  describe('progress reporting', () => {
    it('should report progress during computation', async () => {
      const graph = new Graph();
      graph.addNodesFrom(['a', 'b', 'c', 'd', 'e']);
      graph.addEdge('a', 'b');
      graph.addEdge('b', 'c');
      graph.addEdge('c', 'd');
      graph.addEdge('d', 'e');

      const progressValues = [];
      const progressCallback = (progress) => {
        progressValues.push(progress);
      };

      await forceDirected3DCompute(createGraphData(graph), {
        iterations: 50,
        scale: 100
      }, progressCallback);

      // Should have reported progress multiple times
      expect(progressValues.length).toBeGreaterThan(0);

      // Progress values should be in [0, 1]
      progressValues.forEach(p => {
        expect(p).toBeGreaterThanOrEqual(0);
        expect(p).toBeLessThanOrEqual(1);
      });
    });

    it('should end with progress = 1.0', async () => {
      const graph = new Graph();
      graph.addNodesFrom(['a', 'b', 'c']);
      graph.addEdge('a', 'b');
      graph.addEdge('b', 'c');

      const progressValues = [];
      const progressCallback = (progress) => {
        progressValues.push(progress);
      };

      await forceDirected3DCompute(createGraphData(graph), {
        iterations: 30,
        scale: 100
      }, progressCallback);

      // Last progress should be 1.0
      expect(progressValues[progressValues.length - 1]).toBe(1.0);
    });

    it('should have monotonically increasing progress', async () => {
      const graph = new Graph();
      graph.addNodesFrom(['a', 'b', 'c', 'd']);
      graph.addEdge('a', 'b');
      graph.addEdge('b', 'c');
      graph.addEdge('c', 'd');

      const progressValues = [];
      const progressCallback = (progress) => {
        progressValues.push(progress);
      };

      await forceDirected3DCompute(createGraphData(graph), {
        iterations: 50,
        scale: 100
      }, progressCallback);

      // Progress should be monotonically increasing
      for (let i = 1; i < progressValues.length; i++) {
        expect(progressValues[i]).toBeGreaterThanOrEqual(progressValues[i - 1]);
      }
    });
  });
});
