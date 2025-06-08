<template>
  <div 
    class="bg-container w-full" 
    :style="{ 
      transform: `rotate3d(1, 0, 0, ${deg}deg) translateZ(0)`
    }"
  >
    <img :src="avif" class="w-full aspect-[3088/2100] object-cover select-none" alt="" draggable="false" />
  </div>
</template>

<script setup>
import { useScroll, useMotionValueEvent } from "motion-v";
import avif from '@/assets/images/app_screen.png?format=avif'
// import webp from '@/assets/images/app_screen.png?format=webp'
// import png from '@/assets/images/app_screen.png'

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: avif,
      type: 'image/avif',
      fetchpriority: 'high'
    }
  ]
})

const breakpoints = useRxBreakpoints();
const mdWidth = breakpoints.smallerOrEqual('md')
const deg = ref(15)

onMounted(() => {
  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const value = 15 - latest * 180;
    deg.value = value > 0 ? value : 0;
  });
})
</script>

<style scoped>
.bg-container {
  position: relative;
  z-index: 2;
  transform-origin: center;
}
</style>