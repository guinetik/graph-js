---
title: "graph-js Documentation Index"
created: "2025-01-03"
tags: [index, hub, documentation]
category: "core"
related: []
status: "complete"
aliases: ["home", "start", "docs"]
---

# graph-js Documentation

Welcome to the comprehensive documentation for **@guinetik/graph-js** - a modern, high-performance JavaScript library for network graph analysis.

This documentation follows the Zettelkasten system, where each concept is documented as an atomic note with cross-references. Use `[[links]]` to navigate between related concepts.

## Quick Navigation

### Getting Started
- [[00-quick-start]] - Quick start guide
- [[00-architecture-overview]] - High-level architecture

### Core Concepts
- [[graph-data-structure]] - Graph class and data structure
- [[networkstats-class]] - Main NetworkStats API
- [[worker-architecture]] - Worker-first design

### Statistics & Metrics

**Node-Level Metrics:**
- [[statistics-overview]] - Overview of all metrics
- [[metric-degree]] - Degree centrality
- [[metric-betweenness]] - Betweenness centrality
- [[metric-clustering]] - Clustering coefficient
- [[metric-eigenvector]] - Eigenvector centrality
- [[metric-eigenvector-laplacian]] - Laplacian eigenvector
- [[metric-closeness]] - Closeness centrality
- [[metric-cliques]] - Maximal cliques
- [[metric-ego-density]] - Ego network density

**Graph-Level Statistics:**
- [[graph-stats-overview]] - Overview of graph statistics
- [[graph-stat-density]] - Edge density
- [[graph-stat-diameter]] - Graph diameter
- [[graph-stat-average-clustering]] - Average clustering coefficient
- [[graph-stat-average-shortest-path]] - Mean path length
- [[graph-stat-connected-components]] - Component analysis
- [[graph-stat-average-degree]] - Mean degree

### Layout Algorithms
- [[layouts-overview]] - Layout registry and selection guide
- [[layout-random]] - RandomLayout
- [[layout-circular]] - CircularLayout
- [[layout-spiral]] - SpiralLayout
- [[layout-shell]] - ShellLayout
- [[layout-spectral]] - SpectralLayout
- [[layout-force-directed]] - ForceDirectedLayout
- [[layout-kamada-kawai]] - KamadaKawaiLayout
- [[layout-bipartite]] - BipartiteLayout
- [[layout-multipartite]] - MultipartiteLayout
- [[layout-bfs]] - BFSLayout

### Community Detection
- [[community-detection-overview]] - Community detection concepts
- [[algorithm-louvain]] - Louvain algorithm

### Data Adapters
- [[adapters-overview]] - Adapter pattern overview
- [[adapter-csv]] - CSVAdapter
- [[adapter-json]] - JSONAdapter
- [[adapter-networkx]] - NetworkXAdapter

### Algorithms Deep Dive
- [[algorithm-brandes]] - Brandes algorithm for betweenness
- [[algorithm-power-iteration]] - Power iteration for eigenvector
- [[algorithm-fruchterman-reingold]] - Force-directed layout algorithm
- [[algorithm-kamada-kawai]] - Energy minimization details

### Advanced Topics
- [[performance-optimization]] - Performance tips and benchmarks
- [[typescript-support]] - TypeScript definitions
- [[browser-vs-node]] - Environment differences
- [[bundle-integration]] - Bundler setup (Vite, Webpack, Rollup)
- [[testing-strategy]] - Test architecture

### Examples & Use Cases
- [[example-basic-analysis]] - Basic usage example
- [[example-progress-tracking]] - Progress callback usage
- [[example-graph-stats]] - Graph-level statistics example
- [[example-community-detection]] - Community detection workflow
- [[example-layout-visualization]] - Combining metrics and layouts
- [[example-d3-integration]] - D3.js integration
- [[use-case-social-networks]] - Social network analysis
- [[use-case-citation-networks]] - Citation networks
- [[use-case-family-trees]] - Family relationship graphs

## Documentation Structure

This documentation uses the Zettelkasten method:
- **Atomic Notes**: Each file covers one concept
- **Cross-References**: Use `[[note-name]]` to link related concepts
- **Hub Notes**: Overview files aggregate related topics
- **Obsidian-Compatible**: Frontmatter metadata for organization

## See Also

- [[00-architecture-overview]] - Understanding the library architecture
- [[00-quick-start]] - Getting started quickly

