<template>
  <div class="avatar-picker">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="flex items-center gap-3">
      <!-- Preview -->
      <div
        class="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-2xl"
        :title="modelValue || 'No avatar'"
      >
        {{ modelValue || '👤' }}
      </div>

      <!-- Input -->
      <input
        :id="inputId"
        :value="modelValue"
        @input="handleInput"
        type="text"
        :placeholder="placeholder"
        :required="required"
        :maxlength="maxLength"
        class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-2xl text-center"
      />
    </div>
    <p v-if="hint" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

/**
 * AvatarPicker - Simple emoji input for node avatars
 *
 * @component
 * @example
 * <AvatarPicker
 *   v-model="avatar"
 *   label="Avatar"
 *   placeholder="Type an emoji"
 * />
 */

const props = defineProps({
  /**
   * The current avatar value (emoji)
   */
  modelValue: {
    type: String,
    default: ''
  },
  /**
   * Label text
   */
  label: {
    type: String,
    default: ''
  },
  /**
   * Placeholder text
   */
  placeholder: {
    type: String,
    default: 'Type an emoji 😊'
  },
  /**
   * Hint text shown below input
   */
  hint: {
    type: String,
    default: 'Type or paste an emoji character'
  },
  /**
   * Whether this field is required
   */
  required: {
    type: Boolean,
    default: false
  },
  /**
   * Maximum number of characters (emojis can be multiple chars)
   */
  maxLength: {
    type: Number,
    default: 10
  }
});

const emit = defineEmits(['update:modelValue']);

// Generate unique ID for input
const inputId = computed(() => `avatar-picker-${Math.random().toString(36).substr(2, 9)}`);

/**
 * Handle input changes
 */
const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>

<style scoped>
.avatar-picker input::placeholder {
  font-size: 0.875rem;
}
</style>
