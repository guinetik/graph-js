<template>
  <div class="layout-picker">
    <div class="space-y-2">
      <label class="block text-sm font-medium text-secondary">
        Choose Layout:
      </label>
      <select
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :disabled="disabled"
        class="w-full bg-secondary text-primary border border-color px-3 py-2 rounded-md disabled:opacity-50"
      >
        <option
          v-for="layout in availableLayouts"
          :key="layout.id"
          :value="layout.id"
        >
          {{ layout.name }}
        </option>
      </select>
    </div>

    <button
      @click="$emit('apply')"
      :disabled="disabled || loading"
      class="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-md font-semibold transition-colors mt-3"
    >
      <span v-if="!loading">🎯 Apply Layout</span>
      <span v-else>⏳ Applying...</span>
    </button>

    <div v-if="modelValue !== 'none' && selectedLayoutInfo" class="info-box-yellow mt-3">
      <p class="text-xs text-yellow-800 dark:text-yellow-200">
        <strong>{{ selectedLayoutInfo.name }}:</strong>
        {{ selectedLayoutInfo.description }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  availableLayouts: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'apply']);

const selectedLayoutInfo = computed(() => {
  return props.availableLayouts.find(l => l.id === props.modelValue);
});
</script>

<style scoped>
.layout-picker {
  /* Component styles are inherited from parent */
}
</style>
