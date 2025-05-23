<template>
  <div 
    :class="cn('flex items-start relative', {
      'h-9 overflow-hidden': !showAll
    })" 
    v-bind="$attrs"
    ref="wrapperRef"
  >
    <div class="inline-flex items-center flex-wrap gap-2 relative" ref="contentRef">
      <NuxtLinkLocale
        v-for="tab in tabs"
        :class="cn('tab-item h-9 flex items-center justify-center py-2 px-14px rounded-2 cursor-pointer', {
          'bg-[#F1F5F8]': modelValue === tab.key
        })"
        :to="tab.to"
        @click="modelValue = tab.key"
      >
        {{ tab.label }}
      </NuxtLinkLocale>
      <div v-if="showMore" class="absolute top-0 right-0 w-1px h-9 shadow-[-2px_0_6px_0_rgba(0_0_0/0.3)]"></div>
    </div> 

    <motion.button 
      @click="handleClick" 
      :class="cn('relative size-9 bg-white border-none flex items-center justify-center cursor-pointer')"
      v-if="showMore"
    >
      <!--  -->
      <motion.div
        :animate="{ rotate: showAll ? 180 : 0 }"
      >
        <RxIcon name="base/rx_ic_chevron_down" />
      </motion.div>
    </motion.button>
  </div>
</template>


<script setup lang="ts">
import { motion } from 'motion-v';
import { RxIcon } from '@/components/rx-icon';
import { ref } from 'vue';

const showAll = ref(false);
const showMore = ref(true);
const wrapperRef = useTemplateRef<HTMLDivElement>('wrapperRef');
const contentRef = useTemplateRef<HTMLDivElement>('contentRef');

const breakpoints = useRxBreakpoints();
const mdWidth = breakpoints.smallerOrEqual('md')

type Tab = {
  key: string;
  label: string;
}

const props = withDefaults(defineProps<{
  tabs: Tab[]
}>(), {
  tabs: () => []
})

const modelValue = defineModel();

const handleClick = (e: MouseEvent) => {
  e.stopPropagation();
  showAll.value = !showAll.value;
}

const resize = () => {
  const wrapper = wrapperRef.value!;
  const content = contentRef.value!;
  if (wrapper.getBoundingClientRect().width <= content.getBoundingClientRect().width + 36 && !mdWidth.value) {
    showMore.value = true
  } else {
    showMore.value = false
  }
}

watch(mdWidth, () => {
  showAll.value = mdWidth.value;
})

watch(() => props.tabs, () => {
  nextTick(resize)
});

onMounted(() => {
  showAll.value = mdWidth.value;
  resize()
  window.addEventListener('resize', resize)
  onUnmounted(() => {
    window.removeEventListener('resize', resize)
  })
})
</script>