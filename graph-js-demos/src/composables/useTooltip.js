import { ref, reactive } from 'vue';

/**
 * Global tooltip state
 */
const tooltipState = reactive({
  visible: false,
  text: '',
  x: 0,
  y: 0
});

/**
 * Composable for showing tooltips globally
 * 
 * @returns {Object} Tooltip control functions
 * 
 * @example
 * const { showTooltip, hideTooltip, updatePosition } = useTooltip();
 * 
 * // Show tooltip
 * showTooltip('This is a tooltip');
 * 
 * // Update position (call on mousemove)
 * updatePosition(event);
 * 
 * // Hide tooltip
 * hideTooltip();
 */
export function useTooltip() {
  /**
   * Show tooltip with text
   * @param {string} text - Tooltip text to display
   */
  const showTooltip = (text) => {
    tooltipState.text = text;
    tooltipState.visible = true;
  };

  /**
   * Hide tooltip
   */
  const hideTooltip = () => {
    tooltipState.visible = false;
    tooltipState.text = '';
  };

  /**
   * Update tooltip position based on mouse event
   * @param {MouseEvent} event - Mouse event with clientX/clientY
   */
  const updatePosition = (event) => {
    if (!event) return;
    
    // Use clientX/clientY directly - these are viewport coordinates
    // Perfect for position: fixed
    tooltipState.x = event.clientX ?? 0;
    tooltipState.y = event.clientY ?? 0;
  };

  /**
   * Show tooltip with text and position from event
   * Convenience method that does both at once
   * @param {MouseEvent} event - Mouse event
   * @param {string} text - Tooltip text
   */
  const showTooltipAt = (event, text) => {
    if (event) {
      updatePosition(event);
    }
    showTooltip(text);
  };

  return {
    showTooltip,
    hideTooltip,
    updatePosition,
    showTooltipAt,
    tooltipState
  };
}

