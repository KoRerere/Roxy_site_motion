<script setup lang="ts">
import { usePricingContext } from '../pricing-context'

const modelValue = defineModel<number>('modelValue', {
  default: 360,
})

const context = usePricingContext()

defineProps<{
  topUpSeason?: boolean
}>()
</script>

<template>
  <div class="flex gap-3 justify-center" v-bind="$attrs">
    <button
      v-for="item in context.timeOptions" :key="item.value" :class="cn(
        'w-134px lg:w-190px h-46px rounded-t-[8px] relative border-none text-white cursor-pointer',
        topUpSeason ? 'bg-[#61697F]' : 'bg-black/20',
        {
          '!bg-white text-black': modelValue === item.value,
        },
      )" @click="modelValue = item.value"
    >
      <span class="text-18px font-600 whitespace-pre-line">{{ item.label }}</span>
      <div v-if="item.discountIcon" class="absolute z-10 -right-2 -top-3">
        <img :src="item.discountIcon" class="select-none" draggable="false" alt="">
      </div>
    </button>
  </div>
</template>
