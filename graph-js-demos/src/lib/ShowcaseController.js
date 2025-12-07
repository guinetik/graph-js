import { JSONAdapter, CSVAdapter } from '@guinetik/graph-js';
import { createLogger } from '@guinetik/logger';

/**
 * Controller for the Showcase page that handles all business logic
 * independent of the UI framework (Vue, React, etc.)
 * 
 * This controller manages:
 * - Dataset loading and transformation
 * - Node operations (add/remove)
 * - Network analysis orchestration
 * - Layout algorithm application
 * - Status feedback management
 */
export class ShowcaseController {
  /**
   * Creates a new ShowcaseController instance
   * 
   * @param {Object} dependencies - Required dependencies
   * @param {Object} dependencies.graphManager - The graph manager (e.g., from useNetworkGraph)
   * @param {Function} dependencies.onStatusChange - Callback for status updates (message, type)
   * @param {Function} dependencies.translate - Translation function (key, replacements) => string
   */
  constructor({ graphManager, onStatusChange = null, translate = null }) {
    this.graphManager = graphManager;
    this.onStatusChange = onStatusChange;
    this.translate = translate || ((key) => key); // Fallback to key if no translation function
    this.log = createLogger({
      prefix: 'ShowcaseController',
      level: import.meta.env.DEV ? 'debug' : 'info'
    });
    
    // Available datasets configuration
    this.datasets = {
      default: {
        name: 'Default',
        loader: () => this._loadDefaultDataset()
      },
      karate: {
        name: 'Karate Club',
        loader: () => this._loadKarateDataset()
      },
      miserables: {
        name: 'Les Misérables',
        loader: () => this._loadMiserablesDataset()
      },
      kevinbacon: {
        name: 'Kevin Bacon',
        loader: () => this._loadKevinBaconDataset()
      }
    };
  }

  /**
   * Gets the initial default dataset
   * 
   * @returns {Object} Initial dataset with nodes and links in D3 format
   */
  getInitialDataset() {
    const initialData = {
      nodes: [
        { id: 'Alice', group: 1 },
        { id: 'Bob', group: 1 },
        { id: 'Charlie', group: 2 },
        { id: 'David', group: 2 },
        { id: 'Eve', group: 3 },
        { id: 'Frank', group: 3 },
        { id: 'Grace', group: 1 },
        { id: 'Henry', group: 2 },
        { id: 'Isabel', group: 4 },
        { id: 'John', group: 4 },
        { id: 'Kate', group: 5 },
        { id: 'Luke', group: 5 },
        { id: 'Mary', group: 6 },
        { id: 'Nick', group: 6 },
        { id: 'Oliver', group: 7 }
      ],
      links: [
        { source: 'Alice', target: 'Bob' },
        { source: 'Alice', target: 'Charlie' },
        { source: 'Bob', target: 'Charlie' },
        { source: 'Charlie', target: 'David' },
        { source: 'Eve', target: 'Frank' },
        { source: 'Eve', target: 'Alice' },
        { source: 'Grace', target: 'Alice' },
        { source: 'Henry', target: 'Bob' },
        { source: 'Henry', target: 'Eve' },
        { source: 'Isabel', target: 'John' },
        { source: 'Isabel', target: 'Kate' },
        { source: 'John', target: 'Luke' },
        { source: 'Kate', target: 'Mary' },
        { source: 'Luke', target: 'Nick' },
        { source: 'Mary', target: 'Oliver' },
        { source: 'Nick', target: 'Oliver' },
        { source: 'Oliver', target: 'Alice' },
        { source: 'Frank', target: 'Mary' },
        { source: 'David', target: 'Isabel' },
        { source: 'Grace', target: 'Kate' }
      ]
    };

    return initialData;
  }

  /**
   * Loads default dataset (internal data)
   * 
   * @returns {Promise<Object>} Graph data in D3 format
   * @private
   */
  async _loadDefaultDataset() {
    const initialData = this.getInitialDataset();

    // Already in D3 format (has links), just return it
    return initialData;
  }

  /**
   * Loads Karate Club dataset from JSON file
   * 
   * @returns {Promise<Object>} Graph data in D3 format
   * @private
   */
  async _loadKarateDataset() {
    const graphData = await JSONAdapter.loadFromURL('/data/karateclub.json');

    // Add group property from club field if present
    graphData.nodes = graphData.nodes.map(n => ({
      ...n,
      group: n.club === 'Mr. Hi' ? 1 : 2
    }));

    return {
      nodes: graphData.nodes,
      links: graphData.edges
    };
  }

  /**
   * Loads Les Misérables dataset from CSV file
   * 
   * @returns {Promise<Object>} Graph data in D3 format
   * @private
   */
  async _loadMiserablesDataset() {
    const graphData = await CSVAdapter.loadFromURL('/data/les_miserables.csv');

    // Add default group if not present
    graphData.nodes = graphData.nodes.map(n => ({
      ...n,
      group: n.group || 1
    }));

    return {
      nodes: graphData.nodes,
      links: graphData.edges
    };
  }

  /**
   * Loads Kevin Bacon dataset from CSV files (edges + nodes with metadata)
   *
   * @returns {Promise<Object>} Graph data in D3 format
   * @private
   */
  async _loadKevinBaconDataset() {
    const graphData = await CSVAdapter.loadFromURL(
      '/data/kevin_bacon_edges.csv',
      '/data/kevin_bacon_nodes.csv'
    );

    // Assign groups based on category (movies vs actors)
    graphData.nodes = graphData.nodes.map(n => ({
      ...n,
      group: n.category === 'movie' ? 1 : 2
    }));

    return {
      nodes: graphData.nodes,
      links: graphData.edges
    };
  }

  /**
   * Loads a dataset by key
   * 
   * @param {string} datasetKey - Key of the dataset to load ('default', 'karate', 'miserables')
   * @returns {Promise<Object>} Result object with success status and data
   */
  async loadDataset(datasetKey) {
    const dataset = this.datasets[datasetKey];
    
    if (!dataset) {
      return {
        success: false,
        error: `Unknown dataset: ${datasetKey}`
      };
    }

    try {
      this.log.debug('Loading dataset', { datasetKey, datasetName: dataset.name });
      this._updateStatus('Loading dataset...', 'info');
      
      const d3Data = await dataset.loader();
      
      // Load data into graph
      this.graphManager.loadData(d3Data.nodes, d3Data.links);

      // Apply dataset-specific visual encoding
      if (datasetKey === 'kevinbacon') {
        // Color by category (movie vs actor) for bipartite graph
        this.graphManager.updateVisualEncoding({
          colorBy: 'category',
          colorScheme: 'categorical'
        });
      }

      const message = this.translate('showcase.messages.loadedDataset', {
        name: dataset.name,
        nodes: d3Data.nodes.length,
        edges: d3Data.links.length
      });
      this.log.info('Dataset loaded successfully', { 
        name: dataset.name, 
        nodeCount: d3Data.nodes.length, 
        edgeCount: d3Data.links.length 
      });
      this._updateStatus(message, 'success');

      return {
        success: true,
        data: d3Data,
        name: dataset.name,
        nodeCount: d3Data.nodes.length,
        edgeCount: d3Data.links.length
      };
    } catch (err) {
      const message = this.translate('showcase.messages.failedToLoadDataset', { error: err.message });
      this.log.error('Failed to load dataset', { datasetKey, error: err.message, stack: err.stack });
      this._updateStatus(message, 'error');
      
      return {
        success: false,
        error: err.message
      };
    }
  }

  /**
   * Adds a random node connected to an existing random node
   * 
   * @returns {Object} Result object with success status and node info
   */
  addRandomNode() {
    if (!this.graphManager.graphInstance.value) {
      return { success: false, error: 'Graph not initialized' };
    }

    const nodeIds = this.graphManager.getNodeIds();
    if (nodeIds.length === 0) {
      return { success: false, error: 'No nodes available to connect to' };
    }

    // Pick a random existing node to connect to
    const randomNode = nodeIds[Math.floor(Math.random() * nodeIds.length)];
    const newNode = this.graphManager.addNode([randomNode], null, null, true); // incremental = true

    if (newNode) {
      const message = this.translate('showcase.messages.addedNode', { 
        nodeId: newNode.id, 
        connectedTo: randomNode 
      });
      this.log.debug('Added random node', { nodeId: newNode.id, connectedTo: randomNode });
      this._updateStatus(message, 'success');

      return {
        success: true,
        node: newNode,
        connectedTo: randomNode
      };
    }

    this.log.warn('Failed to add random node');
    return { success: false, error: 'Failed to add node' };
  }

  /**
   * Adds a node connected to the currently selected node
   *
   * @returns {Object} Result object with success status and node info
   */
  addNodeToSelected() {
    if (!this.graphManager.graphInstance.value) {
      return { success: false, error: 'Graph not initialized' };
    }

    // Get the currently selected node
    const selectedNode = this.graphManager.getSelectedNode();

    if (!selectedNode) {
      const message = this.translate('showcase.messages.noNodeSelected');
      this.log.warn('No node selected');
      this._updateStatus(message, 'error');

      return {
        success: false,
        error: 'No node selected'
      };
    }

    const targetNodeId = selectedNode.id;
    const newNode = this.graphManager.addNode([targetNodeId], null, null, true); // incremental = true

    if (newNode) {
      const message = this.translate('showcase.messages.addedNode', { 
        nodeId: newNode.id, 
        connectedTo: targetNodeId 
      });
      this.log.debug('Added node connected to selected', { nodeId: newNode.id, targetNodeId });
      this._updateStatus(message, 'success');

      return {
        success: true,
        node: newNode,
        connectedTo: targetNodeId
      };
    }

    this.log.warn('Failed to add node connected to selected', { targetNodeId });
    return { success: false, error: 'Failed to add node' };
  }

  /**
   * Removes a random node from the graph
   *
   * @returns {Object} Result object with success status and removed node ID
   */
  removeRandomNode() {
    if (!this.graphManager.graphInstance.value) {
      return { success: false, error: 'Graph not initialized' };
    }

    const nodeIds = this.graphManager.getNodeIds();
    if (nodeIds.length === 0) {
      const message = this.translate('showcase.messages.noNodesToRemove');
      this._updateStatus(message, 'error');

      return { success: false, error: 'No nodes to remove' };
    }

    const randomId = nodeIds[Math.floor(Math.random() * nodeIds.length)];
    const success = this.graphManager.removeNode(randomId, true); // incremental = true

    if (success) {
      const message = this.translate('showcase.messages.removedNode', { nodeId: randomId });
      this.log.debug('Removed random node', { nodeId: randomId });
      this._updateStatus(message, 'info');

      return {
        success: true,
        removedNodeId: randomId
      };
    }

    this.log.warn('Failed to remove random node');
    return { success: false, error: 'Failed to remove node' };
  }

  /**
   * Analyzes the graph using specified metrics
   * 
   * @param {string[]} metrics - Array of metric names to compute (e.g., ['degree', 'eigenvector', 'betweenness'])
   * @returns {Promise<Object>} Result object with success status and analysis results
   */
  async analyzeGraph(metrics = ['degree', 'eigenvector', 'betweenness']) {
    try {
      this.log.debug('Starting graph analysis', { metrics });
      this._updateStatus('Analyzing network using workers...', 'info');
      
      const results = await this.graphManager.analyzeGraph(metrics);

      if (results) {
        const message = this.translate('showcase.messages.analysisComplete', { count: results.nodes.length });
        this.log.info('Graph analysis complete', { 
          nodeCount: results.nodes.length, 
          metrics 
        });
        this._updateStatus(message, 'success');
        
        return {
          success: true,
          results,
          nodeCount: results.nodes.length,
          metrics
        };
      }

      this.log.warn('Analysis returned no results');
      return { success: false, error: 'Analysis returned no results' };
    } catch (err) {
      const message = this.translate('showcase.messages.analysisFailed', { error: err.message });
      this.log.error('Graph analysis failed', { error: err.message, stack: err.stack, metrics });
      this._updateStatus(message, 'error');
      
      return {
        success: false,
        error: err.message
      };
    }
  }

  /**
   * Applies a layout algorithm to the graph
   * 
   * @param {string} layoutId - ID of the layout algorithm to apply
   * @returns {Promise<Object>} Result object with success status
   */
  async applyLayout(layoutId) {
    if (layoutId === 'none') {
      const message = this.translate('showcase.messages.usingD3Physics');
      this.log.debug('Using default D3 physics simulation');
      this._updateStatus(message, 'info');

      // Unlock all fixed positions to allow D3 physics to take over
      this.graphManager.unlockPositions();

      return {
        success: true,
        layoutId: 'none',
        message: 'Using default D3 physics simulation'
      };
    }

    try {
      this.log.debug('Applying layout algorithm', { layoutId });
      this._updateStatus(`Applying ${layoutId} layout...`, 'info');
      
      const success = await this.graphManager.applyLayout(layoutId);

      if (success) {
        const message = this.translate('showcase.messages.appliedLayout', { layout: layoutId });
        this.log.info('Layout applied successfully', { layoutId });
        this._updateStatus(message, 'success');
        
        return {
          success: true,
          layoutId
        };
      }

      this.log.warn('Layout application failed', { layoutId });
      return { success: false, error: 'Layout application failed' };
    } catch (err) {
      const message = this.translate('showcase.messages.layoutFailed', { error: err.message });
      this.log.error('Layout application failed', { layoutId, error: err.message, stack: err.stack });
      this._updateStatus(message, 'error');
      
      return {
        success: false,
        error: err.message
      };
    }
  }

  /**
   * Gets available layout algorithms
   * 
   * @returns {Array} Array of layout objects with id, name, and description
   */
  getAvailableLayouts() {
    return this.graphManager.getAvailableLayouts();
  }

  /**
   * Updates status via callback if provided
   * 
   * @param {string} message - Status message
   * @param {string} type - Status type ('info', 'success', 'error')
   * @private
   */
  _updateStatus(message, type) {
    if (this.onStatusChange) {
      this.onStatusChange(message, type);
    }
  }

  /**
   * Checks if the graph is initialized
   * 
   * @returns {boolean} True if graph is ready
   */
  isGraphReady() {
    return this.graphManager.graphInstance.value !== null;
  }

  /**
   * Gets current node count
   * 
   * @returns {number} Number of nodes in the graph
   */
  getNodeCount() {
    return this.graphManager.getNodeIds().length;
  }

  /**
   * Gets available community detection algorithms
   * 
   * @returns {Array} Array of algorithm metadata objects
   */
  getAvailableCommunityAlgorithms() {
    return this.graphManager.getAvailableCommunityAlgorithms();
  }

  /**
   * Detects communities in the current graph
   * 
   * @param {string} algorithmId - Algorithm ID (e.g., 'louvain')
   * @returns {Promise<Object>} Community detection results
   */
  async detectCommunities(algorithmId) {
    if (!this.isGraphReady()) {
      this._updateStatus(this.translate('showcase.messages.graphNotInitialized'), 'error');
      return null;
    }

    const nodeCount = this.getNodeCount();
    if (nodeCount === 0) {
      this._updateStatus(this.translate('showcase.messages.graphIsEmpty'), 'error');
      return null;
    }

    try {
      this._updateStatus(`Detecting communities using ${algorithmId}...`, 'info');

      const result = await this.graphManager.detectCommunities(algorithmId);

      if (result) {
        const message = this.translate('showcase.messages.foundCommunities', {
          count: result.numCommunities,
          modularity: result.modularity.toFixed(3)
        });
        this._updateStatus(message, 'success');
        return result;
      } else {
        this._updateStatus(this.translate('showcase.messages.communityDetectionFailed'), 'error');
        return null;
      }
    } catch (error) {
      this.log.error('Community detection failed', { 
        algorithmId, 
        error: error.message, 
        stack: error.stack 
      });
      this._updateStatus(`Error: ${error.message}`, 'error');
      return null;
    }
  }

  /**
   * Gets the currently selected node
   *
   * @returns {Object|null} Selected node or null
   */
  getSelectedNode() {
    return this.graphManager.getSelectedNode();
  }
}

