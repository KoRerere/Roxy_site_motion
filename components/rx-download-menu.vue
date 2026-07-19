<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v'
import { ref } from 'vue'
import { RxIcon } from '@/components/rx-icon'

const props = defineProps({
  /** 传入则作为下拉面板宽度（如 `260px`、`min(280px,90vw)`）；不传则默认 `w-40`（160px） */
  width: {
    type: String,
  },
  /** 追加到面板的 class，例如 `min-w-[260px]` */
  panelClass: {
    type: String,
    default: '',
  },
  /** 点击组件外部时是否自动关闭下拉 */
  closeOnClickOutside: {
    type: Boolean,
    default: true,
  },
  model: {
    type: Array as PropType<{
      label: string
      command?: () => void
      icon?: string
      itemClass?: string
      iconSize?: number | string
      iconProps?: Record<string, any>
    }[]>,
    required: true,
  },
})

const isOpen = ref(false)
const rootRef = ref<HTMLElement>()

function toggle() {
  isOpen.value = !isOpen.value
}

function handleClick(item: { command?: () => void }) {
  item.command?.()
  isOpen.value = false
}

onMounted(() => {
  const handleWinPointerDown = (e: PointerEvent) => {
    if (!props.closeOnClickOutside || !isOpen.value)
      return

    const target = e.target as Node | null
    if (!target || rootRef.value?.contains(target))
      return

    isOpen.value = false
  }

  // 使用 capture 阶段的 pointerdown，避免与 toggle click 同帧竞争导致闪烁
  window.addEventListener('pointerdown', handleWinPointerDown, true)
  onUnmounted(() => {
    window.removeEventListener('pointerdown', handleWinPointerDown, true)
  })
})
</script>

<template>
  <div ref="rootRef" class="max-w-full min-w-0 relative">
    <slot :toggle="toggle" />

    <AnimatePresence>
      <motion.div
        v-if="isOpen"
        :style="width ? { width } : undefined"
        :initial="{ opacity: 0, y: -10 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: -10 }"
        :transition="{ duration: 0.2 }"
        class="mt-2 border rounded bg-white shadow-lg absolute z-10" :class="[
          width ? 'max-w-[calc(100vw-24px)]' : 'w-40',
          panelClass,
        ]"
      >
        <ul class="p-1 list-none">
          <li
            v-for="item in model" class="text-primary px-4 py-2 flex gap-2 cursor-pointer text-nowrap items-center hover:bg-gray-100"
            :class="itemClass" @click="handleClick(item)"
          >
            <component :is="item.icon" v-if="typeof item.icon === 'object'" :size="item.iconSize" v-bind="item.iconProps" />
            <RxIcon v-else-if="item.icon" :name="item.icon" :size="item.iconSize" v-bind="item.iconProps" />
            {{ item.label }}
          </li>
        </ul>
      </motion.div>
    </AnimatePresence>
  </div>
</template>
