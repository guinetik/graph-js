<template>
  <div class="layout-picker">
    <div class="space-y-2">
      <label class="block text-sm font-medium text-secondary">
        {{ t('showcase.layoutPicker.chooseLayout') }}
      </label>
      <CustomDropdown
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :options="availableLayouts.map(layout => ({ value: layout.id, label: layout.name }))"
        :disabled="disabled"
        :placeholder="t('showcase.layoutPicker.chooseLayout')"
      />
    </div>

    <button
      @click="$emit('apply')"
      :disabled="disabled || loading"
      class="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-md font-semibold transition-colors mt-3"
    >
      <span v-if="!loading">{{ t('showcase.layoutPicker.applyButton') }}</span>
      <span v-else>{{ t('showcase.layoutPicker.applyingButton') }}</span>
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
