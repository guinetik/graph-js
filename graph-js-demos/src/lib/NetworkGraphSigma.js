/**
 * NetworkGraphSigma - WebGL-based Network Visualization using Sigma.js
 *
 * A high-performance graph visualization component using Sigma.js and Graphology.
 * This component mirrors the NetworkGraphD3 interface for easy swapping.
 *
 * Features:
 * - WebGL rendering for large graphs (10k+ nodes)
 * - Interactive nodes (drag, hover, zoom)
 * - Automatic node sizing based on metrics
 * - Color encoding for communities/metrics
 *
 * @example
 * const graph = new NetworkGraphSigma('#graph-container', {
 *   width: 800,
 *   height: 600
 * });
 *
 * graph.setData(
 *   [{ id: 'A', group: 1 }, { id: 'B', group: 1 }],
 *   [{ source: 'A', target: 'B' }]
 * );
 */

import Sigma from 'sigma';
import Graph from 'graphology';
import { createNodeBorderProgram } from '@sigma/node-border';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import { createLogger } from '@guinetik/logger';
import { GraphTooltip } from './GraphTooltip.js';

const log = createLogger({
  prefix: 'NetworkGraphSigma',
  level: 'info'
});

/**
 * Default configuration
 */
const DEFAULTS = {
  WIDTH: 800,
  HEIGHT: 600,
  NODE_SIZE: 5,
  MIN_SIZE: 3,
  MAX_SIZE: 12,
  EDGE_COLOR: '#aaa',
  NODE_COLOR: '#6366f1',   // Nice indigo color
  HOVER_COLOR: '#ef4444',  // Red for hover
  SELECTED_COLOR: '#f97316' // Orange for selected
};

/**
 * Color schemes for node coloring
 */
const COLOR_SCHEMES = {
  category10: [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#6366f1', // indigo
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
    '#14b8a6', // teal
    '#a855f7'  // vibrant purple
  ],
  pastel: [
    '#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6',
    '#ffff99', '#b15928', '#66c2a5', '#fc8d62', '#8da0cb'
  ]
};

/**
 * Helper function to normalize link source/target to ID
 */
function normalizeLinkId(source) {
  return typeof source === 'string' ? source : (source?.id || String(source));
}

/**
 * NetworkGraphSigma - WebGL graph visualization component
 */
export class NetworkGraphSigma {
  /**
   * Create a new NetworkGraphSigma instance
   *
   * @param {string|HTMLElement} container - Container selector or element
   * @param {Object} options - Configuration options
   */
  constructor(container, options = {}) {
    // Resolve container
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    if (!this.container) {
      throw new Error('NetworkGraphSigma: Container not found');
    }

    // Store options
    this.options = {
      width: options.width || this.container.clientWidth || DEFAULTS.WIDTH,
      height: options.height || this.container.clientHeight || DEFAULTS.HEIGHT,
      nodeSize: options.nodeRadius || DEFAULTS.NODE_SIZE,
      minSize: options.minRadius || DEFAULTS.MIN_SIZE,
      maxSize: options.maxRadius || DEFAULTS.MAX_SIZE,
      sizeBy: options.sizeBy || null,
      colorBy: options.colorBy || 'group',
      colorScheme: options.colorScheme || 'category10',
      showLabels: options.showLabels !== false,
      ...options
    };

    // Initialize state
    this.graph = null;
    this.sigma = null;
    this.data = { nodes: [], links: [] };
    this.isReady = false;
    this.isDestroyed = false;
    this.selectedNode = null;
    this.hoveredNode = null;
    this.draggedNode = null;
    this.isDragging = false;

    // Event handlers
    this.eventHandlers = new Map();
    this.interactionDisabled = false;

    // Scales
    this.sizeScale = null;
    this.colorMap = null;

    // Tooltip
    this.tooltip = new GraphTooltip({
      contentBuilder: options.tooltipBuilder || null
    });
    this.lastMouseEvent = null;

    // ForceAtlas2 simulation state
    this.simulationRunning = false;
    this.simulationFrame = null;
    this.simulationAlpha = 1;        // Like D3's alpha - starts at 1, decays to 0
    this.simulationAlphaDecay = 0.02; // How fast it cools down
    this.simulationAlphaMin = 0.001;  // Stop when below this
    this.simulationSettings = {
      iterations: 1,
      settings: {
        gravity: 0.5,          // Moderate gravity
        scalingRatio: 20,      // Strong repulsion
        slowDown: 1,           // Fast movement
        barnesHutOptimize: true,
        barnesHutTheta: 0.5,
        adjustSizes: false,
        strongGravityMode: false,
        outboundAttractionDistribution: false,
        linLogMode: false
      }
    };

    // Logger
    this.log = log;

    // Initialize
    this._initContainer();
    this._initGraph();

    this.log.info('NetworkGraphSigma initialized', {
      width: this.options.width,
      height: this.options.height
    });
  }

  /**
   * Initialize container styles
   * @private
   */
  _initContainer() {
    // Ensure container has dimensions
    if (!this.container.style.width) {
      this.container.style.width = `${this.options.width}px`;
    }
    if (!this.container.style.height) {
      this.container.style.height = `${this.options.height}px`;
    }
    this.container.style.position = 'relative';
  }

  /**
   * Initialize Graphology graph and Sigma renderer
   * @private
   */
  _initGraph() {
    // Create Graphology graph
    this.graph = new Graph({ type: 'undirected', allowSelfLoops: false });
  }

  /**
   * Initialize or reinitialize Sigma renderer
   * @private
   */
  _initSigma() {
    // Destroy existing Sigma instance
    if (this.sigma) {
      this.sigma.kill();
      this.sigma = null;
    }

    // Create bordered node program with white outline
    // Borders render outside-in: first is outer (white border), second is inner (fill)
    const NodeBorderProgram = createNodeBorderProgram({
      borders: [
        { size: { value: 0.06 }, color: { value: '#ffffff' } },   // Outer white border
        { size: { fill: true }, color: { attribute: 'color' } }   // Inner fill
      ]
    });

    // Performance optimization: disable labels for large graphs
    const nodeCount = this.graph.order;
    const isLargeGraph = nodeCount > 5000;
    const shouldRenderLabels = this.options.showLabels && !isLargeGraph;

    // Create Sigma instance with improved visual settings
    this.sigma = new Sigma(this.graph, this.container, {
      allowInvalidContainer: true,
      renderLabels: shouldRenderLabels,
      labelRenderedSizeThreshold: isLargeGraph ? 20 : 4,  // Higher threshold for large graphs
      labelFont: 'Inter, system-ui, Arial, sans-serif',
      labelSize: 11,
      labelWeight: '500',
      labelColor: { color: '#333' },
      defaultNodeColor: DEFAULTS.NODE_COLOR,
      defaultEdgeColor: isLargeGraph ? '#99999933' : '#99999966',  // More transparent for large graphs
      defaultNodeType: 'bordered',         // Use bordered nodes
      nodeProgramClasses: {
        bordered: NodeBorderProgram
      },
      defaultEdgeType: 'line',
      minCameraRatio: 0.1,
      maxCameraRatio: 10,
      stagePadding: 50,
      // Rendering quality - optimize for large graphs
      renderEdgeLabels: false,
      enableEdgeEvents: false,            // Better performance
      zIndex: true,                       // Enable z-ordering
      // Performance optimizations for large graphs
      allowInvalidContainer: true,
      ...(isLargeGraph && {
        // Reduce rendering quality for very large graphs
        nodeReducer: (node, data) => {
          // Simplify node data for rendering
          return {
            ...data,
            // Remove expensive properties if not needed
            label: shouldRenderLabels ? data.label : undefined
          };
        }
      })
    });

    // Set up event handlers
    this._setupEventHandlers();
  }

  /**
   * Set up Sigma event handlers
   * @private
   */
  _setupEventHandlers() {
    if (!this.sigma) return;

    // Node click
    this.sigma.on('clickNode', ({ node }) => {
      if (this.interactionDisabled) return;
      this._selectNode(node);
      this.emit('nodeClick', { node: this.graph.getNodeAttributes(node), id: node });
    });

    // Node hover
    this.sigma.on('enterNode', ({ node }) => {
      if (this.interactionDisabled) return;

      this.hoveredNode = node;
      this._updateNodeHighlight();

      // Show tooltip using tracked mouse position
      // Merge data from both graph attributes and original node data for complete stats
      const graphAttrs = this.graph.getNodeAttributes(node);
      const originalNode = this.data.nodes.find(n => String(n.id) === String(node)) || {};
      const nodeData = { ...originalNode, ...graphAttrs, id: node };

      if (this.lastMouseEvent) {
        this.tooltip.show(this.lastMouseEvent, nodeData);
      }

      this.emit('nodeHover', { node: nodeData, id: node });
    });

    this.sigma.on('leaveNode', ({ node }) => {
      if (this.interactionDisabled) return;
      this.hoveredNode = null;
      this._updateNodeHighlight();

      // Hide tooltip
      this.tooltip.hide();

      this.emit('nodeLeave', { node: this.graph.getNodeAttributes(node), id: node });
    });

    // Track mouse position for tooltip using native DOM event
    // This ensures we always have accurate clientX/clientY coordinates
    this._mouseMoveHandler = (event) => {
      this.lastMouseEvent = { clientX: event.clientX, clientY: event.clientY };

      // Update tooltip position if hovering over a node
      if (this.hoveredNode && !this.isDragging) {
        this.tooltip.updatePosition(this.lastMouseEvent);
      }
    };
    this.container.addEventListener('mousemove', this._mouseMoveHandler);

    // Node drag
    let dragStartPos = null;

    this.sigma.on('downNode', ({ node, event }) => {
      if (this.interactionDisabled) return;

      this.draggedNode = node;
      this.isDragging = true;
      dragStartPos = { x: event.x, y: event.y };

      // Hide tooltip during drag
      this.tooltip.hide();

      // Fix node position
      const attrs = this.graph.getNodeAttributes(node);
      this.graph.setNodeAttribute(node, 'fx', attrs.x);
      this.graph.setNodeAttribute(node, 'fy', attrs.y);

      // Prevent camera movement
      this.sigma.getCamera().disable();

      this.emit('nodeDragStart', { node: attrs, id: node });
    });

    this.sigma.getMouseCaptor().on('mousemovebody', (event) => {
      if (this.interactionDisabled) return;
      if (!this.isDragging || !this.draggedNode) return;

      // Get new position in graph coordinates
      const pos = this.sigma.viewportToGraph({ x: event.x, y: event.y });

      // Update node position
      this.graph.setNodeAttribute(this.draggedNode, 'x', pos.x);
      this.graph.setNodeAttribute(this.draggedNode, 'y', pos.y);
      this.graph.setNodeAttribute(this.draggedNode, 'fx', pos.x);
      this.graph.setNodeAttribute(this.draggedNode, 'fy', pos.y);

      this.emit('nodeDrag', {
        node: this.graph.getNodeAttributes(this.draggedNode),
        id: this.draggedNode
      });
    });

    this.sigma.getMouseCaptor().on('mouseup', () => {
      if (this.isDragging && this.draggedNode) {
        this.emit('nodeDragEnd', {
          node: this.graph.getNodeAttributes(this.draggedNode),
          id: this.draggedNode
        });
      }

      this.isDragging = false;
      this.draggedNode = null;
      dragStartPos = null;

      // Re-enable camera
      this.sigma.getCamera().enable();
    });

    // Stage click (deselect)
    this.sigma.on('clickStage', () => {
      if (this.selectedNode) {
        const node = this.selectedNode;
        this._deselectNode();
        this.emit('nodeDeselected', { id: node });
      }
    });
  }

  /**
   * Update node highlighting based on hover/selection state
   * @private
   */
  _updateNodeHighlight() {
    if (!this.sigma) return;

    this.sigma.setSetting('nodeReducer', (node, data) => {
      const newData = { ...data };

      if (node === this.selectedNode) {
        newData.color = DEFAULTS.SELECTED_COLOR;
        newData.highlighted = true;
      } else if (node === this.hoveredNode) {
        newData.color = DEFAULTS.HOVER_COLOR;
        newData.highlighted = true;
      }

      return newData;
    });

    this.sigma.refresh();
  }

  /**
   * Select a node
   * @private
   */
  _selectNode(nodeId) {
    const previousSelected = this.selectedNode;
    this.selectedNode = nodeId;

    if (previousSelected) {
      this.emit('nodeDeselected', { id: previousSelected });
    }

    this._updateNodeHighlight();
    this.emit('nodeSelected', {
      node: this.graph.getNodeAttributes(nodeId),
      id: nodeId
    });
  }

  /**
   * Deselect current node
   * @private
   */
  _deselectNode() {
    this.selectedNode = null;
    this._updateNodeHighlight();
  }

  /**
   * Start the ForceAtlas2 simulation
   * Runs with alpha decay like D3 - starts fast, slows down, stops at equilibrium
   */
  startSimulation() {
    if (this.simulationRunning || !this.graph || this.graph.order === 0) {
      return;
    }

    this.simulationRunning = true;
    this.simulationAlpha = 1; // Reset alpha to full strength

    // Disable interactivity during simulation for better performance
    this.interactionDisabled = true;

    // Scale settings based on graph size - larger graphs need MORE spread, not less
    const nodeCount = this.graph.order;
    const edgeCount = this.graph.size;
    const isLargeGraph = nodeCount > 5000;
    const isVeryLargeGraph = nodeCount > 10000;
    
    // For large graphs, we want MAXIMUM spread - use aggressive scaling
    // The graph will naturally spread out, then we'll zoom out to fit it
    const scaleFactor = Math.sqrt(nodeCount) * 2; // More aggressive scaling for large graphs
    
    // Update settings for this graph size
    // Key insight: VERY LOW gravity + STRONG repulsion = maximum spread
    // This lets the graph take as much space as it needs, then we zoom out
    this.simulationSettings.settings.scalingRatio = Math.max(100, scaleFactor); // Very strong repulsion for spread
    
    // Performance optimization: adjust settings for large graphs
    // But keep gravity VERY LOW so graph can spread out naturally
    if (isVeryLargeGraph) {
      // For very large graphs: very low gravity (let it spread) but optimize performance
      this.simulationSettings.settings.gravity = 0.001; // Very low - let it spread
      // Increase slowDown to reduce computation per frame
      this.simulationSettings.settings.slowDown = Math.max(this.simulationSettings.settings.slowDown, 10);
      // Use Barnes-Hut optimization more aggressively
      this.simulationSettings.settings.barnesHutTheta = 0.8;
    } else if (isLargeGraph) {
      this.simulationSettings.settings.gravity = 0.005; // Low gravity for spread
      this.simulationSettings.settings.slowDown = Math.max(this.simulationSettings.settings.slowDown, 5);
      this.simulationSettings.settings.barnesHutTheta = 0.6;
    } else {
      this.simulationSettings.settings.gravity = 0.01;  // Near-zero gravity - infinite space
    }

    this.log.info('Starting ForceAtlas2 simulation', {
      nodeCount,
      scaleFactor,
      scalingRatio: this.simulationSettings.settings.scalingRatio
    });

    const runSimulationStep = () => {
      if (!this.simulationRunning || this.isDestroyed || !this.graph) {
        return;
      }

      // Check if simulation should stop (reached equilibrium)
      if (this.simulationAlpha < this.simulationAlphaMin) {
        this.log.info('Simulation reached equilibrium');
        this.simulationRunning = false;

        // Re-enable interactivity
        this.interactionDisabled = false;

        // Fit view to show entire graph after a short delay
        // This ensures nodes have settled into their final positions
        setTimeout(() => {
          this.fitView();
        }, 100);
        
        this.emit('simulationEnd');
        return;
      }

      // Skip simulation step if dragging a node
      if (!this.isDragging) {
        // Apply alpha to slowDown - as alpha decreases, movement slows
        const settings = {
          ...this.simulationSettings,
          settings: {
            ...this.simulationSettings.settings,
            slowDown: this.simulationSettings.settings.slowDown / this.simulationAlpha
          }
        };

        // Run one iteration of ForceAtlas2
        forceAtlas2.assign(this.graph, settings);

        // Decay alpha (cool down) - faster decay for large graphs
        const nodeCount = this.graph.order;
        const alphaDecay = nodeCount > 10000 
          ? this.simulationAlphaDecay * 1.5  // Faster decay for very large graphs
          : nodeCount > 5000
          ? this.simulationAlphaDecay * 1.2  // Slightly faster for large graphs
          : this.simulationAlphaDecay;        // Normal decay for smaller graphs
        this.simulationAlpha -= this.simulationAlpha * alphaDecay;
      }

      // If a node is being dragged, restore its fixed position
      if (this.draggedNode && this.graph.hasNode(this.draggedNode)) {
        const attrs = this.graph.getNodeAttributes(this.draggedNode);
        if (attrs.fx !== undefined) {
          this.graph.setNodeAttribute(this.draggedNode, 'x', attrs.fx);
          this.graph.setNodeAttribute(this.draggedNode, 'y', attrs.fy);
        }
      }

      // Schedule next frame
      this.simulationFrame = requestAnimationFrame(runSimulationStep);
    };

    // Start the simulation loop
    this.simulationFrame = requestAnimationFrame(runSimulationStep);
  }

  /**
   * Stop the ForceAtlas2 simulation
   */
  stopSimulation() {
    if (!this.simulationRunning) {
      return;
    }

    this.simulationRunning = false;

    if (this.simulationFrame) {
      cancelAnimationFrame(this.simulationFrame);
      this.simulationFrame = null;
    }

    // Re-enable interactivity
    this.interactionDisabled = false;

    this.log.info('Stopped ForceAtlas2 simulation');
  }

  /**
   * Toggle simulation on/off
   * @returns {boolean} New simulation state
   */
  toggleSimulation() {
    if (this.simulationRunning) {
      this.stopSimulation();
    } else {
      this.startSimulation();
    }
    return this.simulationRunning;
  }

  /**
   * Check if simulation is running
   * @returns {boolean}
   */
  isSimulationRunning() {
    return this.simulationRunning;
  }

  /**
   * Set graph data
   *
   * @param {Array} nodes - Array of node objects with id property
   * @param {Array} links - Array of link objects with source/target
   */
  setData(nodes, links) {
    if (this.isDestroyed) {
      this.log.warn('Cannot set data on destroyed instance');
      return;
    }

    // Validate input
    if (!Array.isArray(nodes)) {
      throw new Error('NetworkGraphSigma: nodes must be an array');
    }
    if (!Array.isArray(links)) {
      throw new Error('NetworkGraphSigma: links must be an array');
    }

    this.log.debug('Setting graph data', {
      nodeCount: nodes.length,
      linkCount: links.length
    });

    // Store original data references
    this.data.nodes = nodes;
    this.data.links = links.map(link => ({
      ...link,
      source: normalizeLinkId(link.source),
      target: normalizeLinkId(link.target)
    }));

    // Clear selection
    this.selectedNode = null;

    // Rebuild graph
    this._buildGraph();

    // Initialize Sigma if not already
    if (!this.sigma) {
      this._initSigma();
    }

    // Mark as ready
    this.isReady = true;

    // Always start ForceAtlas2 simulation - it's needed to spread out nodes properly
    // Performance optimizations are applied in startSimulation() for large graphs
    this.startSimulation();

    // Emit ready event - fitView will be called when simulation ends
    this.emit('ready');
  }

  /**
   * Build Graphology graph from data
   * @private
   */
  _buildGraph() {
    // Clear existing graph
    this.graph.clear();

    // Compute scales
    this._computeScales();

    // Add nodes with random initial positions (spread out)
    // Scale spread VERY aggressively for large graphs - let them spread naturally
    const nodeCount = this.data.nodes.length;
    // Much larger initial spread for large graphs - they'll spread even more during simulation
    const spread = Math.sqrt(nodeCount) * 200; // Much larger spread for more room

    for (let i = 0; i < this.data.nodes.length; i++) {
      const node = this.data.nodes[i];
      const nodeId = String(node.id);

      // Get position (use existing or random spread)
      const x = node.x !== undefined ? node.x : (Math.random() - 0.5) * spread;
      const y = node.y !== undefined ? node.y : (Math.random() - 0.5) * spread;

      // Compute size
      let size = this.options.nodeSize;
      if (this.sizeScale && node[this.options.sizeBy] !== undefined) {
        size = this.sizeScale(node[this.options.sizeBy]);
      }

      // Compute color
      let color = DEFAULTS.NODE_COLOR;
      if (this.colorMap && node[this.options.colorBy] !== undefined) {
        color = this.colorMap(node[this.options.colorBy]);
      }

      this.graph.addNode(nodeId, {
        x,
        y,
        size,
        color,
        label: String(node.label || node.id),
        ...node
      });
    }

    // Add edges
    for (const link of this.data.links) {
      const sourceId = String(link.source);
      const targetId = String(link.target);

      // Skip invalid edges
      if (!this.graph.hasNode(sourceId) || !this.graph.hasNode(targetId)) {
        continue;
      }

      // Skip self-loops and duplicates
      if (sourceId === targetId) continue;
      if (this.graph.hasEdge(sourceId, targetId)) continue;

      try {
        this.graph.addEdge(sourceId, targetId, {
          weight: link.weight || 1,
          size: Math.max(1, Math.log(link.weight || 1) + 1),
          color: DEFAULTS.EDGE_COLOR
        });
      } catch (e) {
        // Edge already exists
      }
    }

    this.log.info('Graph built', {
      nodes: this.graph.order,
      edges: this.graph.size
    });
  }

  /**
   * Compute size and color scales
   * @private
   */
  _computeScales() {
    if (!this.data.nodes || this.data.nodes.length === 0) return;

    // Size scale
    if (this.options.sizeBy) {
      const values = this.data.nodes
        .map(n => n[this.options.sizeBy])
        .filter(v => v !== undefined && v !== null && !isNaN(v));

      if (values.length > 0) {
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min || 1;

        this.sizeScale = (value) => {
          const normalized = (value - min) / range;
          return this.options.minSize + Math.sqrt(normalized) * (this.options.maxSize - this.options.minSize);
        };
      }
    }

    // Color map
    const colorProperty = this.options.colorBy;
    if (colorProperty) {
      const values = this.data.nodes
        .map(n => n[colorProperty])
        .filter(v => v !== undefined && v !== null);

      const uniqueValues = [...new Set(values)];
      const scheme = COLOR_SCHEMES[this.options.colorScheme] || COLOR_SCHEMES.category10;

      const colorAssignment = new Map();
      uniqueValues.forEach((val, idx) => {
        colorAssignment.set(val, scheme[idx % scheme.length]);
      });

      this.colorMap = (value) => colorAssignment.get(value) || DEFAULTS.NODE_COLOR;
    }
  }

  /**
   * Update visual encoding (size/color properties)
   *
   * @param {Object} options - Visual encoding options
   */
  updateVisualEncoding(options = {}) {
    if (options.sizeBy !== undefined) this.options.sizeBy = options.sizeBy;
    if (options.minSize !== undefined) this.options.minSize = options.minSize;
    if (options.maxSize !== undefined) this.options.maxSize = options.maxSize;
    if (options.colorBy !== undefined) this.options.colorBy = options.colorBy;
    if (options.colorScheme !== undefined) this.options.colorScheme = options.colorScheme;

    // Recompute scales
    this._computeScales();

    // Update all nodes
    this.graph.forEachNode((nodeId, attrs) => {
      const originalNode = this.data.nodes.find(n => String(n.id) === nodeId);
      if (!originalNode) return;

      // Update size
      if (this.sizeScale && originalNode[this.options.sizeBy] !== undefined) {
        this.graph.setNodeAttribute(nodeId, 'size', this.sizeScale(originalNode[this.options.sizeBy]));
      }

      // Update color
      if (this.colorMap && originalNode[this.options.colorBy] !== undefined) {
        this.graph.setNodeAttribute(nodeId, 'color', this.colorMap(originalNode[this.options.colorBy]));
      }
    });

    if (this.sigma) {
      this.sigma.refresh();
    }
  }

  /**
   * Update edge colors to highlight clique edges (edges that are part of triangles)
   *
   * @param {boolean} enabled - Whether to highlight clique edges
   */
  updateCliqueEdgeColors(enabled) {
    if (!this.graph) return;

    const CLIQUE_EDGE_COLOR = '#ef4444'; // Red for clique edges
    const NORMAL_EDGE_COLOR = DEFAULTS.EDGE_COLOR;

    // Helper function to check if an edge is part of a triangle
    const isCliqueEdge = (sourceId, targetId) => {
      const sourceNeighbors = this.graph.neighbors(sourceId);
      const targetNeighbors = this.graph.neighbors(targetId);
      
      // Check if source and target share a common neighbor (forming a triangle)
      for (const neighbor of sourceNeighbors) {
        if (neighbor !== targetId && targetNeighbors.includes(neighbor)) {
          return true; // Found a triangle: source-target-neighbor
        }
      }
      return false;
    };

    // Update all edge colors
    this.graph.forEachEdge((edgeId, attrs, sourceId, targetId) => {
      const color = enabled && isCliqueEdge(sourceId, targetId) 
        ? CLIQUE_EDGE_COLOR 
        : NORMAL_EDGE_COLOR;
      this.graph.setEdgeAttribute(edgeId, 'color', color);
    });

    if (this.sigma) {
      this.sigma.refresh();
    }

    this.log.debug('Updated clique edge colors', { enabled });
  }

  /**
   * Update node statistics from analysis
   *
   * @param {Array} enrichedNodes - Nodes with computed statistics
   * @param {string} sizeBy - Property to use for sizing
   * @param {boolean} preserveZoom - Whether to preserve current zoom
   */
  updateNodeStatistics(enrichedNodes, sizeBy = 'eigenvector', preserveZoom = true) {
    // Merge statistics into original nodes
    for (const enriched of enrichedNodes) {
      const nodeId = String(enriched.id);
      const originalNode = this.data.nodes.find(n => String(n.id) === nodeId);

      if (originalNode) {
        // Merge computed properties
        Object.assign(originalNode, enriched);
      }

      // Update graph node attributes
      if (this.graph.hasNode(nodeId)) {
        for (const [key, value] of Object.entries(enriched)) {
          if (key !== 'id') {
            this.graph.setNodeAttribute(nodeId, key, value);
          }
        }
      }
    }

    // Update visual encoding with new sizeBy
    this.updateVisualEncoding({ sizeBy });
  }

  /**
   * Update the graph visualization
   * Refreshes Sigma to reflect any data changes
   * Stops the simulation since a layout was applied
   */
  updateGraph() {
    if (!this.graph || !this.sigma) return;

    // Stop simulation when layout is applied (positions are now fixed)
    this.stopSimulation();

    // Sync node positions from data back to graph
    for (const node of this.data.nodes) {
      const nodeId = String(node.id);
      if (this.graph.hasNode(nodeId)) {
        if (node.x !== undefined) this.graph.setNodeAttribute(nodeId, 'x', node.x);
        if (node.y !== undefined) this.graph.setNodeAttribute(nodeId, 'y', node.y);
        if (node.fx !== undefined) this.graph.setNodeAttribute(nodeId, 'x', node.fx);
        if (node.fy !== undefined) this.graph.setNodeAttribute(nodeId, 'y', node.fy);
      }
    }

    // Refresh Sigma renderer
    this.sigma.refresh();

    // Emit ready event (Sigma doesn't have a simulation to wait for)
    this.emit('ready');
  }

  /**
   * Lock all node positions at their current locations
   */
  lockPositions() {
    if (!this.data.nodes || this.data.nodes.length === 0) {
      this.log.warn('No nodes to lock');
      return;
    }

    // Set fixed positions to current positions
    this.data.nodes.forEach(node => {
      const nodeId = String(node.id);
      if (this.graph.hasNode(nodeId)) {
        const x = this.graph.getNodeAttribute(nodeId, 'x');
        const y = this.graph.getNodeAttribute(nodeId, 'y');
        node.fx = x;
        node.fy = y;
        node.x = x;
        node.y = y;
      }
    });

    this.log.debug('Locked all node positions');
  }

  /**
   * Unlock all node positions
   */
  unlockPositions() {
    if (!this.data.nodes || this.data.nodes.length === 0) {
      this.log.warn('No nodes to unlock');
      return;
    }

    // Clear fixed positions
    this.data.nodes.forEach(node => {
      node.fx = null;
      node.fy = null;
    });

    this.log.debug('Unlocked all node positions');
  }

  /**
   * Get all node IDs
   * @returns {Array} Array of node IDs
   */
  getNodeIds() {
    return this.data.nodes.map(n => n.id);
  }

  /**
   * Check if a node exists
   * @param {String} nodeId - Node ID to check
   * @returns {Boolean} True if node exists
   */
  hasNode(nodeId) {
    return this.data.nodes.some(n => String(n.id) === String(nodeId));
  }

  /**
   * Get selected node
   * @returns {Object|null} Selected node data or null
   */
  getSelectedNode() {
    if (!this.selectedNode) return null;
    return this.graph.hasNode(this.selectedNode)
      ? { id: this.selectedNode, ...this.graph.getNodeAttributes(this.selectedNode) }
      : null;
  }

  /**
   * Fit graph to view
   */
  fitView() {
    if (!this.sigma) return;

    // Use Sigma's built-in animatedReset which automatically fits the graph
    // This is more reliable than manual calculations
    const camera = this.sigma.getCamera();
    camera.animatedReset({ duration: 300 });
  }

  /**
   * Get camera for programmatic control
   */
  getCamera() {
    return this.sigma?.getCamera();
  }

  /**
   * Register event handler
   *
   * @param {string} eventName - Event name
   * @param {Function} handler - Event handler
   */
  on(eventName, handler) {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, new Set());
    }
    this.eventHandlers.get(eventName).add(handler);
  }

  /**
   * Remove event handler
   *
   * @param {string} eventName - Event name
   * @param {Function} handler - Event handler
   */
  off(eventName, handler) {
    if (this.eventHandlers.has(eventName)) {
      this.eventHandlers.get(eventName).delete(handler);
    }
  }

  /**
   * Emit event
   *
   * @param {string} eventName - Event name
   * @param {*} data - Event data
   */
  emit(eventName, data) {
    if (this.eventHandlers.has(eventName)) {
      for (const handler of this.eventHandlers.get(eventName)) {
        try {
          handler(data);
        } catch (e) {
          this.log.error('Event handler error', { eventName, error: e.message });
        }
      }
    }
  }

  /**
   * Destroy the graph instance
   */
  destroy() {
    if (this.isDestroyed) return;

    this.log.info('Destroying NetworkGraphSigma instance');

    // Stop simulation
    this.stopSimulation();

    // Remove mouse move listener
    if (this._mouseMoveHandler && this.container) {
      this.container.removeEventListener('mousemove', this._mouseMoveHandler);
      this._mouseMoveHandler = null;
    }

    // Destroy tooltip
    if (this.tooltip) {
      this.tooltip.destroy();
      this.tooltip = null;
    }

    // Kill Sigma
    if (this.sigma) {
      this.sigma.kill();
      this.sigma = null;
    }

    // Clear graph
    if (this.graph) {
      this.graph.clear();
      this.graph = null;
    }

    // Clear data
    this.data = { nodes: [], links: [] };

    // Clear event handlers
    this.eventHandlers.clear();

    // Clear state
    this.isReady = false;
    this.isDestroyed = true;
  }
}

export default NetworkGraphSigma;
