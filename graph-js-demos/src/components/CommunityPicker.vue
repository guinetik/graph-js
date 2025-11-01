<template>
  <div class="community-picker">
    <div class="space-y-2">
      <label class="block text-sm font-medium text-secondary">
        {{ label || 'Choose Algorithm:' }}
      </label>
      <select
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :disabled="disabled"
        class="w-full bg-secondary text-primary border border-color px-3 py-2 rounded-md disabled:opacity-50"
      >
        <option
          v-for="algo in availableAlgorithms"
          :key="algo.id"
          :value="algo.id"
        >
          {{ algo.name }}
        </option>
      </select>
    </div>

    <button
      @click="$emit('detect')"
      :disabled="disabled || detecting"
      class="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-md font-semibold transition-colors mt-3"
    >
      <span v-if="!detecting">🎨 Detect Communities</span>
      <span v-else>⏳ Detecting...</span>
    </button>

    <!-- Optional inline results display (can be hidden via slot) -->
    <slot name="results"></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  availableAlgorithms: {
    type: Array,
    required: true
  },
  detecting: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: 'Choose Algorithm:'
  }
});

const emit = defineEmits(['update:modelValue', 'detect']);
</script>

<style scoped>
.community-picker {
  /* Component styles are inherited from parent */
}
</style>
