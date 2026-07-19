<script setup lang="ts">
import type { SvgNames } from './svg-icon-types'
import { svgIcons } from './svgIcons'

const props = defineProps({
  name: {
    type: String as PropType<SvgNames>,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 16,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  fallback: {
    type: String,
    default: '',
  },
  containerClass: {
    type: String,
    default: '',
  },
  stroke: {
    type: String,
  }
})

const fontSize = computed(() => {
  const { size } = props
  // if (typeof window === 'undefined') {
  //   // SSR 环境下直接返回像素值
  //   return Number.isNaN(Number(size)) ? size : `${size}px`
  // }
  // return Number.isNaN(Number(size)) ? size : `${size}px`
  return Number.isNaN(Number(size)) ? size : `${size}px`
})

const SvgComponent = computed(() => {
  return svgIcons[`../../assets/svgs/${props.name}.svg`] ?? svgIcons[`../../../assets/svgs/${props.fallback}.svg`]
})
</script>

<template>
  <ClientOnly>
    <component
      :is="SvgComponent"
      class="svg inline align-baseline shrink-0"
      :style="{ fontSize, color, stroke }"
      :data-name="name"
      v-bind="$attrs"
    />
  </ClientOnly>
</template>

