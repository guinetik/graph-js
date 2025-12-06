<template>
  <Transition name="tooltip-fade">
    <div
      v-if="tooltipState.visible && tooltipState.text"
      class="global-tooltip"
      :style="tooltipStyle"
    >
      {{ tooltipState.text }}
    </div>
  </Transition>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useTooltip } from '../composables/useTooltip';

const { tooltipState } = useTooltip();

const offset = 15; // Distance from cursor
const tooltipWidth = 288; // 18rem = 288px
const tooltipHeight = 120; // Approximate height

/**
 * Calculate tooltip position with edge detection
 */
const tooltipStyle = computed(() => {
  if (!tooltipState.visible) {
    return { display: 'none' };
  }

  let left = tooltipState.x + offset;
  let top = tooltipState.y + offset;

  // Prevent tooltip from going off right edge
  if (left + tooltipWidth > window.innerWidth) {
    left = tooltipState.x - tooltipWidth - offset;
  }

  // Prevent tooltip from going off bottom edge
  if (top + tooltipHeight > window.innerHeight) {
    top = tooltipState.y - tooltipHeight - offset;
  }

  // Prevent tooltip from going off left edge
  if (left < 0) {
    left = 5;
  }

  // Prevent tooltip from going off top edge
  if (top < 0) {
    top = 5;
  }

  return {
    left: `${left}px`,
    top: `${top}px`,
  };
});

/**
 * Global mousemove handler to keep tooltip following cursor
 */
const handleGlobalMouseMove = (event) => {
  if (tooltipState.visible) {
    tooltipState.x = event.clientX;
    tooltipState.y = event.clientY;
  }
};

onMounted(() => {
  document.addEventListener('mousemove', handleGlobalMouseMove);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleGlobalMouseMove);
});
</script>

<style scoped>
.global-tooltip {
  position: fixed;
  padding: 0.625rem 0.75rem;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 0.75rem;
  line-height: 1.5;
  white-space: normal;
  width: 18rem;
  max-width: calc(100vw - 2rem);
  z-index: 99999;
  pointer-events: none;
  word-wrap: break-word;
  transform: none;
  margin: 0;
}

.dark .global-tooltip {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity var(--transition-normal);
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}
</style>

