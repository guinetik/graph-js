<template>
  <div class="bacon-finder">
    <h3 class="bacon-finder-title">
      {{ title }}
    </h3>

    <!-- Search Input with Autocomplete -->
    <div class="bacon-search-container">
      <div class="bacon-search-input-wrapper">
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          :placeholder="placeholder"
          class="bacon-search-input"
          @input="handleInput"
          @focus="showSuggestions = true"
          @keydown.down.prevent="navigateSuggestion(1)"
          @keydown.up.prevent="navigateSuggestion(-1)"
          @keydown.enter.prevent="selectHighlighted"
          @keydown.escape="closeSuggestions"
        />
        <button
          v-if="searchQuery"
          class="bacon-clear-btn"
          @click="clearSearch"
        >
          &times;
        </button>
      </div>

      <!-- Suggestions Dropdown -->
      <div
        v-if="showSuggestions && filteredSuggestions.length > 0"
        class="bacon-suggestions"
      >
        <div
          v-for="(suggestion, index) in filteredSuggestions"
          :key="suggestion.id"
          :class="[
            'bacon-suggestion-item',
            { 'bacon-suggestion-highlighted': index === highlightedIndex }
          ]"
          @mousedown.prevent="selectSuggestion(suggestion)"
          @mouseenter="highlightedIndex = index"
        >
          <span class="bacon-suggestion-icon">
            {{ suggestion.category === 'movie' ? '🎬' : '🎭' }}
          </span>
          <span class="bacon-suggestion-text">{{ suggestion.id }}</span>
          <span class="bacon-suggestion-category">{{ suggestion.category }}</span>
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="result" class="bacon-result">
      <div v-if="result.found" class="bacon-result-found">
        <!-- Bacon Number Display -->
        <div class="bacon-number-display">
          <span class="bacon-number-icon">🥓</span>
          <span class="bacon-number-label">Bacon Number:</span>
          <span class="bacon-number-value">{{ result.baconNumber }}</span>
        </div>

        <!-- Path Display -->
        <div class="bacon-path">
          <div class="bacon-path-label">Path:</div>
          <div class="bacon-path-nodes">
            <template v-for="(node, index) in result.path" :key="index">
              <span
                :class="[
                  'bacon-path-node',
                  {
                    'bacon-path-actor': node.category === 'actor',
                    'bacon-path-movie': node.category === 'movie',
                    'bacon-path-kevin': node.id === centerNode
                  }
                ]"
              >
                {{ node.id }}
              </span>
              <span v-if="index < result.path.length - 1" class="bacon-path-arrow">→</span>
            </template>
          </div>
        </div>

        <!-- Clear Path Button -->
        <button
          class="bacon-clear-path-btn"
          @click="clearPath"
        >
          Clear Highlight
        </button>
      </div>

      <div v-else class="bacon-result-not-found">
        <span class="bacon-not-found-icon">🚫</span>
        <span>No connection found to {{ centerNode }}</span>
      </div>
    </div>

    <!-- Hint when no search -->
    <div v-else class="bacon-hint">
      <p>Search for an actor or movie to find their connection to {{ centerNode }}.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  /**
   * Array of node objects with { id, category }
   */
  nodes: {
    type: Array,
    required: true
  },
  /**
   * Array of edge objects with { source, target }
   */
  edges: {
    type: Array,
    required: true
  },
  /**
   * The center node to find paths to (default: Kevin Bacon)
   */
  centerNode: {
    type: String,
    default: 'Kevin Bacon'
  },
  /**
   * Title for the component
   */
  title: {
    type: String,
    default: 'Find Bacon Number'
  },
  /**
   * Placeholder text for search input
   */
  placeholder: {
    type: String,
    default: 'Search actor or movie...'
  }
});

const emit = defineEmits(['pathFound', 'pathCleared']);

// Local state
const searchQuery = ref('');
const showSuggestions = ref(false);
const highlightedIndex = ref(-1);
const result = ref(null);
const searchInput = ref(null);

/**
 * Filter suggestions based on search query
 */
const filteredSuggestions = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return [];

  const query = searchQuery.value.toLowerCase();
  return props.nodes
    .filter(node => {
      // Ensure node.id is a string before calling toLowerCase
      const nodeId = String(node.id || '');
      return nodeId !== props.centerNode &&
        nodeId.toLowerCase().includes(query);
    })
    .slice(0, 10); // Limit to 10 suggestions
});

/**
 * Build adjacency list from edges for BFS
 */
const buildAdjacencyList = () => {
  const adj = new Map();

  // Initialize all nodes
  props.nodes.forEach(node => {
    adj.set(node.id, []);
  });

  // Add edges (undirected)
  props.edges.forEach(edge => {
    const source = typeof edge.source === 'object' ? edge.source.id : edge.source;
    const target = typeof edge.target === 'object' ? edge.target.id : edge.target;

    if (adj.has(source)) adj.get(source).push(target);
    if (adj.has(target)) adj.get(target).push(source);
  });

  return adj;
};

/**
 * BFS to find shortest path from source to center node
 */
const findShortestPath = (sourceId) => {
  if (sourceId === props.centerNode) {
    return {
      found: true,
      path: [{ id: props.centerNode, category: getNodeCategory(props.centerNode) }],
      baconNumber: 0,
      pathEdges: []
    };
  }

  const adj = buildAdjacencyList();
  const visited = new Set();
  const parent = new Map();
  const queue = [sourceId];

  visited.add(sourceId);

  while (queue.length > 0) {
    const current = queue.shift();

    if (current === props.centerNode) {
      // Reconstruct path
      const path = [];
      const pathEdges = [];
      let node = current;

      while (node !== undefined) {
        path.unshift({
          id: node,
          category: getNodeCategory(node)
        });

        const prev = parent.get(node);
        if (prev !== undefined) {
          pathEdges.push({ source: prev, target: node });
        }
        node = prev;
      }

      // Bacon number = path length / 2 (since bipartite: actor-movie-actor)
      const baconNumber = Math.floor((path.length - 1) / 2);

      return { found: true, path, baconNumber, pathEdges };
    }

    const neighbors = adj.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent.set(neighbor, current);
        queue.push(neighbor);
      }
    }
  }

  return { found: false, path: [], baconNumber: -1, pathEdges: [] };
};

/**
 * Get node category by ID
 */
const getNodeCategory = (nodeId) => {
  const node = props.nodes.find(n => n.id === nodeId);
  return node?.category || 'unknown';
};

/**
 * Handle input changes
 */
const handleInput = () => {
  highlightedIndex.value = -1;
  result.value = null;
  emit('pathCleared');
};

/**
 * Navigate through suggestions with keyboard
 */
const navigateSuggestion = (direction) => {
  if (filteredSuggestions.value.length === 0) return;

  highlightedIndex.value += direction;

  if (highlightedIndex.value < 0) {
    highlightedIndex.value = filteredSuggestions.value.length - 1;
  } else if (highlightedIndex.value >= filteredSuggestions.value.length) {
    highlightedIndex.value = 0;
  }
};

/**
 * Select highlighted suggestion
 */
const selectHighlighted = () => {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredSuggestions.value.length) {
    selectSuggestion(filteredSuggestions.value[highlightedIndex.value]);
  }
};

/**
 * Select a suggestion and find path
 */
const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion.id;
  showSuggestions.value = false;
  highlightedIndex.value = -1;

  // Find shortest path
  result.value = findShortestPath(suggestion.id);

  if (result.value.found) {
    emit('pathFound', {
      sourceNode: suggestion.id,
      path: result.value.path,
      pathEdges: result.value.pathEdges,
      baconNumber: result.value.baconNumber
    });
  }
};

/**
 * Close suggestions dropdown
 */
const closeSuggestions = () => {
  showSuggestions.value = false;
  highlightedIndex.value = -1;
};

/**
 * Clear search and result
 */
const clearSearch = () => {
  searchQuery.value = '';
  result.value = null;
  showSuggestions.value = false;
  highlightedIndex.value = -1;
  emit('pathCleared');
};

/**
 * Clear just the path highlight (keep search)
 */
const clearPath = () => {
  emit('pathCleared');
};

/**
 * Handle click outside to close suggestions
 */
const handleClickOutside = (event) => {
  if (searchInput.value && !searchInput.value.contains(event.target)) {
    closeSuggestions();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.bacon-finder {
  background: linear-gradient(135deg, rgba(255, 102, 0, 0.1), rgba(255, 153, 51, 0.1));
  border: 1px solid rgba(255, 102, 0, 0.3);
  border-radius: 0.75rem;
  padding: 1rem;
}

.dark .bacon-finder {
  background: linear-gradient(135deg, rgba(255, 102, 0, 0.15), rgba(255, 153, 51, 0.15));
  border-color: rgba(255, 102, 0, 0.4);
}

.bacon-finder-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #c2410c;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dark .bacon-finder-title {
  color: #fb923c;
}

/* Search Container */
.bacon-search-container {
  position: relative;
}

.bacon-search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.bacon-search-input {
  width: 100%;
  padding: 0.625rem 2rem 0.625rem 0.75rem;
  border: 1px solid rgba(255, 102, 0, 0.3);
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.dark .bacon-search-input {
  background: rgba(31, 41, 55, 0.8);
  border-color: rgba(255, 102, 0, 0.4);
}

.bacon-search-input:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
}

.bacon-clear-btn {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
}

.bacon-clear-btn:hover {
  color: #f97316;
}

/* Suggestions Dropdown */
.bacon-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.25rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 240px;
  overflow-y: auto;
  z-index: 50;
}

.dark .bacon-suggestions {
  background: #1f2937;
  border-color: #374151;
}

.bacon-suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.15s;
}

.bacon-suggestion-item:hover,
.bacon-suggestion-highlighted {
  background: rgba(255, 102, 0, 0.1);
}

.dark .bacon-suggestion-item:hover,
.dark .bacon-suggestion-highlighted {
  background: rgba(255, 102, 0, 0.2);
}

.bacon-suggestion-icon {
  font-size: 1rem;
}

.bacon-suggestion-text {
  flex: 1;
  font-size: 0.875rem;
  color: var(--color-text-primary);
}

.bacon-suggestion-category {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: capitalize;
}

/* Result Section */
.bacon-result {
  margin-top: 0.75rem;
}

.bacon-result-found {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.dark .bacon-result-found {
  background: rgba(31, 41, 55, 0.5);
}

.bacon-number-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.bacon-number-icon {
  font-size: 1.25rem;
}

.bacon-number-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.bacon-number-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ea580c;
}

.dark .bacon-number-value {
  color: #fb923c;
}

/* Path Display */
.bacon-path {
  margin-bottom: 0.75rem;
}

.bacon-path-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 0.375rem;
}

.bacon-path-nodes {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
}

.bacon-path-node {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.bacon-path-actor {
  background: #dbeafe;
  color: #1e40af;
}

.dark .bacon-path-actor {
  background: rgba(59, 130, 246, 0.3);
  color: #93c5fd;
}

.bacon-path-movie {
  background: #d1fae5;
  color: #065f46;
}

.dark .bacon-path-movie {
  background: rgba(16, 185, 129, 0.3);
  color: #6ee7b7;
}

.bacon-path-kevin {
  background: #ffedd5;
  color: #c2410c;
  font-weight: 700;
  box-shadow: 0 0 0 2px #fb923c;
}

.dark .bacon-path-kevin {
  background: rgba(255, 102, 0, 0.3);
  color: #fb923c;
}

.bacon-path-arrow {
  color: var(--color-text-secondary);
  font-size: 0.75rem;
}

/* Clear Path Button */
.bacon-clear-path-btn {
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  border: 1px solid rgba(255, 102, 0, 0.3);
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.bacon-clear-path-btn:hover {
  background: rgba(255, 102, 0, 0.1);
  border-color: #f97316;
  color: #f97316;
}

/* Not Found */
.bacon-result-not-found {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #dc2626;
}

.dark .bacon-result-not-found {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

/* Hint */
.bacon-hint {
  margin-top: 0.5rem;
  padding: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-align: center;
}
</style>
