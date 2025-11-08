<template>
  <div class="page-content">
    <!-- Header -->
    <div class="section-header mb-12">
      <h1 class="text-5xl font-bold mb-4">{{ t('docs.title') }}</h1>
      <p class="section-description">{{ t('docs.subtitle') }}</p>
    </div>

    <!-- Table of Contents -->
    <div class="card mb-12 p-6">
      <h2 class="text-2xl font-bold mb-4">📚 Contents</h2>
      <div class="grid md:grid-cols-3 gap-4">
        <a href="#quick-start" class="flex items-center text-accent hover:underline">
          <span class="mr-2">🚀</span>
          <span>{{ t('docs.sections.quickStart') }}</span>
        </a>
        <a href="#core-classes" class="flex items-center text-accent hover:underline">
          <span class="mr-2">🧱</span>
          <span>{{ t('docs.sections.coreClasses') }}</span>
        </a>
        <a href="#adapters" class="flex items-center text-accent hover:underline">
          <span class="mr-2">🔄</span>
          <span>{{ t('docs.sections.adapters') }}</span>
        </a>
        <a href="#layouts" class="flex items-center text-accent hover:underline">
          <span class="mr-2">🎯</span>
          <span>{{ t('docs.sections.layouts') }}</span>
        </a>
        <a href="#community" class="flex items-center text-accent hover:underline">
          <span class="mr-2">🎨</span>
          <span>{{ t('docs.sections.community') }}</span>
        </a>
        <a href="#examples" class="flex items-center text-accent hover:underline">
          <span class="mr-2">💡</span>
          <span>{{ t('docs.sections.examples') }}</span>
        </a>
      </div>
    </div>

    <!-- Quick Start -->
    <section id="quick-start" class="mb-12">
      <h2 class="text-3xl font-bold mb-8 flex items-center">
        <span class="mr-3">🚀</span>
        <span>{{ t('docs.quickStart.title') }}</span>
      </h2>

      <div class="card p-8">
        <p class="text-secondary mb-6">{{ t('docs.quickStart.description') }}</p>

        <h3 class="text-xl font-bold text-accent mb-3">{{ t('docs.quickStart.install') }}</h3>
        <div class="bg-gray-900 rounded-lg p-4 mb-6">
          <code class="text-green-400">{{ t('docs.quickStart.installCmd') }}</code>
        </div>

        <h3 class="text-xl font-bold text-accent mb-3">{{ t('docs.quickStart.basicUsage') }}</h3>
        <CodeBlock :code="basicUsageCode" language="javascript" />
      </div>
    </section>

    <!-- Core Classes -->
    <section id="core-classes" class="mb-12">
      <h2 class="text-3xl font-bold mb-8 flex items-center">
        <span class="mr-3">🧱</span>
        <span>{{ t('docs.sections.coreClasses') }}</span>
      </h2>

      <!-- Graph Class -->
      <div class="card p-8 mb-8">
        <h3 class="text-2xl font-bold text-accent mb-4">{{ t('docs.graph.title') }}</h3>
        <p class="text-secondary mb-6">{{ t('docs.graph.description') }}</p>

        <div class="bg-gray-900 rounded-lg p-4 mb-6">
          <code class="text-sm text-gray-200">const graph = new Graph();</code>
        </div>

        <h4 class="text-xl font-bold mb-4">{{ t('docs.graph.methods') }}</h4>
        <div class="space-y-3">
          <div class="border-l-4 border-accent pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.graph.methodsList.addNode.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.graph.methodsList.addNode.description') }}</p>
          </div>
          <div class="border-l-4 border-accent pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.graph.methodsList.addNodesFrom.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.graph.methodsList.addNodesFrom.description') }}</p>
          </div>
          <div class="border-l-4 border-accent pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.graph.methodsList.addEdge.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.graph.methodsList.addEdge.description') }}</p>
          </div>
          <div class="border-l-4 border-accent pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.graph.methodsList.removeNode.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.graph.methodsList.removeNode.description') }}</p>
          </div>
          <div class="border-l-4 border-accent pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.graph.methodsList.getNeighbors.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.graph.methodsList.getNeighbors.description') }}</p>
          </div>
          <div class="border-l-4 border-accent pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.graph.methodsList.hasEdge.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.graph.methodsList.hasEdge.description') }}</p>
          </div>
          <div class="border-l-4 border-accent pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.graph.methodsList.numberOfNodes.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.graph.methodsList.numberOfNodes.description') }}</p>
          </div>
        </div>

        <CodeBlock :code="graphClassCode" language="javascript" />
      </div>

      <!-- NetworkStats Class -->
      <div class="card p-8">
        <h3 class="text-2xl font-bold text-accent mb-4">{{ t('docs.networkStats.title') }}</h3>
        <p class="text-secondary mb-6">{{ t('docs.networkStats.description') }}</p>

        <h4 class="text-xl font-bold mb-3">{{ t('docs.networkStats.constructor') }}</h4>
        <div class="bg-gray-900 rounded-lg p-4 mb-4">
          <code class="text-sm text-gray-200">new NetworkStats(options?)</code>
        </div>
        <ul class="list-disc pl-6 space-y-2 text-secondary mb-6">
          <li><code class="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-xs">maxIter:</code> {{ t('docs.networkStats.constructorParams.maxIter') }}</li>
          <li><code class="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-xs">verbose:</code> {{ t('docs.networkStats.constructorParams.verbose') }}</li>
        </ul>

        <h4 class="text-xl font-bold mb-3">{{ t('docs.networkStats.analyze.title') }}</h4>
        <p class="text-secondary mb-3">{{ t('docs.networkStats.analyze.description') }}</p>
        <div class="bg-gray-900 rounded-lg p-4 mb-4">
          <code class="text-sm text-gray-200">analyzer.analyze(network, features?)</code>
        </div>

        <h4 class="text-xl font-bold mb-3">{{ t('docs.networkStats.features.title') }}</h4>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="flex items-start">
            <span class="font-mono text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded mr-3">degree</span>
            <span class="text-secondary text-sm">{{ t('docs.networkStats.features.degree') }}</span>
          </div>
          <div class="flex items-start">
            <span class="font-mono text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded mr-3">eigenvector</span>
            <span class="text-secondary text-sm">{{ t('docs.networkStats.features.eigenvector') }}</span>
          </div>
          <div class="flex items-start">
            <span class="font-mono text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded mr-3">eigenvector-laplacian</span>
            <span class="text-secondary text-sm">{{ t('docs.networkStats.features.eigenvectorLaplacian') }}</span>
          </div>
          <div class="flex items-start">
            <span class="font-mono text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded mr-3">betweenness</span>
            <span class="text-secondary text-sm">{{ t('docs.networkStats.features.betweenness') }}</span>
          </div>
          <div class="flex items-start">
            <span class="font-mono text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded mr-3">clustering</span>
            <span class="text-secondary text-sm">{{ t('docs.networkStats.features.clustering') }}</span>
          </div>
          <div class="flex items-start">
            <span class="font-mono text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded mr-3">closeness</span>
            <span class="text-secondary text-sm">{{ t('docs.networkStats.features.closeness') }}</span>
          </div>
          <div class="flex items-start">
            <span class="font-mono text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded mr-3">cliques</span>
            <span class="text-secondary text-sm">{{ t('docs.networkStats.features.cliques') }}</span>
          </div>
          <div class="flex items-start">
            <span class="font-mono text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded mr-3">ego-density</span>
            <span class="text-secondary text-sm">{{ t('docs.networkStats.features.egoDensity') }}</span>
          </div>
          <div class="flex items-start">
            <span class="font-mono text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded mr-3">modularity</span>
            <span class="text-secondary text-sm">{{ t('docs.networkStats.features.modularity') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Data Adapters -->
    <section id="adapters" class="mb-12">
      <h2 class="text-3xl font-bold mb-8 flex items-center">
        <span class="mr-3">🔄</span>
        <span>{{ t('docs.adapters.title') }}</span>
      </h2>
      <p class="text-xl text-secondary mb-8">{{ t('docs.adapters.description') }}</p>

      <!-- CSV Adapter -->
      <div class="card p-8 mb-8">
        <h3 class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">{{ t('docs.adapters.csv.title') }}</h3>
        <p class="text-secondary mb-6">{{ t('docs.adapters.csv.description') }}</p>

        <h4 class="text-xl font-bold mb-4">{{ t('docs.adapters.csv.methods') }}</h4>
        <div class="space-y-3 mb-6">
          <div class="border-l-4 border-blue-500 pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.adapters.csv.methodsList.fromEdgeList.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.adapters.csv.methodsList.fromEdgeList.description') }}</p>
            <p class="text-xs text-accent mt-1">{{ t('docs.adapters.csv.methodsList.fromEdgeList.returns') }}</p>
          </div>
          <div class="border-l-4 border-blue-500 pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.adapters.csv.methodsList.fromNodes.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.adapters.csv.methodsList.fromNodes.description') }}</p>
            <p class="text-xs text-accent mt-1">{{ t('docs.adapters.csv.methodsList.fromNodes.returns') }}</p>
          </div>
          <div class="border-l-4 border-blue-500 pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.adapters.csv.methodsList.loadFromURL.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.adapters.csv.methodsList.loadFromURL.description') }}</p>
            <p class="text-xs text-accent mt-1">{{ t('docs.adapters.csv.methodsList.loadFromURL.returns') }}</p>
          </div>
          <div class="border-l-4 border-blue-500 pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.adapters.csv.methodsList.toEdgeList.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.adapters.csv.methodsList.toEdgeList.description') }}</p>
            <p class="text-xs text-accent mt-1">{{ t('docs.adapters.csv.methodsList.toEdgeList.returns') }}</p>
          </div>
          <div class="border-l-4 border-blue-500 pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.adapters.csv.methodsList.toNodes.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.adapters.csv.methodsList.toNodes.description') }}</p>
            <p class="text-xs text-accent mt-1">{{ t('docs.adapters.csv.methodsList.toNodes.returns') }}</p>
          </div>
        </div>

        <CodeBlock :code="csvAdapterCode" language="javascript" />
      </div>

      <!-- JSON Adapter -->
      <div class="card p-8 mb-8">
        <h3 class="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">{{ t('docs.adapters.json.title') }}</h3>
        <p class="text-secondary mb-6">{{ t('docs.adapters.json.description') }}</p>

        <h4 class="text-xl font-bold mb-4">{{ t('docs.adapters.json.methods') }}</h4>
        <div class="space-y-3 mb-6">
          <div class="border-l-4 border-green-500 pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.adapters.json.methodsList.fromD3.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.adapters.json.methodsList.fromD3.description') }}</p>
            <p class="text-xs text-accent mt-1">{{ t('docs.adapters.json.methodsList.fromD3.returns') }}</p>
          </div>
          <div class="border-l-4 border-green-500 pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.adapters.json.methodsList.fromCytoscape.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.adapters.json.methodsList.fromCytoscape.description') }}</p>
            <p class="text-xs text-accent mt-1">{{ t('docs.adapters.json.methodsList.fromCytoscape.returns') }}</p>
          </div>
          <div class="border-l-4 border-green-500 pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.adapters.json.methodsList.fromFormat.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.adapters.json.methodsList.fromFormat.description') }}</p>
            <p class="text-xs text-accent mt-1">{{ t('docs.adapters.json.methodsList.fromFormat.returns') }}</p>
          </div>
          <div class="border-l-4 border-green-500 pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.adapters.json.methodsList.toD3.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.adapters.json.methodsList.toD3.description') }}</p>
            <p class="text-xs text-accent mt-1">{{ t('docs.adapters.json.methodsList.toD3.returns') }}</p>
          </div>
          <div class="border-l-4 border-green-500 pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.adapters.json.methodsList.toCytoscape.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.adapters.json.methodsList.toCytoscape.description') }}</p>
            <p class="text-xs text-accent mt-1">{{ t('docs.adapters.json.methodsList.toCytoscape.returns') }}</p>
          </div>
          <div class="border-l-4 border-green-500 pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.adapters.json.methodsList.loadFromURL.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.adapters.json.methodsList.loadFromURL.description') }}</p>
            <p class="text-xs text-accent mt-1">{{ t('docs.adapters.json.methodsList.loadFromURL.returns') }}</p>
          </div>
        </div>

        <CodeBlock :code="jsonAdapterCode" language="javascript" />
      </div>

      <!-- NetworkX Adapter -->
      <div class="card p-8">
        <h3 class="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">{{ t('docs.adapters.networkx.title') }}</h3>
        <p class="text-secondary mb-6">{{ t('docs.adapters.networkx.description') }}</p>

        <h4 class="text-xl font-bold mb-4">{{ t('docs.adapters.networkx.methods') }}</h4>
        <div class="space-y-3 mb-6">
          <div class="border-l-4 border-yellow-500 pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.adapters.networkx.methodsList.fromNodeLink.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.adapters.networkx.methodsList.fromNodeLink.description') }}</p>
            <p class="text-xs text-accent mt-1">{{ t('docs.adapters.networkx.methodsList.fromNodeLink.returns') }}</p>
          </div>
          <div class="border-l-4 border-yellow-500 pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.adapters.networkx.methodsList.fromAdjacency.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.adapters.networkx.methodsList.fromAdjacency.description') }}</p>
            <p class="text-xs text-accent mt-1">{{ t('docs.adapters.networkx.methodsList.fromAdjacency.returns') }}</p>
          </div>
          <div class="border-l-4 border-yellow-500 pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.adapters.networkx.methodsList.toNodeLink.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.adapters.networkx.methodsList.toNodeLink.description') }}</p>
            <p class="text-xs text-accent mt-1">{{ t('docs.adapters.networkx.methodsList.toNodeLink.returns') }}</p>
          </div>
          <div class="border-l-4 border-yellow-500 pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.adapters.networkx.methodsList.toAdjacency.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.adapters.networkx.methodsList.toAdjacency.description') }}</p>
            <p class="text-xs text-accent mt-1">{{ t('docs.adapters.networkx.methodsList.toAdjacency.returns') }}</p>
          </div>
        </div>

        <CodeBlock :code="networkxAdapterCode" language="javascript" />
      </div>
    </section>

    <!-- Graph Layouts -->
    <section id="layouts" class="mb-12">
      <h2 class="text-3xl font-bold mb-8 flex items-center">
        <span class="mr-3">🎯</span>
        <span>{{ t('docs.layouts.title') }}</span>
      </h2>
      <p class="text-xl text-secondary mb-4">{{ t('docs.layouts.description') }}</p>
      <p class="text-sm text-accent mb-8">💡 {{ t('docs.layouts.note') }}</p>

      <!-- Force-Directed Layout -->
      <div class="card p-8 mb-8">
        <h3 class="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">{{ t('docs.layouts.forceDirected.title') }}</h3>
        <p class="text-secondary mb-2">{{ t('docs.layouts.forceDirected.description') }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ t('docs.layouts.forceDirected.complexity') }}</p>
        <p class="text-sm text-accent mb-4">{{ t('docs.layouts.forceDirected.bestFor') }}</p>

        <h4 class="text-lg font-bold mb-3">{{ t('docs.layouts.forceDirected.constructor') }}</h4>
        <div class="bg-gray-100 dark:bg-gray-900 p-4 rounded mb-4">
          <h5 class="font-semibold mb-2">Options:</h5>
          <ul class="space-y-1 text-sm">
            <li><code class="text-xs">iterations:</code> {{ t('docs.layouts.forceDirected.options.iterations') }}</li>
            <li><code class="text-xs">k:</code> {{ t('docs.layouts.forceDirected.options.k') }}</li>
            <li><code class="text-xs">scale:</code> {{ t('docs.layouts.forceDirected.options.scale') }}</li>
            <li><code class="text-xs">center:</code> {{ t('docs.layouts.forceDirected.options.center') }}</li>
            <li><code class="text-xs">initialPositions:</code> {{ t('docs.layouts.forceDirected.options.initialPositions') }}</li>
            <li><code class="text-xs">threshold:</code> {{ t('docs.layouts.forceDirected.options.threshold') }}</li>
          </ul>
        </div>

        <CodeBlock :code="forceLayoutCode" language="javascript" />
      </div>

      <!-- Kamada-Kawai Layout -->
      <div class="card p-8 mb-8">
        <h3 class="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">{{ t('docs.layouts.kamadaKawai.title') }}</h3>
        <p class="text-secondary mb-2">{{ t('docs.layouts.kamadaKawai.description') }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ t('docs.layouts.kamadaKawai.complexity') }}</p>
        <p class="text-sm text-accent mb-4">{{ t('docs.layouts.kamadaKawai.bestFor') }}</p>

        <h4 class="text-lg font-bold mb-3">{{ t('docs.layouts.kamadaKawai.constructor') }}</h4>
        <div class="bg-gray-100 dark:bg-gray-900 p-4 rounded mb-4">
          <h5 class="font-semibold mb-2">Options:</h5>
          <ul class="space-y-1 text-sm">
            <li><code class="text-xs">iterations:</code> {{ t('docs.layouts.kamadaKawai.options.iterations') }}</li>
            <li><code class="text-xs">scale:</code> {{ t('docs.layouts.kamadaKawai.options.scale') }}</li>
            <li><code class="text-xs">center:</code> {{ t('docs.layouts.kamadaKawai.options.center') }}</li>
            <li><code class="text-xs">initialPositions:</code> {{ t('docs.layouts.kamadaKawai.options.initialPositions') }}</li>
            <li><code class="text-xs">threshold:</code> {{ t('docs.layouts.kamadaKawai.options.threshold') }}</li>
            <li><code class="text-xs">K:</code> {{ t('docs.layouts.kamadaKawai.options.K') }}</li>
          </ul>
        </div>

        <CodeBlock :code="kamadaKawaiCode" language="javascript" />
      </div>

      <!-- Spectral Layout -->
      <div class="card p-8 mb-8">
        <h3 class="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-4">{{ t('docs.layouts.spectral.title') }}</h3>
        <p class="text-secondary mb-2">{{ t('docs.layouts.spectral.description') }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ t('docs.layouts.spectral.complexity') }}</p>
        <p class="text-sm text-accent mb-2">{{ t('docs.layouts.spectral.bestFor') }}</p>
        <p class="text-sm text-red-600 dark:text-red-400 mb-4">⚠️ {{ t('docs.layouts.spectral.requires') }}</p>

        <CodeBlock :code="spectralLayoutCode" language="javascript" />
      </div>

      <!-- Other Layouts Grid -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Circular -->
        <div class="card p-6">
          <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">{{ t('docs.layouts.circular.title') }}</h3>
          <p class="text-secondary text-sm mb-2">{{ t('docs.layouts.circular.description') }}</p>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">{{ t('docs.layouts.circular.complexity') }}</p>
          <p class="text-xs text-accent">{{ t('docs.layouts.circular.bestFor') }}</p>
        </div>

        <!-- Shell -->
        <div class="card p-6">
          <h3 class="text-xl font-bold text-green-600 dark:text-green-400 mb-3">{{ t('docs.layouts.shell.title') }}</h3>
          <p class="text-secondary text-sm mb-2">{{ t('docs.layouts.shell.description') }}</p>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">{{ t('docs.layouts.shell.complexity') }}</p>
          <p class="text-xs text-accent mb-1">{{ t('docs.layouts.shell.bestFor') }}</p>
          <p class="text-xs text-red-600 dark:text-red-400">⚠️ {{ t('docs.layouts.shell.requires') }}</p>
        </div>

        <!-- Spiral -->
        <div class="card p-6">
          <h3 class="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-3">{{ t('docs.layouts.spiral.title') }}</h3>
          <p class="text-secondary text-sm mb-2">{{ t('docs.layouts.spiral.description') }}</p>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">{{ t('docs.layouts.spiral.complexity') }}</p>
          <p class="text-xs text-accent">{{ t('docs.layouts.spiral.bestFor') }}</p>
        </div>

        <!-- BFS -->
        <div class="card p-6">
          <h3 class="text-xl font-bold text-red-600 dark:text-red-400 mb-3">{{ t('docs.layouts.bfs.title') }}</h3>
          <p class="text-secondary text-sm mb-2">{{ t('docs.layouts.bfs.description') }}</p>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">{{ t('docs.layouts.bfs.complexity') }}</p>
          <p class="text-xs text-accent">{{ t('docs.layouts.bfs.bestFor') }}</p>
        </div>

        <!-- Bipartite -->
        <div class="card p-6">
          <h3 class="text-xl font-bold text-teal-600 dark:text-teal-400 mb-3">{{ t('docs.layouts.bipartite.title') }}</h3>
          <p class="text-secondary text-sm mb-2">{{ t('docs.layouts.bipartite.description') }}</p>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">{{ t('docs.layouts.bipartite.complexity') }}</p>
          <p class="text-xs text-accent">{{ t('docs.layouts.bipartite.bestFor') }}</p>
        </div>

        <!-- Random -->
        <div class="card p-6">
          <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-3">{{ t('docs.layouts.random.title') }}</h3>
          <p class="text-secondary text-sm mb-2">{{ t('docs.layouts.random.description') }}</p>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">{{ t('docs.layouts.random.complexity') }}</p>
          <p class="text-xs text-accent">{{ t('docs.layouts.random.bestFor') }}</p>
        </div>
      </div>

      <!-- Usage Pattern -->
      <div class="card p-6 mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h4 class="text-lg font-bold mb-3">{{ t('docs.layouts.usage') }}</h4>
        <p class="text-sm text-secondary mb-3">{{ t('docs.layouts.usageDescription') }}</p>
        <CodeBlock :code="layoutUsageCode" language="javascript" />
      </div>
    </section>

    <!-- Community Detection -->
    <section id="community" class="mb-12">
      <h2 class="text-3xl font-bold mb-8 flex items-center">
        <span class="mr-3">🎨</span>
        <span>{{ t('docs.community.title') }}</span>
      </h2>
      <p class="text-xl text-secondary mb-8">{{ t('docs.community.description') }}</p>

      <!-- CommunityDetection Class -->
      <div class="card p-8 mb-8">
        <h3 class="text-2xl font-bold text-accent mb-4">{{ t('docs.community.mainClass.title') }}</h3>
        <p class="text-secondary mb-6">{{ t('docs.community.mainClass.description') }}</p>

        <h4 class="text-xl font-bold mb-3">{{ t('docs.community.mainClass.constructor') }}</h4>
        <div class="bg-gray-900 rounded-lg p-4 mb-6">
          <code class="text-sm text-gray-200">new CommunityDetection(graph)</code>
        </div>

        <h4 class="text-xl font-bold mb-4">Methods</h4>
        <div class="space-y-3 mb-6">
          <div class="border-l-4 border-accent pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.community.mainClass.methods.detectCommunities.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.community.mainClass.methods.detectCommunities.description') }}</p>
            <p class="text-xs text-accent mt-1">{{ t('docs.community.mainClass.methods.detectCommunities.returns') }}</p>
          </div>
          <div class="border-l-4 border-accent pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.community.mainClass.methods.calculateModularity.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.community.mainClass.methods.calculateModularity.description') }}</p>
            <p class="text-xs text-accent mt-1">{{ t('docs.community.mainClass.methods.calculateModularity.returns') }}</p>
          </div>
        </div>

        <h4 class="text-xl font-bold mb-4">Static Methods</h4>
        <div class="space-y-3">
          <div class="border-l-4 border-purple-500 pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.community.mainClass.staticMethods.detect.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.community.mainClass.staticMethods.detect.description') }}</p>
            <p class="text-xs text-accent mt-1">{{ t('docs.community.mainClass.staticMethods.detect.returns') }}</p>
          </div>
          <div class="border-l-4 border-purple-500 pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.community.mainClass.staticMethods.getNodesInCommunity.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.community.mainClass.staticMethods.getNodesInCommunity.description') }}</p>
          </div>
          <div class="border-l-4 border-purple-500 pl-4 py-2">
            <code class="text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{{ t('docs.community.mainClass.staticMethods.getCommunityGroups.name') }}</code>
            <p class="text-secondary text-sm mt-1">{{ t('docs.community.mainClass.staticMethods.getCommunityGroups.description') }}</p>
          </div>
        </div>
      </div>

      <!-- Louvain Algorithm -->
      <div class="card p-8 mb-8">
        <h3 class="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">{{ t('docs.community.louvain.title') }}</h3>
        <p class="text-secondary mb-2">{{ t('docs.community.louvain.description') }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ t('docs.community.louvain.complexity') }}</p>
        <p class="text-sm text-accent mb-6">{{ t('docs.community.louvain.bestFor') }}</p>

        <h4 class="text-lg font-bold mb-3">{{ t('docs.community.louvain.constructor') }}</h4>
        <div class="bg-gray-100 dark:bg-gray-900 p-4 rounded mb-4">
          <h5 class="font-semibold mb-2">Options:</h5>
          <ul class="space-y-1 text-sm">
            <li><code class="text-xs">resolution:</code> {{ t('docs.community.louvain.options.resolution') }}</li>
            <li><code class="text-xs">maxIterations:</code> {{ t('docs.community.louvain.options.maxIterations') }}</li>
          </ul>
        </div>

        <CodeBlock :code="communityDetectionCode" language="javascript" />
      </div>

      <!-- CommunityResult -->
      <div class="card p-8">
        <h3 class="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">{{ t('docs.community.result.title') }}</h3>
        <p class="text-secondary mb-6">{{ t('docs.community.result.description') }}</p>

        <div class="bg-gray-100 dark:bg-gray-900 p-4 rounded">
          <h5 class="font-semibold mb-3">Properties:</h5>
          <ul class="space-y-2 text-sm">
            <li><code class="text-xs">communities:</code> {{ t('docs.community.result.properties.communities') }}</li>
            <li><code class="text-xs">modularity:</code> {{ t('docs.community.result.properties.modularity') }}</li>
            <li><code class="text-xs">numCommunities:</code> {{ t('docs.community.result.properties.numCommunities') }}</li>
            <li><code class="text-xs">algorithm:</code> {{ t('docs.community.result.properties.algorithm') }}</li>
            <li><code class="text-xs">metadata:</code> {{ t('docs.community.result.properties.metadata') }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Usage Examples -->
    <section id="examples" class="mb-12">
      <h2 class="text-3xl font-bold mb-8 flex items-center">
        <span class="mr-3">💡</span>
        <span>{{ t('docs.examples.title') }}</span>
      </h2>
      <p class="text-xl text-secondary mb-8">{{ t('docs.examples.description') }}</p>

      <!-- Basic Analysis -->
      <div class="card p-8 mb-8">
        <h3 class="text-2xl font-bold text-accent mb-4">{{ t('docs.examples.basic.title') }}</h3>
        <p class="text-secondary mb-4">{{ t('docs.examples.basic.description') }}</p>

        <CodeBlock :code="basicAnalysisCode" language="javascript" />
      </div>

      <!-- CSV Loading -->
      <div class="card p-8 mb-8">
        <h3 class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">{{ t('docs.examples.csv.title') }}</h3>
        <p class="text-secondary mb-4">{{ t('docs.examples.csv.description') }}</p>

        <CodeBlock :code="csvExampleCode" language="javascript" />
      </div>

      <!-- Complete Workflow -->
      <div class="card p-8">
        <h3 class="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">{{ t('docs.examples.complete.title') }}</h3>
        <p class="text-secondary mb-4">{{ t('docs.examples.complete.description') }}</p>

        <CodeBlock :code="completeWorkflowCode" language="javascript" />
      </div>
    </section>

    <!-- Footer -->
    <div class="text-center pt-12 pb-6 border-t border-[var(--color-border)]">
      <p class="text-secondary">
        📚 For more details, check out the
        <a href="https://github.com/guinetik/graph-js"
           class="text-purple-600 dark:text-purple-400 hover:underline"
           target="_blank">
          GitHub repository
        </a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '../composables/useI18n';
import CodeBlock from '../components/CodeBlock.vue';

const { t } = useI18n();

// Code examples
const basicUsageCode = `import NetworkStats from '@guinetik/graph-js';

const network = [
  { source: 'Alice', target: 'Bob' },
  { source: 'Bob', target: 'Charlie' },
  { source: 'Charlie', target: 'Alice' }
];

const analyzer = new NetworkStats({ verbose: false });
const results = await analyzer.analyze(network, ['degree', 'eigenvector']);

console.log(results);
// [
//   { id: 'Alice', degree: 2, eigenvector: 0.577 },
//   { id: 'Bob', degree: 2, eigenvector: 0.577 },
//   { id: 'Charlie', degree: 2, eigenvector: 0.577 }
// ]`;

const graphClassCode = `import { Graph } from '@guinetik/graph-js';

const graph = new Graph();
graph.addNodesFrom(['A', 'B', 'C']);
graph.addEdge('A', 'B', 1);
graph.addEdge('B', 'C', 2);

console.log(graph.getNeighbors('B')); // ['A', 'C']
console.log(graph.numberOfNodes());    // 3
console.log(graph.numberOfEdges());    // 2`;

const csvAdapterCode = `import { CSVAdapter } from '@guinetik/graph-js';

// Load from URLs
const graphData = await CSVAdapter.loadFromURL(
  '../data/edges.csv',
  '../data/nodes.csv'
);

// Export to CSV
const edgesCSV = CSVAdapter.toEdgeList(graphData);
const nodesCSV = CSVAdapter.toNodes(graphData);`;

const jsonAdapterCode = `import { JSONAdapter } from '@guinetik/graph-js';

// Convert D3 format to GraphData
const graphData = JSONAdapter.fromD3(d3Data);

// Convert to Cytoscape format
const cytoData = JSONAdapter.toCytoscape(graphData);

// Auto-detect format
const data = JSONAdapter.fromFormat(unknownJSON);`;

const networkxAdapterCode = `import { NetworkXAdapter } from '@guinetik/graph-js';

// From Python: nx.node_link_data(G)
const graphData = NetworkXAdapter.fromNodeLink(nxData);

// To Python: G = nx.node_link_graph(nxData)
const nxData = NetworkXAdapter.toNodeLink(graphData, {
  directed: false,
  multigraph: false
});`;

const forceLayoutCode = `import { Graph, ForceDirectedLayout } from '@guinetik/graph-js';

const graph = new Graph();
graph.addNodesFrom(['A', 'B', 'C']);
graph.addEdge('A', 'B');
graph.addEdge('B', 'C');

const layout = new ForceDirectedLayout(graph, {
  iterations: 100,
  scale: 200
});
const positions = await layout.getPositions();
// { 'A': {x: 120, y: 45}, 'B': {x: -30, y: 90}, ... }`;

const kamadaKawaiCode = `import { KamadaKawaiLayout } from '@guinetik/graph-js';

const layout = new KamadaKawaiLayout(graph, {
  iterations: 100,
  scale: 200
});
const positions = await layout.getPositions();`;

const spectralLayoutCode = `import { NetworkStats, Graph, SpectralLayout } from '@guinetik/graph-js';

// First compute eigenvector-laplacian
const analyzer = new NetworkStats();
await analyzer.analyze(edges, ['eigenvector-laplacian']);

// Then apply layout
const layout = new SpectralLayout(graph, { scale: 200 });
const positions = await layout.getPositions();`;

const layoutUsageCode = `// All layouts follow this pattern
const layout = new SomeLayout(graph, options);
const positions = await layout.getPositions({
  onProgress: (progress) => console.log(\`\${progress * 100}%\`)
});`;

const communityDetectionCode = `import { CommunityDetection, LouvainAlgorithm } from '@guinetik/graph-js';

// Method 1: Direct detection from GraphData
const result = await CommunityDetection.detect(graphData, 'louvain', {
  resolution: 1.0,
  onProgress: (p) => console.log(\`\${Math.round(p * 100)}%\`)
});

// Method 2: Using algorithm instance
const detector = new CommunityDetection(graph);
const algorithm = new LouvainAlgorithm({ resolution: 1.0 });
const result = await detector.detectCommunities(algorithm);

console.log(result.communities);     // { 'A': 0, 'B': 0, 'C': 1 }
console.log(result.modularity);      // 0.42
console.log(result.numCommunities);  // 2`;

const basicAnalysisCode = `import NetworkStats from '@guinetik/graph-js';

const network = [
  { source: 'Alice', target: 'Bob', weight: 1 },
  { source: 'Bob', target: 'Carol', weight: 2 },
  { source: 'Carol', target: 'Dave', weight: 1 }
];

const analyzer = new NetworkStats({ verbose: true });
const results = await analyzer.analyze(network, ['degree', 'eigenvector', 'betweenness']);

console.log(results);
// [
//   { id: 'Alice', degree: 1, eigenvector: 0.34, betweenness: 0 },
//   { id: 'Bob', degree: 2, eigenvector: 0.58, betweenness: 0.67 },
//   ...
// ]

await analyzer.dispose(); // Cleanup workers`;

const csvExampleCode = `import { CSVAdapter } from '@guinetik/graph-js';
import NetworkStats from '@guinetik/graph-js';

// Load CSV data
const graphData = await CSVAdapter.loadFromURL(
  '../data/edges.csv',
  '../data/nodes.csv'
);

// Convert to edge list for analysis
const network = graphData.edges;

// Analyze
const analyzer = new NetworkStats();
const results = await analyzer.analyze(network, ['degree', 'clustering']);
await analyzer.dispose();`;

const completeWorkflowCode = `import NetworkStats, {
  CSVAdapter,
  Graph,
  KamadaKawaiLayout,
  CommunityDetection
} from '@guinetik/graph-js';

// 1. Load data
const graphData = await CSVAdapter.loadFromURL('../data/edges.csv');

// 2. Analyze network
const analyzer = new NetworkStats();
const nodeMetrics = await analyzer.analyze(graphData.edges, [
  'degree',
  'eigenvector',
  'betweenness'
]);

// 3. Apply layout
const graph = new Graph();
graphData.edges.forEach(e => {
  graph.addNode(e.source);
  graph.addNode(e.target);
  graph.addEdge(e.source, e.target, e.weight || 1);
});

const layout = new KamadaKawaiLayout(graph, { scale: 200 });
const positions = await layout.getPositions();

// 4. Detect communities
const communityResult = await CommunityDetection.detect(
  graphData,
  'louvain'
);

// 5. Combine results
const finalData = nodeMetrics.map(node => ({
  ...node,
  x: positions[node.id].x,
  y: positions[node.id].y,
  community: communityResult.communities[node.id]
}));

console.log('Analysis complete!', finalData);
console.log('Modularity:', communityResult.modularity);

await analyzer.dispose();`;
</script>
