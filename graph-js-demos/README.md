# @guinetik/graph-js-demos

Demo application showcasing the capabilities of [@guinetik/graph-js](../graph-js) library with interactive examples and real-world use cases.

## Purpose

This project serves two primary purposes:

1. **Testing Ground**: Development environment for testing new features, APIs, and performance optimizations of the graph-js library
2. **Interactive Documentation**: Live examples demonstrating how to use the library for network analysis and visualization

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to explore the demos.

## Examples

### Network Explorer
**Route:** `/explorer`
**Purpose:** General-purpose network graph visualization and analysis

**Features:**
- Load sample networks or paste custom JSON data
- Calculate 8+ centrality metrics (degree, betweenness, eigenvector, etc.)
- Apply 11 layout algorithms (Kamada-Kawai, Force-Directed, Spectral, etc.)
- Detect communities with Louvain algorithm
- Dynamic visual encoding (size by metric, color by community)
- Export computed positions
- Graph-level statistics

**Key Files:**
- `src/views/ExplorerPage.vue` - Main UI component
- `src/lib/ExplorerController.js` - Business logic and state management
- `src/composables/useNetworkGraph.js` - D3 visualization composable

---

### Family Tree Builder
**Route:** `/family`
**Purpose:** Interactive family tree construction and visualization

**Features:**
- Build family relationships (parents, siblings, children, cousins, partners, etc.)
- Automatic relationship validation (max 2 parents, 2 grandparents per parent, etc.)
- Partner tracking (`partnerOf` property for correct relationship representation)
- Undo/Redo with Memento pattern (max 10 snapshots)
- Network analysis of family structure
- Local storage persistence
- Color-coded relationships (9 relationship types)

**Key Files:**
- `src/views/FamilyPage.vue` - Main UI component
- `src/lib/FamilyController.js` - Controller with Memento pattern for undo/redo
- `src/lib/family/FamilyOperations.js` - Add/edit/delete operations with validation
- `src/lib/family/FamilyValidation.js` - Relationship validation logic
- `src/lib/family/FamilyConstants.js` - Group definitions and color schemes

**Architecture Pattern:**
```
FamilyPage.vue (UI)
    ↓ uses
useNetworkGraph.js (composable)
    ↓ manages
FamilyController.js (state + undo/redo)
    ↓ delegates to
FamilyOperations.js (CRUD operations)
    ↓ validates with
FamilyValidation.js (business rules)
```

---

### Showcase
**Route:** `/showcase`
**Purpose:** Curated collection of interesting network graphs with analysis

**Features:**
- Pre-configured datasets (Karate Club, Les Misérables, etc.)
- Visual exploration of community structure
- Comparison of different layout algorithms
- Centrality metric visualization

**Key Files:**
- `src/views/ShowcasePage.vue` - Main UI component
- `src/lib/ShowcaseController.js` - Dataset management

---

## Architecture & Design Patterns

### Vue/Controller Separation

**DO:** Separate business logic from UI components

```javascript
// ✅ GOOD: Controller handles business logic
class FamilyController {
  constructor(getGraphInstance, saveCallback) {
    this.operations = new FamilyOperations(getGraphInstance);
    this.history = [];  // Memento snapshots
  }

  addParent(name) {
    const result = this.operations.addParent(name);
    this.saveSnapshot();  // Business logic
    return result;
  }
}

// Vue component only handles UI events
<script setup>
const familyController = ref(null);
const handleAddParent = () => {
  familyController.value.addParent(parentName.value);
};
</script>
```

**DON'T:** Mix business logic in Vue components

```javascript
// ❌ BAD: Business logic in component
<script setup>
const handleAddParent = () => {
  // Complex validation
  // State mutation
  // History management
  // All in the component!
};
</script>
```

### Event-Driven Architecture

**DO:** Use callbacks and event emitters for cross-layer communication

```javascript
// ✅ GOOD: Status updates via callback
const handleStatusChange = (message, type) => {
  statusMessage.value = message;
  statusType.value = type;
};

// Library reports progress
await analyzer.analyze(network, features, {
  onProgress: (progress) => {
    handleStatusChange(`Analyzing: ${Math.round(progress * 100)}%`, 'info');
  }
});
```

**DON'T:** Poll or use timers for state synchronization

```javascript
// ❌ BAD: Polling with setTimeout
let checkProgress = () => {
  setTimeout(() => {
    if (!done) checkProgress();
  }, 100);
};
```

### Timing-Sensitive Operations

**DO:** Use `requestAnimationFrame` for DOM/render-dependent operations

```javascript
// ✅ GOOD: Wait for D3 rendering before property update
requestAnimationFrame(() => {
  const nodeInData = graphInstance.data.nodes.find(n => n.id === newNode.id);
  if (nodeInData) {
    nodeInData.partnerOf = personId;
  }
});
```

**DON'T:** Use `setTimeout` for timing control

```javascript
// ❌ BAD: Arbitrary delay
setTimeout(() => {
  // Hope the DOM is ready?
}, 50);
```

### Logging with @guinetik/logger

**DO:** Use structured logging throughout the codebase

```javascript
// ✅ GOOD: Structured logging with context
import { createLogger } from '@guinetik/logger';

const log = createLogger({
  prefix: 'FamilyController',
  level: 'debug'
});

log.info('Adding parent', { name, existingCount: 2 });
log.error('Validation failed', { reason: 'Max parents exceeded' });
log.debug('Snapshot saved', { historySize: this.history.length });
```

**DON'T:** Use console.log directly

```javascript
// ❌ BAD: Unstructured console logging
console.log('adding parent', name);
console.log('failed');
```

### Documentation with JSDoc

**DO:** Document all classes, methods, and complex functions

```javascript
// ✅ GOOD: Complete JSDoc
/**
 * Add a parent to the family tree
 *
 * @param {string} name - Parent's name
 * @returns {Object} Result object with success status
 * @throws {Error} If maximum parents (2) already added
 *
 * @example
 * const result = controller.addParent('Jane');
 * if (result.success) {
 *   console.log('Parent added:', result.node.id);
 * }
 */
addParent(name) {
  // implementation
}
```

**DON'T:** Leave code undocumented or use vague comments

```javascript
// ❌ BAD: No docs or poor comments
// adds parent
addParent(name) {
  // do stuff
}
```

### Async/Sync Pattern Detection

**DO:** Handle both sync and async return values gracefully

```javascript
// ✅ GOOD: Detect and handle both cases
const result = this.addNodeWithRelationship(...);

if (result && typeof result.then === 'function') {
  // Async case - wait for Promise
  result.then(node => setPropertyOnNode(node));
} else {
  // Sync case - use immediately
  setPropertyOnNode(result);
}
```

**DON'T:** Assume return type without checking

```javascript
// ❌ BAD: Assume sync
const node = this.addNode(...);
node.property = value;  // May fail if Promise!
```

### Property Reference Management

**DO:** Set properties on both the returned object AND the data array reference

```javascript
// ✅ GOOD: Robust property setting
_setNodeProperty(newNode, propertyName, propertyValue, graphInstance) {
  // Set on returned node
  newNode[propertyName] = propertyValue;

  // Also set on node in data array
  if (graphInstance?.data) {
    let nodeInData = graphInstance.data.nodes.find(n => n.id === newNode.id);
    if (nodeInData) {
      nodeInData[propertyName] = propertyValue;
    } else {
      // Fallback: use requestAnimationFrame
      requestAnimationFrame(() => {
        const nodeInData = graphInstance.data.nodes.find(n => n.id === newNode.id);
        if (nodeInData) nodeInData[propertyName] = propertyValue;
      });
    }
  }
}
```

**DON'T:** Set property only on returned object

```javascript
// ❌ BAD: Only sets on one reference
const node = addNode(id);
node.customProperty = value;  // May not persist in D3 data!
```

### Memento Pattern for Undo/Redo

**DO:** Use Memento pattern for state history

```javascript
// ✅ GOOD: Memento pattern (FamilyController.js)
class FamilyController {
  constructor() {
    this.history = [];
    this.maxHistory = 10;
  }

  saveSnapshot() {
    const snapshot = {
      nodes: JSON.parse(JSON.stringify(this.graphInstance.data.nodes)),
      links: JSON.parse(JSON.stringify(this.graphInstance.data.links)),
      timestamp: Date.now()
    };

    this.history.push(snapshot);
    if (this.history.length > this.maxHistory) {
      this.history.shift();  // Remove oldest
    }
  }

  undo() {
    if (this.history.length > 0) {
      const snapshot = this.history.pop();
      this.restoreSnapshot(snapshot);
    }
  }
}
```

**DON'T:** Try to implement command pattern for graph operations

```javascript
// ❌ BAD: Command pattern for graphs is complex
// Reversing add operations, link mutations, etc. is error-prone
class AddNodeCommand {
  execute() { /* ... */ }
  undo() { /* reverse operation - many edge cases! */ }
}
```

---

## Code Organization

```
graph-js-demos/
├── src/
│   ├── views/              # Vue page components (UI only)
│   │   ├── ExplorerPage.vue
│   │   ├── FamilyPage.vue
│   │   └── ShowcasePage.vue
│   │
│   ├── composables/        # Vue composables (reusable logic)
│   │   ├── useNetworkGraph.js    # D3 graph management
│   │   ├── useDarkMode.js        # Theme switching
│   │   └── useI18n.js            # Internationalization
│   │
│   ├── lib/                # Business logic (framework-agnostic)
│   │   ├── NetworkGraphD3.js     # D3 visualization engine
│   │   ├── NetworkAnalyzer.js    # Wraps @guinetik/graph-js
│   │   ├── ExplorerController.js # Explorer state/logic
│   │   ├── FamilyController.js   # Family tree state + undo/redo
│   │   ├── ShowcaseController.js # Showcase datasets
│   │   └── family/               # Family tree domain logic
│   │       ├── FamilyConstants.js     # Types, colors, labels
│   │       ├── FamilyOperations.js    # CRUD operations
│   │       └── FamilyValidation.js    # Business rules
│   │
│   ├── components/         # Reusable Vue components
│   ├── assets/            # Static assets, styles
│   └── router/            # Vue Router configuration
│
├── public/                # Public assets
└── package.json
```

---

## Development Guidelines

### Adding New Examples

1. Create new view component in `src/views/`
2. Create controller in `src/lib/` for business logic
3. Use `useNetworkGraph` composable for D3 visualization
4. Add route in `src/router/index.js`
5. Document with JSDoc comments
6. Follow event-driven pattern for status updates

### Testing New Library Features

1. Use ExplorerPage for quick prototyping
2. Add specific example in Showcase for demos
3. Use FamilyPage for testing domain-specific logic
4. Test worker performance with large datasets

### Performance Considerations

- All network analysis runs in Web Workers (non-blocking)
- Use `d3.scaleSqrt()` for balanced node sizing (not `scaleLinear`)
- Implement progress callbacks for long operations
- Use `requestAnimationFrame` for render-dependent updates
- Avoid synchronous blocking operations in UI thread

---

## Tech Stack

- **Vue 3**: Composition API with `<script setup>`
- **Vue Router**: Client-side routing
- **D3.js**: Graph visualization and layouts
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **@guinetik/graph-js**: Network analysis library
- **@guinetik/logger**: Structured logging

---

## Common Pitfalls

### ❌ DON'T: Use setTimeout for coordination
```javascript
setTimeout(() => {
  // Hope things are ready?
}, 100);
```

### ✅ DO: Use requestAnimationFrame for render-dependent timing
```javascript
requestAnimationFrame(() => {
  // Executes after next render
});
```

---

### ❌ DON'T: Set properties only on returned objects
```javascript
const node = addNode('A');
node.customProp = 'value';  // May not persist in graph data!
```

### ✅ DO: Set on both returned object and data array
```javascript
const node = addNode('A');
node.customProp = 'value';

const nodeInData = graphInstance.data.nodes.find(n => n.id === 'A');
if (nodeInData) nodeInData.customProp = 'value';
```

---

### ❌ DON'T: Mix business logic in Vue components
```javascript
<script setup>
const addNode = () => {
  // 100 lines of validation, state mutation, etc.
};
</script>
```

### ✅ DO: Delegate to controllers
```javascript
<script setup>
const controller = ref(null);
const addNode = () => controller.value.addNode(name.value);
</script>
```

---

### ❌ DON'T: Use console.log
```javascript
console.log('something happened', data);
```

### ✅ DO: Use structured logging
```javascript
log.info('Operation completed', { nodeCount: data.length, time: 120 });
```

---

## Contributing

When adding new examples or features:

1. Follow the Vue/Controller separation pattern
2. Document all public methods with JSDoc
3. Use @guinetik/logger for logging
4. Implement event-driven callbacks (no polling/setTimeout)
5. Handle both async and sync operation patterns
6. Add progress tracking for long operations
7. Test with various graph sizes (10 nodes to 1000+ nodes)

## License

MIT
