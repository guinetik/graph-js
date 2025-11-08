# Contributing to @guinetik/graph-js-demos

This document outlines the patterns, architecture, and contribution guidelines for the graph-js demo application. It's designed for both humans and LLMs working on the codebase.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Vue 3 Patterns](#vue-3-patterns)
3. [Code Organization](#code-organization)
4. [Inherited Rules from graph-js](#inherited-rules-from-graph-js)
5. [Common Patterns](#common-patterns)
6. [For LLMs](#for-llms)

---

## Architecture Overview

### Tech Stack

- **Vue 3** with Composition API (`<script setup>`)
- **Vue Router 4** for navigation
- **Tailwind CSS** for styling
- **D3.js** for visualization
- **Vite** for building
- **@guinetik/graph-js** as the core library

### Core Principle: Separation of Concerns

The demo app follows **strict separation** between UI and business logic:

```
┌─────────────────────────────────────┐
│   Vue Components (.vue files)       │  ← UI only, no business logic
│   - Templates                       │
│   - Event handlers (delegates)      │
│   - Reactive state (refs)           │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   Composables (useXxx.js)           │  ← Vue-specific glue code
│   - Lifecycle management            │
│   - Reactivity bridges              │
│   - Event handling                  │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   Controllers (XxxController.js)    │  ← Pure business logic
│   - Framework-agnostic              │
│   - Domain operations               │
│   - Validation & state              │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   Domain Modules                    │  ← Specialized services
│   - Operations, Validation          │
│   - Storage, Dialog services        │
│   - Memento (undo/redo)             │
└─────────────────────────────────────┘
```

**Why this separation?**
- Controllers can be unit tested without Vue
- Business logic is reusable across frameworks
- Vue components stay thin and focused on presentation
- Easier to reason about and maintain

---

## Vue 3 Patterns

### Use Composition API with `<script setup>`

All Vue components use the Composition API with `<script setup>` syntax.

```vue
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useNetworkGraph } from '../composables/useNetworkGraph';

// Composables
const { graphContainer, graphInstance, loadData } = useNetworkGraph();

// Local state
const statusMessage = ref('');
const loading = ref(false);

// Event handlers
const handleClick = () => {
  // Delegate to controller
  controller.doSomething();
};

onMounted(() => {
  initializeController();
});
</script>

<template>
  <div ref="graphContainer"></div>
  <button @click="handleClick">Click</button>
</template>
```

### Composables for Reusable Logic

Composables extract **Vue-specific** reusable logic. They bridge between Vue's reactivity and plain JavaScript.

**File naming:** `use[Feature].js` (e.g., `useNetworkGraph.js`, `useI18n.js`, `useDarkMode.js`)

```javascript
// composables/useNetworkGraph.js
import { ref, onMounted, onUnmounted } from 'vue';
import { NetworkGraphD3 } from '../lib/NetworkGraphD3';
import { createLogger } from '@guinetik/logger';

const log = createLogger({ prefix: 'useNetworkGraph', level: 'debug' });

export function useNetworkGraph(options = {}) {
  const graphContainer = ref(null);
  const graphInstance = ref(null);
  const loading = ref(false);

  const initGraph = () => {
    if (!graphContainer.value) {
      log.warn('Container not ready');
      return;
    }

    graphInstance.value = new NetworkGraphD3(graphContainer.value, options);
    log.info('Graph initialized');
  };

  const loadData = (nodes, links) => {
    if (!graphInstance.value) {
      log.warn('Graph not initialized');
      return;
    }
    graphInstance.value.setData(nodes, links);
  };

  // Cleanup
  onUnmounted(() => {
    if (graphInstance.value) {
      graphInstance.value.destroy();
    }
  });

  return {
    graphContainer,
    graphInstance,
    loading,
    initGraph,
    loadData
  };
}
```

**Composable responsibilities:**
- Manage Vue lifecycle (`onMounted`, `onUnmounted`)
- Create and manage refs
- Set up watchers
- Handle Vue-specific features
- Bridge to non-Vue code (controllers, libraries)

**What composables should NOT do:**
- ❌ Business logic or validation
- ❌ Data transformation or calculations
- ❌ API calls (delegate to services)
- ❌ Complex state management (use controllers)

### Controllers for Business Logic

Controllers are **framework-agnostic** classes that handle domain logic. They can be used in Vue, React, Svelte, or vanilla JS.

**File naming:** `[Feature]Controller.js` (e.g., `FamilyController.js`, `ExplorerController.js`)

```javascript
// lib/FamilyController.js
import { createLogger } from '@guinetik/logger';

export class FamilyController {
  constructor({ graphManager, onStatusChange, lang = 'en' }) {
    this.graphManager = graphManager;
    this.onStatusChange = onStatusChange;
    this.lang = lang;
    this.log = createLogger({ prefix: 'FamilyController', level: 'debug' });

    // Initialize domain services
    this.validation = new FamilyValidation(...);
    this.storage = new FamilyStorage(...);
    this.operations = new FamilyOperations(...);
  }

  // Business operations
  addParent(personId, parentName) {
    // Validation
    if (!this.validation.canAddParent(personId)) {
      return { success: false, error: 'Cannot add parent' };
    }

    // Operation
    const result = this.operations.addParent(personId, parentName);

    // Side effects
    if (result.success) {
      this.storage.saveFamily();
      this.showStatus('Parent added', 'success');
    }

    return result;
  }

  // Helper to show status (delegates to Vue callback)
  showStatus(message, type) {
    if (this.onStatusChange) {
      this.onStatusChange(message, type);
    }
  }

  // Get graph instance (handles Vue ref unwrapping)
  getGraphInstance() {
    // Handle Vue ref
    return this.graphManager.graphInstance.value || this.graphManager.graphInstance;
  }

  dispose() {
    this.storage.stopAutoSave();
    this.log.info('Controller disposed');
  }
}
```

**Controller responsibilities:**
- Domain operations and workflows
- Validation and business rules
- Coordinate between services
- Manage domain state
- Error handling

**Controller dependencies:**
- Receive dependencies via constructor (dependency injection)
- Accept callbacks for UI updates (`onStatusChange`)
- Work with plain data (not Vue refs)

### Template Patterns

**Keep templates declarative and simple:**

```vue
<template>
  <DemoLayout>
    <template #controls>
      <!-- Status display -->
      <div v-if="statusMessage" :class="statusClass">
        {{ statusMessage }}
      </div>

      <!-- Action buttons -->
      <button @click="handleAddParents">
        Add Parents
      </button>

      <!-- Use components for complex UI -->
      <NetworkAnalysis
        v-model:selected-metrics="selectedFeatures"
        @analyze="handleAnalyzeGraph"
      />
    </template>

    <template #graph>
      <div ref="graphContainer" class="w-full h-full"></div>
    </template>
  </DemoLayout>
</template>
```

**Template guidelines:**
- Use `v-if`/`v-show` for conditional rendering
- Use `v-for` with `:key` for lists
- Delegate events to methods (`@click="handleFoo"`)
- Keep computed logic in `<script>`, not templates
- Use components to break down complexity

---

## Code Organization

### Directory Structure

```
graph-js-demos/
├── src/
│   ├── views/                    # Page-level Vue components
│   │   ├── ExplorerPage.vue      # Network explorer demo
│   │   ├── FamilyPage.vue        # Family tree demo
│   │   └── ShowcasePage.vue      # Dataset showcase
│   ├── components/               # Reusable Vue components
│   │   ├── DemoLayout.vue        # Common layout
│   │   ├── DialogForm.vue        # Generic dialog
│   │   ├── LayoutPicker.vue      # Layout selector
│   │   └── NetworkAnalysis.vue   # Analysis controls
│   ├── composables/              # Vue composables
│   │   ├── useNetworkGraph.js    # Graph management
│   │   ├── useI18n.js            # Internationalization
│   │   └── useDarkMode.js        # Theme management
│   ├── lib/                      # Business logic (framework-agnostic)
│   │   ├── NetworkGraphD3.js     # D3 graph component
│   │   ├── NetworkAnalyzer.js    # Graph analysis
│   │   ├── FamilyController.js   # Family tree controller
│   │   └── family/               # Family-specific modules
│   │       ├── FamilyOperations.js
│   │       ├── FamilyValidation.js
│   │       ├── FamilyStorage.js
│   │       ├── FamilyDialogService.js
│   │       └── memento/          # Undo/redo pattern
│   ├── router/                   # Vue Router config
│   └── styles/                   # Global styles
├── data/                         # Sample datasets
└── public/                       # Static assets
```

### File Naming Conventions

- **Vue components**: PascalCase with `.vue` extension (`DemoLayout.vue`, `NetworkAnalysis.vue`)
- **Composables**: camelCase starting with `use` (`useNetworkGraph.js`)
- **Controllers**: PascalCase with `Controller` suffix (`FamilyController.js`)
- **Services/Modules**: PascalCase (`FamilyValidation.js`, `NetworkAnalyzer.js`)
- **Utilities**: camelCase (`i18n.js`, `particles.js`)

---

## Inherited Rules from graph-js

The demo app inherits core rules from the main library:

### ❌ No `console.log` - Use Logger

**ALWAYS** use `@guinetik/logger`. Never use `console.*` directly.

```javascript
// ❌ WRONG
export function loadData(nodes, links) {
  console.log('Loading data...', nodes.length);

  try {
    graph.setData(nodes, links);
    console.log('Data loaded');
  } catch (error) {
    console.error('Failed to load data:', error);
  }
}

// ✅ CORRECT
import { createLogger } from '@guinetik/logger';

const log = createLogger({
  prefix: 'DataLoader',
  level: import.meta.env.DEV ? 'debug' : 'info'
});

export function loadData(nodes, links) {
  log.debug('Loading data', { nodeCount: nodes.length, linkCount: links.length });

  try {
    graph.setData(nodes, links);
    log.info('Data loaded successfully');
  } catch (error) {
    log.error('Failed to load data', { error: error.message, stack: error.stack });
  }
}
```

**Logger configuration:**
- Use `import.meta.env.DEV` to set log level (debug in dev, info in prod)
- Prefix with module/component name for easy filtering
- Log objects for structured data, not concatenated strings

### ❌ No `setTimeout`/`setInterval` - Use Events

Everything must be **event-driven**. No arbitrary timeouts or polling.

```javascript
// ❌ WRONG - Using setTimeout to clear status
const handleStatusChange = (message, type) => {
  statusMessage.value = message;
  statusType.value = type;

  // Auto-clear after delay
  setTimeout(() => {
    statusMessage.value = '';
  }, type === 'error' ? 5000 : 3000);
};

// ✅ CORRECT - Event-driven status management
const handleStatusChange = (message, type, options = {}) => {
  statusMessage.value = message;
  statusType.value = type;

  // Status persists until next action or explicit clear
  // Let user dismiss manually or next status update clears it
};

const clearStatus = () => {
  statusMessage.value = '';
};
```

```javascript
// ❌ WRONG - setTimeout to wait for DOM
const addNode = (nodeId) => {
  graphInstance.value.addNode(nodeId);

  // Wait for DOM to update
  setTimeout(() => {
    const nodeElement = graphInstance.value.getNodeElement(nodeId);
    nodeElement.setAttribute('data-selected', 'true');
  }, 100);
};

// ✅ CORRECT - Event-driven DOM updates
const addNode = (nodeId) => {
  graphInstance.value.addNode(nodeId);

  // Listen for render completion
  graphInstance.value.once('nodeAdded', (node) => {
    if (node.id === nodeId) {
      const nodeElement = graphInstance.value.getNodeElement(nodeId);
      nodeElement.setAttribute('data-selected', 'true');
    }
  });
};

// ✅ ALSO CORRECT - Use Vue's nextTick for reactive updates
import { nextTick } from 'vue';

const addNode = async (nodeId) => {
  graphInstance.value.addNode(nodeId);

  await nextTick(); // Wait for Vue's reactive updates

  const nodeElement = graphInstance.value.getNodeElement(nodeId);
  nodeElement.setAttribute('data-selected', 'true');
};
```

**Exceptions for `setTimeout`:**
- **Debounce/throttle utilities** - OK if encapsulated (like in NetworkGraphD3.debounce)
- **requestAnimationFrame** - Preferred for animation/rendering checks
- **Vue nextTick** - Use this instead of `setTimeout` for reactive updates

**For auto-save, use visibility API instead of setInterval:**

```javascript
// ❌ WRONG - setInterval for auto-save
this.autoSaveInterval = setInterval(() => {
  this.saveFamily();
}, 30000);

// ✅ BETTER - Event-driven with visibility check
startAutoSave() {
  // Save on visibility change (tab becomes active)
  document.addEventListener('visibilitychange', this.handleVisibilityChange);

  // Save on beforeunload
  window.addEventListener('beforeunload', this.saveFamily);
}

handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    this.saveFamily();
  }
};

// If you MUST use setInterval, at least check visibility
this.autoSaveInterval = setInterval(() => {
  if (document.visibilityState === 'visible') {
    this.saveFamily();
  }
}, 30000);
```

### Modern JavaScript Only

Use ES2020+ features, no TypeScript:

```javascript
// ✅ Optional chaining
const nodeCount = graphInstance.value?.data?.nodes?.length ?? 0;

// ✅ Nullish coalescing
const verbose = options.verbose ?? true;

// ✅ Destructuring with defaults
const { scale = 100, center = { x: 0, y: 0 } } = options || {};

// ✅ Async/await
const results = await analyzeGraph(features);

// ✅ for...of
for (const node of nodes) {
  processNode(node);
}
```

---

## Common Patterns

### Pattern: Controller Integration

How to integrate a controller with Vue:

```vue
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useNetworkGraph } from '../composables/useNetworkGraph';
import { FamilyController } from '../lib/FamilyController';

// Composables provide graph functionality
const { graphContainer, graphInstance, loadData } = useNetworkGraph();

// Local state
const statusMessage = ref('');
const statusType = ref('info');

// Controller instance (created after graph is ready)
let controller = null;

// Status callback (Vue updates UI)
const handleStatusChange = (message, type) => {
  statusMessage.value = message;
  statusType.value = type;
};

// Initialize controller when graph is ready
const initializeController = () => {
  // Create graph manager interface
  const graphManager = {
    graphInstance,
    loadData,
    addNode: (neighbors, id, group) => addNode(neighbors, id, group, true),
    lockPositions,
    unlockPositions
  };

  // Create controller
  controller = new FamilyController({
    graphManager,
    onStatusChange: handleStatusChange,
    lang: 'en'
  });

  // Load initial data
  const data = controller.getInitialDataset();
  loadData(data.nodes, data.links);
};

// Wait for graph instance, then initialize
watch(graphInstance, (instance) => {
  if (instance && !controller) {
    initializeController();
  }
}, { immediate: true });

// Event handlers delegate to controller
const handleAddParent = () => {
  if (!controller) return;
  controller.showAddParentDialog();
};

// Cleanup
onUnmounted(() => {
  if (controller) {
    controller.dispose();
  }
});
</script>

<template>
  <div>
    <div v-if="statusMessage" :class="statusClass">
      {{ statusMessage }}
    </div>

    <button @click="handleAddParent">Add Parent</button>

    <div ref="graphContainer"></div>
  </div>
</template>
```

### Pattern: Service Modules

Break controllers into focused service modules:

```
FamilyController
├── FamilyValidation     - Business rules & validation
├── FamilyOperations     - CRUD operations on graph
├── FamilyStorage        - localStorage persistence
├── FamilyDialogService  - Dialog configuration & execution
└── MementoHistory       - Undo/redo state management
```

Each service is a class with single responsibility:

```javascript
// family/FamilyValidation.js
export class FamilyValidation {
  constructor(getGraphInstance, t) {
    this.getGraphInstance = getGraphInstance;
    this.t = t; // Translation function
  }

  canAddParent(personId) {
    const graph = this.getGraphInstance();
    if (!graph) return false;

    const node = graph.getNode(personId);
    if (!node) return false;

    // Business rule: person can't already have parents
    const hasParents = graph.getNeighbors(personId)
      .some(n => graph.getNode(n).group === FAMILY_GROUPS.PARENT);

    return !hasParents;
  }

  validatePersonName(name) {
    if (!name || name.trim() === '') {
      return { valid: false, error: this.t('validation.nameRequired') };
    }
    if (name.length > 50) {
      return { valid: false, error: this.t('validation.nameTooLong') };
    }
    return { valid: true };
  }
}
```

### Pattern: Memento for Undo/Redo

Use the Memento pattern for undo/redo functionality:

```javascript
// family/memento/GraphMemento.js
export class GraphMemento {
  constructor(graph) {
    this.timestamp = Date.now();
    this.nodes = JSON.parse(JSON.stringify(graph.data.nodes));
    this.links = JSON.parse(JSON.stringify(graph.data.links));
  }

  restore(graph) {
    graph.setData(this.nodes, this.links);
  }
}

// family/memento/MementoHistory.js
export class MementoHistory {
  constructor({ maxHistorySize = 10 } = {}) {
    this.maxHistorySize = maxHistorySize;
    this.history = [];
    this.currentIndex = -1;
  }

  saveState(memento) {
    // Remove future states if we're not at the end
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Add new state
    this.history.push(memento);

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }
  }

  undo() {
    if (!this.canUndo()) return null;
    this.currentIndex--;
    return this.history[this.currentIndex];
  }

  redo() {
    if (!this.canRedo()) return null;
    this.currentIndex++;
    return this.history[this.currentIndex];
  }

  canUndo() {
    return this.currentIndex > 0;
  }

  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }
}
```

### Pattern: Event Emitter

Use event emitters for component communication:

```javascript
// lib/NetworkGraphD3.js
export class NetworkGraphD3 {
  constructor(container, options) {
    this.events = new Map(); // Event listeners
  }

  on(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName).push(callback);
  }

  once(eventName, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }

  off(eventName, callback) {
    if (!this.events.has(eventName)) return;
    const listeners = this.events.get(eventName);
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  emit(eventName, ...args) {
    if (!this.events.has(eventName)) return;
    this.events.get(eventName).forEach(callback => {
      callback(...args);
    });
  }

  // Usage in methods
  addNode(node) {
    // Add node logic...
    this.emit('nodeAdded', node);
  }
}
```

### Pattern: Internationalization (i18n)

Use the i18n composable for translations:

```vue
<script setup>
import { useI18n } from '../composables/useI18n';

const { t, lang } = useI18n();

// Pass translation function to controllers
const controller = new FamilyController({
  lang: lang.value,
  // ...
});

// Watch for language changes
watch(lang, (newLang) => {
  // Update controller or reload translations
  controller.updateLanguage(newLang);
});
</script>

<template>
  <div>
    <h1>{{ t('family.header.title') }}</h1>
    <p>{{ t('family.header.subtitle') }}</p>
  </div>
</template>
```

---

## For LLMs

When working on the demos app:

### Critical Constraints

1. **NO `console.*`** - Use `@guinetik/logger` with `createLogger()`
2. **NO `setTimeout`/`setInterval`** - Use events, Promises, `nextTick`, `requestAnimationFrame`
3. **Separation of concerns** - Controllers (logic) ≠ Vue components (UI)
4. **Framework-agnostic controllers** - No Vue-specific code in controllers
5. **Composables for Vue glue** - Bridge between Vue and plain JS

### Architecture Checklist

When adding a feature:

- [ ] Is business logic in a controller or service module?
- [ ] Is Vue-specific code isolated to composables or components?
- [ ] Are you using logger instead of console?
- [ ] Are you using events/callbacks instead of setTimeout?
- [ ] Does the controller accept dependencies via constructor?
- [ ] Can the controller work without Vue (testable)?
- [ ] Are you using `nextTick` for reactive updates, not `setTimeout`?

### Quick Reference Pattern

```vue
<script setup>
import { ref, watch } from 'vue';
import { useNetworkGraph } from '../composables/useNetworkGraph';
import { MyController } from '../lib/MyController';
import { createLogger } from '@guinetik/logger';

const log = createLogger({ prefix: 'MyPage' });

// Composables
const { graphContainer, graphInstance } = useNetworkGraph();

// State
const status = ref('');

// Controller (framework-agnostic)
let controller = null;

const initController = () => {
  controller = new MyController({
    graphManager: { graphInstance, /* ... */ },
    onStatusChange: (msg, type) => { status.value = msg; }
  });
};

// Wait for graph ready
watch(graphInstance, (instance) => {
  if (instance && !controller) {
    initController();
  }
}, { immediate: true });

// Event handlers delegate to controller
const handleAction = () => {
  if (!controller) {
    log.warn('Controller not ready');
    return;
  }

  const result = controller.doAction();

  if (!result.success) {
    log.error('Action failed', { error: result.error });
  }
};
</script>

<template>
  <div ref="graphContainer"></div>
  <button @click="handleAction">Action</button>
</template>
```

### Common Mistakes to Avoid

❌ **Don't put business logic in Vue components**
```vue
<script setup>
// WRONG - validation in component
const handleAddParent = () => {
  if (!hasNode(selectedId)) {
    statusMessage.value = 'Node not found';
    return;
  }
  // ...
};
</script>
```

✅ **Do delegate to controller**
```vue
<script setup>
// RIGHT - delegate to controller
const handleAddParent = () => {
  const result = controller.addParent(selectedId, parentName);
  if (!result.success) {
    statusMessage.value = result.error;
  }
};
</script>
```

❌ **Don't access Vue refs in controllers**
```javascript
// WRONG - controller accessing Vue refs
export class MyController {
  doSomething() {
    const count = this.graphInstance.value.data.nodes.length; // NO!
  }
}
```

✅ **Do unwrap refs or pass plain data**
```javascript
// RIGHT - controller works with plain objects
export class MyController {
  getGraphInstance() {
    // Handle Vue ref unwrapping
    return this.graphManager.graphInstance.value || this.graphManager.graphInstance;
  }

  doSomething() {
    const graph = this.getGraphInstance();
    const count = graph.data.nodes.length;
  }
}
```

---

## Development Workflow

```bash
# Install dependencies
cd graph-js-demos
npm install

# Dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Questions?

1. Check existing demos for patterns (especially FamilyPage.vue)
2. Look at controller separation in `lib/FamilyController.js`
3. Study composables in `composables/useNetworkGraph.js`
4. Open a GitHub issue for architectural questions
