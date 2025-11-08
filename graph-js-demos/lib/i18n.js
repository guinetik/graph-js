/**
 * Internationalization (i18n)
 * Translation strings for English and Portuguese
 */

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
        title: 'Lorem Ipsum Network Analysis',
        subtitle: 'Dolor sit amet consectetur adipiscing elit',
        description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation.',
        cta: 'Get Started',
        github: 'View on GitHub'
      },
      features: [
        {
          icon: '📊',
          title: 'Lorem Analytics',
          description: 'Consectetur adipiscing elit sed do eiusmod tempor incididunt'
        },
        {
          icon: '🔍',
          title: 'Ipsum Explorer',
          description: 'Ut labore et dolore magna aliqua enim ad minim veniam'
        },
        {
          icon: '🎨',
          title: 'Dolor Layouts',
          description: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip'
        },
        {
          icon: '⚡',
          title: 'Amet Performance',
          description: 'Ex ea commodo consequat duis aute irure dolor in reprehenderit'
        },
        {
          icon: '🔗',
          title: 'Sit Connections',
          description: 'Voluptate velit esse cillum dolore eu fugiat nulla pariatur'
        },
        {
          icon: '📈',
          title: 'Elit Statistics',
          description: 'Excepteur sint occaecat cupidatat non proident sunt in culpa'
        }
      ],
      code: {
        title: 'Lorem Ipsum Example',
        snippet: `npm install lorem-ipsum

import { Lorem } from 'lorem-ipsum';

const network = [
  { source: 'Dolor', target: 'Sit', weight: 1 },
  { source: 'Amet', target: 'Elit', weight: 2 }
];

const analyzer = new Lorem();
const results = analyzer.analyze(network);

console.log(results);`
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
        description: 'Main class for analyzing networks and calculating statistical metrics.',
        constructor: 'Constructor',
        constructorParams: {
          maxIter: 'Maximum iterations for algorithms (default: 100000)',
          verbose: 'Enable logging (default: true)'
        },
        analyze: {
          title: 'analyze() Method',
          description: 'Compute network statistics for all nodes'
        },
        features: {
          title: 'Available Features',
          degree: 'Number of connections per node',
          eigenvector: 'Influence based on connection quality (like PageRank)',
          betweenness: 'Bridge importance between groups',
          clustering: 'How densely connected neighbors are',
          cliques: 'Number of complete subgraphs containing the node',
          modularity: 'Community assignment (Louvain algorithm)'
        }
      },
      adapters: {
        description: 'Convert between various graph formats and the standard GraphData format.',
        csv: {
          title: 'CSVAdapter',
          description: 'Load and convert CSV files to graph format'
        },
        json: {
          title: 'JSONAdapter',
          description: 'Support for D3.js, Cytoscape, and other JSON formats'
        },
        networkx: {
          title: 'NetworkXAdapter',
          description: 'Python NetworkX interoperability'
        }
      },
      layouts: {
        description: 'Position nodes in 2D space using physics-based algorithms.',
        forceDirected: {
          title: 'ForceDirectedLayout',
          description: 'Spring-electrical model (Fruchterman-Reingold algorithm)',
          options: {
            width: 'Layout area width (default: 1000)',
            height: 'Layout area height (default: 1000)',
            iterations: 'Number of simulation steps (default: 100)',
            repulsion: 'Node repulsion strength (default: 50000)',
            attraction: 'Edge attraction strength (default: 0.1)'
          }
        },
        circular: {
          title: 'CircularLayout',
          description: 'Distance-based circular positioning'
        }
      },
      community: {
        description: 'Detect communities (clusters) in networks using various algorithms.',
        detector: {
          description: 'Main orchestrator class using Strategy Pattern'
        },
        louvain: {
          title: 'LouvainAlgorithm',
          description: 'Fast modularity optimization (Louvain method)'
        },
        customAlgorithm: {
          title: 'Custom Algorithms',
          description: 'Extend CommunityAlgorithm to create your own algorithms'
        }
      },
      examples: {
        csv: {
          title: 'Loading CSV Data',
          description: 'Import network data from CSV files'
        },
        layout: {
          title: 'Graph Layout',
          description: 'Position nodes using force-directed layout'
        },
        communityStrategy: {
          title: 'Community Detection (Strategy Pattern)',
          description: 'Use algorithm instances for community detection'
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
        eigenvectorLaplacian: 'Eigenvector (Laplacian) - for Spectral layout',
        nodeSizeLabel: 'Node Size Based On:',
        selectMetric: '-- Select a metric --',
        analyzeButton: '⚡ Analyze Network',
        analyzingButton: '⏳ Analyzing...',
        degreeName: 'Degree',
        betweennessName: 'Betweenness',
        clusteringName: 'Clustering',
        eigenvectorName: 'Eigenvector'
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
    },
    docs: {
      title: 'Documentation',
      description: 'Learn how to use @guinetik/graph-js'
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
        eigenvectorLaplacian: 'Eigenvector (Laplaciano) - para layout Espectral',
        nodeSizeLabel: 'Tamanho do Nó Baseado Em:',
        selectMetric: '-- Selecione uma métrica --',
        analyzeButton: '⚡ Analisar Rede',
        analyzingButton: '⏳ Analisando...',
        degreeName: 'Grau',
        betweennessName: 'Intermediação',
        clusteringName: 'Agrupamento',
        eigenvectorName: 'Eigenvector'
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
        title: 'Lorem Ipsum Análise de Redes',
        subtitle: 'Dolor sit amet consectetur adipiscing elit',
        description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation.',
        cta: 'Começar',
        github: 'Ver no GitHub'
      },
      features: [
        {
          icon: '📊',
          title: 'Lorem Análise',
          description: 'Consectetur adipiscing elit sed do eiusmod tempor incididunt'
        },
        {
          icon: '🔍',
          title: 'Ipsum Explorador',
          description: 'Ut labore et dolore magna aliqua enim ad minim veniam'
        },
        {
          icon: '🎨',
          title: 'Dolor Layouts',
          description: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip'
        },
        {
          icon: '⚡',
          title: 'Amet Performance',
          description: 'Ex ea commodo consequat duis aute irure dolor in reprehenderit'
        },
        {
          icon: '🔗',
          title: 'Sit Conexões',
          description: 'Voluptate velit esse cillum dolore eu fugiat nulla pariatur'
        },
        {
          icon: '📈',
          title: 'Elit Estatísticas',
          description: 'Excepteur sint occaecat cupidatat non proident sunt in culpa'
        }
      ],
      code: {
        title: 'Exemplo Lorem Ipsum',
        snippet: `npm install lorem-ipsum

import { Lorem } from 'lorem-ipsum';

const network = [
  { source: 'Dolor', target: 'Sit', weight: 1 },
  { source: 'Amet', target: 'Elit', weight: 2 }
];

const analyzer = new Lorem();
const results = analyzer.analyze(network);

console.log(results);`
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
        description: 'Classe principal para analisar redes e calcular métricas estatísticas.',
        constructor: 'Construtor',
        constructorParams: {
          maxIter: 'Máximo de iterações para algoritmos (padrão: 100000)',
          verbose: 'Ativar logging (padrão: true)'
        },
        analyze: {
          title: 'Método analyze()',
          description: 'Computar estatísticas de rede para todos os nós'
        },
        features: {
          title: 'Recursos Disponíveis',
          degree: 'Número de conexões por nó',
          eigenvector: 'Influência baseada na qualidade das conexões',
          betweenness: 'Importância de ponte entre grupos',
          clustering: 'Quão densamente conectados estão os vizinhos',
          cliques: 'Número de subgrafos completos contendo o nó',
          modularity: 'Atribuição de comunidade (algoritmo Louvain)'
        }
      },
      adapters: {
        description: 'Converter entre vários formatos de grafo.',
        csv: {
          title: 'CSVAdapter',
          description: 'Carregar e converter arquivos CSV para formato de grafo'
        },
        json: {
          title: 'JSONAdapter',
          description: 'Suporte para D3.js, Cytoscape e outros formatos JSON'
        },
        networkx: {
          title: 'NetworkXAdapter',
          description: 'Interoperabilidade com Python NetworkX'
        }
      },
      layouts: {
        description: 'Posicionar nós no espaço 2D usando algoritmos baseados em física.',
        forceDirected: {
          title: 'ForceDirectedLayout',
          description: 'Modelo spring-elétrico (algoritmo Fruchterman-Reingold)',
          options: {
            width: 'Largura da área de layout (padrão: 1000)',
            height: 'Altura da área de layout (padrão: 1000)',
            iterations: 'Número de passos de simulação (padrão: 100)',
            repulsion: 'Força de repulsão dos nós (padrão: 50000)',
            attraction: 'Força de atração das arestas (padrão: 0.1)'
          }
        },
        circular: {
          title: 'CircularLayout',
          description: 'Posicionamento circular baseado em distância'
        }
      },
      community: {
        description: 'Detectar comunidades (clusters) em redes usando vários algoritmos.',
        detector: {
          description: 'Classe orquestradora principal usando Strategy Pattern'
        },
        louvain: {
          title: 'LouvainAlgorithm',
          description: 'Otimização rápida de modularidade (método Louvain)'
        },
        customAlgorithm: {
          title: 'Algoritmos Personalizados',
          description: 'Estender CommunityAlgorithm para criar seus próprios algoritmos'
        }
      },
      examples: {
        csv: {
          title: 'Carregando Dados CSV',
          description: 'Importar dados de rede de arquivos CSV'
        },
        layout: {
          title: 'Layout de Grafo',
          description: 'Posicionar nós usando layout force-directed'
        },
        communityStrategy: {
          title: 'Detecção de Comunidades (Strategy Pattern)',
          description: 'Usar instâncias de algoritmo para detecção de comunidades'
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
    },
    docs: {
      title: 'Documentação',
      description: 'Aprenda a usar @guinetik/graph-js'
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
      console.warn(`Translation not found: ${key} (${lang})`);
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
