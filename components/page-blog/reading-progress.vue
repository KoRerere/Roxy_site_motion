<template>
    <div
      v-show="progress > 0"
      class="reading-progress"
      :style="{ width: progress + '%' }"
    ></div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    bottomElement: HTMLElement | null
  }>()

  const progress = ref(0)
  let ticking = false
  
  const updateProgress = () => {
    const docElement = document.documentElement
    const scrollTop = window.scrollY || docElement.scrollTop
    const bottomElementTop = props.bottomElement?.offsetTop || window.innerHeight
    const scrollHeight = docElement.scrollHeight - bottomElementTop
    const scrollPercent = (scrollTop / scrollHeight) * 100
    progress.value = scrollPercent
  }
  
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress()
        ticking = false
      })
      ticking = true
    }
  }
  
  onMounted(() => {
    window.addEventListener('scroll', onScroll)
  })
  
  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })
  </script>
  
  <style scoped>
  .reading-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    background: #79C9FA;
    width: 0%;
    z-index: 9999;
    transition: width 0.1s ease-out;
  }
  </style>
  