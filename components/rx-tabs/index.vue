<script setup lang="ts">
import { motion } from 'motion-v'
import { ref } from 'vue'
import { RxIcon } from '@/components/rx-icon'

const props = withDefaults(defineProps<{
  tabs: Tab[]
}>(), {
  tabs: () => [],
})
const showAll = ref(false)
const showMore = ref(true)
const wrapperRef = useTemplateRef<HTMLDivElement>('wrapperRef')
const contentRef = useTemplateRef<HTMLDivElement>('contentRef')

const breakpoints = useRxBreakpoints()
const mdWidth = breakpoints.smallerOrEqual('md')

interface Tab {
  key: string
  label: string
  to: string
  hidden?: boolean
  attrs?: Record<string, any>
}

const modelValue = defineModel()

function handleClick(e: MouseEvent) {
  e.stopPropagation()
  showAll.value = !showAll.value
}

function resize() {
  const wrapper = wrapperRef.value!
  const content = contentRef.value!
  if (wrapper.getBoundingClientRect().width <= content.getBoundingClientRect().width + 36 && !mdWidth.value) {
    showMore.value = true
  }
  else {
    showMore.value = false
  }
}

watch(mdWidth, () => {
  showAll.value = mdWidth.value
})

watch(() => props.tabs, () => {
  nextTick(resize)
})

onMounted(() => {
  showAll.value = mdWidth.value
  resize()
  window.addEventListener('resize', resize)
  onUnmounted(() => {
    window.removeEventListener('resize', resize)
  })
})
</script>

<template>
  <div
    v-bind="$attrs"
    ref="wrapperRef"
    :class="cn('flex items-start relative', {
      'h-9 overflow-hidden': !showAll,
    })"
  >
    <div ref="contentRef" class="inline-flex flex-wrap gap-2 items-center relative">
      <NuxtLinkLocale
        v-for="tab in tabs"
        :key="tab.key"
        :class="cn('tab-item h-9 flex items-center justify-center py-2 px-3.5 rounded-2 border-1 border-solid text-secondary',
                   modelValue === tab.key
                     ? 'bg-[#E4ECF1] border-[#E4ECF1] font-500 text-primary'
                     : ' border-[#E2E9EE] bg-white hover:(border-[#11A3FD] text-primary) cursor-pointer')"
        :to="tab.to"
        v-bind="tab.attrs"
        @click="modelValue = tab.key"
      >
        {{ tab.label }}
      </NuxtLinkLocale>
      <!-- <div v-if="showMore" class="h-9 w-1px shadow-[-2px_0_6px_0_rgba(0_0_0/0.3)] right-0 top-0 absolute" /> -->
    </div>

    <!-- <motion.button
      v-if="showMore"
      :class="cn('relative size-9 bg-white border-none flex items-center justify-center cursor-pointer')"
      @click="handleClick"
    >
      <motion.div
        :animate="{ rotate: showAll ? 180 : 0 }"
      >
        <RxIcon name="base/rx_ic_chevron_down" />
      </motion.div>
    </motion.button> -->
  </div>
</template>
