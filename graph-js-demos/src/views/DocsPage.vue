<template>
  <div class="page-content">
    <!-- Header -->
    <div class="docs-page-header">
      <h1 class="docs-page-title">{{ t('docs.title') }}</h1>
      <p class="section-description">{{ t('docs.subtitle') }}</p>
    </div>

    <!-- Table of Contents -->
    <div class="docs-toc">
      <h2 class="docs-toc-title">📚 Contents</h2>
      <div class="docs-toc-grid">
        <a href="#quick-start" class="docs-toc-link">
          <span class="docs-toc-icon">🚀</span>
          <span>{{ t('docs.sections.quickStart') }}</span>
        </a>
        <a href="#core-classes" class="docs-toc-link">
          <span class="docs-toc-icon">🧱</span>
          <span>{{ t('docs.sections.coreClasses') }}</span>
        </a>
        <a href="#workers" class="docs-toc-link">
          <span class="docs-toc-icon">⚡</span>
          <span>{{ t('docs.sections.workers') }}</span>
        </a>
        <a href="#adapters" class="docs-toc-link">
          <span class="docs-toc-icon">🔄</span>
          <span>{{ t('docs.sections.adapters') }}</span>
        </a>
        <a href="#layouts" class="docs-toc-link">
          <span class="docs-toc-icon">🎯</span>
          <span>{{ t('docs.sections.layouts') }}</span>
        </a>
        <a href="#community" class="docs-toc-link">
          <span class="docs-toc-icon">🎨</span>
          <span>{{ t('docs.sections.community') }}</span>
        </a>
        <a href="#examples" class="docs-toc-link">
          <span class="docs-toc-icon">💡</span>
          <span>{{ t('docs.sections.examples') }}</span>
        </a>
      </div>
    </div>

    <!-- Quick Start -->
    <section id="quick-start" class="docs-section">
      <h2 class="docs-section-header">
        <span class="docs-section-header-icon">🚀</span>
        <span>{{ t('docs.quickStart.title') }}</span>
      </h2>

      <div class="docs-card">
        <p class="docs-card-description">{{ t('docs.quickStart.description') }}</p>

        <h3 class="docs-subsection-title-accent">{{ t('docs.quickStart.install') }}</h3>
        <div class="docs-code-block">
          <code class="docs-code-block-green">{{ t('docs.quickStart.installCmd') }}</code>
        </div>

        <h3 class="docs-subsection-title-accent">{{ t('docs.quickStart.basicUsage') }}</h3>
        <CodeBlock :code="basicUsageCode" language="javascript" />
      </div>
    </section>

    <!-- Core Classes -->
    <section id="core-classes" class="docs-section">
      <h2 class="docs-section-header">
        <span class="docs-section-header-icon">🧱</span>
        <span>{{ t('docs.sections.coreClasses') }}</span>
      </h2>

      <!-- Graph Class -->
      <div class="docs-card">
        <h3 class="docs-card-title">{{ t('docs.graph.title') }}</h3>
        <p class="docs-card-description">{{ t('docs.graph.description') }}</p>

        <div class="docs-code-block">
          <code class="docs-code-block-text">const graph = new Graph();</code>
        </div>

        <h4 class="docs-subsection-title">{{ t('docs.graph.methods') }}</h4>
        <div class="docs-method-list">
          <div class="docs-method-item">
            <code class="docs-method-name">{{ t('docs.graph.methodsList.addNode.name') }}</code>
            <p class="docs-method-description">{{ t('docs.graph.methodsList.addNode.description') }}</p>
          </div>
          <div class="docs-method-item">
            <code class="docs-method-name">{{ t('docs.graph.methodsList.addNodesFrom.name') }}</code>
            <p class="docs-method-description">{{ t('docs.graph.methodsList.addNodesFrom.description') }}</p>
          </div>
          <div class="docs-method-item">
            <code class="docs-method-name">{{ t('docs.graph.methodsList.addEdge.name') }}</code>
            <p class="docs-method-description">{{ t('docs.graph.methodsList.addEdge.description') }}</p>
          </div>
          <div class="docs-method-item">
            <code class="docs-method-name">{{ t('docs.graph.methodsList.removeNode.name') }}</code>
            <p class="docs-method-description">{{ t('docs.graph.methodsList.removeNode.description') }}</p>
          </div>
          <div class="docs-method-item">
            <code class="docs-method-name">{{ t('docs.graph.methodsList.getNeighbors.name') }}</code>
            <p class="docs-method-description">{{ t('docs.graph.methodsList.getNeighbors.description') }}</p>
          </div>
          <div class="docs-method-item">
            <code class="docs-method-name">{{ t('docs.graph.methodsList.hasEdge.name') }}</code>
            <p class="docs-method-description">{{ t('docs.graph.methodsList.hasEdge.description') }}</p>
          </div>
          <div class="docs-method-item">
            <code class="docs-method-name">{{ t('docs.graph.methodsList.numberOfNodes.name') }}</code>
            <p class="docs-method-description">{{ t('docs.graph.methodsList.numberOfNodes.description') }}</p>
          </div>
        </div>

        <CodeBlock :code="graphClassCode" language="javascript" />
      </div>

      <!-- NetworkStats Class -->
      <div class="docs-card">
        <h3 class="docs-card-title">{{ t('docs.networkStats.title') }}</h3>
        <p class="docs-card-description">{{ t('docs.networkStats.description') }}</p>

        <h4 class="docs-subsection-title">{{ t('docs.networkStats.constructor') }}</h4>
        <div class="docs-code-block">
          <code class="docs-code-block-text">new NetworkStats(options?)</code>
        </div>
        <ul class="list-disc pl-6 space-y-2 text-secondary mb-6">
          <li><code class="docs-code-inline-xs">maxIter:</code> {{ t('docs.networkStats.constructorParams.maxIter') }}</li>
          <li><code class="docs-code-inline-xs">verbose:</code> {{ t('docs.networkStats.constructorParams.verbose') }}</li>
        </ul>

        <h4 class="docs-subsection-title">{{ t('docs.networkStats.analyze.title') }}</h4>
        <p class="text-secondary mb-3">{{ t('docs.networkStats.analyze.description') }}</p>
        <div class="docs-code-block">
          <code class="docs-code-block-text">analyzer.analyze(network, features?)</code>
        </div>

        <h4 class="docs-subsection-title">{{ t('docs.networkStats.features.title') }}</h4>
        <div class="docs-feature-grid-item">
          <div class="docs-feature-item">
            <span class="docs-feature-badge">degree</span>
            <span class="docs-feature-description">{{ t('docs.networkStats.features.degree') }}</span>
          </div>
          <div class="docs-feature-item">
            <span class="docs-feature-badge">eigenvector</span>
            <span class="docs-feature-description">{{ t('docs.networkStats.features.eigenvector') }}</span>
          </div>
          <div class="docs-feature-item">
            <span class="docs-feature-badge">eigenvector-laplacian</span>
            <span class="docs-feature-description">{{ t('docs.networkStats.features.eigenvectorLaplacian') }}</span>
          </div>
          <div class="docs-feature-item">
            <span class="docs-feature-badge">betweenness</span>
            <span class="docs-feature-description">{{ t('docs.networkStats.features.betweenness') }}</span>
          </div>
          <div class="docs-feature-item">
            <span class="docs-feature-badge">clustering</span>
            <span class="docs-feature-description">{{ t('docs.networkStats.features.clustering') }}</span>
          </div>
          <div class="docs-feature-item">
            <span class="docs-feature-badge">closeness</span>
            <span class="docs-feature-description">{{ t('docs.networkStats.features.closeness') }}</span>
          </div>
          <div class="docs-feature-item">
            <span class="docs-feature-badge">cliques</span>
            <span class="docs-feature-description">{{ t('docs.networkStats.features.cliques') }}</span>
          </div>
          <div class="docs-feature-item">
            <span class="docs-feature-badge">ego-density</span>
            <span class="docs-feature-description">{{ t('docs.networkStats.features.egoDensity') }}</span>
          </div>
          <div class="docs-feature-item">
            <span class="docs-feature-badge">modularity</span>
            <span class="docs-feature-description">{{ t('docs.networkStats.features.modularity') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Worker Architecture -->
    <section id="workers" class="docs-section">
      <h2 class="docs-section-header">
        <span class="docs-section-header-icon">⚡</span>
        <span>{{ t('docs.workers.title') }}</span>
      </h2>
      <p class="docs-section-intro">{{ t('docs.workers.description') }}</p>

      <!-- Components -->
      <div class="docs-card">
        <h3 class="docs-card-title">{{ t('docs.workers.components.title') }}</h3>

        <div class="docs-method-list">
          <div class="docs-method-item">
            <code class="docs-method-name">{{ t('docs.workers.components.workerManager.name') }}</code>
            <p class="docs-method-description">{{ t('docs.workers.components.workerManager.description') }}</p>
          </div>
          <div class="docs-method-item">
            <code class="docs-method-name">{{ t('docs.workers.components.workerPool.name') }}</code>
            <p class="docs-method-description">{{ t('docs.workers.components.workerPool.description') }}</p>
          </div>
          <div class="docs-method-item">
            <code class="docs-method-name">{{ t('docs.workers.components.workerAdapter.name') }}</code>
            <p class="docs-method-description">{{ t('docs.workers.components.workerAdapter.description') }}</p>
          </div>
        </div>
      </div>

      <!-- Affinity System -->
      <div class="docs-card">
        <h3 class="docs-card-title-purple">{{ t('docs.workers.affinity.title') }}</h3>
        <p class="docs-card-description">{{ t('docs.workers.affinity.description') }}</p>

        <h4 class="docs-subsection-title">{{ t('docs.workers.affinity.howItWorks') }}</h4>
        <ul class="list-disc pl-6 space-y-2 text-secondary mb-6">
          <li v-for="(step, index) in t('docs.workers.affinity.howItWorksSteps')" :key="'how-'+index">{{ step }}</li>
        </ul>

        <h4 class="docs-subsection-title">{{ t('docs.workers.affinity.selectionTitle') }}</h4>
        <ul class="list-decimal pl-6 space-y-2 text-secondary mb-6">
          <li v-for="(step, index) in t('docs.workers.affinity.selectionSteps')" :key="'sel-'+index">{{ step }}</li>
        </ul>
      </div>

      <!-- Configuration -->
      <div class="docs-card">
        <h3 class="docs-card-title-green">{{ t('docs.workers.config.title') }}</h3>

        <CodeBlock :code="workerConfigCode" language="javascript" />

        <div class="docs-options-box mt-4">
          <h5 class="docs-options-title">Options:</h5>
          <ul class="docs-options-list">
            <li><code class="docs-options-code">maxWorkers:</code> {{ t('docs.workers.config.options.maxWorkers') }}</li>
            <li><code class="docs-options-code">enableAffinity:</code> {{ t('docs.workers.config.options.enableAffinity') }}</li>
            <li><code class="docs-options-code">affinityCacheLimit:</code> {{ t('docs.workers.config.options.affinityCacheLimit') }}</li>
            <li><code class="docs-options-code">taskTimeout:</code> {{ t('docs.workers.config.options.taskTimeout') }}</li>
          </ul>
        </div>
      </div>

      <!-- Monitoring -->
      <div class="docs-card">
        <h3 class="docs-card-title-blue">{{ t('docs.workers.monitoring.title') }}</h3>
        <p class="docs-card-description">{{ t('docs.workers.monitoring.description') }}</p>

        <CodeBlock :code="workerMonitoringCode" language="javascript" />
      </div>
    </section>

    <!-- Data Adapters -->
    <section id="adapters" class="docs-section">
      <h2 class="docs-section-header">
        <span class="docs-section-header-icon">🔄</span>
        <span>{{ t('docs.adapters.title') }}</span>
      </h2>
      <p class="docs-section-intro">{{ t('docs.adapters.description') }}</p>

      <!-- CSV Adapter -->
      <div class="docs-card">
        <h3 class="docs-card-title-blue">{{ t('docs.adapters.csv.title') }}</h3>
        <p class="docs-card-description">{{ t('docs.adapters.csv.description') }}</p>

        <h4 class="docs-subsection-title">{{ t('docs.adapters.csv.methods') }}</h4>
        <div class="docs-method-list">
          <div class="docs-method-item-blue">
            <code class="docs-method-name">{{ t('docs.adapters.csv.methodsList.fromEdgeList.name') }}</code>
            <p class="docs-method-description">{{ t('docs.adapters.csv.methodsList.fromEdgeList.description') }}</p>
            <p class="docs-method-returns">{{ t('docs.adapters.csv.methodsList.fromEdgeList.returns') }}</p>
          </div>
          <div class="docs-method-item-blue">
            <code class="docs-method-name">{{ t('docs.adapters.csv.methodsList.fromNodes.name') }}</code>
            <p class="docs-method-description">{{ t('docs.adapters.csv.methodsList.fromNodes.description') }}</p>
            <p class="docs-method-returns">{{ t('docs.adapters.csv.methodsList.fromNodes.returns') }}</p>
          </div>
          <div class="docs-method-item-blue">
            <code class="docs-method-name">{{ t('docs.adapters.csv.methodsList.loadFromURL.name') }}</code>
            <p class="docs-method-description">{{ t('docs.adapters.csv.methodsList.loadFromURL.description') }}</p>
            <p class="docs-method-returns">{{ t('docs.adapters.csv.methodsList.loadFromURL.returns') }}</p>
          </div>
          <div class="docs-method-item-blue">
            <code class="docs-method-name">{{ t('docs.adapters.csv.methodsList.toEdgeList.name') }}</code>
            <p class="docs-method-description">{{ t('docs.adapters.csv.methodsList.toEdgeList.description') }}</p>
            <p class="docs-method-returns">{{ t('docs.adapters.csv.methodsList.toEdgeList.returns') }}</p>
          </div>
          <div class="docs-method-item-blue">
            <code class="docs-method-name">{{ t('docs.adapters.csv.methodsList.toNodes.name') }}</code>
            <p class="docs-method-description">{{ t('docs.adapters.csv.methodsList.toNodes.description') }}</p>
            <p class="docs-method-returns">{{ t('docs.adapters.csv.methodsList.toNodes.returns') }}</p>
          </div>
        </div>

        <CodeBlock :code="csvAdapterCode" language="javascript" />
      </div>

      <!-- JSON Adapter -->
      <div class="docs-card">
        <h3 class="docs-card-title-green">{{ t('docs.adapters.json.title') }}</h3>
        <p class="docs-card-description">{{ t('docs.adapters.json.description') }}</p>

        <h4 class="docs-subsection-title">{{ t('docs.adapters.json.methods') }}</h4>
        <div class="docs-method-list">
          <div class="docs-method-item-green">
            <code class="docs-method-name">{{ t('docs.adapters.json.methodsList.fromD3.name') }}</code>
            <p class="docs-method-description">{{ t('docs.adapters.json.methodsList.fromD3.description') }}</p>
            <p class="docs-method-returns">{{ t('docs.adapters.json.methodsList.fromD3.returns') }}</p>
          </div>
          <div class="docs-method-item-green">
            <code class="docs-method-name">{{ t('docs.adapters.json.methodsList.fromCytoscape.name') }}</code>
            <p class="docs-method-description">{{ t('docs.adapters.json.methodsList.fromCytoscape.description') }}</p>
            <p class="docs-method-returns">{{ t('docs.adapters.json.methodsList.fromCytoscape.returns') }}</p>
          </div>
          <div class="docs-method-item-green">
            <code class="docs-method-name">{{ t('docs.adapters.json.methodsList.fromFormat.name') }}</code>
            <p class="docs-method-description">{{ t('docs.adapters.json.methodsList.fromFormat.description') }}</p>
            <p class="docs-method-returns">{{ t('docs.adapters.json.methodsList.fromFormat.returns') }}</p>
          </div>
          <div class="docs-method-item-green">
            <code class="docs-method-name">{{ t('docs.adapters.json.methodsList.toD3.name') }}</code>
            <p class="docs-method-description">{{ t('docs.adapters.json.methodsList.toD3.description') }}</p>
            <p class="docs-method-returns">{{ t('docs.adapters.json.methodsList.toD3.returns') }}</p>
          </div>
          <div class="docs-method-item-green">
            <code class="docs-method-name">{{ t('docs.adapters.json.methodsList.toCytoscape.name') }}</code>
            <p class="docs-method-description">{{ t('docs.adapters.json.methodsList.toCytoscape.description') }}</p>
            <p class="docs-method-returns">{{ t('docs.adapters.json.methodsList.toCytoscape.returns') }}</p>
          </div>
          <div class="docs-method-item-green">
            <code class="docs-method-name">{{ t('docs.adapters.json.methodsList.loadFromURL.name') }}</code>
            <p class="docs-method-description">{{ t('docs.adapters.json.methodsList.loadFromURL.description') }}</p>
            <p class="docs-method-returns">{{ t('docs.adapters.json.methodsList.loadFromURL.returns') }}</p>
          </div>
        </div>

        <CodeBlock :code="jsonAdapterCode" language="javascript" />
      </div>

      <!-- NetworkX Adapter -->
      <div class="docs-card">
        <h3 class="docs-card-title-yellow">{{ t('docs.adapters.networkx.title') }}</h3>
        <p class="docs-card-description">{{ t('docs.adapters.networkx.description') }}</p>

        <h4 class="docs-subsection-title">{{ t('docs.adapters.networkx.methods') }}</h4>
        <div class="docs-method-list">
          <div class="docs-method-item-yellow">
            <code class="docs-method-name">{{ t('docs.adapters.networkx.methodsList.fromNodeLink.name') }}</code>
            <p class="docs-method-description">{{ t('docs.adapters.networkx.methodsList.fromNodeLink.description') }}</p>
            <p class="docs-method-returns">{{ t('docs.adapters.networkx.methodsList.fromNodeLink.returns') }}</p>
          </div>
          <div class="docs-method-item-yellow">
            <code class="docs-method-name">{{ t('docs.adapters.networkx.methodsList.fromAdjacency.name') }}</code>
            <p class="docs-method-description">{{ t('docs.adapters.networkx.methodsList.fromAdjacency.description') }}</p>
            <p class="docs-method-returns">{{ t('docs.adapters.networkx.methodsList.fromAdjacency.returns') }}</p>
          </div>
          <div class="docs-method-item-yellow">
            <code class="docs-method-name">{{ t('docs.adapters.networkx.methodsList.toNodeLink.name') }}</code>
            <p class="docs-method-description">{{ t('docs.adapters.networkx.methodsList.toNodeLink.description') }}</p>
            <p class="docs-method-returns">{{ t('docs.adapters.networkx.methodsList.toNodeLink.returns') }}</p>
          </div>
          <div class="docs-method-item-yellow">
            <code class="docs-method-name">{{ t('docs.adapters.networkx.methodsList.toAdjacency.name') }}</code>
            <p class="docs-method-description">{{ t('docs.adapters.networkx.methodsList.toAdjacency.description') }}</p>
            <p class="docs-method-returns">{{ t('docs.adapters.networkx.methodsList.toAdjacency.returns') }}</p>
          </div>
        </div>

        <CodeBlock :code="networkxAdapterCode" language="javascript" />
      </div>
    </section>

    <!-- Graph Layouts -->
    <section id="layouts" class="docs-section">
      <h2 class="docs-section-header">
        <span class="docs-section-header-icon">🎯</span>
        <span>{{ t('docs.layouts.title') }}</span>
      </h2>
      <p class="docs-section-intro">{{ t('docs.layouts.description') }}</p>
      <p class="docs-note">💡 {{ t('docs.layouts.note') }}</p>

      <!-- Force-Directed Layout -->
      <div class="docs-card">
        <h3 class="docs-card-title-purple">{{ t('docs.layouts.forceDirected.title') }}</h3>
        <p class="text-secondary mb-2">{{ t('docs.layouts.forceDirected.description') }}</p>
        <p class="docs-complexity">{{ t('docs.layouts.forceDirected.complexity') }}</p>
        <p class="docs-best-for">{{ t('docs.layouts.forceDirected.bestFor') }}</p>

        <h4 class="docs-subsection-title-lg">{{ t('docs.layouts.forceDirected.constructor') }}</h4>
        <div class="docs-options-box">
          <h5 class="docs-options-title">Options:</h5>
          <ul class="docs-options-list">
            <li><code class="docs-options-code">iterations:</code> {{ t('docs.layouts.forceDirected.options.iterations') }}</li>
            <li><code class="docs-options-code">k:</code> {{ t('docs.layouts.forceDirected.options.k') }}</li>
            <li><code class="docs-options-code">scale:</code> {{ t('docs.layouts.forceDirected.options.scale') }}</li>
            <li><code class="docs-options-code">center:</code> {{ t('docs.layouts.forceDirected.options.center') }}</li>
            <li><code class="docs-options-code">initialPositions:</code> {{ t('docs.layouts.forceDirected.options.initialPositions') }}</li>
            <li><code class="docs-options-code">threshold:</code> {{ t('docs.layouts.forceDirected.options.threshold') }}</li>
          </ul>
        </div>

        <CodeBlock :code="forceLayoutCode" language="javascript" />
      </div>

      <!-- Kamada-Kawai Layout -->
      <div class="docs-card">
        <h3 class="docs-card-title-indigo">{{ t('docs.layouts.kamadaKawai.title') }}</h3>
        <p class="text-secondary mb-2">{{ t('docs.layouts.kamadaKawai.description') }}</p>
        <p class="docs-complexity">{{ t('docs.layouts.kamadaKawai.complexity') }}</p>
        <p class="docs-best-for">{{ t('docs.layouts.kamadaKawai.bestFor') }}</p>

        <h4 class="docs-subsection-title-lg">{{ t('docs.layouts.kamadaKawai.constructor') }}</h4>
        <div class="docs-options-box">
          <h5 class="docs-options-title">Options:</h5>
          <ul class="docs-options-list">
            <li><code class="docs-options-code">iterations:</code> {{ t('docs.layouts.kamadaKawai.options.iterations') }}</li>
            <li><code class="docs-options-code">scale:</code> {{ t('docs.layouts.kamadaKawai.options.scale') }}</li>
            <li><code class="docs-options-code">center:</code> {{ t('docs.layouts.kamadaKawai.options.center') }}</li>
            <li><code class="docs-options-code">initialPositions:</code> {{ t('docs.layouts.kamadaKawai.options.initialPositions') }}</li>
            <li><code class="docs-options-code">threshold:</code> {{ t('docs.layouts.kamadaKawai.options.threshold') }}</li>
            <li><code class="docs-options-code">K:</code> {{ t('docs.layouts.kamadaKawai.options.K') }}</li>
          </ul>
        </div>

        <CodeBlock :code="kamadaKawaiCode" language="javascript" />
      </div>

      <!-- Spectral Layout -->
      <div class="docs-card">
        <h3 class="docs-card-title-pink">{{ t('docs.layouts.spectral.title') }}</h3>
        <p class="text-secondary mb-2">{{ t('docs.layouts.spectral.description') }}</p>
        <p class="docs-complexity">{{ t('docs.layouts.spectral.complexity') }}</p>
        <p class="text-sm text-accent mb-2">{{ t('docs.layouts.spectral.bestFor') }}</p>
        <p class="docs-warning">⚠️ {{ t('docs.layouts.spectral.requires') }}</p>

        <CodeBlock :code="spectralLayoutCode" language="javascript" />
      </div>

      <!-- Other Layouts Grid -->
      <div class="docs-feature-grid">
        <!-- Circular -->
        <div class="docs-card-compact">
          <h3 class="docs-card-title-sm text-blue-600 dark:text-blue-400">{{ t('docs.layouts.circular.title') }}</h3>
          <p class="docs-feature-description mb-2">{{ t('docs.layouts.circular.description') }}</p>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">{{ t('docs.layouts.circular.complexity') }}</p>
          <p class="text-xs text-accent">{{ t('docs.layouts.circular.bestFor') }}</p>
        </div>

        <!-- Shell -->
        <div class="docs-card-compact">
          <h3 class="docs-card-title-sm text-green-600 dark:text-green-400">{{ t('docs.layouts.shell.title') }}</h3>
          <p class="docs-feature-description mb-2">{{ t('docs.layouts.shell.description') }}</p>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">{{ t('docs.layouts.shell.complexity') }}</p>
          <p class="text-xs text-accent mb-1">{{ t('docs.layouts.shell.bestFor') }}</p>
          <p class="text-xs text-red-600 dark:text-red-400">⚠️ {{ t('docs.layouts.shell.requires') }}</p>
        </div>

        <!-- Spiral -->
        <div class="docs-card-compact">
          <h3 class="docs-card-title-sm text-yellow-600 dark:text-yellow-400">{{ t('docs.layouts.spiral.title') }}</h3>
          <p class="docs-feature-description mb-2">{{ t('docs.layouts.spiral.description') }}</p>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">{{ t('docs.layouts.spiral.complexity') }}</p>
          <p class="text-xs text-accent">{{ t('docs.layouts.spiral.bestFor') }}</p>
        </div>

        <!-- BFS -->
        <div class="docs-card-compact">
          <h3 class="docs-card-title-sm text-red-600 dark:text-red-400">{{ t('docs.layouts.bfs.title') }}</h3>
          <p class="docs-feature-description mb-2">{{ t('docs.layouts.bfs.description') }}</p>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">{{ t('docs.layouts.bfs.complexity') }}</p>
          <p class="text-xs text-accent">{{ t('docs.layouts.bfs.bestFor') }}</p>
        </div>

        <!-- Bipartite -->
        <div class="docs-card-compact">
          <h3 class="docs-card-title-sm text-teal-600 dark:text-teal-400">{{ t('docs.layouts.bipartite.title') }}</h3>
          <p class="docs-feature-description mb-2">{{ t('docs.layouts.bipartite.description') }}</p>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">{{ t('docs.layouts.bipartite.complexity') }}</p>
          <p class="text-xs text-accent">{{ t('docs.layouts.bipartite.bestFor') }}</p>
        </div>

        <!-- Random -->
        <div class="docs-card-compact">
          <h3 class="docs-card-title-sm text-gray-600 dark:text-gray-400">{{ t('docs.layouts.random.title') }}</h3>
          <p class="docs-feature-description mb-2">{{ t('docs.layouts.random.description') }}</p>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">{{ t('docs.layouts.random.complexity') }}</p>
          <p class="text-xs text-accent">{{ t('docs.layouts.random.bestFor') }}</p>
        </div>
      </div>

      <!-- Usage Pattern -->
      <div class="docs-tip-box">
        <h4 class="docs-subsection-title-lg">{{ t('docs.layouts.usage') }}</h4>
        <p class="text-sm text-secondary mb-3">{{ t('docs.layouts.usageDescription') }}</p>
        <CodeBlock :code="layoutUsageCode" language="javascript" />
      </div>
    </section>

    <!-- Community Detection -->
    <section id="community" class="docs-section">
      <h2 class="docs-section-header">
        <span class="docs-section-header-icon">🎨</span>
        <span>{{ t('docs.community.title') }}</span>
      </h2>
      <p class="docs-section-intro">{{ t('docs.community.description') }}</p>

      <!-- CommunityDetection Class -->
      <div class="docs-card">
        <h3 class="docs-card-title">{{ t('docs.community.mainClass.title') }}</h3>
        <p class="docs-card-description">{{ t('docs.community.mainClass.description') }}</p>

        <h4 class="docs-subsection-title">{{ t('docs.community.mainClass.constructor') }}</h4>
        <div class="docs-code-block">
          <code class="docs-code-block-text">new CommunityDetection(graph)</code>
        </div>

        <h4 class="docs-subsection-title">Methods</h4>
        <div class="docs-method-list">
          <div class="docs-method-item">
            <code class="docs-method-name">{{ t('docs.community.mainClass.methods.detectCommunities.name') }}</code>
            <p class="docs-method-description">{{ t('docs.community.mainClass.methods.detectCommunities.description') }}</p>
            <p class="docs-method-returns">{{ t('docs.community.mainClass.methods.detectCommunities.returns') }}</p>
          </div>
          <div class="docs-method-item">
            <code class="docs-method-name">{{ t('docs.community.mainClass.methods.calculateModularity.name') }}</code>
            <p class="docs-method-description">{{ t('docs.community.mainClass.methods.calculateModularity.description') }}</p>
            <p class="docs-method-returns">{{ t('docs.community.mainClass.methods.calculateModularity.returns') }}</p>
          </div>
        </div>

        <h4 class="docs-subsection-title">Static Methods</h4>
        <div class="docs-method-list">
          <div class="docs-method-item-purple">
            <code class="docs-method-name">{{ t('docs.community.mainClass.staticMethods.detect.name') }}</code>
            <p class="docs-method-description">{{ t('docs.community.mainClass.staticMethods.detect.description') }}</p>
            <p class="docs-method-returns">{{ t('docs.community.mainClass.staticMethods.detect.returns') }}</p>
          </div>
          <div class="docs-method-item-purple">
            <code class="docs-method-name">{{ t('docs.community.mainClass.staticMethods.getNodesInCommunity.name') }}</code>
            <p class="docs-method-description">{{ t('docs.community.mainClass.staticMethods.getNodesInCommunity.description') }}</p>
          </div>
          <div class="docs-method-item-purple">
            <code class="docs-method-name">{{ t('docs.community.mainClass.staticMethods.getCommunityGroups.name') }}</code>
            <p class="docs-method-description">{{ t('docs.community.mainClass.staticMethods.getCommunityGroups.description') }}</p>
          </div>
        </div>
      </div>

      <!-- Louvain Algorithm -->
      <div class="docs-card">
        <h3 class="docs-card-title-orange">{{ t('docs.community.louvain.title') }}</h3>
        <p class="text-secondary mb-2">{{ t('docs.community.louvain.description') }}</p>
        <p class="docs-complexity">{{ t('docs.community.louvain.complexity') }}</p>
        <p class="docs-card-description">{{ t('docs.community.louvain.bestFor') }}</p>

        <h4 class="docs-subsection-title-lg">{{ t('docs.community.louvain.constructor') }}</h4>
        <div class="docs-options-box">
          <h5 class="docs-options-title">Options:</h5>
          <ul class="docs-options-list">
            <li><code class="docs-options-code">resolution:</code> {{ t('docs.community.louvain.options.resolution') }}</li>
            <li><code class="docs-options-code">maxIterations:</code> {{ t('docs.community.louvain.options.maxIterations') }}</li>
          </ul>
        </div>

        <CodeBlock :code="communityDetectionCode" language="javascript" />
      </div>

      <!-- CommunityResult -->
      <div class="docs-card">
        <h3 class="docs-card-title-green">{{ t('docs.community.result.title') }}</h3>
        <p class="docs-card-description">{{ t('docs.community.result.description') }}</p>

        <div class="docs-options-box">
          <h5 class="docs-options-title">Properties:</h5>
          <ul class="docs-options-list space-y-2">
            <li><code class="docs-options-code">communities:</code> {{ t('docs.community.result.properties.communities') }}</li>
            <li><code class="docs-options-code">modularity:</code> {{ t('docs.community.result.properties.modularity') }}</li>
            <li><code class="docs-options-code">numCommunities:</code> {{ t('docs.community.result.properties.numCommunities') }}</li>
            <li><code class="docs-options-code">algorithm:</code> {{ t('docs.community.result.properties.algorithm') }}</li>
            <li><code class="docs-options-code">metadata:</code> {{ t('docs.community.result.properties.metadata') }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Usage Examples -->
    <section id="examples" class="docs-section">
      <h2 class="docs-section-header">
        <span class="docs-section-header-icon">💡</span>
        <span>{{ t('docs.examples.title') }}</span>
      </h2>
      <p class="docs-section-intro">{{ t('docs.examples.description') }}</p>

      <!-- Basic Analysis -->
      <div class="docs-card">
        <h3 class="docs-card-title">{{ t('docs.examples.basic.title') }}</h3>
        <p class="text-secondary mb-4">{{ t('docs.examples.basic.description') }}</p>

        <CodeBlock :code="basicAnalysisCode" language="javascript" />
      </div>

      <!-- CSV Loading -->
      <div class="docs-card">
        <h3 class="docs-card-title-blue">{{ t('docs.examples.csv.title') }}</h3>
        <p class="text-secondary mb-4">{{ t('docs.examples.csv.description') }}</p>

        <CodeBlock :code="csvExampleCode" language="javascript" />
      </div>

      <!-- Complete Workflow -->
      <div class="docs-card">
        <h3 class="docs-card-title-purple">{{ t('docs.examples.complete.title') }}</h3>
        <p class="text-secondary mb-4">{{ t('docs.examples.complete.description') }}</p>

        <CodeBlock :code="completeWorkflowCode" language="javascript" />
      </div>
    </section>

    <!-- Footer -->
    <div class="docs-footer">
      <p class="text-secondary">
        📚 For more details, check out the
        <a href="https://github.com/guinetik/graph-js"
           class="docs-footer-link"
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

// Worker configuration code
const workerConfigCode = `import NetworkStats from '@guinetik/graph-js';

const analyzer = new NetworkStats({
  maxWorkers: 4,              // Max workers (default: auto-detect)
  enableAffinity: true,       // Enable worker affinity (default: true)
  affinityCacheLimit: 50,     // Max cached functions per worker
  taskTimeout: 300000,        // 5 minute timeout
  verbose: true               // See affinity logs: 🎯 hits, 📦 updates
});

// Run analysis - affinity routing happens automatically
const results = await analyzer.analyze(network, ['degree', 'eigenvector']);

// Cleanup when done
await analyzer.dispose();`;

// Worker monitoring code
const workerMonitoringCode = `import WorkerManager from '@guinetik/graph-js';

// Get pool status
const status = WorkerManager.getStatus();
console.log(\`Workers: \${status.availableWorkers}/\${status.totalWorkers}\`);
console.log(\`Affinity hit rate: \${(status.affinity.hitRate * 100).toFixed(1)}%\`);

// Get detailed affinity stats
const stats = WorkerManager.getAffinityStats();
console.log(\`Hits: \${stats.hits}, Misses: \${stats.misses}\`);

// Per-worker cache info
stats.workerCaches.forEach(w => {
  console.log(\`Worker \${w.workerId}: \${w.cachedFunctions.length} cached\`);
  console.log(\`  Functions: \${w.cachedFunctions.join(', ')}\`);
});`;

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
