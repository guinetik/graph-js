<template>
  <div class="community-picker">
    <div class="space-y-2">
      <label class="block text-sm font-medium text-secondary">
        {{ label || t('showcase.communityPicker.chooseAlgorithm') }}
      </label>
      <CustomDropdown
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :options="availableAlgorithms.map(algo => ({ value: algo.id, label: algo.name }))"
        :disabled="disabled"
        :placeholder="label || t('showcase.communityPicker.chooseAlgorithm')"
      />
    </div>

    <button
      @click="$emit('detect')"
      :disabled="disabled || detecting"
      class="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-md font-semibold transition-colors mt-3"
    >
      <span v-if="!detecting">{{ t('showcase.communityPicker.detectButton') }}</span>
      <span v-else>{{ t('showcase.communityPicker.detectingButton') }}</span>
    </button>

    <!-- Optional inline results display (can be hidden via slot) -->
    <slot name="results"></slot>
  </div>
</template>

<script setup>
import { useI18n } from '../composables/useI18n';
import CustomDropdown from './CustomDropdown.vue';

/**
 * Use i18n for translations
 */
const { t } = useI18n();

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
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'detect']);
</script>

<style scoped>
.community-picker {
  /* Component styles are inherited from parent */
}
</style>
