<script lang="ts" setup>
import type { SvgNames } from './rx-icon'
import { RxIcon } from './rx-icon'

type Size = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | undefined

interface Props {
  size?: Size
  placeholder?: string
  name?: string
  modelValue?: string
  leftIcon?: SvgNames
  leftIconColor?: string
  icon?: SvgNames
  iconColor?: string
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  size: 'sm',
  placeholder: '',
})

const emit = defineEmits(['update:modelValue', 'change', 'leftIconClick', 'iconClick'])

const iconSize = computed(() => {
  if (props.size === 'xl') return 20
  if (props.size === 'lg') return 16
  if (props.size === 'md') return 16
  return 14
})

const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div class="rx-input" :class="size" v-bind="$attrs">
    <div v-if="leftIcon" class="rx-input__icon" @click="$emit('leftIconClick')">
      <RxIcon :name="leftIcon" :color="leftIconColor" :size="iconSize" />
    </div>
    <input
      class="rx-input__field"
      :placeholder="placeholder"
      :name="name"
      :value="modelValue"
      @input="onInput"
    >
    <div v-if="icon" class="rx-input__icon" @click="$emit('iconClick')">
      <RxIcon :name="icon" :color="iconColor" :size="iconSize" />
    </div>
  </div>
</template>

<style scoped>
.rx-input {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #e5e9eb;
  background-color: #fff;
  transition: all 0.2s;
  min-height: 44px;
  width: 100%;
  padding: 6px 8px;
  font-size: 13px;
  line-height: 20px;
}

.rx-input:hover {
  border-color: #a3a9ad;
}

.rx-input__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
}

.rx-input__field {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #171c1f;
  font-size: inherit;
  line-height: inherit;
  font-family: inherit;
}

.rx-input__field::placeholder {
  color: #a3a9ad;
}

/* Size variants */
.xl {
  border-radius: 10px;
  border: 1px solid #e5e9eb;
  padding: 13px 15px;
  font-size: 16px;
  line-height: 20px;
  gap: 10px;
}

.lg {
  border-radius: 8px;
  border: 1px solid #e5e9eb;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 20px;
  gap: 8px;
}

.md {
  border-radius: 6px;
  border: 1px solid #c7cdd1;
  padding: 8px 10px;
  font-size: 13px;
  line-height: 20px;
}

.sm {
  border-radius: 6px;
  border: 1px solid #c7cdd1;
  padding: 6px 8px;
  font-size: 12px;
  line-height: 20px;
}

.xs {
  border-radius: 4px;
  border: 0.5px solid #c7cdd1;
  padding: 6px;
  font-size: 12px;
  line-height: 16px;
}

.xxs {
  border-radius: 4px;
  border: 0.5px solid #c7cdd1;
  padding: 4px 6px;
  font-size: 12px;
  line-height: 16px;
}
</style>
