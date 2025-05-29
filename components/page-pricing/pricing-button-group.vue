<template>
  <div class="flex justify-center gap-3" v-bind="$attrs">
    <button
      v-for="item in group"
      :key="item.value"
      :class="cn(
        'w-134px lg:w-190px h-46px rounded-t-2 relative bg-[#8E95A9] border-none text-white cursor-pointer',
        {
          'bg-white text-black': modelValue === item.value,
        }
      )"
      @click="modelValue = item.value"
    >
      <span class="whitespace-pre-line font-600 text-18px">{{ item.text }}</span>
      <div class="absolute -top-3 -right-2 z-10" v-if="item.icon">
        <img :src="item.icon" class="select-none" draggable="false" />
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">

const modelValue = defineModel<number>('modelValue', {
  default: 360
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