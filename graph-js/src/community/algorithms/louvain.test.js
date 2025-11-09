import { describe, it, expect } from 'vitest';
import { LouvainAlgorithm } from './louvain.js';
import { CommunityAlgorithm } from './base.js';
import Graph from '../../graph.js';

describe('LouvainAlgorithm', () => {
  let graph;

  beforeEach(() => {
    graph = new Graph();
    graph.addNodesFrom(['A', 'B', 'C', 'D', 'E', 'F']);
    // Create two communities: {A, B, C} and {D, E, F}
    graph.addEdge('A', 'B', 1);
    graph.addEdge('B', 'C', 1);
    graph.addEdge('C', 'A', 1);
    graph.addEdge('D', 'E', 1);
    graph.addEdge('E', 'F', 1);
    graph.addEdge('F', 'D', 1);
    // Weak connection between communities
    graph.addEdge('C', 'D', 0.1);
  });

  it('should extend CommunityAlgorithm', () => {
    const algorithm = new LouvainAlgorithm();
    expect(algorithm).toBeInstanceOf(CommunityAlgorithm);
  });

  it('should have correct metadata', () => {
    const algorithm = new LouvainAlgorithm();
    const info = algorithm.getInfo();

    expect(info.name).toBe('louvain');
    expect(info.description).toContain('Louvain');
  });

  it('should detect communities', async () => {
    const algorithm = new LouvainAlgorithm();
    const result = await algorithm.detect(graph);

    expect(result).toHaveProperty('communities');
    expect(result).toHaveProperty('modularity');
    expect(result).toHaveProperty('numCommunities');
    expect(result).toHaveProperty('algorithm');
    expect(result.algorithm).toBe('louvain');
  });

  it('should return valid community assignments', async () => {
    const algorithm = new LouvainAlgorithm();
    const result = await algorithm.detect(graph);

    // All nodes should have community assignments
    expect(result.communities).toHaveProperty('A');
    expect(result.communities).toHaveProperty('B');
    expect(result.communities).toHaveProperty('C');
    expect(result.communities).toHaveProperty('D');
    expect(result.communities).toHaveProperty('E');
    expect(result.communities).toHaveProperty('F');

    // Community IDs should be numbers
    expect(typeof result.communities.A).toBe('number');
  });

  it('should detect at least 2 communities in bipartite-like graph', async () => {
    const algorithm = new LouvainAlgorithm();
    const result = await algorithm.detect(graph);

    // Should detect 2 communities (or possibly more due to algorithm randomness)
    expect(result.numCommunities).toBeGreaterThanOrEqual(2);
  });

  it('should calculate modularity', async () => {
    const algorithm = new LouvainAlgorithm();
    const result = await algorithm.detect(graph);

    // Modularity should be between -1 and 1
    expect(result.modularity).toBeGreaterThanOrEqual(-1);
    expect(result.modularity).toBeLessThanOrEqual(1);
  });

  it('should throw error if graph is null', async () => {
    const algorithm = new LouvainAlgorithm();
    await expect(algorithm.detect(null)).rejects.toThrow();
  });

  it('should accept options in constructor', () => {
    const algorithm = new LouvainAlgorithm({ resolution: 1.5 });
    expect(algorithm.options.resolution).toBe(1.5);
  });
});
