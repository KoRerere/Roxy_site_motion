<script setup>
import { useMotionValueEvent, useScroll } from 'motion-v'

import heroImgEn from '@/assets/images/home/hero-img/en.png?format=webp'
import heroImgRu from '@/assets/images/home/hero-img/ru.png?format=webp'
import heroImgZh from '@/assets/images/home/hero-img/zh.png?format=webp'
import Cards from './cards.vue'
// import webp from '@/assets/images/app_screen.png?format=webp'
// import png from '@/assets/images/app_screen.png'

const { locale } = useRxI18n()
const heroImg = computed(() => {
  if (locale.value === 'zh') {
    return heroImgZh
  }
  else if (locale.value === 'ru') {
    return heroImgRu
  }
  return heroImgEn
})

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: heroImg,
      type: 'image/webp',
      fetchpriority: 'high',
    },
  ],
})

const deg = ref(15)

onMounted(() => {
  const { scrollYProgress } = useScroll()
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const value = 15 - latest * 250
    deg.value = value > 0 ? value : 0
  })
})
</script>

<template>
  <div
    class="bg-container w-full"
    :style="{
      transform: `rotate3d(1, 0, 0, ${deg}deg) translateZ(0)`,
    }"
  >
    <div class="w-full aspect-[63/43]">
      <img
        :src="heroImg"
        class="w-full select-none object-cover"
        alt=""
        draggable="false"
      >
    </div>
  </div>
</template>

  <style scoped>
  .perspective-wrapper {
  position: relative;
  z-index: 10;
  perspective: 5200px;
  transform-style: preserve-3d;
  isolation: isolate;
}
.bg-container {
  position: relative;
  z-index: 2;
  transform-origin: center;
}
</style>
