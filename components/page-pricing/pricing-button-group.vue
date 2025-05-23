<template>
  <div class="p-2 md:p-6px bg-white/20 rounded-4 inline-flex gap-1">
    <button
      v-for="item in group"
      :key="item.value"
      :class="cn(
        'border-0 px-14px md:px-5 py-2 md:py-9px rounded-10px cursor-pointer font-600 bg-transparent relative text-sub-title',
        {
          'bg-[#11A3FD]': modelValue === item.value,
        }
      )"
      @click="modelValue = item.value"
    >
      <span class="text-white text-nowrap">{{ item.text }}</span>
      <div class="absolute top-[-18px] right-[-18px] z-10" v-if="item.icon">
        <img :src="item.icon" />
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">

const modelValue = defineModel<number>('modelValue', {
  default: 30
})

const group = computed(() => [
  {
    text: $t('30 天'),
    value: 30
  },
  {
    text: $t('90 天'),
    value: 90,
    icon: '/pricing/90day.svg'
  },
  {
    text: $t('180 天'),
    value: 180,
    icon: '/pricing/180day.svg'
  },
  {
    text: $t('360 天'),
    value: 360,
    icon: '/pricing/360day.svg'
  }
])
</script>