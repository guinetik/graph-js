---
title: "Performance Optimization"
created: "2025-01-03"
tags: [performance, optimization, benchmarks]
category: "advanced"
related: ["[[worker-architecture]]", "[[statistics-overview]]"]
status: "complete"
aliases: ["performance", "optimization"]
---

# Performance Optimization

Tips and benchmarks for optimizing graph-js performance.

## Worker Architecture Benefits

The worker-first architecture provides 2-3x speedup on large graphs:
- **Non-blocking**: UI remains responsive
- **Parallel Processing**: Multiple workers handle tasks simultaneously
- **CPU Utilization**: Automatically uses all available cores

## Benchmarks

Performance on MacBook Pro (M1, 8 cores):

| Graph Size | Metric | Time (Worker) | Time (Main Thread) |
|------------|--------|---------------|---------------------|
| 100 nodes | Degree | 5ms | 8ms |
| 100 nodes | Eigenvector | 45ms | 120ms |
| 1000 nodes | Betweenness | 850ms | 2400ms |
| 5000 nodes | Clustering | 1200ms | 4100ms |

## Performance Tips

### 1. Choose Metrics Wisely

Some metrics are computationally expensive:
- **Fast**: [[metric-degree]], [[metric-eigenvector-laplacian]]
- **Medium**: [[metric-clustering]], [[metric-eigenvector]]
- **Slow**: [[metric-betweenness]], [[metric-cliques]]

### 2. Use Progress Callbacks

Monitor long-running operations:

```javascript
const results = await analyzer.analyze(network, ['betweenness'], {
  onProgress: (progress) => {
    console.log(`${Math.round(progress * 100)}%`);
  }
});
```

### 3. Batch Operations

Analyze multiple features at once for better performance:

```javascript
// Good: Single analysis call
const results = await analyzer.analyze(network, [
  'degree',
  'betweenness',
  'eigenvector'
]);

// Less efficient: Multiple calls
const degree = await analyzer.analyze(network, ['degree']);
const betweenness = await analyzer.analyze(network, ['betweenness']);
```

### 4. Dispose Analyzers

Always clean up when done:

```javascript
await analyzer.dispose();
```

### 5. Configure Workers

For large graphs, configure worker count:

```javascript
const analyzer = new NetworkStats({
  maxWorkers: 4,  // Limit workers if needed
  taskTimeout: 120000  // Increase timeout for large graphs
});
```

## Related Notes

- [[worker-architecture]] - Worker system details
- [[statistics-overview]] - Metric complexity guide

