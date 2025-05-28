<template>
  <div class="relative">
    <slot :toggle="toggle" />

    <AnimatePresence>
      <motion.div
        v-if="isOpen"
        :initial="{ opacity: 0, y: -10 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: -10 }"
        :transition="{ duration: 0.2 }"
        class="absolute mt-2 w-40 bg-white shadow-lg rounded border z-10"
      >
        <ul class="p-1 list-none">
          <li 
            v-for="item in model" 
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-primary" 
            @click="handleClick(item)"
          >
            {{ item.label }}
          </li>
        </ul>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AnimatePresence, motion } from 'motion-v'

defineProps({
  model: {
    type: Array as PropType<{
      label: string,
      command?: () => void,
    }[]>,
    required: true,
  }
})

const isOpen = ref(false)

function toggle(event?: Event) {
  event?.stopPropagation()
  isOpen.value = !isOpen.value
}

function handleClick(item: { command?: () => void }) {
  item.command?.()
  isOpen.value = false
}

onMounted(() => {
  const handleWinClick = () => {
    isOpen.value = false
  }
  window.addEventListener('click', handleWinClick)
  onUnmounted(() => {
    window.removeEventListener('click', handleWinClick)
  })
})
</script>