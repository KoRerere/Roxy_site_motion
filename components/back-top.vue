<template>
  <div class="fixed right-5 md:right-10 bottom-5 md:bottom-10 flex flex-col gap-3 z-10" ref="backTopRef">
    <div v-show="isShow">
      <button
        :class="cn(
          'size-12 rounded-full flex items-center justify-center border-none cursor-pointer text-white',
          topIconClasses
        )"
        @click="backTop"
      >
        <RxIcon name="base/rx_ic_back_top" size="18" />
      </button>
    </div>
    <NuxtLink 
      :to="telegramLink" 
      target="_blank" 
      class="size-12 rounded-full flex items-center justify-center shadow-[0_0_5px_3px_rgba(0_0_0/0.05)]"
    >
      <img src="/rx_ic_tg.svg" alt="telegram" class="w-full h-full object-cover" />
    </NuxtLink>
    <LiveChat>
      <button
        class="size-12 rounded-full flex items-center justify-center border-none cursor-pointer shadow-[0_0_5px_3px_rgba(0_0_0/0.05)]"
      >
        <img src="/rx_ic_live_chat.svg" alt="live-chat" class="w-full h-full object-cover" />
      </button>
    </LiveChat>
  </div>
</template>

<script setup>
import { RxIcon } from '@/components/rx-icon'
import { useScroll, useMotionValueEvent } from 'motion-v'

const topIconClasses = ref('bg-white/20 text-white')

const backTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const { telegramLink } = useTelegram()

const { $eventBus } = useNuxtApp()

const isShow = ref(true);

onMounted(() => {
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    isShow.value = latest > window.innerHeight
  })

  $eventBus.on('backTopReached', (bool) => {
    topIconClasses.value = bool ? 'bg-black/20' : 'bg-white/20'
  })

  onUnmounted(() => {
    console.log('组件卸载')
    $eventBus.off('backTopReached');
  })
})

onErrorCaptured((err) => {
  console.log('组件错误')
  console.error(err)
})
</script>