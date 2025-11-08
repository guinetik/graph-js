<template>
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
        <h2 class="text-lg font-semibold text-green-900 dark:text-green-300 mb-2">
          {{ t('family.whatIs.title') }}
        </h2>
        <p class="text-sm text-green-800 dark:text-green-200">
          {{ t('family.whatIs.description') }}
        </p>
      </div>

      <!-- Status Section -->
      <div class="sticky top-0 z-20 bg-white/98 dark:bg-gray-800/98 backdrop-blur-md border-b border-[var(--color-border)] pb-4 mb-4 -mx-6 px-6 pt-4 -mt-2 overflow-x-hidden">
        <h2 class="demo-controls-section-title mb-3">{{ t('family.status.title') }}</h2>

        <div class="bg-[var(--color-bg-secondary)] rounded-md p-4 text-sm shadow-sm border border-[var(--color-border)]">
          <div v-if="!statusMessage" class="text-secondary text-center py-2">
            <div class="text-xs">{{ t('family.status.ready') }}</div>
            <div class="text-xs mt-1 opacity-60">{{ t('family.status.clickToAdd') }}</div>
          </div>
          <div v-else class="space-y-2">
            <div :class="{
              'flex items-start space-x-2': true,
              'text-green-600 dark:text-green-400': statusType === 'success',
              'text-red-600 dark:text-red-400': statusType === 'error',
              'text-blue-600 dark:text-blue-400': statusType === 'info'
            }">
              <div class="flex-shrink-0 mt-0.5">
                <span v-if="statusType === 'success'">✅</span>
                <span v-else-if="statusType === 'error'">❌</span>
                <span v-else>ℹ️</span>
              </div>
              <div class="flex-1 break-words">{{ statusMessage }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Relatives Section -->
      <div class="demo-controls-section border-t border-[var(--color-border)] pt-4">
        <h2 class="demo-controls-section-title">{{ t('family.addRelatives.title') }}</h2>

        <div class="grid grid-cols-2 gap-2">
          <!-- Row 1: Parents & Grandparents -->
          <button
            @click="handleAddParents"
            class="bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-sm text-sm"
            type="button"
          >
            {{ t('family.addRelatives.parents') }}
          </button>

          <button
            @click="handleAddGrandparents"
            class="bg-amber-700 hover:bg-amber-800 text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-sm text-sm"
          >
            {{ t('family.addRelatives.grandparents') }}
          </button>

          <!-- Row 2: Sibling & Niece/Nephew -->
          <button
            @click="handleAddSibling"
            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-sm text-sm"
          >
            {{ t('family.addRelatives.sibling') }}
          </button>

          <button
            @click="handleAddNieceNephew"
            class="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-sm text-sm"
          >
            {{ t('family.addRelatives.nieceNephew') }}
          </button>

          <!-- Row 3: Uncle/Aunt & Cousin -->
          <button
            @click="handleAddUncleAunt"
            class="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-sm text-sm"
          >
            {{ t('family.addRelatives.uncleAunt') }}
          </button>

          <button
            @click="handleAddCousin"
            class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-sm text-sm"
          >
            {{ t('family.addRelatives.cousin') }}
          </button>

          <!-- Row 4: Partner & Child -->
          <button
            @click="handleAddPartner"
            class="bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-sm text-sm"
          >
            {{ t('family.addRelatives.partner') }}
          </button>

          <button
            @click="handleAddChild"
            class="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-sm text-sm"
          >
            {{ t('family.addRelatives.child') }}
          </button>
        </div>
      </div>

      <!-- Actions Section -->
      <div class="demo-controls-section border-t border-[var(--color-border)] pt-4">
        <h2 class="demo-controls-section-title">{{ t('family.actions.title') }}</h2>

        <div class="grid grid-cols-2 gap-2">
          <button
            @click="handleSaveFamily"
            class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-sm text-sm"
          >
            {{ t('family.actions.saveFamily') }}
          </button>

          <button
            @click="handleSaveImage"
            class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-sm text-sm"
          >
            {{ t('family.actions.saveImage') }}
          </button>

          <button
            @click="handleLockGraph"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-sm text-sm"
          >
            {{ t('family.actions.lockGraph') }}
          </button>

          <button
            @click="handleUnlockGraph"
            class="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-sm text-sm"
          >
            {{ t('family.actions.unlockGraph') }}
          </button>

          <button
            @click="handleUndo"
            :disabled="!canUndo"
            class="bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-sm text-sm"
          >
            {{ t('family.actions.undo') }}
          </button>

          <button
            @click="handleRedo"
            :disabled="!canRedo"
            class="bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-sm text-sm"
          >
            {{ t('family.actions.redo') }}
          </button>

          <button
            @click="handleResetTree"
            class="col-span-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors shadow-sm text-sm"
          >
            {{ t('family.actions.resetTree') }}
          </button>
        </div>
      </div>

      <!-- Render Mode Section -->
      <div class="demo-controls-section border-t border-[var(--color-border)] pt-4">
        <h2 class="demo-controls-section-title">{{ t('family.renderNodes.title') }}</h2>

        <div class="flex flex-wrap gap-2 mb-3">
          <label
            class="flex items-center gap-2 cursor-pointer px-3 py-2 border-2 rounded-lg transition-all flex-1 min-w-[120px]"
            :class="{
              'border-green-500 bg-green-50 dark:bg-green-900/20': renderMode === 'colors',
              'border-gray-300 dark:border-gray-600 hover:border-green-300': renderMode !== 'colors'
            }"
          >
            <input
              type="radio"
              name="renderMode"
              value="colors"
              v-model="renderMode"
              class="text-green-600 focus:ring-green-500"
            />
            <span class="text-xl">🎨</span>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('family.renderNodes.colors') }}</span>
          </label>

          <label
            class="flex items-center gap-2 cursor-pointer px-3 py-2 border-2 rounded-lg transition-all flex-1 min-w-[120px]"
            :class="{
              'border-green-500 bg-green-50 dark:bg-green-900/20': renderMode === 'avatars',
              'border-gray-300 dark:border-gray-600 hover:border-green-300': renderMode !== 'avatars'
            }"
          >
            <input
              type="radio"
              name="renderMode"
              value="avatars"
              v-model="renderMode"
              class="text-green-600 focus:ring-green-500"
            />
            <span class="text-xl">👤</span>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('family.renderNodes.avatars') }}</span>
          </label>
        </div>

        <div class="info-box-blue">
          <p class="text-xs text-blue-800 dark:text-blue-200">
            <strong>{{ t('family.renderNodes.colors') }}:</strong> {{ t('family.renderNodes.colorsDesc') }}<br>
            <strong>{{ t('family.renderNodes.avatars') }}:</strong> {{ t('family.renderNodes.avatarsDesc') }}
          </p>
        </div>
      </div>

      <!-- Network Analysis Section -->
      <div class="demo-controls-section border-t border-[var(--color-border)] pt-4">
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
      <div class="demo-controls-section border-t border-[var(--color-border)] pt-4">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          {{ t('family.relationshipColors.title') }}
        </h3>
        <div class="space-y-2 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-indigo-500"></div>
            <span class="text-gray-700 dark:text-gray-300">{{ t('family.relationshipColors.you') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-pink-500"></div>
            <span class="text-gray-700 dark:text-gray-300">{{ t('family.relationshipColors.parents') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-blue-500"></div>
            <span class="text-gray-700 dark:text-gray-300">{{ t('family.relationshipColors.siblings') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-orange-500"></div>
            <span class="text-gray-700 dark:text-gray-300">{{ t('family.relationshipColors.unclesAunts') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-purple-500"></div>
            <span class="text-gray-700 dark:text-gray-300">{{ t('family.relationshipColors.cousins') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-amber-700"></div>
            <span class="text-gray-700 dark:text-gray-300">{{ t('family.relationshipColors.grandparents') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-cyan-500"></div>
            <span class="text-gray-700 dark:text-gray-300">{{ t('family.relationshipColors.nieces') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-rose-500"></div>
            <span class="text-gray-700 dark:text-gray-300">{{ t('family.relationshipColors.partners') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-teal-500"></div>
            <span class="text-gray-700 dark:text-gray-300">{{ t('family.relationshipColors.children') }}</span>
          </div>
        </div>
      </div>

      <!-- Layout Algorithm Section -->
      <div class="demo-controls-section border-t border-[var(--color-border)] pt-4">
        <h2 class="demo-controls-section-title">{{ t('family.layoutAlgorithm.title') }}</h2>

        <LayoutPicker
          v-model="selectedLayout"
          :available-layouts="availableLayouts"
          :loading="loading || applyingLayout"
          @apply="handleApplyLayout"
        />

        <div class="info-box-yellow mt-3">
          <p class="text-xs text-yellow-800 dark:text-yellow-200">
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
        <h3 class="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
          {{ t('family.instructions.title') }}
        </h3>
        <ul class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
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
      <div
        v-if="loading || switchingRenderMode"
        class="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 z-10"
      >
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mb-4"></div>
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
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import DemoLayout from '../components/DemoLayout.vue';
import DialogForm from '../components/DialogForm.vue';
import LayoutPicker from '../components/LayoutPicker.vue';
import NetworkAnalysis from '../components/NetworkAnalysis.vue';
import { useNetworkGraph } from '../composables/useNetworkGraph';
import { useI18n } from '../composables/useI18n';
import { getTranslation } from '../../lib/i18n.js';
import { FamilyController, FAMILY_GROUPS, GROUP_COLORS, DIALOG_ACTIONS } from '../lib/FamilyController';
import { FamilyDialogService } from '../lib/family/FamilyDialogService.js';
import { createLogger } from '@guinetik/logger';

const log = createLogger({
  prefix: 'FamilyPage',
  level: import.meta.env.DEV ? 'debug' : 'info'
});

// Use i18n for translations
const { t, lang } = useI18n();

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
  analysisProgress
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
const handleAddParents = () => showDialogForAction(
  DIALOG_ACTIONS.ADD_PARENTS,
  () => controller?.getDialogService().getAddParentsDialog()
);

const handleAddSibling = () => showDialogForAction(
  DIALOG_ACTIONS.ADD_SIBLING,
  () => controller?.getDialogService().getAddSiblingDialog()
);

const handleAddGrandparents = () => showDialogForAction(
  DIALOG_ACTIONS.ADD_GRANDPARENTS,
  () => controller?.getDialogService().getAddGrandparentsDialog()
);

const handleAddUncleAunt = () => showDialogForAction(
  DIALOG_ACTIONS.ADD_UNCLE_AUNT,
  () => controller?.getDialogService().getAddUncleAuntDialog()
);

const handleAddCousin = () => showDialogForAction(
  DIALOG_ACTIONS.ADD_COUSIN,
  () => controller?.getDialogService().getAddCousinDialog()
);

const handleAddChild = () => showDialogForAction(
  DIALOG_ACTIONS.ADD_CHILD,
  () => controller?.getDialogService().getAddChildDialog()
);

const handleAddNieceNephew = () => showDialogForAction(
  DIALOG_ACTIONS.ADD_NIECE_NEPHEW,
  () => controller?.getDialogService().getAddNieceNephewDialog()
);

const handleAddPartner = () => showDialogForAction(
  DIALOG_ACTIONS.ADD_PARTNER,
  () => controller?.getDialogService().getAddPartnerDialog()
);

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
  controller.saveFamily();
};

/**
 * Handle save image
 */
const handleSaveImage = () => {
  if (!controller) return;
  controller.saveAsPNG('family-tree.png');
};

/**
 * Handle lock graph
 */
const handleLockGraph = () => {
  if (!controller) return;
  controller.lockGraph();
};

/**
 * Handle unlock graph
 */
const handleUnlockGraph = () => {
  if (!controller) return;
  controller.unlockGraph();
};

/**
 * Handle reset tree
 */
const handleResetTree = () => {
  if (!controller) return;
  if (confirm('Are you sure you want to reset your family tree?')) {
    controller.resetFamily();
    updateUndoRedoStates();
  }
};

/**
 * Handle undo
 */
const handleUndo = () => {
  if (!controller) return;
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

  try {
    analyzing.value = true;
    handleStatusChange('Analyzing network...', 'info');

    const result = await analyzeGraph(selectedFeatures.value, {
      includeGraphStats: false // Don't need graph-level stats for family tree
    });

    if (result) {
      // Update visual encoding to size by selected metric
      const sizeByMetric = selectedSizeMetric.value || selectedFeatures.value[0];
      if (graphInstance.value?.updateVisualEncoding) {
        graphInstance.value.updateVisualEncoding({
          sizeBy: sizeByMetric,
          preserveZoom: true
        });
      }
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
