---
title: "Progress Tracking Example"
created: "2025-01-03"
tags: [example, progress, callback]
category: "examples"
related: ["[[networkstats-class]]", "[[metric-betweenness]]"]
status: "complete"
aliases: ["progress-example"]
---

# Progress Tracking Example

Example of tracking progress during long-running analysis operations.

## Basic Progress Tracking

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();

const network = [
  // ... large network ...
];

const results = await analyzer.analyze(network, ['betweenness'], {
  onProgress: (progress) => {
    const percent = Math.round(progress * 100);
    console.log(`Analysis: ${percent}% complete`);
  }
});
```

## Advanced Progress Tracking

```javascript
let lastProgress = 0;

const results = await analyzer.analyze(network, [
  'betweenness',
  'eigenvector',
  'clustering'
], {
  onProgress: (progress) => {
    const percent = Math.round(progress * 100);
    
    // Only log when progress increases
    if (percent > lastProgress) {
      console.log(`Progress: ${percent}%`);
      lastProgress = percent;
      
      // Update UI progress bar
      updateProgressBar(progress);
    }
  }
});
```

## UI Integration

```javascript
// Update progress bar in UI
function updateProgressBar(progress) {
  const progressBar = document.getElementById('progress-bar');
  progressBar.style.width = `${progress * 100}%`;
  progressBar.textContent = `${Math.round(progress * 100)}%`;
}

const results = await analyzer.analyze(network, ['betweenness'], {
  onProgress: updateProgressBar
});
```

## Related Notes

- [[networkstats-class]] - API reference
- [[metric-betweenness]] - Slow metric that benefits from progress tracking


