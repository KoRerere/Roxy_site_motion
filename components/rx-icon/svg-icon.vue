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
    default: '',
  },
  fallback: {
    type: String,
    default: '',
  },
  containerClass: {
    type: String,
    default: '',
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
  <component :is="SvgComponent" class="svg" :data-name="name" v-bind="$attrs" />
  <!-- <SvgComponent class="svg" :data-name="name" v-bind="$attrs" /> -->
</template>

<style lang="scss" scoped>
:where(.svg) {
  font-size: v-bind(fontSize);
  color: v-bind(color);
  flex-shrink: 0;
}
</style>
