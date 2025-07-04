<script lang="ts" setup>
import type { SelectProps } from 'primevue/select'
import { RxIcon, type SvgNames } from '../rx-icon'

type Size = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | undefined

interface Props extends /* @vue-ignore */ Omit<SelectProps, 'size'> {
  size?: Size
  icon?: SvgNames
  iconColor?: string
  name?: string,
  pt?: any
}

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<Props>()

const { 
  size, 
  icon, 
  iconColor, 
  name
} = toRefs(props)

defineEmits(['change'])

const defaultProps: SelectProps = {
  inputId: name.value,
  filter: true,
  optionLabel: 'label',
}

const iconSize = computed(() => {
  if (size.value === 'xl') {
    return 18
  }

  if (size.value === 'lg') {
    return 16
  }

  return 14
})
</script>

<template>
  <Select 
    class="w-full" 
    v-bind="{ ...defaultProps, ...props, ...$attrs }" 
    :pt="{ 
      root: size, 
      option: classes.option,
      list: classes[`select-list-${size}`],
      ...props.pt
    }" 
    @change="$emit('change', $event)"
  >
    <template #dropdownicon>
      <RxIcon name="base/rx_ic_chevron_down" :size="iconSize" />
    </template>
    <template v-if="!$attrs.optionValue && !defaultProps.optionValue" #value="{ value: option, placeholder }">
      <div v-if="option" :class="`select-item select-item-${size}`">
        <RxIcon 
          v-if="option.icon || icon" 
          :name="option.icon || icon" 
          :color="iconColor" 
          fallback="base/rx_ic_earth" 
          :size="iconSize"
        />
        <img 
          v-if="option.image" 
          class="select-item__image" 
          :src="option.image"
        >
        <div>{{ option.label }}</div>
      </div>
      <div v-else>
        {{ placeholder }}
      </div>
    </template>
    <template #option="{ option }">
      <div :class="`select-item select-item-${size}`">
        <RxIcon 
          v-if="option.icon || icon" 
          :name="option.icon || icon" 
          :color="iconColor" 
          fallback="base/rx_ic_earth" 
          :size="iconSize"
        />
        <img 
          v-if="option.image" 
          class="select-item__image" 
          :src="option.image"
        >
        <div>{{ option.label }}</div>
        <slot name="option-extra" :option="option" />
      </div>
    </template>
  </Select>
</template>

<style lang="scss" module="classes">
.option {
  font-size: 13px;

  &[data-p-selected='true']:not([data-p-focused='true']) {
    color: var(--Colors-Text-text-brand, #12a3fc) !important;
    background: #e8f5fc !important;
  }
}
</style>

<style lang="scss" scoped>
.select-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md, 6px);
  flex: 1;

  &__image {
    width: 16px;
    height: 16px;
    aspect-ratio: 1;
  }
}

:deep(.p-select-label) {
  color: var(--Component-Colors-TextInput-text-text, #171c1f);
  
}

.xl {
  border-radius: var(--radius-xl, 10px);
  border: 1px solid var(--Component-Colors-TextInput-border-border, #E5E9EB);

  :deep(.p-select-label) {
    padding: 13px 13px 13px var(--spacing-xl, 15px);
    font-size: 16px;
    line-height: var(--Line-Height-text-lg, 20px);
  }
}

.select-item-xl {
  gap: 10px;
}

.lg {
  border-radius: var(--radius-lg, 8px);
  border: 1px solid var(--Component-Colors-TextInput-border-border, #E5E9EB);

  :deep(.p-select-label) {
    padding: 10px 10px 10px var(--spacing-xl, 12px);
    font-size: 14px;
    line-height: var(--Line-Height-text-lg, 20px);
  }

  .select-item {
    gap: 8px;
  }
}

.md {
  border-radius: var(--radius-md, 6px);
  border: 1px solid var(--Component-Colors-TextInput-border-border, #c7cdd1);

  :deep(.p-select-label) {
    padding: 8px 8px 8px 10px;
    font-size: 13px;
    line-height: var(--Line-Height-text-lg, 20px);
  }
}

.sm {
  border-radius: var(--radius-md, 6px);
  border: 1px solid var(--Component-Colors-TextInput-border-border, #c7cdd1);

  :deep(.p-select-label) {
    padding: var(--spacing-md, 6px) var(--spacing-md, 6px) var(--spacing-md, 6px) 8px;
    font-size: 12px;
    line-height: var(--Line-Height-text-lg, 20px);
  }
}

.xs {
  border-radius: var(--radius-sm, 4px);
  border: 0.5px solid var(--Component-Colors-TextInput-border-border, #c7cdd1);

  :deep(.p-select-label) {
    padding: var(--spacing-md, 6px);
    font-size: 12px;
    line-height: var(--Line-Height-text-xs, 16px);
  }
}

.xxs {
  border-radius: var(--radius-sm, 4px);
  border: 0.5px solid var(--Component-Colors-TextInput-border-border, #c7cdd1);

  :deep(.p-select-label) {
    padding: var(--spacing-sm, 4px) var(--spacing-sm, 4px) var(--spacing-sm, 4px) var(--spacing-md, 6px);
    font-size: 12px;
    line-height: var(--Line-Height-text-xs, 16px);
  }
}
</style>
