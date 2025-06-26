<template>
  <NuxtLinkLocale 
    :to="to"
    class="flex gap-2 items-center py-3 px-6 rounded-2 bg-[#11A3FD] text-white font-500 btn-effect"
    @mouseenter="animate(d, '82%')"
    @mouseleave="animate(d, '42%')"
    :style="{ background: `linear-gradient(315deg, #F9B3B4 0%, #238AFF ${r})` }"
    v-bind="$attrs"
  >
    <RxIcon name="base/rx_ic_download" :size="iconSize" />
    <slot></slot>
  </NuxtLinkLocale>
</template>

<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
import { motionValue, animate, useMotionValueEvent } from 'motion-v';

const props = defineProps({
  to: {
    type: String,
    default: '/download'
  },
  iconSize: {
    type: Number,
    default: 24
  }
})

const d = motionValue('42%');
const r = ref('42%')

useMotionValueEvent(d, 'change', (value) => {
  r.value = value
})

</script>

