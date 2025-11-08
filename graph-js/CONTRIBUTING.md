# Contributing to @guinetik/graph-js

Welcome! This document describes the code style, architectural patterns, and contribution guidelines for this library. It's designed to be useful for both humans and LLMs working on the codebase.

## Table of Contents

1. [Core Principles](#core-principles)
   - Worker-First Architecture
   - Bundler-Friendly Design
   - Dual Export Pattern
   - Event-Driven Architecture
   - Logging Policy
2. [Code Style](#code-style)
3. [Architecture Patterns](#architecture-patterns)
4. [Adding New Features](#adding-new-features)
5. [Testing Guidelines](#testing-guidelines)
6. [What NOT to Do](#what-not-to-do)
   - No Private Field Syntax (#)
   - No setTimeout/setInterval
   - No console.log
   - No TypeScript
   - No Dynamic Imports
   - No Computation on Main Thread

---

## Core Principles

### Worker-First Architecture

**ALL** computation must happen in Web Workers. This is non-negotiable.

- ✅ Main thread: Thin wrapper classes, API surface, worker delegation
- ✅ Workers: Pure compute functions with all the heavy lifting
- ❌ Main thread: Direct computation, blocking operations

### Bundler-Friendly Design

Use **static imports** and **module registries**, not dynamic imports.

```javascript
// ✅ CORRECT - Static imports in worker
import * as randomCompute from '../layouts/random.js';
const MODULE_REGISTRY = {
  '../layouts/random.js': randomCompute
};

// ❌ WRONG - Dynamic imports (breaks bundlers)
const module = await import(`../layouts/${algorithmName}.js`);
```

### Dual Export Pattern

Every algorithm module exports BOTH:
1. **OOP Wrapper Class** - For main thread API
2. **Pure Compute Function** - For worker execution

```javascript
// 1. Main thread API (thin wrapper)
export class RandomLayout extends Layout {
  constructor(graph, options = {}) {
    super(graph, options, {
      module: '../layouts/random.js',    // ← Worker will find this
      functionName: 'randomCompute'      // ← Worker will call this
    });
  }
}

// 2. Worker compute function (does actual work)
export async function randomCompute(graphData, options, progressCallback) {
  // All the heavy computation here
  return positions;
}
```

### Event-Driven Architecture

**Everything is event-based**. No polling, no arbitrary timeouts.

- ✅ Event callbacks: `onProgress`, `onComplete`, `onError`
- ✅ Promises and async/await for async operations
- ✅ Web Worker message passing with `postMessage`/`onmessage`
- ❌ `setTimeout` or `setInterval` for control flow
- ❌ Polling loops waiting for state changes

```javascript
// ✅ CORRECT - Event-driven with callbacks
export async function compute(graphData, options, progressCallback) {
  for (let i = 0; i < iterations; i++) {
    // Do work...
    reportProgress(progressCallback, i / iterations);  // Event-based
  }
}

// ❌ WRONG - Using setTimeout
export async function compute(graphData, options, progressCallback) {
  setTimeout(() => {
    // Never use setTimeout for control flow
  }, 100);
}
```

### Logging Policy

**Always use `@guinetik/logger`**. Never use `console.*` directly.

```javascript
// ✅ CORRECT - Use logger
import { createLogger } from '@guinetik/logger';

const log = createLogger({
  prefix: 'MyModule',
  level: 'debug'
});

log.info('Processing data');
log.debug('Debug details:', data);
log.error('Error occurred:', error);

// ❌ WRONG - Direct console usage
console.log('Processing data');
console.error('Error occurred');
```

---

## Code Style

### Language Features

**ES Modules Only** - No CommonJS.

```javascript
// ✅ Use ES module syntax
import { Graph } from './graph.js';
export default NetworkStats;
export { Graph, Layout };

// ❌ No CommonJS
const Graph = require('./graph.js');
module.exports = NetworkStats;
```

**Pure JavaScript** - This library uses modern JavaScript (ES2020+) with JSDoc for type safety. No TypeScript source code. This keeps algorithms readable, enables experimentation with cutting-edge JS features, and simplifies the build pipeline. See [No TypeScript](#-no-typescript) for detailed rationale.

### Modern JavaScript

Use ESNext features supported by modern browsers and Node.js:

```javascript
// ✅ Arrow functions
const compute = (data) => data.map(x => x * 2);

// ✅ Destructuring
const { scale = 100, center = { x: 0, y: 0 } } = options || {};

// ✅ Template literals
this.log.info(`Analyzing network with ${network.length} edges`);

// ✅ Async/await (ALWAYS for compute operations)
const result = await statInstance.calculate(graph);

// ✅ for...of loops
for (const node of nodes) {
  process(node);
}

// ✅ Optional chaining
const argsLength = args?.length || 0;

// ✅ Nullish coalescing
const verbose = options.verbose ?? true;

// ❌ Avoid old-school for loops when not needed
for (let i = 0; i < nodes.length; i++) { /* ... */ }
```

### Documentation

**JSDoc EVERYWHERE** - Every public function, class, method, and exported constant must have JSDoc.

```javascript
/**
 * Calculate betweenness centrality for all nodes in the graph.
 *
 * Betweenness centrality measures how often a node appears on shortest
 * paths between other nodes. High betweenness indicates "bridge" nodes.
 *
 * **Time Complexity**: O(V³) for unweighted graphs
 * **Space Complexity**: O(V²)
 *
 * @param {Graph} graph - The graph to analyze
 * @param {Object} [options={}] - Computation options
 * @param {boolean} [options.normalized=true] - Normalize results to [0,1]
 * @param {Function} [options.onProgress] - Progress callback (0-1)
 * @returns {Promise<Object>} Node ID -> betweenness score mapping
 * @example
 * const graph = new Graph();
 * graph.addEdge('A', 'B');
 * const scores = await betweennessCompute(graph.serialize());
 * // { 'A': 0, 'B': 0 }
 */
export async function betweennessCompute(graphData, options, progressCallback) {
  // Implementation...
}
```

Include:
- Clear description
- Time/space complexity when relevant
- `@param` with types and descriptions
- `@returns` with type and description
- `@example` showing actual usage
- `@throws` if applicable

### Formatting

- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes for strings
- **Semicolons**: Use them consistently
- **Line Length**: Keep under 100 characters when practical
- **Trailing Commas**: Use them in multi-line arrays/objects

```javascript
// ✅ Good formatting
const options = {
  scale: 100,
  center: { x: 0, y: 0 },
  iterations: 1000,  // ← trailing comma
};

// ❌ Bad formatting
const options = {scale:100,center:{x:0,y:0},iterations:1000}
```

### Naming Conventions

```javascript
// Classes: PascalCase
class RandomLayout extends Layout { }
class NetworkStats { }

// Functions/methods: camelCase
async function randomCompute() { }
getPositions() { }

// Constants: SCREAMING_SNAKE_CASE (for registries/enums)
static FEATURES = {
  EIGENVECTOR: "eigenvector",
  ALL: ["degree", "betweenness"]
};

// Private methods/properties: _prefixedCamelCase (NOT # private fields)
_prepareNetwork(network) { }
_calculateNodeStats(graph, nodes) { }

// Variables: camelCase
const nodeStats = [];
const graphData = graph.serialize();
```

**IMPORTANT**: Do **NOT** use JavaScript `#private` fields/methods, especially in worker code. They break the build pipeline.

```javascript
// ❌ WRONG - Private fields break the pipeline
class MyClass {
  #privateField = 0;
  #privateMethod() { }
}

// ✅ CORRECT - Use underscore prefix convention
class MyClass {
  constructor() {
    this._privateField = 0;
  }
  _privateMethod() { }
}
```

### Options Handling Pattern

**Always** use object destructuring with defaults:

```javascript
// ✅ CORRECT - Destructure with defaults
export async function compute(graphData, options, progressCallback) {
  const {
    scale = 100,
    center = { x: 0, y: 0 },
    iterations = 1000,
    tolerance = 1e-6
  } = options || {};  // ← Handle null/undefined options

  // Use scale, center, etc.
}

// ❌ WRONG - Manual option checking
export async function compute(graphData, options, progressCallback) {
  const scale = options.scale ? options.scale : 100;
  const center = options.center || { x: 0, y: 0 };
  // This is verbose and error-prone
}
```

### Error Handling

Use descriptive errors with context:

```javascript
// ✅ Good error messages
if (!graph.hasNode(nodeId)) {
  throw new Error(`Node '${nodeId}' not found in graph`);
}

if (nodes.length === 0) {
  throw new Error('Cannot compute layout for empty graph');
}

// ❌ Vague errors
throw new Error('Invalid input');
throw new Error('Error');
```

---

## Architecture Patterns

### 1. Base Class Pattern

Layouts and algorithms extend base classes that handle worker delegation:

```javascript
// Base class handles worker communication
export class Layout {
  constructor(graph, options, workerConfig) {
    this.graph = graph;
    this.options = options;
    this.workerConfig = workerConfig;  // { module, functionName }
  }

  async computePositions() {
    // Delegates to worker using workerConfig
    return WorkerManager.execute(this.workerConfig, [graphData, options]);
  }
}

// Child class just sets up configuration
export class KamadaKawaiLayout extends Layout {
  constructor(graph, options = {}) {
    super(graph, options, {
      module: '../layouts/kamada-kawai.js',
      functionName: 'kamadaKawaiCompute'
    });
  }
}
```

### 2. Registry Pattern

Use registries for programmatic discovery:

```javascript
// Registry with metadata
export const LAYOUT_REGISTRY = {
  layouts: {
    random: {
      class: RandomLayout,
      name: 'Random',
      category: 'simple',
      complexity: 'O(n)',
      requiresStats: [],
      description: 'Places nodes at random positions'
    },
    // ... more layouts
  },

  // Helper methods
  getAll() { return Object.values(this.layouts); },
  byCategory(cat) { return this.getAll().filter(l => l.category === cat); },
  withoutStatRequirements() { return this.getAll().filter(l => l.requiresStats.length === 0); }
};
```

**When to add to a registry:**
- New layout algorithm → `LAYOUT_REGISTRY` in `src/layouts/index.js`
- New community detection → `COMMUNITY_REGISTRY` in `src/community/index.js`

### 3. Progress Reporting

All long-running operations support progress callbacks:

```javascript
// In compute functions
import { reportProgress } from '../compute/compute-utils.js';

export async function expensiveCompute(graphData, options, progressCallback) {
  const totalSteps = nodes.length;

  for (let i = 0; i < totalSteps; i++) {
    // Do work...

    // Report progress (0.0 to 1.0)
    reportProgress(progressCallback, (i + 1) / totalSteps);
  }

  // Always report 1.0 at the end
  reportProgress(progressCallback, 1.0);
  return result;
}
```

### 4. Graph Serialization

Workers receive serialized graph data, not Graph instances:

```javascript
// Main thread prepares data
const graphData = graph.serialize();  // Returns plain object
await WorkerManager.execute(config, [graphData, options]);

// Worker reconstructs graph
import { reconstructGraph } from '../../compute/compute-utils.js';

export async function compute(graphData, options, progressCallback) {
  const graph = reconstructGraph(graphData);  // Graph instance
  // Now use graph.getNeighbors(), etc.
}
```

### 5. Singleton Pattern (WorkerManager)

The WorkerManager is a singleton that manages the worker pool:

```javascript
// ✅ CORRECT - Use WorkerManager methods
await WorkerManager.initialize(options);
const result = await WorkerManager.execute(config, args);
await WorkerManager.terminate();

// ❌ WRONG - Don't instantiate
const manager = new WorkerManager();  // This won't work
```

---

## Adding New Features

### Adding a New Layout Algorithm

1. **Create the layout file** in `src/layouts/your-layout.js`:

```javascript
import { Layout } from './layout.js';
import { reportProgress } from '../compute/compute-utils.js';

/**
 * YourLayout - Description of what it does
 *
 * **Time Complexity**: O(?)
 * **Use Case**: When to use this layout
 *
 * @extends Layout
 */
export class YourLayout extends Layout {
  constructor(graph, options = {}) {
    super(graph, {
      // Default options
      iterations: 100,
      ...options
    }, {
      module: '../layouts/your-layout.js',
      functionName: 'yourLayoutCompute'
    });
  }
}

/**
 * Compute function for workers
 */
export async function yourLayoutCompute(graphData, options, progressCallback) {
  const { iterations = 100 } = options || {};
  const nodes = Array.from(graphData.nodes || []);
  const positions = {};

  // Your algorithm here
  for (let i = 0; i < iterations; i++) {
    // Compute positions...
    reportProgress(progressCallback, (i + 1) / iterations);
  }

  return positions;  // { nodeId: { x, y }, ... }
}
```

2. **Register in worker** (`src/compute/network-worker.js`):

```javascript
// Add import
import * as yourLayoutCompute from '../layouts/your-layout.js';

// Add to MODULE_REGISTRY
const MODULE_REGISTRY = {
  // ... existing entries
  '../layouts/your-layout.js': yourLayoutCompute
};
```

3. **Export from layouts** (`src/layouts/index.js`):

```javascript
export { YourLayout } from './your-layout.js';
```

4. **Add to LAYOUT_REGISTRY** (`src/layouts/index.js`):

```javascript
export const LAYOUT_REGISTRY = {
  layouts: {
    // ... existing layouts
    'your-layout': {
      class: YourLayout,
      name: 'Your Layout',
      category: 'physics',  // or 'simple', 'hierarchical', 'spectral'
      complexity: 'O(n²)',
      requiresStats: [],  // e.g., ['degree', 'eigenvector-laplacian']
      description: 'Short description of the layout'
    }
  },
  // ... helper methods
};
```

5. **Write tests** (`src/layouts/your-layout.test.js`):

```javascript
import { describe, it, expect } from 'vitest';
import { Graph } from '../graph.js';
import { YourLayout } from './your-layout.js';

describe('YourLayout', () => {
  it('should compute positions for all nodes', async () => {
    const graph = new Graph();
    graph.addNodesFrom(['A', 'B', 'C']);
    graph.addEdge('A', 'B');

    const layout = new YourLayout(graph);
    const positions = await layout.getPositions();

    expect(positions).toHaveProperty('A');
    expect(positions).toHaveProperty('B');
    expect(positions).toHaveProperty('C');
    expect(positions.A).toHaveProperty('x');
    expect(positions.A).toHaveProperty('y');
  });
});
```

### Adding a New Statistic

Follow the same pattern as layouts:

1. Add compute function to `src/statistics/algorithms/node-stats.js` or `graph-stats.js`
2. Create wrapper class in `src/statistics/` (or use existing `NetworkStatistics`)
3. Register in `src/compute/network-worker.js`
4. Add to `NetworkStats.FEATURES` or `NetworkStats.GRAPH_STATS` in `src/index.js`
5. Update statistic class mappings in `NetworkStats` constructor
6. Write tests

### Adding a New Community Detection Algorithm

1. Create `src/community/algorithms/your-algorithm.js`:

```javascript
import { CommunityAlgorithm } from './base.js';

export class YourAlgorithm extends CommunityAlgorithm {
  constructor(options = {}) {
    super(
      'your-algorithm',
      'Description of the algorithm',
      {
        module: '../community/algorithms/your-algorithm.js',
        functionName: 'yourAlgorithmCompute'
      }
    );
    this.options = options;
  }
}

export async function yourAlgorithmCompute(graphData, options, progressCallback) {
  // Return { communities: {}, modularity: 0.5, numCommunities: 3 }
}
```

2. Register in worker and `COMMUNITY_REGISTRY`
3. Export from `src/community/index.js`
4. Add to `NetworkStats.COMMUNITY_DETECTION`
5. Write tests

---

## Testing Guidelines

### Test File Structure

- Place test files **next to source files**: `layout.js` → `layout.test.js`
- Use descriptive test names
- Test both success and error cases
- Test with various graph sizes and topologies

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { Graph } from '../graph.js';
import { YourFeature } from './your-feature.js';

describe('YourFeature', () => {
  let graph;

  beforeEach(() => {
    graph = new Graph();
    graph.addNodesFrom(['A', 'B', 'C']);
    graph.addEdge('A', 'B', 1);
    graph.addEdge('B', 'C', 2);
  });

  it('should handle basic case', async () => {
    const result = await compute(graph.serialize());
    expect(result).toBeDefined();
  });

  it('should handle empty graph', async () => {
    const emptyGraph = new Graph();
    await expect(compute(emptyGraph.serialize())).rejects.toThrow();
  });

  it('should handle disconnected components', async () => {
    graph.addNode('D');
    const result = await compute(graph.serialize());
    expect(result).toHaveProperty('D');
  });
});
```

### Run Tests

```bash
# Run all tests with coverage
npm test

# Watch mode during development
npm run test:watch
```

### What to Test

- ✅ Algorithm correctness (compare to known results)
- ✅ Edge cases (empty graph, single node, disconnected)
- ✅ Options handling (defaults, custom values)
- ✅ Error conditions (invalid input, missing data)
- ✅ Progress reporting (if applicable)
- ❌ Don't test implementation details (private methods)

---

## What NOT to Do

### ❌ No Private Field Syntax (#)

**Never** use JavaScript `#private` fields or methods. They break the build pipeline.

```javascript
// ❌ WRONG - Breaks build pipeline
class WorkerPool {
  #workers = [];
  #maxWorkers = 4;

  #createWorker() {
    return new Worker('./worker.js');
  }

  getWorker() {
    return this.#workers[0];
  }
}

// ✅ CORRECT - Use underscore prefix
class WorkerPool {
  constructor() {
    this._workers = [];
    this._maxWorkers = 4;
  }

  _createWorker() {
    return new Worker('./worker.js');
  }

  getWorker() {
    return this._workers[0];
  }
}
```

This is especially critical in worker code where the build pipeline has issues with private fields.

### ❌ No setTimeout/setInterval

**Never** use `setTimeout` or `setInterval`. Everything must be event-driven.

```javascript
// ❌ WRONG - Using setTimeout for delays
async function compute(graphData, options, progressCallback) {
  processData();

  // Wait for some arbitrary time
  await new Promise(resolve => setTimeout(resolve, 100));

  return result;
}

// ❌ WRONG - Using setInterval for polling
function waitForWorker() {
  const interval = setInterval(() => {
    if (workerReady) {
      clearInterval(interval);
      doWork();
    }
  }, 10);
}

// ✅ CORRECT - Event-driven with callbacks
async function compute(graphData, options, progressCallback) {
  for (let step = 0; step < totalSteps; step++) {
    processStep(step);
    reportProgress(progressCallback, step / totalSteps);  // Events
  }
  return result;
}

// ✅ CORRECT - Promise-based event waiting
function waitForWorker() {
  return new Promise((resolve) => {
    worker.onmessage = (event) => {
      if (event.data.type === 'ready') {
        resolve();
      }
    };
  });
}
```

If you think you need a timeout:
- For animation: Use `requestAnimationFrame`
- For async operations: Use Promises and async/await
- For worker communication: Use message passing events
- For delays: Rethink your approach - you probably don't need it

### ❌ No console.log (Use Logger Instead)

**Never** use `console.log`, `console.error`, `console.warn`, etc. Always use `@guinetik/logger`.

```javascript
// ❌ WRONG - Direct console usage
export async function compute(graphData, options, progressCallback) {
  console.log('Starting computation...');

  try {
    const result = processData();
    console.log('Result:', result);
    return result;
  } catch (error) {
    console.error('Computation failed:', error);
    throw error;
  }
}

// ✅ CORRECT - Use logger
import { createLogger } from '@guinetik/logger';

const log = createLogger({
  prefix: 'compute',
  level: 'debug'
});

export async function compute(graphData, options, progressCallback) {
  log.info('Starting computation...');

  try {
    const result = processData();
    log.debug('Result:', result);
    return result;
  } catch (error) {
    log.error('Computation failed:', error);
    throw error;
  }
}
```

**Why logger instead of console:**
- Consistent formatting across the library
- Filterable log levels (debug, info, warn, error)
- Prefixes for easy identification
- Can be configured by users
- Better for production environments

### ❌ No TypeScript

This library is **pure JavaScript** by design. Here's why:

**1. Algorithm Clarity**
Mathematical and graph algorithms are clearer without type annotations cluttering the logic. Compare:

```typescript
// TypeScript - type annotations obscure the algorithm
function betweenness<T extends NodeId>(
  graph: Graph<T>,
  options: BetweennessOptions = {}
): Promise<Map<T, number>> {
  const distances: Map<T, Map<T, number>> = new Map();
  // The algorithm gets lost in the types...
}

// Pure JS - the algorithm is front and center
function betweenness(graph, options = {}) {
  const distances = new Map();
  // Algorithm logic is clear and readable
}
```

For a **math library**, the focus should be on algorithmic clarity, not type gymnastics.

**2. Modern JavaScript Experimentation**
This library is a playground for **ES2020+ features**:
- Optional chaining (`?.`)
- Nullish coalescing (`??`)
- Top-level await
- Private fields (well, we avoid `#` but you get the idea)
- Dynamic import registries

TypeScript sometimes lags behind or adds friction to using cutting-edge JavaScript features.

**3. Build Pipeline Simplicity**
- **No transpilation step** - source code runs directly in modern browsers and Node.js
- **Faster iteration** - no `tsc` watch process, no build errors from types
- **Worker compatibility** - workers have specific serialization requirements; TS adds complexity

**4. Type Safety Still Provided**
Consumers still get full type safety:
- **JSDoc comments** provide inline type information
- **Generated `.d.ts` files** give TypeScript users autocomplete and type checking
- Best of both worlds: clean source, typed consumption

```javascript
// ❌ WRONG - No TypeScript syntax
function compute(graph: Graph, options: Options): Promise<Result> {
  // ...
}

// ✅ CORRECT - JavaScript with comprehensive JSDoc
/**
 * Compute betweenness centrality for all nodes.
 *
 * @param {Graph} graph - The graph to analyze
 * @param {Object} [options={}] - Computation options
 * @param {boolean} [options.normalized=true] - Normalize to [0,1]
 * @param {Function} [options.onProgress] - Progress callback
 * @returns {Promise<Object>} Node ID -> betweenness score
 * @example
 * const result = await compute(graph, { normalized: true });
 */
async function compute(graph, options = {}) {
  // Clean, readable algorithm implementation
}
```

**TL;DR:** Pure JS keeps the code focused on algorithms, allows ES2020+ experimentation, and simplifies the build pipeline - all while providing full type safety to consumers via JSDoc and generated type definitions.

### ❌ No Dynamic Imports in Workers

Workers use a static module registry. **Never** use dynamic imports.

```javascript
// ❌ WRONG - Dynamic imports break bundlers
const module = await import(`../layouts/${name}.js`);
const fn = module[functionName];

// ✅ CORRECT - Static registry lookup
const module = MODULE_REGISTRY[modulePath];
const fn = module[functionName];
```

### ❌ No Computation on Main Thread

All heavy computation must happen in workers.

```javascript
// ❌ WRONG - Computing on main thread
export class BadLayout extends Layout {
  computePositions() {  // ← NOT async, not using worker
    const positions = {};
    for (let i = 0; i < 1000; i++) {
      // Expensive loop blocks UI
    }
    return positions;
  }
}

// ✅ CORRECT - Delegate to worker
export class GoodLayout extends Layout {
  // Inherits computePositions() which delegates to worker
}

export async function goodLayoutCompute(graphData, options, progressCallback) {
  // Does the work in worker thread
}
```

### ❌ No Mutating Input Objects

Treat all inputs as immutable. Return new objects.

```javascript
// ❌ WRONG - Mutating input
function normalize(data) {
  data.values = data.values.map(v => v / max);  // ← Mutates input
  return data;
}

// ✅ CORRECT - Return new object
function normalize(data) {
  return {
    ...data,
    values: data.values.map(v => v / max)
  };
}
```

### ❌ No Synchronous APIs

All computation methods must be async (returns Promise).

```javascript
// ❌ WRONG - Synchronous
compute(graph) {
  return doExpensiveWork();
}

// ✅ CORRECT - Asynchronous
async compute(graph) {
  return await doExpensiveWork();
}
```

### ❌ No Framework Dependencies

The library is framework-agnostic. Don't add React, Vue, Angular, etc. dependencies.

```javascript
// ❌ WRONG
import { useState } from 'react';

// ✅ CORRECT - Pure JS/Web APIs only
import { createLogger } from '@guinetik/logger';
```

### ❌ No Bundling Third-Party Algorithm Libraries

Implement algorithms from scratch. Don't depend on external math/graph libraries.

```javascript
// ❌ WRONG
import { calculateEigenvector } from 'some-math-lib';

// ✅ CORRECT - Implement yourself
function powerIteration(matrix, iterations) {
  // Your implementation
}
```

Exception: Small utilities from `@guinetik/logger` are OK.

---

## Development Workflow

### Setup

```bash
# Install dependencies
cd graph-js
npm install

# Run tests in watch mode
npm run test:watch

# Build the library
npm run build

# Build in watch mode
npm run build:watch
```

### Project Structure

```
graph-js/
├── src/
│   ├── index.js                 # Main entry point
│   ├── graph.js                 # Graph data structure
│   ├── compute/                 # Worker management
│   │   ├── WorkerManager.js     # Singleton worker manager
│   │   ├── WorkerPool.js        # Worker pool
│   │   ├── WorkerAdapter.js     # Communication adapter
│   │   ├── network-worker.js    # Worker entry + MODULE_REGISTRY
│   │   └── compute-utils.js     # Shared utilities
│   ├── statistics/              # Network metrics
│   │   ├── NetworkStatistics.js # Base statistic class
│   │   └── algorithms/          # Algorithm implementations
│   ├── community/               # Community detection
│   │   ├── index.js             # Exports + COMMUNITY_REGISTRY
│   │   └── algorithms/          # Detection algorithms
│   ├── layouts/                 # Graph layouts
│   │   ├── layout.js            # Base layout class
│   │   ├── index.js             # Exports + LAYOUT_REGISTRY
│   │   └── *.js                 # Layout implementations
│   └── adapters/                # Data format converters
├── dist/                        # Build output (gitignored)
├── types/                       # TypeScript definitions (generated)
├── vite.config.js              # Build configuration
├── vitest.config.js            # Test configuration
└── package.json
```

### Making a Pull Request

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Write code following these guidelines
4. Add tests for new features
5. Ensure all tests pass: `npm test`
6. Build successfully: `npm run build`
7. Commit with clear messages
8. Open a PR with description of changes

---

## Questions?

If you have questions about these guidelines or need clarification:

1. Check existing code for patterns
2. Look at similar features (e.g., other layouts for reference)
3. Open a GitHub issue for discussion

## For LLMs

When contributing code or helping maintain this library:

### Critical Constraints (NEVER violate these)

1. **NO `#private` fields/methods** - Use `_underscore` prefix instead (breaks build pipeline)
2. **NO `setTimeout`/`setInterval`** - Everything must be event-driven (use callbacks, Promises)
3. **NO `console.log`** - Always use `@guinetik/logger` (`createLogger()`)
4. **NO TypeScript syntax** - Pure JavaScript with JSDoc only
5. **NO dynamic imports** - Use static imports and MODULE_REGISTRY in workers
6. **NO computation on main thread** - All heavy work in workers via async functions

### Required Patterns

1. **Always follow the dual export pattern**: OOP wrapper + pure compute function
2. **All computation is async** and happens in workers
3. **Use static imports** in `network-worker.js`, never dynamic imports
4. **Follow the registry pattern** for new algorithms/layouts
5. **Include comprehensive JSDoc** with examples and complexity notes
6. **Write tests** alongside features
7. **Progress reporting** for long-running operations via callbacks
8. **Serialize graphs** before sending to workers
9. **Handle options** with destructuring and defaults
10. **Event-driven architecture** - callbacks, Promises, async/await (no polling)

### Quick Reference

```javascript
// ✅ CORRECT Pattern
import { createLogger } from '@guinetik/logger';

const log = createLogger({ prefix: 'MyModule', level: 'debug' });

export class MyAlgorithm extends BaseClass {
  constructor(graph, options = {}) {
    this._privateField = 0;  // ← underscore, not #
    super(graph, options, {
      module: '../path/my-algorithm.js',
      functionName: 'myAlgorithmCompute'
    });
  }

  _privateMethod() { }  // ← underscore prefix
}

export async function myAlgorithmCompute(graphData, options, progressCallback) {
  const { iterations = 100 } = options || {};
  log.info('Starting computation');  // ← logger, not console

  for (let i = 0; i < iterations; i++) {
    // Work...
    reportProgress(progressCallback, i / iterations);  // ← events
  }

  return result;
}
```

The architecture is worker-first by design. Main thread classes are thin wrappers that delegate to workers. This keeps the UI responsive and enables parallel computation.
