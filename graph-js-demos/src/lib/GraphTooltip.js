/**
 * GraphTooltip - Reusable tooltip component for graph visualizations
 *
 * A shared tooltip class that can be used by any graph renderer (D3, Sigma, etc.)
 * Provides consistent tooltip styling and behavior across renderers.
 *
 * @example
 * const tooltip = new GraphTooltip({
 *   maxWidth: 300,
 *   padding: 15
 * });
 *
 * // Show tooltip on mouse event
 * tooltip.show(event, nodeData);
 *
 * // Hide tooltip
 * tooltip.hide();
 *
 * // Cleanup
 * tooltip.destroy();
 */

import { createLogger } from '@guinetik/logger';

const log = createLogger({
  prefix: 'GraphTooltip',
  level: 'info'
});

/**
 * Default configuration
 */
const DEFAULTS = {
  MAX_WIDTH: 300,
  PADDING: 15,
  ANIMATION_DURATION: 150,
  Z_INDEX: 10000
};

/**
 * GraphTooltip - Reusable tooltip for graph nodes
 */
export class GraphTooltip {
  /**
   * Create a new GraphTooltip instance
   *
   * @param {Object} options - Configuration options
   * @param {number} [options.maxWidth=300] - Maximum tooltip width
   * @param {number} [options.padding=15] - Padding from cursor
   * @param {number} [options.animationDuration=150] - Fade animation duration
   * @param {Function} [options.contentBuilder] - Custom content builder function
   */
  constructor(options = {}) {
    this.options = {
      maxWidth: options.maxWidth || DEFAULTS.MAX_WIDTH,
      padding: options.padding || DEFAULTS.PADDING,
      animationDuration: options.animationDuration || DEFAULTS.ANIMATION_DURATION,
      contentBuilder: options.contentBuilder || null,
      zIndex: options.zIndex || DEFAULTS.Z_INDEX
    };

    this.element = null;
    this.currentNode = null;
    this.isDestroyed = false;
    this.darkModeQuery = null;
    this.darkModeHandler = null;

    // Create tooltip element
    this._createTooltip();
  }

  /**
   * Check if dark mode is active
   * @returns {boolean}
   */
  isDarkMode() {
    // Check for .dark class on html or body
    if (document.documentElement.classList.contains('dark') ||
        document.body.classList.contains('dark')) {
      return true;
    }
    // Fallback to media query
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
  }

  /**
   * Create the tooltip DOM element
   * @private
   */
  _createTooltip() {
    // Remove existing tooltip if any
    if (this.element) {
      this.element.remove();
    }

    // Remove existing dark mode listener if any
    if (this.darkModeQuery && this.darkModeHandler) {
      this.darkModeQuery.removeEventListener('change', this.darkModeHandler);
    }

    const isDarkMode = this.isDarkMode();

    // Create tooltip div
    this.element = document.createElement('div');
    this.element.className = 'graph-tooltip';
    this.element.setAttribute('role', 'tooltip');
    this.element.setAttribute('aria-hidden', 'true');

    // Apply styles
    Object.assign(this.element.style, {
      position: 'absolute',
      padding: '10px 14px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      pointerEvents: 'none',
      opacity: '0',
      visibility: 'hidden',
      zIndex: this.options.zIndex,
      maxWidth: `${this.options.maxWidth}px`,
      lineHeight: '1.6',
      backdropFilter: 'blur(8px)',
      transition: `opacity ${this.options.animationDuration}ms ease, visibility ${this.options.animationDuration}ms ease`
    });

    // Set initial color styles
    this._updateStyles(isDarkMode);

    // Append to body
    document.body.appendChild(this.element);

    // Listen for dark mode changes
    if (window.matchMedia) {
      this.darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.darkModeHandler = (e) => {
        if (!this.isDestroyed && this.element) {
          this._updateStyles(this.isDarkMode());
        }
      };
      this.darkModeQuery.addEventListener('change', this.darkModeHandler);
    }

    log.debug('Tooltip created');
  }

  /**
   * Update tooltip styles for dark/light mode
   * @param {boolean} isDarkMode
   * @private
   */
  _updateStyles(isDarkMode) {
    if (!this.element) return;

    if (isDarkMode) {
      Object.assign(this.element.style, {
        background: 'rgba(30, 30, 35, 0.95)',
        color: '#f9fafb',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)'
      });
    } else {
      Object.assign(this.element.style, {
        background: 'rgba(255, 255, 255, 0.98)',
        color: '#1a1a1a',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)'
      });
    }
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} str - String to escape
   * @returns {string}
   */
  escapeHtml(str) {
    if (typeof str !== 'string') return String(str);
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Build default tooltip content HTML
   * @param {Object} node - Node object
   * @returns {string} HTML content
   */
  buildContent(node) {
    if (!node) return '';

    // Use custom builder if provided
    if (this.options.contentBuilder) {
      return this.options.contentBuilder(node);
    }

    const parts = [];
    const isDarkMode = this.isDarkMode();

    // Node ID (always show first)
    parts.push(`<div style="font-weight: 600; margin-bottom: 6px; font-size: 13px;">🔵 ${this.escapeHtml(String(node.id))}</div>`);

    // Properties to exclude (internal/positional properties)
    const excludeProps = new Set([
      'id', 'x', 'y', 'fx', 'fy', 'vx', 'vy', 'index',
      '__data__', '__transition__', 'label', 'size', 'color',
      'hidden', 'forceLabel', 'type', 'highlighted', 'zIndex'
    ]);

    // Priority properties (shown first)
    const priorityProps = [
      'relationship', 'gender', 'avatar', 'group', 'community'
    ];

    // Metrics to format specially
    const metricsProps = [
      'degree', 'eigenvector', 'betweenness', 'clustering',
      'closeness', 'centrality', 'pagerank'
    ];

    // Show priority properties first
    priorityProps.forEach(prop => {
      if (node[prop] !== undefined && node[prop] !== null && !excludeProps.has(prop)) {
        const value = node[prop];

        if (prop === 'relationship') {
          parts.push(`<div style="margin-bottom: 3px;"><strong>👤 Relationship:</strong> ${this.escapeHtml(value)}</div>`);
        } else if (prop === 'gender') {
          const genderMap = {
            'male': { emoji: '🧔‍♂️', text: 'Male' },
            'female': { emoji: '👱‍♀️', text: 'Female' },
            'other': { emoji: '🏳️‍⚧️', text: 'Other' }
          };
          const genderInfo = genderMap[value] || { emoji: '', text: value };
          parts.push(`<div style="margin-bottom: 3px;"><strong>Gender:</strong> ${genderInfo.emoji} ${genderInfo.text}</div>`);
        } else if (prop === 'avatar') {
          parts.push(`<div style="margin-bottom: 3px;"><strong>Avatar:</strong> ${value}</div>`);
        } else if (prop === 'group') {
          parts.push(`<div style="margin-bottom: 3px;"><strong>Group:</strong> ${value}</div>`);
        } else if (prop === 'community') {
          parts.push(`<div style="margin-bottom: 3px;"><strong>🎨 Community:</strong> ${value}</div>`);
        } else {
          const label = prop.charAt(0).toUpperCase() + prop.slice(1).replace(/_/g, ' ');
          parts.push(`<div style="margin-bottom: 3px;"><strong>${label}:</strong> ${this.escapeHtml(String(value))}</div>`);
        }
      }
    });

    // Show metrics with special formatting
    metricsProps.forEach(prop => {
      if (node[prop] !== undefined && node[prop] !== null && !excludeProps.has(prop)) {
        const value = node[prop];
        const label = prop.charAt(0).toUpperCase() + prop.slice(1).replace(/_/g, ' ');

        // Skip centrality if eigenvector is shown (avoid duplication)
        if (prop === 'centrality' && node.eigenvector !== undefined) {
          return;
        }

        if (typeof value === 'number') {
          parts.push(`<div style="margin-bottom: 2px;"><strong>${label}:</strong> ${value.toFixed(4)}</div>`);
        } else {
          parts.push(`<div style="margin-bottom: 2px;"><strong>${label}:</strong> ${this.escapeHtml(String(value))}</div>`);
        }
      }
    });

    // Show all other properties
    const shownProps = new Set([...priorityProps, ...metricsProps]);
    const otherProps = Object.keys(node)
      .filter(key =>
        !excludeProps.has(key) &&
        !shownProps.has(key) &&
        node[key] !== undefined &&
        node[key] !== null &&
        typeof node[key] !== 'function' &&
        !key.startsWith('__')
      )
      .sort();

    if (otherProps.length > 0) {
      const borderColor = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
      const textColor = isDarkMode ? 'rgba(249,250,251,0.8)' : 'rgba(0,0,0,0.7)';

      parts.push(`<div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid ${borderColor}; font-size: 11px;">`);
      parts.push(`<div style="margin-bottom: 4px; font-weight: 600; color: ${textColor};">Other Properties:</div>`);

      otherProps.forEach(prop => {
        const value = node[prop];
        let displayValue;

        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            displayValue = `[${value.length} items]`;
          } else {
            displayValue = `{${Object.keys(value).length} keys}`;
          }
        } else {
          displayValue = String(value);
        }

        const label = prop.charAt(0).toUpperCase() + prop.slice(1).replace(/_/g, ' ');
        parts.push(`<div style="margin-bottom: 2px; font-family: monospace; font-size: 10px;"><strong>${label}:</strong> ${this.escapeHtml(displayValue)}</div>`);
      });

      parts.push('</div>');
    }

    return parts.join('');
  }

  /**
   * Show tooltip at the specified position
   *
   * @param {MouseEvent|Object} event - Mouse event or position object {clientX, clientY}
   * @param {Object} node - Node data to display
   */
  show(event, node) {
    if (!this.element || this.isDestroyed) return;

    // Build tooltip content
    const content = this.buildContent(node);
    this.element.innerHTML = content;

    // Get mouse position
    const mouseX = event.clientX ?? event.x ?? 0;
    const mouseY = event.clientY ?? event.y ?? 0;

    // Show tooltip first to measure its size
    this.element.style.opacity = '0';
    this.element.style.visibility = 'visible';
    this.element.setAttribute('aria-hidden', 'false');

    const tooltipWidth = this.element.offsetWidth || 200;
    const tooltipHeight = this.element.offsetHeight || 100;
    const padding = this.options.padding;

    // Calculate position relative to mouse
    let left = mouseX + padding;
    let top = mouseY - tooltipHeight - padding;

    // Adjust position to keep tooltip in viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // If tooltip would go off right edge, show on left side of cursor
    if (left + tooltipWidth > viewportWidth - padding) {
      left = mouseX - tooltipWidth - padding;
    }

    // If tooltip would go off left edge, show on right side
    if (left < padding) {
      left = mouseX + padding;
    }

    // If tooltip would go off top, show below cursor
    if (top < padding) {
      top = mouseY + padding;
    }

    // If tooltip would go off bottom, show above cursor
    if (top + tooltipHeight > viewportHeight - padding) {
      top = mouseY - tooltipHeight - padding;
    }

    // Position and show tooltip
    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
    this.element.style.opacity = '1';

    this.currentNode = node;
  }

  /**
   * Update tooltip position (for following cursor)
   *
   * @param {MouseEvent|Object} event - Mouse event or position object
   */
  updatePosition(event) {
    if (!this.element || !this.currentNode || this.isDestroyed) return;
    this.show(event, this.currentNode);
  }

  /**
   * Hide the tooltip
   */
  hide() {
    if (!this.element) return;

    this.element.style.opacity = '0';
    this.element.style.visibility = 'hidden';
    this.element.setAttribute('aria-hidden', 'true');
    this.currentNode = null;
  }

  /**
   * Destroy the tooltip and clean up
   */
  destroy() {
    if (this.isDestroyed) return;

    log.debug('Destroying tooltip');

    // Remove dark mode listener
    if (this.darkModeQuery && this.darkModeHandler) {
      this.darkModeQuery.removeEventListener('change', this.darkModeHandler);
      this.darkModeQuery = null;
      this.darkModeHandler = null;
    }

    // Remove element
    if (this.element) {
      this.element.remove();
      this.element = null;
    }

    this.currentNode = null;
    this.isDestroyed = true;
  }
}

export default GraphTooltip;
