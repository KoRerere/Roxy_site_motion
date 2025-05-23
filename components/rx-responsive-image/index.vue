<template>
  <picture>
    <source :srcset="imageUrls.avif" type="image/avif">
    <source :srcset="imageUrls.webp" type="image/webp">
    <img :src="imageUrls.png" loading="lazy" draggable="false" v-bind="$attrs" />
  </picture>
</template>

<script setup lang="ts">
import { avif, webp, png } from './images'
import { ref } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  lazy: {
    type: Boolean,
    default: true,
  },
  high: {
    type: Boolean,
    default: false,
  }
})

const imageUrls = ref({
  avif: '',
  webp: '',
  png: ''
})

watchEffect(async () => {
  const path = `../../assets/images/${props.name}.png`
  const [avifModule, webpModule, pngModule] = await Promise.all([
    avif[path](),
    webp[path](),
    png[path]()
  ])
  
  imageUrls.value = {
    avif: (avifModule as any).default,
    webp: (webpModule as any).default,
    png: (pngModule as any).default
  }
})
</script>

