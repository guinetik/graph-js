<template>
  <div class="custom-dropdown" :class="{ 'is-open': isOpen, 'is-disabled': disabled, 'is-compact': compact }">
    <button
      ref="triggerRef"
      type="button"
      :disabled="disabled"
      @click="toggleDropdown"
      class="custom-dropdown-trigger"
      :class="{ 'is-compact': compact }"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
    >
      <span class="custom-dropdown-value">
        {{ displayValue }}
      </span>
      <svg
        class="custom-dropdown-chevron"
        :class="{ 'is-open': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition name="dropdown-fade">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="custom-dropdown-menu"
        role="listbox"
      >
        <button
          v-for="option in options"
          :key="getOptionValue(option)"
          type="button"
          role="option"
          :aria-selected="isSelected(option)"
          @click="selectOption(option)"
          class="custom-dropdown-option"
          :class="{ 'is-selected': isSelected(option) }"
        >
          {{ getOptionLabel(option) }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

/**
 * CustomDropdown - A styled dropdown component matching tooltip aesthetics
 * 
 * @component
 * @example
 * <CustomDropdown
 *   v-model="selectedValue"
 *   :options="[
 *     { value: 'en', label: 'English' },
 *     { value: 'pt', label: 'Português' }
 *   ]"
 *   :disabled="false"
 * />
 */
const props = defineProps({
  /**
   * Current selected value
   */
  modelValue: {
    type: [String, Number],
    default: null
  },
  /**
   * Array of options. Can be objects with {value, label} or simple strings/numbers
   */
  options: {
    type: Array,
    required: true
  },
  /**
   * Whether the dropdown is disabled
   */
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * Placeholder text when no option is selected
   */
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  /**
   * Use compact styling (smaller padding)
   */
  compact: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const triggerRef = ref(null);
const dropdownRef = ref(null);

/**
 * Get the value from an option (handles both object and primitive options)
 */
const getOptionValue = (option) => {
  return typeof option === 'object' && option !== null ? option.value : option;
};

/**
 * Get the label from an option (handles both object and primitive options)
 */
const getOptionLabel = (option) => {
  return typeof option === 'object' && option !== null ? option.label : option;
};

/**
 * Check if an option is currently selected
 */
const isSelected = (option) => {
  return getOptionValue(option) === props.modelValue;
};

/**
 * Get the display value (label of selected option or placeholder)
 */
const displayValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined || props.modelValue === '') {
    return props.placeholder;
  }
  const selectedOption = props.options.find(opt => getOptionValue(opt) === props.modelValue);
  return selectedOption ? getOptionLabel(selectedOption) : props.placeholder;
});

/**
 * Toggle dropdown open/closed state
 */
const toggleDropdown = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
};

/**
 * Select an option and close the dropdown
 */
const selectOption = (option) => {
  const value = getOptionValue(option);
  emit('update:modelValue', value);
  isOpen.value = false;
};

/**
 * Handle click outside to close dropdown
 */
const handleClickOutside = (event) => {
  if (
    isOpen.value &&
    triggerRef.value &&
    dropdownRef.value &&
    !triggerRef.value.contains(event.target) &&
    !dropdownRef.value.contains(event.target)
  ) {
    isOpen.value = false;
  }
};

/**
 * Handle escape key to close dropdown
 */
const handleEscape = (event) => {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false;
  }
};

// Watch for modelValue changes to close dropdown if needed
watch(() => props.modelValue, () => {
  // Optionally close dropdown when value changes externally
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscape);
});
</script>

<style scoped>
.custom-dropdown {
  position: relative;
  width: 100%;
}

.custom-dropdown-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
}

.custom-dropdown-trigger.is-compact {
  padding: 0.25rem 0.5rem;
  font-size: 0.8125rem;
}

.custom-dropdown-trigger:hover:not(:disabled) {
  border-color: var(--color-border-hover);
}

.custom-dropdown-trigger:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.custom-dropdown-trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.custom-dropdown-value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.custom-dropdown-chevron {
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
  flex-shrink: 0;
  transition: transform var(--transition-fast);
  color: var(--color-text-secondary);
}

.custom-dropdown-chevron.is-open {
  transform: rotate(180deg);
}

.custom-dropdown-menu {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 16rem;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 0.25rem;
}

.dark .custom-dropdown-menu {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.custom-dropdown-option {
  width: 100%;
  display: block;
  padding: 0.625rem 0.75rem;
  background-color: transparent;
  color: var(--color-text-primary);
  border: none;
  text-align: left;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-dropdown-option:first-child {
  border-top-left-radius: var(--radius-md);
  border-top-right-radius: var(--radius-md);
}

.custom-dropdown-option:last-child {
  border-bottom-left-radius: var(--radius-md);
  border-bottom-right-radius: var(--radius-md);
}

.custom-dropdown-option:hover {
  background-color: var(--color-bg-tertiary);
}

.custom-dropdown-option.is-selected {
  background-color: var(--color-accent);
  color: white;
}

.custom-dropdown-option.is-selected:hover {
  background-color: var(--color-accent-hover);
}

/* Scrollbar styling */
.custom-dropdown-menu::-webkit-scrollbar {
  width: 8px;
}

.custom-dropdown-menu::-webkit-scrollbar-track {
  background: transparent;
}

.custom-dropdown-menu::-webkit-scrollbar-thumb {
  background-color: var(--color-border);
  border-radius: 4px;
}

.custom-dropdown-menu::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-border-hover);
}

/* Transition animations */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity var(--transition-normal), transform var(--transition-normal);
}

.dropdown-fade-enter-from {
  opacity: 0;
  transform: translateY(-0.5rem);
}

.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}
</style>

