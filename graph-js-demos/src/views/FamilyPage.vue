<template>
  <div class="family-page">
  <DemoLayout>
    <template #controls>
      <!-- Header -->
      <div class="demo-controls-header">
        <h1 class="demo-controls-title">
          {{ t('family.header.title') }}
        </h1>
        <p class="demo-controls-description">
          {{ t('family.header.subtitle') }}
        </p>
      </div>

      <!-- What is this? -->
      <div class="info-box-green mb-4">
        <h2 class="info-box-title-green">
          {{ t('family.whatIs.title') }}
        </h2>
        <p class="info-box-text-green">
          {{ t('family.whatIs.description') }}
        </p>
      </div>

      <!-- Status Section -->
      <div class="status-section">
        <h2 class="demo-controls-section-title mb-3">{{ t('family.status.title') }}</h2>

        <div class="status-box">
          <div v-if="!statusMessage" class="status-empty">
            <div class="text-xs">{{ t('family.status.ready') }}</div>
            <div class="text-xs mt-1 opacity-60">{{ t('family.status.clickToAdd') }}</div>
          </div>
          <div v-else class="space-y-2">
            <div :class="{
              'status-message-success': statusType === 'success',
              'status-message-error': statusType === 'error',
              'status-message-info': statusType === 'info'
            }">
              <div class="status-icon">
                <span v-if="statusType === 'success'">✅</span>
                <span v-else-if="statusType === 'error'">❌</span>
                <span v-else>ℹ️</span>
              </div>
              <div class="status-text">{{ statusMessage }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Relatives Section -->
      <div class="controls-section-bordered">
        <h2 class="demo-controls-section-title">{{ t('family.addRelatives.title') }}</h2>

        <div class="btn-grid">
          <!-- Row 1: Parents & Grandparents -->
          <button @click="handleAddParents" class="action-btn-pink" type="button">
            {{ t('family.addRelatives.parents') }}
          </button>

          <button @click="handleAddGrandparents" class="action-btn-amber">
            {{ t('family.addRelatives.grandparents') }}
          </button>

          <!-- Row 2: Sibling & Niece/Nephew -->
          <button @click="handleAddSibling" class="action-btn-blue">
            {{ t('family.addRelatives.sibling') }}
          </button>

          <button @click="handleAddNieceNephew" class="action-btn-cyan">
            {{ t('family.addRelatives.nieceNephew') }}
          </button>

          <!-- Row 3: Uncle/Aunt & Cousin -->
          <button @click="handleAddUncleAunt" class="action-btn-orange">
            {{ t('family.addRelatives.uncleAunt') }}
          </button>

          <button @click="handleAddCousin" class="action-btn-purple">
            {{ t('family.addRelatives.cousin') }}
          </button>

          <!-- Row 4: Partner & Child -->
          <button @click="handleAddPartner" class="action-btn-rose">
            {{ t('family.addRelatives.partner') }}
          </button>

          <button @click="handleAddChild" class="action-btn-teal">
            {{ t('family.addRelatives.child') }}
          </button>
        </div>
      </div>

      <!-- Actions Section -->
      <div class="controls-section-bordered">
        <h2 class="demo-controls-section-title">{{ t('family.actions.title') }}</h2>

        <div class="btn-grid">
          <button @click="handleSaveFamily" class="action-btn-gray">
            {{ t('family.actions.saveFamily') }}
          </button>

          <button @click="handleSaveImage" class="action-btn-emerald">
            {{ t('family.actions.saveImage') }}
          </button>

          <button @click="handleLockGraph" class="action-btn-indigo">
            {{ t('family.actions.lockGraph') }}
          </button>

          <button @click="handleUnlockGraph" class="action-btn-amber">
            {{ t('family.actions.unlockGraph') }}
          </button>

          <button @click="handleUndo" :disabled="!canUndo" class="action-btn-violet action-btn-disabled">
            {{ t('family.actions.undo') }}
          </button>

          <button @click="handleRedo" :disabled="!canRedo" class="action-btn-fuchsia action-btn-disabled">
            {{ t('family.actions.redo') }}
          </button>

          <button @click="handleResetTree" class="action-btn-red col-span-2">
            {{ t('family.actions.resetTree') }}
          </button>
        </div>
      </div>

      <!-- Render Mode Section -->
      <div class="controls-section-bordered">
        <h2 class="demo-controls-section-title">{{ t('family.renderNodes.title') }}</h2>

        <div class="render-mode-container">
          <label
            class="render-mode-label"
            :class="renderMode === 'colors' ? 'render-mode-label-active' : 'render-mode-label-inactive'"
          >
            <input
              type="radio"
              name="renderMode"
              value="colors"
              v-model="renderMode"
              class="render-mode-radio"
            />
            <span class="render-mode-icon">🎨</span>
            <span class="render-mode-text">{{ t('family.renderNodes.colors') }}</span>
          </label>

          <label
            class="render-mode-label"
            :class="renderMode === 'avatars' ? 'render-mode-label-active' : 'render-mode-label-inactive'"
          >
            <input
              type="radio"
              name="renderMode"
              value="avatars"
              v-model="renderMode"
              class="render-mode-radio"
            />
            <span class="render-mode-icon">👤</span>
            <span class="render-mode-text">{{ t('family.renderNodes.avatars') }}</span>
          </label>
        </div>

        <div class="info-box-blue">
          <p class="info-box-text-yellow">
            <strong>{{ t('family.renderNodes.colors') }}:</strong> {{ t('family.renderNodes.colorsDesc') }}<br>
            <strong>{{ t('family.renderNodes.avatars') }}:</strong> {{ t('family.renderNodes.avatarsDesc') }}
          </p>
        </div>
      </div>

      <!-- Network Analysis Section -->
      <div class="controls-section-bordered">
        <h2 class="demo-controls-section-title">{{ t('family.networkAnalysis.title') }}</h2>

        <NetworkAnalysis
          v-model:selected-metrics="selectedFeatures"
          v-model:size-metric="selectedSizeMetric"
          :analyzing="analyzing"
          :progress="analysisProgress"
          @analyze="handleAnalyzeGraph"
        />
      </div>

      <!-- Legend -->
      <div class="controls-section-bordered">
        <h3 class="legend-title">
          {{ t('family.relationshipColors.title') }}
        </h3>
        <div class="legend-list">
          <div class="legend-item">
            <div class="legend-dot bg-indigo-500"></div>
            <span class="legend-text">{{ t('family.relationshipColors.you') }}</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot bg-pink-500"></div>
            <span class="legend-text">{{ t('family.relationshipColors.parents') }}</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot bg-blue-500"></div>
            <span class="legend-text">{{ t('family.relationshipColors.siblings') }}</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot bg-orange-500"></div>
            <span class="legend-text">{{ t('family.relationshipColors.unclesAunts') }}</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot bg-purple-500"></div>
            <span class="legend-text">{{ t('family.relationshipColors.cousins') }}</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot bg-amber-700"></div>
            <span class="legend-text">{{ t('family.relationshipColors.grandparents') }}</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot bg-cyan-500"></div>
            <span class="legend-text">{{ t('family.relationshipColors.nieces') }}</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot bg-rose-500"></div>
            <span class="legend-text">{{ t('family.relationshipColors.partners') }}</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot bg-teal-500"></div>
            <span class="legend-text">{{ t('family.relationshipColors.children') }}</span>
          </div>
        </div>
      </div>

      <!-- Layout Algorithm Section -->
      <div class="controls-section-bordered">
        <h2 class="demo-controls-section-title">{{ t('family.layoutAlgorithm.title') }}</h2>

        <LayoutPicker
          v-model="selectedLayout"
          :available-layouts="availableLayouts"
          :loading="loading || applyingLayout"
          @apply="handleApplyLayout"
        />

        <div class="info-box-yellow mt-3">
          <p class="info-box-text-yellow">
            <template v-for="layout in availableLayouts" :key="layout.id">
              <div>
                <strong>{{ layout.name }}:</strong>
                {{ layout.description }}
                <span v-if="layout.requiresStats" class="italic"> (requires analysis)</span>
                <br>
              </div>
            </template>
          </p>
        </div>
      </div>

      <!-- Instructions Box -->
      <div class="info-box-blue">
        <h3 class="info-box-title-blue text-sm">
          {{ t('family.instructions.title') }}
        </h3>
        <ul class="info-box-text-blue space-y-1">
          <li v-html="t('family.instructions.dragNodes')"></li>
          <li v-html="t('family.instructions.autoSaves')"></li>
          <li v-html="t('family.instructions.lock')"></li>
          <li v-html="t('family.instructions.download')"></li>
          <li v-html="t('family.instructions.analyze')"></li>
          <li v-html="t('family.instructions.layouts')"></li>
          <li v-html="t('family.instructions.undoRedo')"></li>
        </ul>
      </div>
    </template>

    <template #graph>
      <!-- Loading Overlay -->
      <div v-if="loading || switchingRenderMode" class="loading-overlay">
        <div class="text-center">
          <div class="loading-spinner"></div>
          <p class="text-secondary">{{ switchingRenderMode ? 'Switching render mode...' : loadingMessage }}</p>
        </div>
      </div>

      <!-- D3 Graph Container -->
      <div ref="graphContainer" class="w-full h-full"></div>
    </template>

  </DemoLayout>

  <!-- Dialog Form - Outside DemoLayout to ensure it's always rendered -->
  <DialogForm
    :key="`dialog-${dialogAction || 'default'}`"
    :visible="dialogVisible"
    :title="dialogTitle"
    :fields="dialogFields"
    @confirm="handleDialogConfirm"
    @cancel="handleDialogCancel"
  />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import DemoLayout from '../components/DemoLayout.vue';
import DialogForm from '../components/DialogForm.vue';
import LayoutPicker from '../components/LayoutPicker.vue';
import NetworkAnalysis from '../components/NetworkAnalysis.vue';
import { useNetworkGraph } from '../composables/useNetworkGraph';
import { useI18n } from '../composables/useI18n';
import { useAnalytics } from '../composables/useAnalytics';
import { getTranslation } from '../../lib/i18n.js';
import { FAMILY_EVENTS, ANALYSIS_EVENTS } from '../lib/analytics/AnalyticsEvents.js';
import { FamilyController, FAMILY_GROUPS, GROUP_COLORS, DIALOG_ACTIONS } from '../lib/FamilyController';
import { FamilyDialogService } from '../lib/family/FamilyDialogService.js';
import { createLogger } from '@guinetik/logger';

const log = createLogger({
  prefix: 'FamilyPage',
  level: import.meta.env.DEV ? 'debug' : 'info'
});

// Use i18n for translations
const { t, lang } = useI18n();

// Analytics tracking
const { trackFamilyAction, trackAnalysis } = useAnalytics();

// Use the network graph composable with custom color function for family groups
const graphComposable = useNetworkGraph({
  colorBy: 'group',
  colorScheme: 'categorical',
  showLabels: true,
  autoComputeCentrality: false, // Manual sizing - users choose metric via Analyze button
  customColorFunction: (node) => {
    const group = node.group || 0;
    return GROUP_COLORS[group] || null; // Return null to use default if not found
  }
});
const {
  graphContainer,
  graphInstance,
  loading,
  loadData,
  addNode,
  addLink,
  hasNode,
  getNodeIds,
  lockPositions,
  unlockPositions,
  saveAsPNG,
  applyLayout,
  getAvailableLayouts,
  analyzeGraph,
  analysisProgress,
  updateVisualEncoding
} = graphComposable;

// Local state
const statusMessage = ref('');
const statusType = ref('info');
const loadingMessage = ref('Loading graph...');
const dialogVisible = ref(false);
const dialogTitle = ref('');
const dialogFields = ref([]);
const dialogAction = ref(null); // Store which action to perform on confirm
const selectedLayout = ref('none');
const availableLayouts = ref([]);
const applyingLayout = ref(false);
const canUndo = ref(false);
const canRedo = ref(false);
const selectedFeatures = ref(['eigenvector']); // Default to eigenvector
const selectedSizeMetric = ref('eigenvector');
const analyzing = ref(false);
const renderMode = ref('colors'); // 'colors' or 'avatars'
const switchingRenderMode = ref(false);

// Controller instance
let controller = null;

/**
 * Status change callback
 * @param {string} message - Status message
 * @param {string} type - Status type
 */
const handleStatusChange = (message, type) => {
  statusMessage.value = message;
  statusType.value = type;
  // Status messages persist - user can dismiss by taking new action
};

/**
 * Update undo/redo button states
 */
const updateUndoRedoStates = () => {
  if (!controller) return;
  canUndo.value = controller.canUndo();
  canRedo.value = controller.canRedo();
};

/**
 * Handle keyboard shortcuts
 * @param {KeyboardEvent} event - Keyboard event
 */
const handleKeyboardShortcut = (event) => {
  // Check for Ctrl+Z (undo) or Cmd+Z on Mac
  if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
    event.preventDefault();
    handleUndo();
  }
  // Check for Ctrl+Y (redo) or Ctrl+Shift+Z or Cmd+Shift+Z on Mac
  else if (
    ((event.ctrlKey || event.metaKey) && event.key === 'y') ||
    ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z')
  ) {
    event.preventDefault();
    handleRedo();
  }
};

/**
 * Initialize controller and load initial data
 */
const initializeFamily = () => {
  // Create graph manager with incremental addNode and addLink for family tree
  const graphManager = {
    graphInstance,
    loadData,
    addNode: (neighborIds, nodeId, group) => addNode(neighborIds, nodeId, group, true), // Use incremental mode
    addLink: (sourceId, targetId) => addLink(sourceId, targetId, true), // Use incremental mode
    hasNode,
    getNodeIds,
    lockPositions,
    unlockPositions,
    saveAsPNG,
    applyLayout,
    getAvailableLayouts
  };

  // Create controller with current language
  controller = new FamilyController({
    graphManager,
    onStatusChange: handleStatusChange,
    lang: lang.value
  });

  // Get available layouts
  availableLayouts.value = controller.getAvailableLayouts();

  // Load saved data or initial data
  const savedData = controller.loadFamily();
  if (savedData) {
    loadData(savedData.nodes, savedData.links);
  } else {
    const initialData = controller.getInitialDataset();
    loadData(initialData.nodes, initialData.links);
  }
};

/**
 * Generic dialog handler for all family member additions
 * @param {string} actionType - One of DIALOG_ACTIONS enum values
 * @param {Function} getDialogConfig - Function that returns dialog configuration from service
 */
const showDialogForAction = async (actionType, getDialogConfig) => {
  if (!controller) {
    handleStatusChange('Graph is still loading. Please wait...', 'error');
    return;
  }

  const dialogService = controller.getDialogService();
  const config = getDialogConfig();

  if (!config) {
    // Dialog service handles validation and returns null if preconditions not met
    // Get appropriate validation message for this action type
    const message = dialogService.getValidationMessage(actionType);
    handleStatusChange(message, 'error');
    return;
  }

  dialogTitle.value = config.title;
  dialogFields.value = config.fields;
  dialogAction.value = config.action;

  await nextTick();
  dialogVisible.value = true;
};

// Dialog handlers - all use the generic showDialogForAction method
const handleAddParents = () => {
  trackFamilyAction(FAMILY_EVENTS.RELATIVE_ADD, { type: 'parents' });
  showDialogForAction(
    DIALOG_ACTIONS.ADD_PARENTS,
    () => controller?.getDialogService().getAddParentsDialog()
  );
};

const handleAddSibling = () => {
  trackFamilyAction(FAMILY_EVENTS.RELATIVE_ADD, { type: 'sibling' });
  showDialogForAction(
    DIALOG_ACTIONS.ADD_SIBLING,
    () => controller?.getDialogService().getAddSiblingDialog()
  );
};

const handleAddGrandparents = () => {
  trackFamilyAction(FAMILY_EVENTS.RELATIVE_ADD, { type: 'grandparents' });
  showDialogForAction(
    DIALOG_ACTIONS.ADD_GRANDPARENTS,
    () => controller?.getDialogService().getAddGrandparentsDialog()
  );
};

const handleAddUncleAunt = () => {
  trackFamilyAction(FAMILY_EVENTS.RELATIVE_ADD, { type: 'uncle_aunt' });
  showDialogForAction(
    DIALOG_ACTIONS.ADD_UNCLE_AUNT,
    () => controller?.getDialogService().getAddUncleAuntDialog()
  );
};

const handleAddCousin = () => {
  trackFamilyAction(FAMILY_EVENTS.RELATIVE_ADD, { type: 'cousin' });
  showDialogForAction(
    DIALOG_ACTIONS.ADD_COUSIN,
    () => controller?.getDialogService().getAddCousinDialog()
  );
};

const handleAddChild = () => {
  trackFamilyAction(FAMILY_EVENTS.RELATIVE_ADD, { type: 'child' });
  showDialogForAction(
    DIALOG_ACTIONS.ADD_CHILD,
    () => controller?.getDialogService().getAddChildDialog()
  );
};

const handleAddNieceNephew = () => {
  trackFamilyAction(FAMILY_EVENTS.RELATIVE_ADD, { type: 'niece_nephew' });
  showDialogForAction(
    DIALOG_ACTIONS.ADD_NIECE_NEPHEW,
    () => controller?.getDialogService().getAddNieceNephewDialog()
  );
};

const handleAddPartner = () => {
  trackFamilyAction(FAMILY_EVENTS.RELATIVE_ADD, { type: 'partner' });
  showDialogForAction(
    DIALOG_ACTIONS.ADD_PARTNER,
    () => controller?.getDialogService().getAddPartnerDialog()
  );
};

/**
 * Handle dialog confirm
 * @param {Array} values - Array of field values
 */
const handleDialogConfirm = (values) => {
  if (!controller || !dialogAction.value) return;

  dialogVisible.value = false;

  // Save state before operation (using dialog title as description)
  controller.saveStateBeforeOperation(dialogTitle.value);

  const dialogService = controller.getDialogService();
  const result = dialogService.executeAction(dialogAction.value, values, controller.getOperations());

  if (result.success) {
    if (result.message) {
      handleStatusChange(result.message, 'info');
    }
    // Color updates happen automatically in addNodeIncremental() via computeScales()
    // Update undo/redo states after successful operation
    updateUndoRedoStates();
  } else {
    handleStatusChange(result.message || 'Failed to add relative', 'error');
  }

  dialogAction.value = null;
};

/**
 * Handle dialog cancel
 */
const handleDialogCancel = () => {
  dialogVisible.value = false;
  dialogAction.value = null;
};

/**
 * Handle save family
 */
const handleSaveFamily = () => {
  if (!controller) return;
  trackFamilyAction(FAMILY_EVENTS.TREE_SAVE);
  controller.saveFamily();
};

/**
 * Handle save image
 */
const handleSaveImage = () => {
  if (!controller) return;
  trackFamilyAction(FAMILY_EVENTS.TREE_EXPORT);
  controller.saveAsPNG('family-tree.png');
};

/**
 * Handle lock graph
 */
const handleLockGraph = () => {
  if (!controller) return;
  trackFamilyAction(FAMILY_EVENTS.GRAPH_LOCK);
  controller.lockGraph();
};

/**
 * Handle unlock graph
 */
const handleUnlockGraph = () => {
  if (!controller) return;
  trackFamilyAction(FAMILY_EVENTS.GRAPH_UNLOCK);
  controller.unlockGraph();
};

/**
 * Handle reset tree
 */
const handleResetTree = () => {
  if (!controller) return;
  if (confirm('Are you sure you want to reset your family tree?')) {
    trackFamilyAction(FAMILY_EVENTS.TREE_RESET);
    controller.resetFamily();
    updateUndoRedoStates();
  }
};

/**
 * Handle undo
 */
const handleUndo = () => {
  if (!controller) return;
  trackFamilyAction(FAMILY_EVENTS.UNDO_ACTION);
  const result = controller.undo();
  if (result.success) {
    handleStatusChange(result.message, 'info');
  } else {
    handleStatusChange(result.message || 'Nothing to undo', 'error');
  }
  updateUndoRedoStates();
};

/**
 * Handle redo
 */
const handleRedo = () => {
  if (!controller) return;
  trackFamilyAction(FAMILY_EVENTS.REDO_ACTION);
  const result = controller.redo();
  if (result.success) {
    handleStatusChange(result.message, 'info');
  } else {
    handleStatusChange(result.message || 'Nothing to redo', 'error');
  }
  updateUndoRedoStates();
};

/**
 * Handle analyze graph
 */
const handleAnalyzeGraph = async () => {
  if (!analyzeGraph || selectedFeatures.value.length === 0) return;
  trackAnalysis(ANALYSIS_EVENTS.ANALYSIS_RUN, { metrics: selectedFeatures.value.join(',') });

  try {
    analyzing.value = true;
    handleStatusChange('Analyzing network...', 'info');

    const result = await analyzeGraph(selectedFeatures.value, {
      includeGraphStats: false // Don't need graph-level stats for family tree
    });

    if (result) {
      // Update visual encoding to size by selected metric
      const sizeByMetric = selectedSizeMetric.value || selectedFeatures.value[0];
      updateVisualEncoding({
        sizeBy: sizeByMetric,
        minRadius: 5,
        maxRadius: 30,
        preserveZoom: true
      });
      handleStatusChange(`✅ Analysis complete - sizing by ${sizeByMetric}`, 'success');
    }
  } catch (err) {
    log.error('Analysis error', { error: err.message, stack: err.stack });
    handleStatusChange(`Analysis failed: ${err.message}`, 'error');
  } finally {
    analyzing.value = false;
  }
};

/**
 * Handle apply layout
 */
const handleApplyLayout = async () => {
  if (!controller || !selectedLayout.value) return;
  trackAnalysis(ANALYSIS_EVENTS.LAYOUT_CHANGE, { layout: selectedLayout.value });

  try {
    applyingLayout.value = true;
    const result = await controller.applyLayout(selectedLayout.value);

    if (result.success) {
      // Layout applied successfully - status message already shown by controller
    } else {
      handleStatusChange(result.error || 'Failed to apply layout', 'error');
    }
  } catch (err) {
    log.error('Layout error', { error: err.message, stack: err.stack });
    handleStatusChange(`Layout failed: ${err.message}`, 'error');
  } finally {
    applyingLayout.value = false;
  }
};

// Watch for graph instance to be ready, then initialize
watch(graphInstance, (newInstance) => {
  if (newInstance && !controller) {
    initializeFamily();
    updateUndoRedoStates();
  }
}, { immediate: true });

// Watch for language changes and update controller
watch(lang, (newLang) => {
  if (controller) {
    // Update controller language for translations
    controller.lang = newLang;
    // Create translation function for new language
    const tFunc = (key) => getTranslation(newLang, key);
    // Recreate the dialog service with new language
    controller.dialogService = new FamilyDialogService(
      () => controller.getGraphInstance(),
      controller.validation,
      tFunc
    );
    // Update validation and storage with new language
    controller.validation.t = tFunc;
    controller.storage.t = tFunc;
  }
});

// Watch for render mode changes
watch(renderMode, (newMode) => {
  trackFamilyAction(FAMILY_EVENTS.RENDER_MODE_CHANGE, { mode: newMode });
  if (graphInstance.value) {
    switchingRenderMode.value = true;

    // Listen for the 'ready' event which fires when D3 has finished rendering
    const onRenderComplete = () => {
      switchingRenderMode.value = false;
      graphInstance.value.off('ready', onRenderComplete);
    };

    graphInstance.value.on('ready', onRenderComplete);
    graphInstance.value.setRenderMode(newMode);
  }
});

// Watch for size metric changes to update visualization without re-analyzing
watch(selectedSizeMetric, (newMetric) => {
  if (newMetric && graphInstance.value) {
    log.debug('Size metric changed', { metric: newMetric });
    updateVisualEncoding({
      sizeBy: newMetric,
      minRadius: 5,
      maxRadius: 30
    });
  }
});

// Add keyboard shortcuts on mount
onMounted(() => {
  window.addEventListener('keydown', handleKeyboardShortcut);
});

// Cleanup on unmount
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboardShortcut);
  if (controller) {
    controller.dispose();
  }
});
</script>
