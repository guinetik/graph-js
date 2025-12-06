/**
 * Internationalization (i18n)
 * Translation strings for English and Portuguese
 */

import { createLogger } from '@guinetik/logger';

const log = createLogger({
  prefix: 'i18n',
  level: import.meta.env.DEV ? 'debug' : 'info'
});

export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      showcase: 'Features Showcase',
      explorer: 'Network Explorer',
      family: 'Family Tree',
      docs: 'Documentation'
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      darkMode: 'Toggle dark mode',
      language: 'Language'
    },

    // Footer
    footer: {
      madeBy: 'Made with',
      by: 'by',
      license: 'MIT License'
    },

    // Home page
    home: {
      hero: {
        title: 'Modern Network Analysis for JavaScript',
        subtitle: 'Powerful graph theory and network analysis with worker-first architecture',
        description: 'Analyze social networks, family trees, and complex graphs with ease. Fast parallel computation, comprehensive metrics, and beautiful visualizations - all in pure JavaScript.',
        cta: 'Get Started',
        github: 'View on GitHub'
      },
      features: [
        {
          icon: '📊',
          title: 'Network Analytics',
          description: 'Compute centrality metrics, clustering coefficients, and graph-level statistics with comprehensive analysis tools'
        },
        {
          icon: '🔍',
          title: 'Interactive Explorer',
          description: 'Explore networks with drag-and-drop, zoom, pan, and real-time analysis of nodes and communities'
        },
        {
          icon: '🎨',
          title: 'Multiple Layouts',
          description: '11 layout algorithms including force-directed, Kamada-Kawai, spectral, and hierarchical layouts'
        },
        {
          icon: '⚡',
          title: 'Worker Performance',
          description: 'Non-blocking UI with web workers for parallel computation on large graphs with thousands of nodes'
        },
        {
          icon: '🔗',
          title: 'Community Detection',
          description: 'Find clusters and groups in networks using Louvain algorithm with modularity optimization'
        },
        {
          icon: '📈',
          title: 'Rich Metrics',
          description: 'Degree, betweenness, eigenvector, clustering, closeness, and more statistical features'
        }
      ],
      code: {
        title: 'Quick Start Example',
        snippet: `npm install @guinetik/graph-js

import NetworkStats from '@guinetik/graph-js';

const network = [
  { source: 'Alice', target: 'Bob', weight: 1 },
  { source: 'Bob', target: 'Carol', weight: 2 },
  { source: 'Carol', target: 'Alice', weight: 1 }
];

const analyzer = new NetworkStats({ verbose: true });
const results = await analyzer.analyze(network, ['degree', 'eigenvector']);

console.log(results);
// Analysis runs in workers for optimal performance!`
      }
    },

    // Documentation
    docs: {
      title: 'Documentation',
      subtitle: 'Complete API reference for @guinetik/graph-js',
      sections: {
        quickStart: 'Quick Start',
        coreClasses: 'Core Classes',
        adapters: 'Data Adapters',
        layouts: 'Graph Layouts',
        community: 'Community Detection',
        examples: 'Usage Examples'
      },
      quickStart: {
        title: 'Quick Start',
        install: 'Installation',
        installCmd: 'npm install @guinetik/graph-js',
        basicUsage: 'Basic Usage',
        description: 'Get started with network analysis in just a few lines of code.'
      },
      graph: {
        title: 'Graph',
        description: 'Core graph data structure using adjacency maps for efficient operations.',
        methods: 'Methods',
        methodsList: {
          addNode: {
            name: 'addNode(nodeId)',
            description: 'Add a single node to the graph'
          },
          addNodesFrom: {
            name: 'addNodesFrom(nodeIds)',
            description: 'Add multiple nodes from an array'
          },
          addEdge: {
            name: 'addEdge(source, target, weight?)',
            description: 'Add an edge between two nodes'
          },
          removeNode: {
            name: 'removeNode(nodeId)',
            description: 'Remove a node and all its edges'
          },
          getNeighbors: {
            name: 'getNeighbors(nodeId)',
            description: 'Get array of neighbor node IDs'
          },
          hasEdge: {
            name: 'hasEdge(source, target)',
            description: 'Check if edge exists'
          },
          numberOfNodes: {
            name: 'numberOfNodes()',
            description: 'Get total number of nodes'
          }
        }
      },
      networkStats: {
        title: 'NetworkStats',
        description: 'Main class for analyzing networks and calculating statistical metrics. All computation happens in web workers for optimal performance.',
        constructor: 'Constructor',
        constructorParams: {
          verbose: 'Enable detailed logging (default: true)',
          maxWorkers: 'Maximum number of workers (default: auto-detect CPU cores)',
          taskTimeout: 'Task timeout in milliseconds (default: 60000)',
          workerScript: 'Custom worker script path for bundlers like Vite'
        },
        analyze: {
          title: 'analyze() Method',
          description: 'Compute network statistics for all nodes'
        },
        features: {
          title: 'Available Features',
          degree: 'Number of connections per node',
          eigenvector: 'Influence based on connection quality (like PageRank)',
          eigenvectorLaplacian: 'Laplacian eigenvector centrality (for spectral layouts)',
          betweenness: 'Bridge importance between groups',
          clustering: 'How densely connected neighbors are',
          closeness: 'Average distance to all other nodes in the network',
          cliques: 'Number of complete subgraphs containing the node',
          egoDensity: 'Density of the node\'s immediate neighborhood',
          modularity: 'Community assignment (Louvain algorithm)'
        }
      },
      adapters: {
        title: 'Data Adapters',
        description: 'Convert between various graph formats and the standard GraphData format. All adapters use static methods.',
        csv: {
          title: 'CSVAdapter',
          description: 'Load and convert CSV files to graph format. Supports edge lists and node property files.',
          methods: 'Methods',
          methodsList: {
            fromEdgeList: {
              name: 'fromEdgeList(csvText, options)',
              description: 'Parse CSV edge list. Options: header (default: true), delimiter (default: ","), weighted (default: true)',
              returns: 'Returns GraphData with nodes and edges'
            },
            fromNodes: {
              name: 'fromNodes(csvText, options)',
              description: 'Parse CSV node properties',
              returns: 'Returns array of NodeData objects'
            },
            loadFromURL: {
              name: 'loadFromURL(edgeURL, nodeURL, options)',
              description: 'Async method to fetch and parse CSV from URLs',
              returns: 'Returns Promise<GraphData>'
            },
            toEdgeList: {
              name: 'toEdgeList(graphData, options)',
              description: 'Export edges to CSV string',
              returns: 'Returns CSV string'
            },
            toNodes: {
              name: 'toNodes(graphData, options)',
              description: 'Export nodes to CSV string',
              returns: 'Returns CSV string'
            }
          }
        },
        json: {
          title: 'JSONAdapter',
          description: 'Support for D3.js, Cytoscape, and other JSON formats. Auto-detects format.',
          methods: 'Methods',
          methodsList: {
            fromD3: {
              name: 'fromD3(d3Data)',
              description: 'Convert D3.js force-directed format (with "links") to GraphData',
              returns: 'Returns GraphData'
            },
            fromCytoscape: {
              name: 'fromCytoscape(cytoData)',
              description: 'Convert Cytoscape.js format to GraphData',
              returns: 'Returns GraphData'
            },
            fromFormat: {
              name: 'fromFormat(jsonData)',
              description: 'Auto-detect format (GraphData, D3, Cytoscape, NetworkX)',
              returns: 'Returns GraphData'
            },
            toD3: {
              name: 'toD3(graphData)',
              description: 'Convert to D3.js format with "links" property',
              returns: 'Returns D3GraphData'
            },
            toCytoscape: {
              name: 'toCytoscape(graphData)',
              description: 'Convert to Cytoscape.js format',
              returns: 'Returns CytoscapeData'
            },
            loadFromURL: {
              name: 'loadFromURL(url)',
              description: 'Async method to fetch and parse JSON',
              returns: 'Returns Promise<GraphData>'
            }
          }
        },
        networkx: {
          title: 'NetworkXAdapter',
          description: 'Python NetworkX interoperability. Supports node-link and adjacency formats.',
          methods: 'Methods',
          methodsList: {
            fromNodeLink: {
              name: 'fromNodeLink(nxData)',
              description: 'Convert NetworkX node-link format (most common)',
              returns: 'Returns GraphData'
            },
            fromAdjacency: {
              name: 'fromAdjacency(nxData)',
              description: 'Convert NetworkX adjacency format',
              returns: 'Returns GraphData'
            },
            toNodeLink: {
              name: 'toNodeLink(graphData, options)',
              description: 'Convert to node-link format. Options: directed (default: false), multigraph (default: false)',
              returns: 'Returns NetworkX node-link data'
            },
            toAdjacency: {
              name: 'toAdjacency(graphData)',
              description: 'Convert to adjacency format',
              returns: 'Returns array of node objects with adjacency lists'
            }
          }
        }
      },
      layouts: {
        title: 'Graph Layouts',
        description: 'Position nodes in 2D space using various algorithms. All layouts use async computation in Web Workers for optimal performance.',
        note: 'All layout methods are async and return Promise<Object> with node positions {nodeId: {x, y}}',
        forceDirected: {
          title: 'ForceDirectedLayout',
          description: 'Spring-electrical model using Fruchterman-Reingold algorithm. Good for general-purpose network visualization.',
          complexity: 'Time Complexity: O(iterations × V²)',
          bestFor: 'Best for: General networks, social graphs',
          constructor: 'new ForceDirectedLayout(graph, options)',
          options: {
            iterations: 'Number of simulation steps (default: 50)',
            k: 'Optimal distance between nodes (default: auto-calculated)',
            scale: 'Scale factor for positions (default: 1)',
            center: 'Center point {x, y} (default: {x:0, y:0})',
            initialPositions: 'Starting positions (default: random)',
            threshold: 'Convergence threshold (default: 1e-4)'
          }
        },
        kamadaKawai: {
          title: 'KamadaKawaiLayout',
          description: 'Energy minimization based on all-pairs shortest paths. Produces aesthetically pleasing layouts.',
          complexity: 'Time Complexity: O(V³ + iterations × V²)',
          bestFor: 'Best for: Small-medium graphs (<1000 nodes), trees, planar graphs',
          constructor: 'new KamadaKawaiLayout(graph, options)',
          options: {
            iterations: 'Maximum iterations (default: 1000)',
            scale: 'Scale factor (default: 1)',
            center: 'Center point (default: {x:0, y:0})',
            initialPositions: 'Starting positions (default: circular)',
            threshold: 'Convergence threshold (default: 1e-4)',
            K: 'Spring constant scaling (default: auto)'
          }
        },
        spectral: {
          title: 'SpectralLayout',
          description: 'Uses Laplacian eigenvectors as coordinates. Excellent for visualizing community structure.',
          complexity: 'Time Complexity: O(V) using pre-computed eigenvectors',
          bestFor: 'Best for: Community visualization, graph topology',
          requires: 'Requires: "eigenvector-laplacian" statistic must be pre-computed',
          constructor: 'new SpectralLayout(graph, options)',
          options: {
            scale: 'Scale factor (default: 100)',
            center: 'Center point (default: {x:0, y:0})'
          }
        },
        circular: {
          title: 'CircularLayout',
          description: 'Positions nodes in a circle. Simple and clean for small networks.',
          complexity: 'Time Complexity: O(V)',
          bestFor: 'Best for: Small networks, cycle graphs',
          constructor: 'new CircularLayout(graph, options)',
          options: {
            scale: 'Circle radius (default: 100)',
            center: 'Center point (default: {x:0, y:0})',
            sortBy: 'Optional sort function for node order'
          }
        },
        shell: {
          title: 'ShellLayout',
          description: 'Concentric circles based on node degree. High-degree nodes in center.',
          complexity: 'Time Complexity: O(V)',
          bestFor: 'Best for: Hub-and-spoke networks, star graphs',
          requires: 'Requires: "degree" statistic must be pre-computed',
          constructor: 'new ShellLayout(graph, options)'
        },
        spiral: {
          title: 'SpiralLayout',
          description: 'Archimedean spiral pattern. Aesthetically pleasing for ordered data.',
          complexity: 'Time Complexity: O(V)',
          bestFor: 'Best for: Sequential or temporal networks',
          constructor: 'new SpiralLayout(graph, options)'
        },
        bfs: {
          title: 'BFSLayout',
          description: 'Breadth-first search layers. Shows distance from root node.',
          complexity: 'Time Complexity: O(V + E)',
          bestFor: 'Best for: Trees, hierarchies, showing propagation',
          constructor: 'new BFSLayout(graph, options)'
        },
        bipartite: {
          title: 'BipartiteLayout',
          description: 'Two-layer layout for bipartite graphs.',
          complexity: 'Time Complexity: O(V)',
          bestFor: 'Best for: Two-mode networks, actor-event data',
          constructor: 'new BipartiteLayout(graph, options)'
        },
        random: {
          title: 'RandomLayout',
          description: 'Random positions. Useful as starting point for other layouts.',
          complexity: 'Time Complexity: O(V)',
          bestFor: 'Best for: Initial positions, testing',
          constructor: 'new RandomLayout(graph, options)'
        },
        usage: 'Usage Pattern',
        usageDescription: 'All layouts follow the same async pattern'
      },
      community: {
        title: 'Community Detection',
        description: 'Detect communities (clusters) in networks using various algorithms. All computation runs in Web Workers.',
        mainClass: {
          title: 'CommunityDetection',
          description: 'Main class for detecting communities in graphs',
          constructor: 'new CommunityDetection(graph)',
          methods: {
            detectCommunities: {
              name: 'detectCommunities(algorithm, options)',
              description: 'Detect communities using specified algorithm. Algorithm can be instance or string ("louvain")',
              returns: 'Returns Promise<CommunityResult> with communities, modularity, numCommunities'
            },
            calculateModularity: {
              name: 'calculateModularity(communities)',
              description: 'Calculate modularity score for a partition',
              returns: 'Returns number (-1 to 1, higher is better)'
            }
          },
          staticMethods: {
            detect: {
              name: 'CommunityDetection.detect(graphData, algorithm, options)',
              description: 'Convenience method for direct detection from GraphData',
              returns: 'Returns Promise<CommunityResult>'
            },
            getNodesInCommunity: {
              name: 'CommunityDetection.getNodesInCommunity(communities, communityId)',
              description: 'Get array of node IDs in a specific community'
            },
            getCommunityGroups: {
              name: 'CommunityDetection.getCommunityGroups(communities)',
              description: 'Get object mapping communityId to array of node IDs'
            }
          }
        },
        louvain: {
          title: 'LouvainAlgorithm',
          description: 'Fast modularity optimization using the Louvain method. The most popular community detection algorithm.',
          complexity: 'Time Complexity: O(V log V)',
          bestFor: 'Best for: Large networks, general-purpose community detection',
          constructor: 'new LouvainAlgorithm(options)',
          options: {
            resolution: 'Resolution parameter for modularity (default: 1.0). Higher values find smaller communities.',
            maxIterations: 'Maximum iterations (default: 100)'
          }
        },
        result: {
          title: 'CommunityResult',
          description: 'Result object returned by community detection',
          properties: {
            communities: 'Object mapping nodeId to communityId (number)',
            modularity: 'Modularity score (-1 to 1, typically 0.3-0.7 for good partitions)',
            numCommunities: 'Number of communities found',
            algorithm: 'Algorithm name used',
            metadata: 'Optional additional information'
          }
        },
        customAlgorithm: {
          title: 'Custom Algorithms',
          description: 'Extend CommunityAlgorithm base class to create your own algorithms',
          note: 'Implement the detect() method and configure worker module path'
        }
      },
      examples: {
        title: 'Usage Examples',
        description: 'Complete code examples for common use cases',
        basic: {
          title: 'Basic Network Analysis',
          description: 'Analyze a simple network and compute centrality metrics'
        },
        csv: {
          title: 'Loading CSV Data',
          description: 'Import network data from CSV files and analyze'
        },
        json: {
          title: 'Working with JSON',
          description: 'Convert between JSON formats (D3, Cytoscape, NetworkX)'
        },
        layout: {
          title: 'Applying Layouts',
          description: 'Position nodes using layout algorithms'
        },
        community: {
          title: 'Community Detection',
          description: 'Find communities using Louvain algorithm'
        },
        complete: {
          title: 'Complete Workflow',
          description: 'End-to-end example: load data, analyze, layout, detect communities'
        }
      }
    },

    // Pages
    showcase: {
      title: 'Features Showcase',
      description: 'Explore all the features of @guinetik/graph-js',
      header: {
        title: '🕸️ Interactive Network Graph',
        subtitle: 'Explore network analysis in real-time. Add nodes, remove them, and watch the graph update dynamically.'
      },
      whatIs: {
        title: 'What is this?',
        description: 'This interactive visualization demonstrates <strong>network analysis</strong>. Node size represents centrality: larger nodes are more influential in the network.'
      },
      status: {
        title: 'Status',
        ready: 'Ready for operations',
        hover: 'Hover over nodes to see details'
      },
      controls: {
        title: 'Controls',
        addRandom: 'Add a random node connected to a random existing node',
        addToSelected: 'Add a node connected to {name}',
        selectNodeFirst: 'Select a node first',
        removeRandom: 'Remove a random node'
      },
      dataLoading: {
        title: 'Load Dataset',
        choose: 'Choose Dataset:',
        default: 'Default Inline (15 nodes)',
        karate: 'Karate Club JSON (34 nodes)',
        miserables: 'Les Misérables CSV (77 nodes)',
        loadButton: '📊 Load Dataset',
        loading: '⏳ Loading...'
      },
      networkAnalysis: {
        title: '⚡ Network Analysis (Node Sizes)',
        description: '<strong>Uses @guinetik/graph-js:</strong> Computes centrality metrics in web workers for optimal performance.',
        metricsTitle: 'Metrics to Calculate',
        degreeCentrality: 'Degree Centrality',
        betweennessCentrality: 'Betweenness Centrality',
        clusteringCoefficient: 'Clustering Coefficient',
        eigenvectorCentrality: 'Eigenvector Centrality',
        pageRankCentrality: 'PageRank Centrality',
        eigenvectorLaplacian: 'Eigenvector (Laplacian) - for Spectral layout',
        nodeSizeLabel: 'Node Size Based On:',
        selectMetric: '-- Select a metric --',
        analyzeButton: '⚡ Analyze Network',
        analyzingButton: '⏳ Analyzing...',
        degreeName: 'Degree',
        betweennessName: 'Betweenness',
        clusteringName: 'Clustering',
        eigenvectorName: 'Eigenvector',
        pageRankName: 'PageRank'
      },
      layoutAlgorithm: {
        title: 'Layout Algorithm'
      },
      communityDetection: {
        title: '🎨 Community Detection',
        communitiesFound: 'Communities Found:',
        modularity: 'Modularity:',
        nodeColorsAssignments: 'Node colors represent community assignments'
      },
      instructions: {
        title: '💡 How to interact',
        dragNodes: '🖱️ <strong>Drag nodes</strong> to reposition them',
        scroll: '🔍 <strong>Scroll</strong> to zoom in/out',
        dragBackground: '👆 <strong>Drag background</strong> to pan',
        hoverNodes: '💬 <strong>Hover nodes</strong> to see detailed information',
        nodeSize: '📊 <strong>Node size</strong> = centrality',
        color: '🎨 <strong>Color</strong> = group/community'
      },
      buttons: {
        add: 'Add',
        toSelected: 'To Selected',
        remove: 'Remove'
      },
      messages: {
        loadingGraph: 'Loading graph...',
        loadingDataset: 'Loading {dataset} dataset...',
        loadingDatasetName: 'Loading {name} dataset...',
        analyzing: 'Analyzing network using workers...',
        applyingLayout: 'Applying {layout} layout...',
        detectingCommunities: 'Detecting communities using {algorithm}...',
        // Status messages from ShowcaseController
        loadedDataset: '✅ Loaded {name} dataset ({nodes} nodes, {edges} edges)',
        failedToLoadDataset: '❌ Failed to load dataset: {error}',
        addedNode: '✅ Added node "{nodeId}" connected to "{connectedTo}"',
        noNodeSelected: '❌ No node selected. Click on a node to select it first.',
        noNodesToRemove: '❌ No nodes to remove',
        removedNode: '🗑️ Removed node "{nodeId}"',
        analysisComplete: '✅ Analysis complete! Computed {count} node metrics using web workers',
        analysisFailed: '❌ Analysis failed: {error}',
        usingD3Physics: 'ℹ️ Using D3 physics simulation (no layout algorithm)',
        appliedLayout: '✅ Applied {layout} layout algorithm',
        layoutFailed: '❌ Layout failed: {error}',
        foundCommunities: 'Found {count} communities (modularity: {modularity})',
        communityDetectionFailed: 'Community detection failed',
        graphNotInitialized: 'Graph not initialized',
        graphIsEmpty: 'Graph is empty'
      },
      // Layout Picker Component
      layoutPicker: {
        chooseLayout: 'Choose Layout:',
        applyButton: '🎯 Apply Layout',
        applyingButton: '⏳ Applying...'
      },
      // Community Picker Component
      communityPicker: {
        chooseAlgorithm: 'Choose Algorithm:',
        detectButton: '🎨 Detect Communities',
        detectingButton: '⏳ Detecting...'
      }
    },
    explorer: {
      title: 'Network Explorer',
      description: 'Interactive network analysis and visualization',
      header: {
        title: '🔍 Network Explorer',
        subtitle: 'Explore sample networks and upload your own files. Supports CSV, JSON, and NetworkX formats.'
      },
      renderer: {
        title: 'Graph Renderer',
        d3: 'D3.js (SVG)',
        sigma: 'Sigma.js (WebGL)',
        d3Description: 'SVG-based rendering. Best for small-medium graphs (<1000 nodes). Supports rich interactions.',
        sigmaDescription: 'WebGL-based rendering. Optimized for large graphs (10k+ nodes). Hardware-accelerated.'
      },
      parallelComputation: {
        title: '🚀 Parallel Computation Demo',
        description: 'This demo showcases <strong>Web Workers</strong> for parallel network analysis. Large networks are processed across multiple CPU cores for faster computation.',
        workersSupported: '✓ Workers Supported',
        workersNotSupported: '✗ Workers Not Supported',
        cores: 'cores'
      },
      status: {
        title: 'Status',
        ready: 'Ready for operations',
        loadNetwork: 'Load a network to begin'
      },
      dataLoading: {
        title: 'Data Loading',
        sampleNetworks: '📊 Sample Networks',
        uploadFile: '📁 Upload File',
        chooseNetwork: 'Choose Network:',
        chooseCity: '-- Choose a city --',
        caruaru: 'Caruaru (~130 edges, small)',
        rj: 'Rio de Janeiro (~1,900 edges, medium)',
        niteroi: 'Niterói (~18,500 edges, large)',
        loadNetwork: '📊 Load Network',
        loading: '⏳ Loading...',
        fileFormat: 'File Format:',
        edgesCSV: 'Edges CSV (Required):',
        nodesCSV: 'Nodes CSV (Optional):',
        edgeCSVFormat: '<strong>Edge CSV format:</strong> source,target,weight<br><strong>Node CSV format:</strong> id,group,label,...',
        jsonFile: 'JSON File:',
        networkxFile: 'NetworkX JSON File:',
        jsonSupports: 'Supports: Standard (nodes/edges), D3 (nodes/links), Cytoscape, or raw edge list array',
        networkxSupports: 'Supports: node-link format, adjacency format',
        loadUploadedFile: '📁 Load Uploaded File',
        formatJSON: 'JSON (nodes/edges, D3, Cytoscape)',
        formatCSV: 'CSV (edge list)',
        formatNetworkX: 'NetworkX (node-link, adjacency)'
      },
      networkStats: {
        title: 'Network Statistics',
        nodes: 'Nodes',
        edges: 'Edges',
        avgDegree: 'Avg Degree',
        analysisTime: 'Analysis Time',
        communities: 'Communities',
        modularity: 'Modularity',
        usingParallel: '⚡ Using parallel computation',
        workersActive: 'workers active',
        singleThreaded: '⚠ Single-threaded mode',
        networkTooSmall: 'Network too small for workers'
      },
      networkAnalysis: {
        title: '⚡ Network Analysis (Node Sizes)'
      },
      layoutAlgorithm: {
        title: '🎯 Layout Algorithm',
        requiresAnalysis: 'requires analysis'
      },
      graphStats: {
        title: '📊 Graph Statistics',
        density: 'Density:',
        diameter: 'Diameter:',
        avgClustering: 'Avg Clustering:',
        avgPathLength: 'Avg Path Length:',
        components: 'Components:',
        avgDegree: 'Avg Degree:',
        calculated: 'Calculated alongside node metrics'
      },
      communityDetection: {
        title: '🎨 Community Detection (Node Colors)',
        algorithm: 'Algorithm:'
      },
      communityResults: {
        title: '🎨 Community Detection Results',
        communitiesFound: 'Communities Found:',
        modularityScore: 'Modularity Score:',
        computationTime: 'Computation Time:',
        algorithm: 'Algorithm:',
        nodeColorsRepresent: 'Node colors represent their community assignments'
      },
      instructions: {
        title: '💡 How to interact',
        dragNodes: '🖱️ <strong>Drag nodes</strong> to reposition them',
        scroll: '🔍 <strong>Scroll</strong> to zoom in/out',
        dragBackground: '👆 <strong>Drag background</strong> to pan',
        hoverNodes: '💬 <strong>Hover nodes</strong> to see detailed information',
        nodeSize: '📊 <strong>Node size</strong> = selected metric',
        color: '🎨 <strong>Color</strong> = community'
      },
      messages: {
        loadingNetworkData: 'Loading network data...',
        loadedNetwork: '✅ Loaded {name} ({nodes} nodes, {edges} edges)',
        failedToLoadNetwork: '❌ Failed to load network: {error}',
        loadingUploadedFile: 'Loading uploaded file...',
        loadedFile: '✅ Loaded {fileName} ({nodes} nodes, {edges} edges)',
        failedToLoadFile: '❌ Failed to load file: {error}',
        analyzingNetwork: 'Analyzing network using workers...',
        analysisComplete: '✅ Analysis complete! Computed {count} node metrics',
        analysisFailed: '❌ Analysis failed: {error}',
        usingD3Physics: 'ℹ️ Using D3 physics simulation (no layout algorithm)',
        applyingLayout: 'Applying {layout} layout...',
        appliedLayout: '✅ Applied {layout} layout algorithm',
        layoutFailed: '❌ Layout failed: {error}',
        graphNotInitialized: 'Graph not initialized',
        graphIsEmpty: 'Graph is empty',
        detectingCommunities: 'Detecting communities using {algorithm}...',
        foundCommunities: 'Found {count} communities (modularity: {modularity})',
        communityDetectionFailed: 'Community detection failed'
      }
    },
    family: {
      title: 'Family Tree',
      subtitle: 'Build and visualize your family tree interactively',
      description: 'Visualize family relationships',
      header: {
        title: '🌳 Family Tree Builder',
        subtitle: 'Build and visualize your family tree interactively. Start with yourself and add relatives to see the network grow.'
      },
      whatIs: {
        title: 'What is this?',
        description: 'A network visualization of family relationships. Each color represents a different relationship type. The tree auto-saves to your browser\'s storage every 30 seconds.'
      },
      status: {
        title: 'Status',
        ready: 'Ready for operations',
        clickToAdd: 'Click buttons to add relatives'
      },
      addRelatives: {
        title: 'Add Relatives',
        parents: '👨‍👩‍👧 Parents',
        grandparents: '👴👵 Grandparents',
        sibling: '👫 Sibling',
        nieceNephew: '🧒 Niece/Nephew',
        uncleAunt: '🧑‍🤝‍🧑 Uncle/Aunt',
        cousin: '👯 Cousin',
        partner: '💑 Partner',
        child: '👶 Child'
      },
      actions: {
        title: 'Actions',
        saveFamily: '💾 Save Family',
        saveImage: '📸 Save as Image',
        lockGraph: '🔒 Lock Graph',
        unlockGraph: '🔓 Unlock Graph',
        undo: '↩️ Undo',
        redo: '↪️ Redo',
        resetTree: '🗑️ Reset Tree'
      },
      renderNodes: {
        title: '🎨 Render Nodes',
        colors: '🎨 Colors',
        avatars: '👤 Avatars',
        colorsDesc: 'Nodes colored by relationship type.',
        avatarsDesc: 'Nodes shown as emoji avatars (if set).'
      },
      networkAnalysis: {
        title: '⚡ Network Analysis (Node Sizes)'
      },
      relationshipColors: {
        title: 'Relationship Colors',
        you: 'You',
        parents: 'Parents',
        siblings: 'Siblings',
        unclesAunts: 'Uncles/Aunts',
        cousins: 'Cousins',
        grandparents: 'Grandparents',
        nieces: 'Nieces/Nephews',
        partners: 'Partners/Spouses',
        children: 'Children'
      },
      layoutAlgorithm: {
        title: '🎯 Layout Algorithm'
      },
      instructions: {
        title: '💡 How to use',
        dragNodes: '🖱️ <strong>Drag nodes</strong> to arrange your tree',
        autoSaves: '💾 <strong>Auto-saves</strong> every 30 seconds',
        lock: '🔒 <strong>Lock</strong> to freeze positions',
        download: '📸 <strong>Download</strong> as PNG image',
        analyze: '⚡ <strong>Analyze</strong> to size nodes by centrality metrics',
        layouts: '🎯 <strong>Apply layouts</strong> to visualize your tree differently',
        undoRedo: '↩️ <strong>Undo/Redo</strong> with buttons or Ctrl+Z / Ctrl+Y (up to 10 actions)'
      },
      dialogs: {
        selectOption: 'Select an option',
        addParents: 'Add Parents',
        addSibling: 'Add Sibling',
        addGrandparents: 'Add Grandparents',
        addUncleAunt: 'Add Uncle/Aunt',
        addCousin: 'Add Cousin',
        addChild: 'Add Child',
        addNieceNephew: 'Add Niece/Nephew',
        addPartner: 'Add Partner/Spouse',
        fields: {
          motherName: 'Mother Name',
          motherAvatar: 'Mother Avatar (optional)',
          fatherName: 'Father Name',
          fatherAvatar: 'Father Avatar (optional)',
          siblingName: 'Sibling Name',
          gender: 'Gender',
          avatar: 'Avatar (optional)',
          parentsSide: "Parent's Side",
          grandmotherName: 'Grandmother Name',
          grandmotherAvatar: 'Grandmother Avatar (optional)',
          grandfatherName: 'Grandfather Name',
          grandfatherAvatar: 'Grandfather Avatar (optional)',
          name: 'Name',
          uncleAuntField: 'Uncle/Aunt',
          sibling: 'Sibling',
          parent: 'Parent',
          partnerOf: 'Partner Of'
        },
        genderOptions: {
          male: 'Male',
          female: 'Female',
          other: 'Other'
        },
        placeholders: {
          mother: '👩 Type an emoji',
          father: '👨 Type an emoji',
          avatar: '👤 Type an emoji',
          grandmother: '👵 Type an emoji',
          grandfather: '👴 Type an emoji'
        }
      },
      operations: {
        errors: {
          atLeastOneParent: 'At least one parent name is required',
          onlyOneParentSlot: 'Only one parent slot available. Added only the mother.',
          siblingNameRequired: 'Sibling name is required',
          genderRequired: 'Gender is required',
          graphNotInitialized: 'Graph not initialized',
          failedToAddSibling: 'Failed to add sibling',
          parentNotFound: 'Parent not found',
          atLeastOneGrandparent: 'At least one grandparent name is required',
          onlyOneGrandparentSlot: 'Only one grandparent slot available for this parent. Added only the grandmother.',
          failedToAddGrandparents: 'Failed to add grandparents',
          uncleAuntNameRequired: 'Uncle/aunt name is required',
          failedToAddUncleAunt: 'Failed to add uncle/aunt',
          cousinNameRequired: 'Cousin name is required',
          failedToAddCousin: 'Failed to add cousin',
          childNameRequired: 'Child name is required',
          failedToAddChild: 'Failed to add child',
          nieceNephewNameRequired: 'Niece/nephew name is required',
          failedToAddNieceNephew: 'Failed to add niece/nephew',
          partnerNameRequired: 'Partner name is required',
          personNotFound: 'Person not found',
          alreadyHasPartner: 'already has a partner!'
        },
        success: {
          parentAdded: 'Parent(s) added successfully',
          siblingAdded: 'Sibling added successfully',
          grandparentsAdded: 'Grandparent(s) added successfully',
          uncleAuntAdded: 'Uncle/Aunt added successfully',
          cousinAdded: 'Cousin added successfully',
          childAdded: 'Child added successfully',
          nieceNephewAdded: 'Niece/Nephew added successfully',
          partnerAdded: 'Partner added successfully'
        },
        validation: {
          noParents: 'You must add parents first before adding grandparents',
          noUnclesAunts: 'You must add uncles/aunts first before adding cousins',
          noSiblings: 'You must add siblings first before adding nieces/nephews',
          maxParents: 'You already have 2 parents added. You cannot add more than 2 parents.',
          notEligibleForPartner: 'No eligible people available for partners'
        }
      },
      storage: {
        saved: 'Family tree saved!',
        loaded: 'Family tree loaded',
        reset: 'Family tree reset',
        error: 'Error saving family tree'
      },
      history: {
        undone: 'Action undone',
        redone: 'Action redone',
        nothingToUndo: 'Nothing to undo',
        nothingToRedo: 'Nothing to redo'
      },
      relationships: {
        yourPartner: 'Your Partner/Spouse',
        partnerOf: "'s Partner",
        yourChild: 'Your child',
        siblingChild: "'s child (your niece/nephew)",
        cousinChild: "'s child (your cousin's child)",
        grandchild: "'s child (your grandchild)",
        siblingInLaw: "'s partner (your sibling-in-law)",
        childInLaw: "'s partner (your child-in-law)"
      },
      dropdownOptions: {
        yourChild: 'Your child',
        childTemplate: '{name}\'s child',
        nieceNephewTemplate: '{name}\'s child (your niece/nephew)',
        cousinChildTemplate: '{name}\'s child (your cousin\'s child)',
        grandchildTemplate: '{name}\'s child (your grandchild)',
        partnerTemplate: '{name}\'s partner',
        siblingPartnerTemplate: '{name}\'s partner (your sibling-in-law)',
        childPartnerTemplate: '{name}\'s partner (your child-in-law)',
        parentSideTemplate: '{name}\'s sibling',
        uncleAuntChildTemplate: '{name}\'s child',
        siblingChildTemplate: '{name}\'s child'
      }
    }
  },

  pt: {
    // Navigation
    nav: {
      home: 'Início',
      showcase: 'Demonstração',
      explorer: 'Explorador de Redes',
      family: 'Árvore Genealógica',
      docs: 'Documentação'
    },

    // Common
    common: {
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      darkMode: 'Alternar modo escuro',
      language: 'Idioma'
    },

    // Footer
    footer: {
      madeBy: 'Feito com',
      by: 'por',
      license: 'Licença MIT'
    },

    // Pages
    showcase: {
      title: 'Demonstração',
      description: 'Explore todos os recursos de @guinetik/graph-js',
      header: {
        title: '🕸️ Grafo de Rede Interativo',
        subtitle: 'Explore análise de redes em tempo real. Adicione nós, remova-os e veja o grafo se atualizar dinamicamente.'
      },
      whatIs: {
        title: 'O que é isto?',
        description: 'Esta visualização interativa demonstra <strong>análise de redes</strong>. O tamanho do nó representa centralidade: nós maiores são mais influentes na rede.'
      },
      status: {
        title: 'Status',
        ready: 'Pronto para operações',
        hover: 'Passe o mouse sobre nós para ver detalhes'
      },
      controls: {
        title: 'Controles',
        addRandom: 'Adicionar um nó aleatório conectado a um nó existente aleatório',
        addToSelected: 'Adicionar um nó conectado a {name}',
        selectNodeFirst: 'Selecione um nó primeiro',
        removeRandom: 'Remover um nó aleatório'
      },
      dataLoading: {
        title: 'Carregar Conjunto de Dados',
        choose: 'Escolha um Conjunto de Dados:',
        default: 'Padrão Embutido (15 nós)',
        karate: 'Karate Club JSON (34 nós)',
        miserables: 'Os Miseráveis CSV (77 nós)',
        loadButton: '📊 Carregar Conjunto de Dados',
        loading: '⏳ Carregando...'
      },
      networkAnalysis: {
        title: '⚡ Análise de Rede (Tamanhos de Nó)',
        description: '<strong>Usa @guinetik/graph-js:</strong> Calcula métricas de centralidade em web workers para desempenho ideal.',
        metricsTitle: 'Métricas para Calcular',
        degreeCentrality: 'Centralidade de Grau',
        betweennessCentrality: 'Centralidade de Intermediação',
        clusteringCoefficient: 'Coeficiente de Agrupamento',
        eigenvectorCentrality: 'Centralidade de Eigenvector',
        pageRankCentrality: 'Centralidade PageRank',
        eigenvectorLaplacian: 'Eigenvector (Laplaciano) - para layout Espectral',
        nodeSizeLabel: 'Tamanho do Nó Baseado Em:',
        selectMetric: '-- Selecione uma métrica --',
        analyzeButton: '⚡ Analisar Rede',
        analyzingButton: '⏳ Analisando...',
        degreeName: 'Grau',
        betweennessName: 'Intermediação',
        clusteringName: 'Agrupamento',
        eigenvectorName: 'Eigenvector',
        pageRankName: 'PageRank'
      },
      layoutAlgorithm: {
        title: 'Algoritmo de Layout'
      },
      communityDetection: {
        title: '🎨 Detecção de Comunidades',
        communitiesFound: 'Comunidades Encontradas:',
        modularity: 'Modularidade:',
        nodeColorsAssignments: 'As cores dos nós representam as atribuições de comunidades'
      },
      instructions: {
        title: '💡 Como interagir',
        dragNodes: '🖱️ <strong>Arraste nós</strong> para reposicioná-los',
        scroll: '🔍 <strong>Role</strong> para ampliar/reduzir',
        dragBackground: '👆 <strong>Arraste o fundo</strong> para mover',
        hoverNodes: '💬 <strong>Passe o mouse sobre nós</strong> para ver informações detalhadas',
        nodeSize: '📊 <strong>Tamanho do nó</strong> = centralidade',
        color: '🎨 <strong>Cor</strong> = grupo/comunidade'
      },
      buttons: {
        add: 'Adicionar',
        toSelected: 'Para Selecionado',
        remove: 'Remover'
      },
      messages: {
        loadingGraph: 'Carregando grafo...',
        loadingDataset: 'Carregando conjunto de dados {dataset}...',
        loadingDatasetName: 'Carregando conjunto de dados {name}...',
        analyzing: 'Analisando rede usando workers...',
        applyingLayout: 'Aplicando layout {layout}...',
        detectingCommunities: 'Detectando comunidades usando {algorithm}...',
        // Status messages from ShowcaseController
        loadedDataset: '✅ Conjunto de dados {name} carregado ({nodes} nós, {edges} arestas)',
        failedToLoadDataset: '❌ Falha ao carregar conjunto de dados: {error}',
        addedNode: '✅ Nó "{nodeId}" adicionado conectado a "{connectedTo}"',
        noNodeSelected: '❌ Nenhum nó selecionado. Clique em um nó para selecioná-lo primeiro.',
        noNodesToRemove: '❌ Nenhum nó para remover',
        removedNode: '🗑️ Nó "{nodeId}" removido',
        analysisComplete: '✅ Análise completa! Computadas {count} métricas de nós usando web workers',
        analysisFailed: '❌ Análise falhou: {error}',
        usingD3Physics: 'ℹ️ Usando simulação de física D3 (sem algoritmo de layout)',
        appliedLayout: '✅ Layout {layout} aplicado',
        layoutFailed: '❌ Layout falhou: {error}',
        foundCommunities: 'Encontradas {count} comunidades (modularidade: {modularity})',
        communityDetectionFailed: 'Detecção de comunidades falhou',
        graphNotInitialized: 'Grafo não inicializado',
        graphIsEmpty: 'Grafo está vazio'
      },
      // Layout Picker Component
      layoutPicker: {
        chooseLayout: 'Escolha o Layout:',
        applyButton: '🎯 Aplicar Layout',
        applyingButton: '⏳ Aplicando...'
      },
      // Community Picker Component
      communityPicker: {
        chooseAlgorithm: 'Escolha o Algoritmo:',
        detectButton: '🎨 Detectar Comunidades',
        detectingButton: '⏳ Detectando...'
      }
    },

    // Home page
    home: {
      hero: {
        title: 'Análise de Redes Moderna para JavaScript',
        subtitle: 'Teoria de grafos e análise de redes poderosa com arquitetura worker-first',
        description: 'Analise redes sociais, árvores genealógicas e grafos complexos com facilidade. Computação paralela rápida, métricas abrangentes e visualizações bonitas - tudo em JavaScript puro.',
        cta: 'Começar',
        github: 'Ver no GitHub'
      },
      features: [
        {
          icon: '📊',
          title: 'Análise de Redes',
          description: 'Calcule métricas de centralidade, coeficientes de agrupamento e estatísticas de grafo com ferramentas de análise abrangentes'
        },
        {
          icon: '🔍',
          title: 'Explorador Interativo',
          description: 'Explore redes com arrastar e soltar, zoom, pan e análise em tempo real de nós e comunidades'
        },
        {
          icon: '🎨',
          title: 'Múltiplos Layouts',
          description: '11 algoritmos de layout incluindo force-directed, Kamada-Kawai, spectral e layouts hierárquicos'
        },
        {
          icon: '⚡',
          title: 'Performance com Workers',
          description: 'UI não bloqueante com web workers para computação paralela em grafos grandes com milhares de nós'
        },
        {
          icon: '🔗',
          title: 'Detecção de Comunidades',
          description: 'Encontre clusters e grupos em redes usando algoritmo Louvain com otimização de modularidade'
        },
        {
          icon: '📈',
          title: 'Métricas Ricas',
          description: 'Grau, intermediação, eigenvector, agrupamento, proximidade e mais recursos estatísticos'
        }
      ],
      code: {
        title: 'Exemplo de Início Rápido',
        snippet: `npm install @guinetik/graph-js

import NetworkStats from '@guinetik/graph-js';

const network = [
  { source: 'Alice', target: 'Bob', weight: 1 },
  { source: 'Bob', target: 'Carol', weight: 2 },
  { source: 'Carol', target: 'Alice', weight: 1 }
];

const analyzer = new NetworkStats({ verbose: true });
const results = await analyzer.analyze(network, ['degree', 'eigenvector']);

console.log(results);
// Análise executada em workers para desempenho ideal!`
      }
    },

    // Documentation (Portuguese - needs translation)
    docs: {
      title: 'Documentação',
      subtitle: 'Referência completa da API para @guinetik/graph-js',
      sections: {
        quickStart: 'Início Rápido',
        coreClasses: 'Classes Principais',
        adapters: 'Adaptadores de Dados',
        layouts: 'Layouts de Grafos',
        community: 'Detecção de Comunidades',
        examples: 'Exemplos de Uso'
      },
      quickStart: {
        title: 'Início Rápido',
        install: 'Instalação',
        installCmd: 'npm install @guinetik/graph-js',
        basicUsage: 'Uso Básico',
        description: 'Comece com análise de redes em apenas algumas linhas de código.'
      },
      graph: {
        title: 'Graph',
        description: 'Estrutura de dados de grafo principal usando mapas de adjacência.',
        methods: 'Métodos',
        methodsList: {
          addNode: {
            name: 'addNode(nodeId)',
            description: 'Adicionar um nó ao grafo'
          },
          addNodesFrom: {
            name: 'addNodesFrom(nodeIds)',
            description: 'Adicionar múltiplos nós de um array'
          },
          addEdge: {
            name: 'addEdge(source, target, weight?)',
            description: 'Adicionar uma aresta entre dois nós'
          },
          removeNode: {
            name: 'removeNode(nodeId)',
            description: 'Remover um nó e todas as suas arestas'
          },
          getNeighbors: {
            name: 'getNeighbors(nodeId)',
            description: 'Obter array de IDs de nós vizinhos'
          },
          hasEdge: {
            name: 'hasEdge(source, target)',
            description: 'Verificar se aresta existe'
          },
          numberOfNodes: {
            name: 'numberOfNodes()',
            description: 'Obter número total de nós'
          }
        }
      },
      networkStats: {
        title: 'NetworkStats',
        description: 'Classe principal para analisar redes e calcular métricas estatísticas. Toda computação acontece em web workers para desempenho ideal.',
        constructor: 'Construtor',
        constructorParams: {
          verbose: 'Ativar logging detalhado (padrão: true)',
          maxWorkers: 'Número máximo de workers (padrão: detecta núcleos da CPU automaticamente)',
          taskTimeout: 'Timeout de tarefa em milissegundos (padrão: 60000)',
          workerScript: 'Caminho personalizado do script worker para bundlers como Vite'
        },
        analyze: {
          title: 'Método analyze()',
          description: 'Computar estatísticas de rede para todos os nós'
        },
        features: {
          title: 'Recursos Disponíveis',
          degree: 'Número de conexões por nó',
          eigenvector: 'Influência baseada na qualidade das conexões (como PageRank)',
          eigenvectorLaplacian: 'Centralidade eigenvector Laplaciano (para layouts espectrais)',
          betweenness: 'Importância de ponte entre grupos',
          clustering: 'Quão densamente conectados estão os vizinhos',
          closeness: 'Distância média para todos os outros nós na rede',
          cliques: 'Número de subgrafos completos contendo o nó',
          egoDensity: 'Densidade da vizinhança imediata do nó',
          modularity: 'Atribuição de comunidade (algoritmo Louvain)'
        }
      },
      adapters: {
        title: 'Adaptadores de Dados',
        description: 'Converter entre vários formatos de grafo e o formato padrão GraphData. Todos os adaptadores usam métodos estáticos.',
        csv: {
          title: 'CSVAdapter',
          description: 'Carregar e converter arquivos CSV para formato de grafo. Suporta listas de arestas e arquivos de propriedades de nós.',
          methods: 'Métodos',
          methodsList: {
            fromEdgeList: {
              name: 'fromEdgeList(csvText, options)',
              description: 'Analisar lista de arestas CSV. Opções: header (padrão: true), delimiter (padrão: ","), weighted (padrão: true)',
              returns: 'Retorna GraphData com nós e arestas'
            },
            fromNodes: {
              name: 'fromNodes(csvText, options)',
              description: 'Analisar propriedades de nós CSV',
              returns: 'Retorna array de objetos NodeData'
            },
            loadFromURL: {
              name: 'loadFromURL(edgeURL, nodeURL, options)',
              description: 'Método assíncrono para buscar e analisar CSV de URLs',
              returns: 'Retorna Promise<GraphData>'
            },
            toEdgeList: {
              name: 'toEdgeList(graphData, options)',
              description: 'Exportar arestas para string CSV',
              returns: 'Retorna string CSV'
            },
            toNodes: {
              name: 'toNodes(graphData, options)',
              description: 'Exportar nós para string CSV',
              returns: 'Retorna string CSV'
            }
          }
        },
        json: {
          title: 'JSONAdapter',
          description: 'Suporte para D3.js, Cytoscape e outros formatos JSON. Detecta formato automaticamente.',
          methods: 'Métodos',
          methodsList: {
            fromD3: {
              name: 'fromD3(d3Data)',
              description: 'Converter formato D3.js force-directed (com "links") para GraphData',
              returns: 'Retorna GraphData'
            },
            fromCytoscape: {
              name: 'fromCytoscape(cytoData)',
              description: 'Converter formato Cytoscape.js para GraphData',
              returns: 'Retorna GraphData'
            },
            fromFormat: {
              name: 'fromFormat(jsonData)',
              description: 'Detectar formato automaticamente (GraphData, D3, Cytoscape, NetworkX)',
              returns: 'Retorna GraphData'
            },
            toD3: {
              name: 'toD3(graphData)',
              description: 'Converter para formato D3.js com propriedade "links"',
              returns: 'Retorna D3GraphData'
            },
            toCytoscape: {
              name: 'toCytoscape(graphData)',
              description: 'Converter para formato Cytoscape.js',
              returns: 'Retorna CytoscapeData'
            },
            loadFromURL: {
              name: 'loadFromURL(url)',
              description: 'Método assíncrono para buscar e analisar JSON',
              returns: 'Retorna Promise<GraphData>'
            }
          }
        },
        networkx: {
          title: 'NetworkXAdapter',
          description: 'Interoperabilidade com Python NetworkX. Suporta formatos node-link e adjacência.',
          methods: 'Métodos',
          methodsList: {
            fromNodeLink: {
              name: 'fromNodeLink(nxData)',
              description: 'Converter formato NetworkX node-link (mais comum)',
              returns: 'Retorna GraphData'
            },
            fromAdjacency: {
              name: 'fromAdjacency(nxData)',
              description: 'Converter formato de adjacência NetworkX',
              returns: 'Retorna GraphData'
            },
            toNodeLink: {
              name: 'toNodeLink(graphData, options)',
              description: 'Converter para formato node-link. Opções: directed (padrão: false), multigraph (padrão: false)',
              returns: 'Retorna dados node-link NetworkX'
            },
            toAdjacency: {
              name: 'toAdjacency(graphData)',
              description: 'Converter para formato de adjacência',
              returns: 'Retorna array de objetos de nós com listas de adjacência'
            }
          }
        }
      },
      layouts: {
        title: 'Layouts de Grafos',
        description: 'Posicionar nós no espaço 2D usando vários algoritmos. Todos os layouts usam computação assíncrona em Web Workers para desempenho ideal.',
        note: 'Todos os métodos de layout são assíncronos e retornam Promise<Object> com posições de nós {nodeId: {x, y}}',
        forceDirected: {
          title: 'ForceDirectedLayout',
          description: 'Modelo spring-elétrico usando algoritmo Fruchterman-Reingold. Bom para visualização geral de redes.',
          complexity: 'Complexidade de Tempo: O(iterations × V²)',
          bestFor: 'Melhor para: Redes gerais, grafos sociais',
          constructor: 'new ForceDirectedLayout(graph, options)',
          options: {
            iterations: 'Número de passos de simulação (padrão: 50)',
            k: 'Distância ótima entre nós (padrão: auto-calculado)',
            scale: 'Fator de escala para posições (padrão: 1)',
            center: 'Ponto central {x, y} (padrão: {x:0, y:0})',
            initialPositions: 'Posições iniciais (padrão: aleatório)',
            threshold: 'Limiar de convergência (padrão: 1e-4)'
          }
        },
        kamadaKawai: {
          title: 'KamadaKawaiLayout',
          description: 'Minimização de energia baseada em caminhos mais curtos. Produz layouts esteticamente agradáveis.',
          complexity: 'Complexidade de Tempo: O(V³ + iterations × V²)',
          bestFor: 'Melhor para: Grafos pequenos-médios (<1000 nós), árvores, grafos planares',
          constructor: 'new KamadaKawaiLayout(graph, options)',
          options: {
            iterations: 'Máximo de iterações (padrão: 1000)',
            scale: 'Fator de escala (padrão: 1)',
            center: 'Ponto central (padrão: {x:0, y:0})',
            initialPositions: 'Posições iniciais (padrão: circular)',
            threshold: 'Limiar de convergência (padrão: 1e-4)',
            K: 'Escala de constante de mola (padrão: auto)'
          }
        },
        spectral: {
          title: 'SpectralLayout',
          description: 'Usa autovetores Laplacianos como coordenadas. Excelente para visualizar estrutura de comunidades.',
          complexity: 'Complexidade de Tempo: O(V) usando autovetores pré-computados',
          bestFor: 'Melhor para: Visualização de comunidades, topologia de grafo',
          requires: 'Requer: estatística "eigenvector-laplacian" deve ser pré-computada',
          constructor: 'new SpectralLayout(graph, options)',
          options: {
            scale: 'Fator de escala (padrão: 100)',
            center: 'Ponto central (padrão: {x:0, y:0})'
          }
        },
        circular: {
          title: 'CircularLayout',
          description: 'Posiciona nós em círculo. Simples e limpo para redes pequenas.',
          complexity: 'Complexidade de Tempo: O(V)',
          bestFor: 'Melhor para: Redes pequenas, grafos cíclicos',
          constructor: 'new CircularLayout(graph, options)',
          options: {
            scale: 'Raio do círculo (padrão: 100)',
            center: 'Ponto central (padrão: {x:0, y:0})',
            sortBy: 'Função de ordenação opcional para ordem dos nós'
          }
        },
        shell: {
          title: 'ShellLayout',
          description: 'Círculos concêntricos baseados no grau do nó. Nós de alto grau no centro.',
          complexity: 'Complexidade de Tempo: O(V)',
          bestFor: 'Melhor para: Redes hub-and-spoke, grafos estrela',
          requires: 'Requer: estatística "degree" deve ser pré-computada',
          constructor: 'new ShellLayout(graph, options)'
        },
        spiral: {
          title: 'SpiralLayout',
          description: 'Padrão de espiral arquimediana. Esteticamente agradável para dados ordenados.',
          complexity: 'Complexidade de Tempo: O(V)',
          bestFor: 'Melhor para: Redes sequenciais ou temporais',
          constructor: 'new SpiralLayout(graph, options)'
        },
        bfs: {
          title: 'BFSLayout',
          description: 'Camadas de busca em largura. Mostra distância do nó raiz.',
          complexity: 'Complexidade de Tempo: O(V + E)',
          bestFor: 'Melhor para: Árvores, hierarquias, mostrando propagação',
          constructor: 'new BFSLayout(graph, options)'
        },
        bipartite: {
          title: 'BipartiteLayout',
          description: 'Layout de duas camadas para grafos bipartidos.',
          complexity: 'Complexidade de Tempo: O(V)',
          bestFor: 'Melhor para: Redes de dois modos, dados ator-evento',
          constructor: 'new BipartiteLayout(graph, options)'
        },
        random: {
          title: 'RandomLayout',
          description: 'Posições aleatórias. Útil como ponto de partida para outros layouts.',
          complexity: 'Complexidade de Tempo: O(V)',
          bestFor: 'Melhor para: Posições iniciais, testes',
          constructor: 'new RandomLayout(graph, options)'
        },
        usage: 'Padrão de Uso',
        usageDescription: 'Todos os layouts seguem o mesmo padrão assíncrono'
      },
      community: {
        title: 'Detecção de Comunidades',
        description: 'Detectar comunidades (clusters) em redes usando vários algoritmos. Toda computação é executada em Web Workers.',
        mainClass: {
          title: 'CommunityDetection',
          description: 'Classe principal para detectar comunidades em grafos',
          constructor: 'new CommunityDetection(graph)',
          methods: {
            detectCommunities: {
              name: 'detectCommunities(algorithm, options)',
              description: 'Detectar comunidades usando algoritmo especificado. Algoritmo pode ser instância ou string ("louvain")',
              returns: 'Retorna Promise<CommunityResult> com communities, modularity, numCommunities'
            },
            calculateModularity: {
              name: 'calculateModularity(communities)',
              description: 'Calcular pontuação de modularidade para uma partição',
              returns: 'Retorna number (-1 a 1, maior é melhor)'
            }
          },
          staticMethods: {
            detect: {
              name: 'CommunityDetection.detect(graphData, algorithm, options)',
              description: 'Método de conveniência para detecção direta de GraphData',
              returns: 'Retorna Promise<CommunityResult>'
            },
            getNodesInCommunity: {
              name: 'CommunityDetection.getNodesInCommunity(communities, communityId)',
              description: 'Obter array de IDs de nós em uma comunidade específica'
            },
            getCommunityGroups: {
              name: 'CommunityDetection.getCommunityGroups(communities)',
              description: 'Obter objeto mapeando communityId para array de IDs de nós'
            }
          }
        },
        louvain: {
          title: 'LouvainAlgorithm',
          description: 'Otimização rápida de modularidade usando o método Louvain. O algoritmo de detecção de comunidades mais popular.',
          complexity: 'Complexidade de Tempo: O(V log V)',
          bestFor: 'Melhor para: Redes grandes, detecção de comunidades de uso geral',
          constructor: 'new LouvainAlgorithm(options)',
          options: {
            resolution: 'Parâmetro de resolução para modularidade (padrão: 1.0). Valores maiores encontram comunidades menores.',
            maxIterations: 'Máximo de iterações (padrão: 100)'
          }
        },
        result: {
          title: 'CommunityResult',
          description: 'Objeto de resultado retornado pela detecção de comunidades',
          properties: {
            communities: 'Objeto mapeando nodeId para communityId (número)',
            modularity: 'Pontuação de modularidade (-1 a 1, tipicamente 0.3-0.7 para boas partições)',
            numCommunities: 'Número de comunidades encontradas',
            algorithm: 'Nome do algoritmo usado',
            metadata: 'Informações adicionais opcionais'
          }
        },
        customAlgorithm: {
          title: 'Algoritmos Personalizados',
          description: 'Estender classe base CommunityAlgorithm para criar seus próprios algoritmos',
          note: 'Implementar o método detect() e configurar caminho do módulo worker'
        }
      },
      examples: {
        title: 'Exemplos de Uso',
        description: 'Exemplos de código completos para casos de uso comuns',
        basic: {
          title: 'Análise Básica de Redes',
          description: 'Analisar uma rede simples e computar métricas de centralidade'
        },
        csv: {
          title: 'Carregando Dados CSV',
          description: 'Importar dados de rede de arquivos CSV e analisar'
        },
        json: {
          title: 'Trabalhando com JSON',
          description: 'Converter entre formatos JSON (D3, Cytoscape, NetworkX)'
        },
        layout: {
          title: 'Aplicando Layouts',
          description: 'Posicionar nós usando algoritmos de layout'
        },
        community: {
          title: 'Detecção de Comunidades',
          description: 'Encontrar comunidades usando algoritmo Louvain'
        },
        complete: {
          title: 'Fluxo Completo',
          description: 'Exemplo ponta a ponta: carregar dados, analisar, aplicar layout, detectar comunidades'
        }
      }
    },

    explorer: {
      title: 'Explorador de Redes',
      description: 'Análise e visualização interativa de redes',
      header: {
        title: '🔍 Explorador de Redes',
        subtitle: 'Explore redes de exemplo e carregue seus próprios arquivos. Suporta formatos CSV, JSON e NetworkX.'
      },
      renderer: {
        title: 'Renderizador de Grafo',
        d3: 'D3.js (SVG)',
        sigma: 'Sigma.js (WebGL)',
        d3Description: 'Renderização baseada em SVG. Melhor para grafos pequenos-médios (<1000 nós). Suporta interações ricas.',
        sigmaDescription: 'Renderização baseada em WebGL. Otimizado para grafos grandes (10k+ nós). Aceleração por hardware.'
      },
      parallelComputation: {
        title: '🚀 Demonstração de Computação Paralela',
        description: 'Esta demonstração apresenta <strong>Web Workers</strong> para análise de redes paralela. Redes grandes são processadas em múltiplos núcleos de CPU para computação mais rápida.',
        workersSupported: '✓ Workers Suportados',
        workersNotSupported: '✗ Workers Não Suportados',
        cores: 'núcleos'
      },
      status: {
        title: 'Status',
        ready: 'Pronto para operações',
        loadNetwork: 'Carregue uma rede para começar'
      },
      dataLoading: {
        title: 'Carregamento de Dados',
        sampleNetworks: '📊 Redes de Exemplo',
        uploadFile: '📁 Carregar Arquivo',
        chooseNetwork: 'Escolha uma Rede:',
        chooseCity: '-- Escolha uma cidade --',
        caruaru: 'Caruaru (~130 arestas, pequena)',
        rj: 'Rio de Janeiro (~1.900 arestas, média)',
        niteroi: 'Niterói (~18.500 arestas, grande)',
        loadNetwork: '📊 Carregar Rede',
        loading: '⏳ Carregando...',
        fileFormat: 'Formato do Arquivo:',
        edgesCSV: 'CSV de Arestas (Obrigatório):',
        nodesCSV: 'CSV de Nós (Opcional):',
        edgeCSVFormat: '<strong>Formato CSV de arestas:</strong> source,target,weight<br><strong>Formato CSV de nós:</strong> id,group,label,...',
        jsonFile: 'Arquivo JSON:',
        networkxFile: 'Arquivo JSON NetworkX:',
        jsonSupports: 'Suporta: Padrão (nodes/edges), D3 (nodes/links), Cytoscape, ou array de lista de arestas',
        networkxSupports: 'Suporta: formato node-link, formato adjacency',
        loadUploadedFile: '📁 Carregar Arquivo Enviado',
        formatJSON: 'JSON (nodes/edges, D3, Cytoscape)',
        formatCSV: 'CSV (lista de arestas)',
        formatNetworkX: 'NetworkX (node-link, adjacency)'
      },
      networkStats: {
        title: 'Estatísticas da Rede',
        nodes: 'Nós',
        edges: 'Arestas',
        avgDegree: 'Grau Médio',
        analysisTime: 'Tempo de Análise',
        communities: 'Comunidades',
        modularity: 'Modularidade',
        usingParallel: '⚡ Usando computação paralela',
        workersActive: 'workers ativos',
        singleThreaded: '⚠ Modo single-thread',
        networkTooSmall: 'Rede muito pequena para workers'
      },
      networkAnalysis: {
        title: '⚡ Análise de Rede (Tamanhos de Nó)'
      },
      layoutAlgorithm: {
        title: '🎯 Algoritmo de Layout',
        requiresAnalysis: 'requer análise'
      },
      graphStats: {
        title: '📊 Estatísticas do Grafo',
        density: 'Densidade:',
        diameter: 'Diâmetro:',
        avgClustering: 'Agrupamento Médio:',
        avgPathLength: 'Comprimento Médio do Caminho:',
        components: 'Componentes:',
        avgDegree: 'Grau Médio:',
        calculated: 'Calculado junto com métricas de nós'
      },
      communityDetection: {
        title: '🎨 Detecção de Comunidades (Cores dos Nós)',
        algorithm: 'Algoritmo:'
      },
      communityResults: {
        title: '🎨 Resultados da Detecção de Comunidades',
        communitiesFound: 'Comunidades Encontradas:',
        modularityScore: 'Pontuação de Modularidade:',
        computationTime: 'Tempo de Computação:',
        algorithm: 'Algoritmo:',
        nodeColorsRepresent: 'As cores dos nós representam as atribuições de comunidades'
      },
      instructions: {
        title: '💡 Como interagir',
        dragNodes: '🖱️ <strong>Arraste nós</strong> para reposicioná-los',
        scroll: '🔍 <strong>Role</strong> para ampliar/reduzir',
        dragBackground: '👆 <strong>Arraste o fundo</strong> para mover',
        hoverNodes: '💬 <strong>Passe o mouse sobre nós</strong> para ver informações detalhadas',
        nodeSize: '📊 <strong>Tamanho do nó</strong> = métrica selecionada',
        color: '🎨 <strong>Cor</strong> = comunidade'
      },
      messages: {
        loadingNetworkData: 'Carregando dados da rede...',
        loadedNetwork: '✅ {name} carregada ({nodes} nós, {edges} arestas)',
        failedToLoadNetwork: '❌ Falha ao carregar rede: {error}',
        loadingUploadedFile: 'Carregando arquivo enviado...',
        loadedFile: '✅ {fileName} carregado ({nodes} nós, {edges} arestas)',
        failedToLoadFile: '❌ Falha ao carregar arquivo: {error}',
        analyzingNetwork: 'Analisando rede usando workers...',
        analysisComplete: '✅ Análise completa! Computadas {count} métricas de nós',
        analysisFailed: '❌ Análise falhou: {error}',
        usingD3Physics: 'ℹ️ Usando simulação de física D3 (sem algoritmo de layout)',
        applyingLayout: 'Aplicando layout {layout}...',
        appliedLayout: '✅ Layout {layout} aplicado',
        layoutFailed: '❌ Layout falhou: {error}',
        graphNotInitialized: 'Grafo não inicializado',
        graphIsEmpty: 'Grafo está vazio',
        detectingCommunities: 'Detectando comunidades usando {algorithm}...',
        foundCommunities: 'Encontradas {count} comunidades (modularidade: {modularity})',
        communityDetectionFailed: 'Detecção de comunidades falhou'
      }
    },
    family: {
      title: 'Árvore Genealógica',
      subtitle: 'Construa e visualize sua árvore genealógica interativamente',
      description: 'Visualize relações familiares',
      header: {
        title: '🌳 Construtor de Árvore Genealógica',
        subtitle: 'Construa e visualize sua árvore genealógica interativamente. Comece com você mesmo e adicione parentes para ver a rede crescer.'
      },
      whatIs: {
        title: 'O que é isso?',
        description: 'Uma visualização de rede de relações familiares. Cada cor representa um tipo de relação diferente. A árvore é salva automaticamente no armazenamento do seu navegador a cada 30 segundos.'
      },
      status: {
        title: 'Status',
        ready: 'Pronto para operações',
        clickToAdd: 'Clique nos botões para adicionar parentes'
      },
      addRelatives: {
        title: 'Adicionar Parentes',
        parents: '👨‍👩‍👧 Pais',
        grandparents: '👴👵 Avós',
        sibling: '👫 Irmã/Irmão',
        nieceNephew: '🧒 Sobrinha/Sobrinho',
        uncleAunt: '🧑‍🤝‍🧑 Tio/Tia',
        cousin: '👯 Primo/Prima',
        partner: '💑 Parceiro/Parceira',
        child: '👶 Filho/Filha'
      },
      actions: {
        title: 'Ações',
        saveFamily: '💾 Salvar Família',
        saveImage: '📸 Salvar como Imagem',
        lockGraph: '🔒 Bloquear Grafo',
        unlockGraph: '🔓 Desbloquear Grafo',
        undo: '↩️ Desfazer',
        redo: '↪️ Refazer',
        resetTree: '🗑️ Redefinir Árvore'
      },
      renderNodes: {
        title: '🎨 Renderizar Nós',
        colors: '🎨 Cores',
        avatars: '👤 Avatares',
        colorsDesc: 'Nós coloridos por tipo de relação.',
        avatarsDesc: 'Nós mostrados como avatares emoji (se definido).'
      },
      networkAnalysis: {
        title: '⚡ Análise de Rede (Tamanhos de Nó)'
      },
      relationshipColors: {
        title: 'Cores de Relação',
        you: 'Você',
        parents: 'Pais',
        siblings: 'Irmãos',
        unclesAunts: 'Tios/Tias',
        cousins: 'Primos/Primas',
        grandparents: 'Avós',
        nieces: 'Sobrinhas/Sobrinhos',
        partners: 'Parceiros/Parceiras',
        children: 'Filhos/Filhas'
      },
      layoutAlgorithm: {
        title: '🎯 Algoritmo de Layout'
      },
      instructions: {
        title: '💡 Como usar',
        dragNodes: '🖱️ <strong>Arraste nós</strong> para organizar sua árvore',
        autoSaves: '💾 <strong>Salva automaticamente</strong> a cada 30 segundos',
        lock: '🔒 <strong>Bloqueie</strong> para congelar posições',
        download: '📸 <strong>Baixe</strong> como imagem PNG',
        analyze: '⚡ <strong>Analise</strong> para dimensionar nós por métricas de centralidade',
        layouts: '🎯 <strong>Aplique layouts</strong> para visualizar sua árvore de forma diferente',
        undoRedo: '↩️ <strong>Desfazer/Refazer</strong> com botões ou Ctrl+Z / Ctrl+Y (até 10 ações)'
      },
      dialogs: {
        selectOption: 'Selecione uma opção',
        addParents: 'Adicionar Pais',
        addSibling: 'Adicionar Irmã/Irmão',
        addGrandparents: 'Adicionar Avós',
        addUncleAunt: 'Adicionar Tio/Tia',
        addCousin: 'Adicionar Primo/Prima',
        addChild: 'Adicionar Filho/Filha',
        addNieceNephew: 'Adicionar Sobrinha/Sobrinho',
        addPartner: 'Adicionar Parceiro/Parceira',
        fields: {
          motherName: 'Nome da Mãe',
          motherAvatar: 'Avatar da Mãe (opcional)',
          fatherName: 'Nome do Pai',
          fatherAvatar: 'Avatar do Pai (opcional)',
          siblingName: 'Nome do Irmã/Irmão',
          gender: 'Gênero',
          avatar: 'Avatar (opcional)',
          parentsSide: 'Lado do Pai/Mãe',
          grandmotherName: 'Nome da Avó',
          grandmotherAvatar: 'Avatar da Avó (opcional)',
          grandfatherName: 'Nome do Avô',
          grandfatherAvatar: 'Avatar do Avô (opcional)',
          name: 'Nome',
          uncleAuntField: 'Tio/Tia',
          sibling: 'Irmã/Irmão',
          parent: 'Pai/Mãe',
          partnerOf: 'Parceiro/Parceira De'
        },
        genderOptions: {
          male: 'Masculino',
          female: 'Feminino',
          other: 'Outro'
        },
        placeholders: {
          mother: '👩 Digite um emoji',
          father: '👨 Digite um emoji',
          avatar: '👤 Digite um emoji',
          grandmother: '👵 Digite um emoji',
          grandfather: '👴 Digite um emoji'
        }
      },
      operations: {
        errors: {
          atLeastOneParent: 'Pelo menos um nome de pai é necessário',
          onlyOneParentSlot: 'Apenas um slot de pai disponível. Adicionada apenas a mãe.',
          siblingNameRequired: 'Nome do irmã/irmão é obrigatório',
          genderRequired: 'Gênero é obrigatório',
          graphNotInitialized: 'Grafo não inicializado',
          failedToAddSibling: 'Falha ao adicionar irmã/irmão',
          parentNotFound: 'Pai/Mãe não encontrado',
          atLeastOneGrandparent: 'Pelo menos um nome de avó é necessário',
          onlyOneGrandparentSlot: 'Apenas um slot de avó disponível para este pai. Adicionada apenas a avó.',
          failedToAddGrandparents: 'Falha ao adicionar avós',
          uncleAuntNameRequired: 'Nome do tio/tia é obrigatório',
          failedToAddUncleAunt: 'Falha ao adicionar tio/tia',
          cousinNameRequired: 'Nome do primo/prima é obrigatório',
          failedToAddCousin: 'Falha ao adicionar primo/prima',
          childNameRequired: 'Nome do filho/filha é obrigatório',
          failedToAddChild: 'Falha ao adicionar filho/filha',
          nieceNephewNameRequired: 'Nome do sobrinha/sobrinho é obrigatório',
          failedToAddNieceNephew: 'Falha ao adicionar sobrinha/sobrinho',
          partnerNameRequired: 'Nome do parceiro/parceira é obrigatório',
          personNotFound: 'Pessoa não encontrada',
          alreadyHasPartner: 'já tem um parceiro/parceira!'
        },
        success: {
          parentAdded: 'Pais adicionados com sucesso',
          siblingAdded: 'Irmã(o) adicionado(a) com sucesso',
          grandparentsAdded: 'Avós adicionados com sucesso',
          uncleAuntAdded: 'Tio(a) adicionado(a) com sucesso',
          cousinAdded: 'Primo(a) adicionado(a) com sucesso',
          childAdded: 'Filho(a) adicionado(a) com sucesso',
          nieceNephewAdded: 'Sobrinho(a) adicionado(a) com sucesso',
          partnerAdded: 'Parceiro(a) adicionado(a) com sucesso'
        },
        validation: {
          noParents: 'Você deve adicionar pais primeiro antes de adicionar avós',
          noUnclesAunts: 'Você deve adicionar tios/tias primeiro antes de adicionar primos',
          noSiblings: 'Você deve adicionar irmãos primeiro antes de adicionar sobrinhos',
          maxParents: 'Você já tem 2 pais adicionados. Você não pode adicionar mais de 2 pais.',
          notEligibleForPartner: 'Nenhuma pessoa disponível para parceiros'
        }
      },
      storage: {
        saved: 'Árvore genealógica salva!',
        loaded: 'Árvore genealógica carregada',
        reset: 'Árvore genealógica redefinida',
        error: 'Erro ao salvar árvore genealógica'
      },
      history: {
        undone: 'Ação desfeita',
        redone: 'Ação refeita',
        nothingToUndo: 'Nada para desfazer',
        nothingToRedo: 'Nada para refazer'
      },
      relationships: {
        yourPartner: 'Seu Parceiro/Parceira',
        partnerOf: "'s Parceiro/Parceira",
        yourChild: 'Seu filho/filha',
        siblingChild: "'s filho/filha (seu sobrinha/sobrinho)",
        cousinChild: "'s filho/filha (filho/filha do seu primo/prima)",
        grandchild: "'s filho/filha (seu neto/neta)",
        siblingInLaw: "'s parceiro/parceira (seu cunhado/cunhada)",
        childInLaw: "'s parceiro/parceira (seu genro/nora)"
      },
      dropdownOptions: {
        yourChild: 'Seu filho/filha',
        childTemplate: 'Filho(a) de {name}',
        nieceNephewTemplate: 'Filho(a) de {name} (seu sobrinho(a))',
        cousinChildTemplate: 'Filho(a) de {name} (filho(a) do seu primo(a))',
        grandchildTemplate: 'Filho(a) de {name} (seu neto(a))',
        partnerTemplate: 'Parceiro(a) de {name}',
        siblingPartnerTemplate: 'Parceiro(a) de {name} (seu cunhado(a))',
        childPartnerTemplate: 'Parceiro(a) de {name} (seu genro/nora)',
        parentSideTemplate: 'Irmã(o) de {name}',
        uncleAuntChildTemplate: 'Filho(a) de {name}',
        siblingChildTemplate: 'Filho(a) de {name}'
      }
    }
  }
};

/**
 * Get translation for a specific language
 * @param {string} lang - Language code ('en' or 'pt')
 * @param {string} key - Translation key (e.g., 'nav.showcase')
 * @param {Object} replacements - Optional object with placeholder replacements
 * @returns {string} Translated text
 */
export function getTranslation(lang, key, replacements = {}) {
  const keys = key.split('.');
  let value = translations[lang];

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      log.warn('Translation not found', { key, lang });
      return key;
    }
  }

  // Replace placeholders like {name}, {count}, etc.
  if (typeof value === 'string' && Object.keys(replacements).length > 0) {
    return value.replace(/\{(\w+)\}/g, (match, placeholder) => {
      return replacements[placeholder] !== undefined ? replacements[placeholder] : match;
    });
  }

  return value;
}

/**
 * Legacy alias for getTranslation
 * @deprecated Use getTranslation instead
 */
export function t(lang, key) {
  return getTranslation(lang, key);
}
