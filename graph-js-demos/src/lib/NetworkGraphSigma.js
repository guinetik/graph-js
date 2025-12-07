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
import EdgeCurveProgram from '@sigma/edge-curve';
import * as d3 from 'd3';
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
  NODE_SIZE: 8,
  MIN_SIZE: 5,
  MAX_SIZE: 20,
  SIZE_EXPONENT: 0.4, // Power exponent for size scaling (matches D3)
  EDGE_COLOR: '#d0d0d0',  // Light gray (Sigma WebGL doesn't support edge transparency)
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
      sizeExponent: options.sizeExponent || DEFAULTS.SIZE_EXPONENT,
      sizeBy: options.sizeBy || null,
      colorBy: options.colorBy || 'group',
      colorScheme: options.colorScheme || 'category10',
      showLabels: options.showLabels !== false,
      // D3 Force simulation options - customize for different graph types
      chargeStrength: options.chargeStrength || -300,      // More negative = more repulsion
      linkDistance: options.linkDistance || 100,           // Higher = longer links
      linkStrength: options.linkStrength || 0.5,           // Lower = weaker edge pull
      collisionPadding: options.collisionPadding || 2,     // Extra space around nodes
      collisionStrength: options.collisionStrength || 0.7, // How hard nodes push apart
      centerStrength: options.centerStrength || 1,         // Pull toward center (0-1)
      // Edge rendering options
      curvedEdges: options.curvedEdges || false,           // Use curved edges (Bézier curves)
      edgeCurvature: options.edgeCurvature || 0.25,        // Curvature amount (0-1)
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

    // D3 force simulation (calculates positions, Sigma renders)
    this.simulation = null;
    this.simulationRunning = false;
    this.simulationNodes = [];  // D3 needs mutable node array
    this.simulationLinks = [];  // D3 needs mutable link array

    // Resize observer for fluid canvas
    this.resizeObserver = null;
    this._resizeTimeout = null;

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

    // Setup resize observer for fluid canvas sizing
    this._setupResizeObserver();
  }

  /**
   * Setup ResizeObserver for fluid canvas resizing
   * @private
   */
  _setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') {
      this.log.warn('ResizeObserver not supported, canvas will not auto-resize');
      return;
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      // Debounce resize events
      if (this._resizeTimeout) {
        clearTimeout(this._resizeTimeout);
      }

      this._resizeTimeout = setTimeout(() => {
        if (this.isDestroyed || !this.sigma) return;

        const entry = entries[0];
        if (!entry) return;

        const { width, height } = entry.contentRect;

        // Only resize if dimensions actually changed significantly
        if (Math.abs(width - this.options.width) > 1 ||
            Math.abs(height - this.options.height) > 1) {
          this.log.debug('Container resized', { width, height });
          this.options.width = width;
          this.options.height = height;

          // Sigma's resize method updates the WebGL canvas
          this.sigma.resize();
          this.sigma.refresh();

          this.emit('resize', { width, height });
        }
      }, 100); // 100ms debounce
    });

    this.resizeObserver.observe(this.container);
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
      defaultEdgeColor: '#d0d0d0',  // Light gray (WebGL doesn't support edge alpha)
      defaultNodeType: 'bordered',         // Use bordered nodes
      nodeProgramClasses: {
        bordered: NodeBorderProgram
      },
      // Edge programs: line (default) and curved (Bézier curves)
      edgeProgramClasses: {
        curved: EdgeCurveProgram
      },
      defaultEdgeType: this.options.curvedEdges ? 'curved' : 'line',
      minCameraRatio: 0.1,
      maxCameraRatio: 10,
      stagePadding: 50,
      // Rendering quality - optimize for large graphs
      renderEdgeLabels: false,
      enableEdgeEvents: false,            // Better performance
      zIndex: true,                       // Enable z-ordering
      // Performance optimizations for large graphs
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

    // Immediately resize to current container dimensions
    // This handles cases where container was resized before Sigma was created
    const rect = this.container.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      this.options.width = rect.width;
      this.options.height = rect.height;
      this.sigma.resize();
    }

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
   * Start the D3 force simulation (calculates positions, Sigma renders)
   * Uses the same forces as NetworkGraphD3 for consistent behavior
   */
  startSimulation() {
    if (this.simulationRunning || !this.graph || this.graph.order === 0) {
      this.log.debug('Simulation not started', {
        running: this.simulationRunning,
        hasGraph: !!this.graph,
        order: this.graph?.order
      });
      return;
    }

    // Stop any existing simulation
    if (this.simulation) {
      this.simulation.stop();
    }

    // Build node and link arrays for D3
    // D3 mutates these arrays directly
    this.simulationNodes = [];
    this.simulationLinks = [];
    const nodeIndex = {};

    this.graph.forEachNode((nodeId, attrs) => {
      const node = {
        id: nodeId,
        x: attrs.x,
        y: attrs.y,
        size: attrs.size || 8,
        ...attrs
      };
      nodeIndex[nodeId] = node;
      this.simulationNodes.push(node);
    });

    this.graph.forEachEdge((edgeId, attrs, source, target) => {
      this.simulationLinks.push({
        source: nodeIndex[source],
        target: nodeIndex[target],
        ...attrs
      });
    });

    const nodeCount = this.simulationNodes.length;

    this.log.info('Starting D3 force simulation', { nodeCount });

    // Create D3 force simulation with customizable settings
    const opts = this.options;

    this.simulation = d3.forceSimulation(this.simulationNodes)
      .force('link', d3.forceLink(this.simulationLinks)
        .id(d => d.id)
        .distance(opts.linkDistance)
        .strength(opts.linkStrength))
      .force('charge', d3.forceManyBody()
        .strength(opts.chargeStrength))
      .force('center', d3.forceCenter(0, 0)
        .strength(opts.centerStrength))
      .force('collision', d3.forceCollide()
        .radius(d => (d.size || 8) + opts.collisionPadding)
        .strength(opts.collisionStrength))
      .on('tick', () => this._onSimulationTick())
      .on('end', () => this._onSimulationEnd());

    this.log.debug('Force settings', {
      chargeStrength: opts.chargeStrength,
      linkDistance: opts.linkDistance,
      linkStrength: opts.linkStrength,
      collisionPadding: opts.collisionPadding
    });

    this.simulationRunning = true;
    this.emit('simulationStart');
  }

  /**
   * Called on each D3 simulation tick - sync positions to Graphology
   * @private
   */
  _onSimulationTick() {
    // Update Graphology node positions from D3 simulation
    for (const node of this.simulationNodes) {
      if (node.x !== undefined && node.y !== undefined) {
        this.graph.setNodeAttribute(node.id, 'x', node.x);
        this.graph.setNodeAttribute(node.id, 'y', node.y);
      }
    }
    // Sigma auto-refreshes when graph attributes change
  }

  /**
   * Called when D3 simulation ends
   * @private
   */
  _onSimulationEnd() {
    this.simulationRunning = false;
    this.fitView();
    this.log.info('D3 simulation ended');
    this.emit('simulationEnd');
  }

  /**
   * Stop the D3 force simulation
   */
  stopSimulation() {
    this._stopSimulationInternal(false);
  }

  /**
   * Internal stop simulation with skipFit option
   * @private
   */
  _stopSimulationInternal(skipFit = false) {
    if (!this.simulation) {
      return;
    }

    this.simulation.stop();
    this.simulationRunning = false;

    // Fit view after stopping (unless skipFit is true)
    if (!skipFit) {
      this.fitView();
    }

    this.log.info('Stopped D3 simulation', { skipFit });
    this.emit('simulationEnd');
  }

  /**
   * Restart the simulation from scratch
   * Unlocks all node positions, spreads them out, and restarts D3 simulation
   */
  restartSimulation() {
    // Stop any existing simulation
    this.stopSimulation();

    // Calculate spread based on node count
    const nodeCount = this.graph.order;
    const spread = Math.sqrt(nodeCount) * 300;

    // Unlock all nodes and re-spread them randomly
    this.graph.forEachNode((nodeId) => {
      this.graph.removeNodeAttribute(nodeId, 'fx');
      this.graph.removeNodeAttribute(nodeId, 'fy');
      this.graph.setNodeAttribute(nodeId, 'x', (Math.random() - 0.5) * spread);
      this.graph.setNodeAttribute(nodeId, 'y', (Math.random() - 0.5) * spread);
    });

    // Clear fixed positions in data array
    this.data.nodes.forEach(node => {
      node.fx = null;
      node.fy = null;
    });

    this.log.info('Restarting simulation with spread', { nodeCount, spread });

    // Start fresh simulation
    this.startSimulation();
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
   * @param {Object} options - Optional settings
   * @param {boolean} options.skipSimulation - Skip starting the physics simulation (useful when applying layout immediately)
   */
  setData(nodes, links, options = {}) {
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

    // Start simulation unless skipSimulation option is set
    // (useful when applying a static layout immediately after load)
    if (!options?.skipSimulation) {
      this.startSimulation();
    }

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
    // VERY large initial spread - start nodes far apart so ForceAtlas2 can organize them
    // Without this, FA2's edge attraction clusters everything before repulsion can spread it
    const spread = Math.sqrt(nodeCount) * 500;

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
        const edgeAttrs = {
          weight: link.weight || 1,
          size: 0.5,  // Thin edges - reduces visual clutter since we can't use transparency
          color: DEFAULTS.EDGE_COLOR
        };

        // Add curved edge attributes if enabled
        if (this.options.curvedEdges) {
          edgeAttrs.type = 'curved';
          edgeAttrs.curvature = this.options.edgeCurvature;
        }

        this.graph.addEdge(sourceId, targetId, edgeAttrs);
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

    // Size scale - uses power scale matching D3's scalePow for consistency
    if (this.options.sizeBy) {
      const values = this.data.nodes
        .map(n => n[this.options.sizeBy])
        .filter(v => v !== undefined && v !== null && !isNaN(v));

      if (values.length > 0) {
        let min = Math.min(...values);
        let max = Math.max(...values);

        // Handle edge case where all values are the same
        if (min === max) {
          max = min + 1;
        }

        const range = max - min;
        const exponent = this.options.sizeExponent || DEFAULTS.SIZE_EXPONENT;

        // Power scale: normalize to 0-1, apply exponent, map to size range
        this.sizeScale = (value) => {
          const normalized = (value - min) / range;
          const powered = Math.pow(normalized, exponent);
          return this.options.minSize + powered * (this.options.maxSize - this.options.minSize);
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
    // Accept both minRadius/maxRadius (D3 API) and minSize/maxSize (Sigma internal)
    if (options.minRadius !== undefined) this.options.minSize = options.minRadius;
    if (options.maxRadius !== undefined) this.options.maxSize = options.maxRadius;
    if (options.minSize !== undefined) this.options.minSize = options.minSize;
    if (options.maxSize !== undefined) this.options.maxSize = options.maxSize;
    if (options.sizeExponent !== undefined) this.options.sizeExponent = options.sizeExponent;
    if (options.colorBy !== undefined) this.options.colorBy = options.colorBy;
    if (options.colorScheme !== undefined) this.options.colorScheme = options.colorScheme;

    // Recompute scales
    this._computeScales();

    // Update all nodes
    this.graph.forEachNode((nodeId, attrs) => {
      const originalNode = this.data.nodes.find(n => String(n.id) === nodeId);
      if (!originalNode) return;

      // Update size (unless size is locked)
      if (this.sizeScale && originalNode[this.options.sizeBy] !== undefined && !attrs.lockedSize) {
        this.graph.setNodeAttribute(nodeId, 'size', this.sizeScale(originalNode[this.options.sizeBy]));
      }

      // Update color (unless color is locked - e.g., for highlighted nodes like Kevin Bacon)
      if (this.colorMap && originalNode[this.options.colorBy] !== undefined && !attrs.lockedColor) {
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
   * Toggle curved edges on/off
   * @param {boolean} enabled - Whether to use curved edges
   * @param {number} curvature - Optional curvature amount (0-1, default 0.25)
   */
  setCurvedEdges(enabled, curvature = 0.25) {
    if (!this.graph) return;

    this.options.curvedEdges = enabled;
    this.options.edgeCurvature = curvature;

    // Update all edges
    this.graph.forEachEdge((edgeId) => {
      if (enabled) {
        this.graph.setEdgeAttribute(edgeId, 'type', 'curved');
        this.graph.setEdgeAttribute(edgeId, 'curvature', curvature);
      } else {
        this.graph.setEdgeAttribute(edgeId, 'type', 'line');
        this.graph.removeEdgeAttribute(edgeId, 'curvature');
      }
    });

    if (this.sigma) {
      this.sigma.refresh();
    }

    this.log.debug('Curved edges toggled', { enabled, curvature });
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
   *
   * @param {Object} options - Update options
   * @param {boolean} options.skipFit - Don't auto-fit to view (keeps current zoom)
   * @param {number} options.zoomRatio - Set specific zoom ratio (e.g., 0.5 = zoomed in 2x)
   */
  updateGraph(options = {}) {
    if (!this.graph || !this.sigma) return;

    // Stop simulation when layout is applied (positions are now fixed)
    // Pass skipFit through to stopSimulation
    this._stopSimulationInternal(options.skipFit);

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

    // Set specific zoom if requested, otherwise fit to view
    if (options.zoomRatio !== undefined) {
      const camera = this.sigma.getCamera();
      camera.animate({ ratio: options.zoomRatio }, { duration: 300 });
    } else if (!options.skipFit) {
      this.fitView();
    }

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
   * Get the underlying Graphology graph for direct manipulation
   * @returns {Graph} The Graphology graph instance
   */
  getGraph() {
    return this.graph;
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

    // Stop D3 simulation
    if (this.simulation) {
      this.simulation.stop();
      this.simulation = null;
    }
    this.simulationRunning = false;

    // Clean up resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this._resizeTimeout) {
      clearTimeout(this._resizeTimeout);
      this._resizeTimeout = null;
    }

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
