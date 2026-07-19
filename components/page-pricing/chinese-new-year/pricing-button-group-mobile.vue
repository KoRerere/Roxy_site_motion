<script setup lang="ts">
import { usePricingContext } from '../pricing-context'

const modelValue = defineModel<number>('modelValue', {
  default: 30,
})

const context = usePricingContext()
</script>

<template>
  <div class="p-6px rounded-4 bg-white/20 inline-flex gap-1" v-bind="$attrs">
    <button
      v-for="item in context.timeOptions" :key="item.value" :class="cn(
        'border-0 px-3 md:px-5 py-1.5 md:py-9px rounded-2.5 cursor-pointer font-600 bg-transparent relative text-sub-title',
        {
          'bg-[#11A3FD]': modelValue === item.value,
        },
      )" @click="modelValue = item.value"
    >
      <span class="text-white text-nowrap">{{ item.label }}</span>
      <div v-if="item.discountIcon" class="right-[-18px] top-[-18px] absolute z-10">
        <img :src="item.discountIcon" alt="">
      </div>
    </button>
  </div>
</template>
