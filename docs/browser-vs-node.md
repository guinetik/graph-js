---
title: "Browser vs Node.js"
created: "2025-01-03"
tags: [browser, nodejs, environment]
category: "advanced"
related: ["[[worker-architecture]]"]
status: "complete"
aliases: ["environments", "browser-node"]
---

# Browser vs Node.js

graph-js works in both browser and Node.js environments with some differences.

## Browser Environment

### Worker Script

In browsers, you may need to specify the worker script:

```javascript
import NetworkStats from '@guinetik/graph-js';
import workerUrl from '@guinetik/graph-js/worker-url';

const analyzer = new NetworkStats({
  workerScript: workerUrl
});
```

### Bundle Integration

For Vite, Webpack, or Rollup:

```javascript
import workerUrl from '@guinetik/graph-js/worker-url';

const analyzer = new NetworkStats({
  workerScript: workerUrl
});
```

## Node.js Environment

### Automatic Detection

In Node.js, workers are automatically detected:

```javascript
import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats();
// Works automatically, no worker script needed
```

### Worker Pool

Node.js uses worker threads automatically. No special configuration needed.

## Differences

| Feature | Browser | Node.js |
|---------|---------|---------|
| Worker Script | May need explicit path | Auto-detected |
| Worker Type | Web Workers | Worker Threads |
| CPU Detection | `navigator.hardwareConcurrency` | `os.cpus().length` |
| File System | Not available | Available |

## Related Notes

- [[worker-architecture]] - Worker system details
- [[bundle-integration]] - Bundler setup

