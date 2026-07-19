<script lang="ts" setup>
type Size = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined

interface Option {
  value: string | number | boolean
  label: string
}

interface Props {
  size?: Size
  name?: string
  modelValue?: any
  options?: Option[]
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  size: 'sm',
  options: () => [],
})

const emit = defineEmits(['update:modelValue', 'change'])

const selectOption = (option: Option) => {
  emit('update:modelValue', option.value)
  emit('change', option.value)
}
</script>

<template>
  <div class="rx-radio-group" v-bind="$attrs">
    <label
      v-for="option in options"
      :key="String(option.value)"
      :for="`${name}_${option.value}`"
      class="rx-radio-item"
      :class="[size, { 'rx-radio-item--checked': modelValue === option.value }]"
      @click="selectOption(option)"
    >
      <span class="rx-radio-dot">
        <span v-if="modelValue === option.value" class="rx-radio-dot__inner" />
      </span>
      <span class="rx-radio-item__text">{{ option.label }}</span>
    </label>
  </div>
</template>

<style scoped>
.rx-radio-group {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px;
}

.rx-radio-item {
  display: flex;
  align-items: center;
  min-width: 110px;
  border-style: solid;
  border-color: #c7cdd1;
  background: #fff;
  box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05);
  color: #171c1f;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.2s;
}

.rx-radio-item--checked {
  border-color: #12a3fc;
}

.rx-radio-item--checked .rx-radio-item__text {
  color: #12a3fc;
}

.rx-radio-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #c7cdd1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.2s;
}

.rx-radio-item--checked .rx-radio-dot {
  border-color: #12a3fc;
}

.rx-radio-dot__inner {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #12a3fc;
}

/* Size variants */
.xl {
  padding: 12px 12px 12px 14px;
  gap: 8px;
  border-radius: 10px;
  border-width: 1px;
  font-size: 16px;
  line-height: 20px;
}

.lg {
  padding: 10px 10px 10px 12px;
  gap: 8px;
  border-radius: 8px;
  border-width: 1px;
  font-size: 14px;
  line-height: 20px;
}

.md {
  padding: 8px 8px 8px 10px;
  gap: 6px;
  border-radius: 6px;
  border-width: 1px;
  font-size: 13px;
  line-height: 20px;
}

.sm {
  padding: 6px 6px 6px 8px;
  gap: 6px;
  border-radius: 6px;
  border-width: 1px;
  font-size: 12px;
  line-height: 20px;
}

.xs {
  padding: 6px;
  gap: 6px;
  border-radius: 4px;
  border-width: 0.5px;
  font-size: 12px;
  line-height: 16px;
}

.xxs {
  padding: 4px 4px 4px 6px;
  gap: 6px;
  border-radius: 4px;
  border-width: 0.5px;
  font-size: 12px;
  line-height: 16px;
}
</style>
