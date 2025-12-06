/**
 * Google Analytics 4 Event Constants
 * Centralized event definitions for the graph-js-demos application
 *
 * Naming Convention:
 * - Categories use SCREAMING_SNAKE_CASE
 * - Event names use snake_case (GA4 convention)
 */

/**
 * Event Categories
 */
export const ANALYTICS_CATEGORIES = {
  NAVIGATION: 'navigation',
  DATA_MANAGEMENT: 'data_management',
  ANALYSIS: 'analysis',
  GRAPH_INTERACTION: 'graph_interaction',
  FAMILY_TREE: 'family_tree',
  SHOWCASE: 'showcase'
};

/**
 * Navigation Events
 */
export const NAV_EVENTS = {
  PAGE_VIEW: 'page_view',
  MOBILE_MENU_TOGGLE: 'mobile_menu_toggle',
  LANGUAGE_SWITCH: 'language_switch',
  DARK_MODE_TOGGLE: 'dark_mode_toggle'
};

/**
 * Data Management Events
 */
export const DATA_EVENTS = {
  SAMPLE_NETWORK_LOAD: 'sample_network_load',
  FILE_UPLOAD: 'file_upload',
  DATASET_SELECT: 'dataset_select'
};

/**
 * Analysis Events
 */
export const ANALYSIS_EVENTS = {
  METRIC_SELECT: 'metric_select',
  LAYOUT_CHANGE: 'layout_change',
  COMMUNITY_DETECTION: 'community_detection',
  ANALYSIS_RUN: 'analysis_run'
};

/**
 * Graph Interaction Events
 */
export const GRAPH_EVENTS = {
  NODE_CLICK: 'node_click',
  NODE_DRAG: 'node_drag',
  NODE_HOVER: 'node_hover',
  RENDERER_SWITCH: 'renderer_switch'
};

/**
 * Family Tree Events
 */
export const FAMILY_EVENTS = {
  RELATIVE_ADD: 'relative_add',
  TREE_SAVE: 'tree_save',
  TREE_EXPORT: 'tree_export',
  UNDO_ACTION: 'undo_action',
  REDO_ACTION: 'redo_action'
};

/**
 * Showcase Events
 */
export const SHOWCASE_EVENTS = {
  NODE_ADD: 'showcase_node_add',
  NODE_REMOVE: 'showcase_node_remove'
};

/**
 * Route to page title mapping for page_view events
 */
export const ROUTE_TITLES = {
  home: 'Home',
  showcase: 'Showcase',
  explorer: 'Network Explorer',
  family: 'Family Tree',
  docs: 'Documentation'
};
