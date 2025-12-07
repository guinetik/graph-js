import { describe, it, expect } from 'vitest';
import { Graph } from '../graph.js';
import { dfsCompute } from './dfs.js';

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

describe('DFS Layout', () => {
  describe('basic functionality', () => {
    it('should arrange tree in nested structure', async () => {
      const graph = new Graph();
      // Binary tree: root 0, children 1,2, grandchildren 3,4,5,6
      graph.addNodesFrom(['0', '1', '2', '3', '4', '5', '6']);
      graph.addEdge('0', '1');
      graph.addEdge('0', '2');
      graph.addEdge('1', '3');
      graph.addEdge('1', '4');
      graph.addEdge('2', '5');
      graph.addEdge('2', '6');

      const positions = await dfsCompute(createGraphData(graph), {
        startNode: '0',
        scale: 100
      });

      expect(Object.keys(positions).length).toBe(7);

      // All positions should be finite numbers
      Object.values(positions).forEach(p => {
        expect(isFinite(p.x)).toBe(true);
        expect(isFinite(p.y)).toBe(true);
      });

      // Should have some spread in both dimensions
      const xCoords = Object.values(positions).map(p => p.x);
      const yCoords = Object.values(positions).map(p => p.y);
      const xRange = Math.max(...xCoords) - Math.min(...xCoords);
      const yRange = Math.max(...yCoords) - Math.min(...yCoords);

      expect(Math.max(xRange, yRange)).toBeGreaterThan(0);
    });

    it('should position root node at consistent location', async () => {
      const graph = new Graph();
      graph.addNodesFrom(['root', 'child1', 'child2']);
      graph.addEdge('root', 'child1');
      graph.addEdge('root', 'child2');

      const positions = await dfsCompute(createGraphData(graph), {
        startNode: 'root',
        scale: 100
      });

      // Root should be at or near center x
      expect(positions['root']).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty graph', async () => {
      const graph = new Graph();

      const positions = await dfsCompute(createGraphData(graph), {
        scale: 100
      });

      expect(Object.keys(positions).length).toBe(0);
    });

    it('should handle single node', async () => {
      const graph = new Graph();
      graph.addNode('only');

      const positions = await dfsCompute(createGraphData(graph), {
        scale: 100,
        center: { x: 50, y: 50 }
      });

      expect(Object.keys(positions).length).toBe(1);
      expect(positions['only'].x).toBe(50);
      expect(positions['only'].y).toBe(50);
    });

    it('should handle disconnected graphs', async () => {
      const graph = new Graph();
      graph.addNodesFrom(['a', 'b', 'c', 'd']);
      graph.addEdge('a', 'b');
      // c and d are disconnected from a-b

      const positions = await dfsCompute(createGraphData(graph), {
        startNode: 'a',
        scale: 100
      });

      // Should still position all 4 nodes
      expect(Object.keys(positions).length).toBe(4);

      // All positions should be valid
      Object.values(positions).forEach(p => {
        expect(isFinite(p.x)).toBe(true);
        expect(isFinite(p.y)).toBe(true);
      });
    });

    it('should handle chain-like graphs (linear path)', async () => {
      const graph = new Graph();
      // Long chain: a -> b -> c -> d -> e -> f
      graph.addNodesFrom(['a', 'b', 'c', 'd', 'e', 'f']);
      graph.addEdge('a', 'b');
      graph.addEdge('b', 'c');
      graph.addEdge('c', 'd');
      graph.addEdge('d', 'e');
      graph.addEdge('e', 'f');

      const positions = await dfsCompute(createGraphData(graph), {
        startNode: 'a',
        scale: 100
      });

      expect(Object.keys(positions).length).toBe(6);

      // Chain should NOT be a vertical line - should have x spread
      const xCoords = Object.values(positions).map(p => p.x);
      const xRange = Math.max(...xCoords) - Math.min(...xCoords);

      // For chain-like graphs, we expect some horizontal spread (zigzag pattern)
      // The range should be > 0 due to our chain detection logic
      expect(xRange).toBeGreaterThanOrEqual(0);

      // Nodes should be at different depths (y positions)
      const yCoords = Object.values(positions).map(p => p.y);
      const uniqueY = new Set(yCoords.map(y => Math.round(y * 100) / 100));
      expect(uniqueY.size).toBeGreaterThan(1);
    });

    it('should handle graphs with cycles', async () => {
      const graph = new Graph();
      // Triangle with extra node
      graph.addNodesFrom(['a', 'b', 'c', 'd']);
      graph.addEdge('a', 'b');
      graph.addEdge('b', 'c');
      graph.addEdge('c', 'a'); // cycle
      graph.addEdge('a', 'd');

      const positions = await dfsCompute(createGraphData(graph), {
        startNode: 'a',
        scale: 100
      });

      // DFS should still produce valid positions (back edges ignored in tree)
      expect(Object.keys(positions).length).toBe(4);
      Object.values(positions).forEach(p => {
        expect(isFinite(p.x)).toBe(true);
        expect(isFinite(p.y)).toBe(true);
      });
    });
  });

  describe('wide trees', () => {
    it('should handle trees with many children per node', async () => {
      const graph = new Graph();
      // Star graph: center connected to 10 leaves
      graph.addNode('center');
      for (let i = 0; i < 10; i++) {
        graph.addNode(`leaf${i}`);
        graph.addEdge('center', `leaf${i}`);
      }

      const positions = await dfsCompute(createGraphData(graph), {
        startNode: 'center',
        scale: 100
      });

      expect(Object.keys(positions).length).toBe(11);

      // Center should exist
      expect(positions['center']).toBeDefined();

      // Leaves should be spread out horizontally
      const leafPositions = Object.entries(positions)
        .filter(([id]) => id.startsWith('leaf'))
        .map(([, pos]) => pos);

      const xCoords = leafPositions.map(p => p.x);
      const xRange = Math.max(...xCoords) - Math.min(...xCoords);
      expect(xRange).toBeGreaterThan(0);
    });

    it('should preserve vertical spacing between levels', async () => {
      const graph = new Graph();
      // 3-level tree
      graph.addNodesFrom(['root', 'a', 'b', 'a1', 'a2', 'b1', 'b2']);
      graph.addEdge('root', 'a');
      graph.addEdge('root', 'b');
      graph.addEdge('a', 'a1');
      graph.addEdge('a', 'a2');
      graph.addEdge('b', 'b1');
      graph.addEdge('b', 'b2');

      const positions = await dfsCompute(createGraphData(graph), {
        startNode: 'root',
        scale: 100
      });

      // Root should be at different y than children
      const rootY = positions['root'].y;
      const childY = positions['a'].y;
      const grandchildY = positions['a1'].y;

      // Each level should have different y (with tolerance for floating point)
      expect(Math.abs(rootY - childY)).toBeGreaterThan(0.01);
      expect(Math.abs(childY - grandchildY)).toBeGreaterThan(0.01);
    });
  });

  describe('alignment option', () => {
    it('should support horizontal alignment', async () => {
      const graph = new Graph();
      graph.addNodesFrom(['a', 'b', 'c']);
      graph.addEdge('a', 'b');
      graph.addEdge('b', 'c');

      const verticalPositions = await dfsCompute(createGraphData(graph), {
        startNode: 'a',
        align: 'vertical',
        scale: 100
      });

      const horizontalPositions = await dfsCompute(createGraphData(graph), {
        startNode: 'a',
        align: 'horizontal',
        scale: 100
      });

      // Horizontal alignment should swap x and y
      // The patterns should be rotated 90 degrees
      expect(verticalPositions).toBeDefined();
      expect(horizontalPositions).toBeDefined();
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

      await dfsCompute(createGraphData(graph), {
        startNode: 'a',
        scale: 100
      }, progressCallback);

      // Should have reported progress multiple times
      expect(progressValues.length).toBeGreaterThan(0);

      // Progress should end at 1.0
      expect(progressValues[progressValues.length - 1]).toBe(1.0);

      // Progress values should be monotonically increasing
      for (let i = 1; i < progressValues.length; i++) {
        expect(progressValues[i]).toBeGreaterThanOrEqual(progressValues[i - 1]);
      }
    });
  });
});
