---
title: "Bundle Integration"
created: "2025-01-03"
tags: [bundle, vite, webpack, rollup]
category: "advanced"
related: ["[[worker-architecture]]", "[[browser-vs-node]]"]
status: "complete"
aliases: ["bundler", "bundling"]
---

# Bundle Integration

Setting up graph-js with modern bundlers (Vite, Webpack, Rollup).

## Vite

### Installation

```bash
npm install @guinetik/graph-js
```

### Usage

```javascript
import NetworkStats from '@guinetik/graph-js';
import workerUrl from '@guinetik/graph-js/worker-url';

const analyzer = new NetworkStats({
  workerScript: workerUrl
});
```

### Vite Config

No special configuration needed. Vite handles workers automatically.

## Webpack

### Installation

```bash
npm install @guinetik/graph-js
```

### Usage

```javascript
import NetworkStats from '@guinetik/graph-js';
import workerUrl from '@guinetik/graph-js/worker-url';

const analyzer = new NetworkStats({
  workerScript: workerUrl
});
```

### Webpack Config

Webpack handles workers automatically with default configuration.

## Rollup

### Installation

```bash
npm install @guinetik/graph-js
```

### Usage

```javascript
import NetworkStats from '@guinetik/graph-js';
import workerUrl from '@guinetik/graph-js/worker-url';

const analyzer = new NetworkStats({
  workerScript: workerUrl
});
```

## Related Notes

- [[worker-architecture]] - Worker system details
- [[browser-vs-node]] - Environment differences

