<script setup lang="ts">
import { avif, png, webp } from './images'

defineOptions({ inheritAttrs: false })

const { name } = defineProps<{
  name: string
}>()

const loaded = ref(false)

const imageUrls = ref({
  avif: '',
  webp: '',
  png: '',
})

watchEffect(async () => {
  loaded.value = false
  const path = `../../assets/images/${name}.png`
  const [avifModule, webpModule, pngModule] = await Promise.all([
    avif[path]?.(),
    webp[path]?.(),
    png[path]?.(),
  ])

  imageUrls.value = {
    avif: (avifModule as any)?.default,
    webp: (webpModule as any)?.default,
    png: (pngModule as any)?.default,
  }
})
</script>

<template>
  <picture>
    <source :srcset="imageUrls.avif" type="image/avif">
    <source :srcset="imageUrls.webp" type="image/webp">
    <img :src="imageUrls.png" loading="lazy" class="select-none" draggable="false" v-bind="$attrs" :class="{ 'opacity-0': !loaded }" @load="loaded = true">
  </picture>
</template>
