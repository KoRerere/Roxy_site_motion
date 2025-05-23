<template>
  <component :is="tag" v-bind="$attrs" ref="el">
    <template v-if="lazy">
      <slot />
    </template>

    <component v-if="syncComp" :is="syncComp" v-bind="compProps" />
  </component>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import type { AsyncComponentLoader, Component } from 'vue'

const props = defineProps({
  syncCompImport: {
    type: Function as PropType<AsyncComponentLoader<Component>>,
  },
  compProps: {
    type: Object,
    default: () => ({})
  },
  tag: {
    type: String,
    default: 'div'
  },
  delay: {
    type: Number,
    default: 0
  }
})

const el = useTemplateRef<HTMLElement>('el')

const lazy = ref(false)

const syncComp = shallowRef<Component>();

async function delay() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, props.delay * 1000)
  })
}

const { stop } = useIntersectionObserver(el, async ([{ isIntersecting }]) => {
  if (isIntersecting) {
    stop();
    await delay()
    if (typeof props.syncCompImport === 'function') {
      syncComp.value = defineAsyncComponent(props.syncCompImport)
    } else {
      lazy.value = true;
    }
  }
})
</script>