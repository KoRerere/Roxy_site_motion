<script setup>
const props = defineProps({
  type: String,
  color: String,
  bgColor: String,
  size: [String, Number],
  minWidth: [String, Number],
  minHeight: [String, Number],
  style: Object,
  classes: String,
  loading: Boolean,
})

const styleKeys = new Map([
  ['color', {}],
  ['bgColor', { alias: 'backgroundColor' }],
  ['size', { alias: 'fontSize', unit: 'px' }],
  ['minWidth', { unit: 'px' }],
  ['minHeight', { unit: 'px' }]
])


const style = computed(() => {
  const { style, ...data } = props
  const _style = { ...style }
  Object.entries(data).forEach(([key, value]) => {
    if (value && styleKeys.has(key)) {
      const { alias, unit } = styleKeys.get(key)
      _style[alias || key] = unit ? `${value}${unit}` : value
    }
  })
  return _style
})

const classes = computed(() => {
  const { type, classes, } = props
  return [type, classes]
})

</script>

<template>
  <button class="px-4 py-3 gap-2 flex items-center justify-center lb-button" :disabled="loading" :class="classes" :style="style">
    <slot name="icon"></slot>
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.lb-button {
  line-height: normal;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  color: var(--body, #042144);
  background-color: #ffffff;
  border-radius: var(--radius-md, 6px);

  &.btn-outline {
    background: var(--Component-Colors-Buttons-Secondary-bg, #FFF);
    border: 1px solid var(--Component-Colors-Buttons-Secondary-border, #C7CDD1);
    box-shadow: 0px 4px 4px -1px rgba(0, 0, 0, 0.02), 0px 1px 1px 0px rgba(0, 0, 0, 0.06);
  }

  :deep(.v-progress-circular__overlay) {
    stroke-width: 8px;
  }

  :deep(.v-progress-circular__underlay) {
    stroke-width: 8px;
  }
}

.primary {
  color: #ffffff;
  background-color: #33A9FF;
}

.purple {
  color: #ffffff;
  background-color: #B675F7;
}

.disabled {
  color: var(--Component-Colors-Buttons-Secondary-text-inactive, #A3A9AD);
  
  font-weight: 500;
  line-height: var(--Line-Height-text-lg, 20px); /* 153.846% */
  cursor: not-allowed;

  border-radius: var(--radius-md, 6px);
  border: 1px solid var(--Component-Colors-Buttons-Secondary-border, #C7CDD1);
  background: var(--Component-Colors-Buttons-Secondary-bg-inactive, #F0F3F5);

}
</style>