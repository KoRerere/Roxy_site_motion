<script setup lang="ts">
import type { WhyChooseProps } from './interface'

defineProps<WhyChooseProps>()
</script>

<template>
  <div class="flex flex-col gap-6 lg:gap-10">
    <div class="px-5 flex flex-col gap-2 lg:px-15 md:px-10 xl:px-108px">
      <h2 class="section-title text-primary text-center">
        {{ title }}
      </h2>
      <p class="text-3.5 text-tertiary text-center whitespace-pre-line lg:text-body max-lg:leading-[20px]">
        {{ desc }}
      </p>
    </div>

    <div class="gap-6 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
      <div v-for="item in items" :key="item.title" class="choose-item px-4 py-6 rounded-3 bg-white/60 flex flex-col gap-3 transition-all duration-200 backdrop-blur-12 lg:px-6 lg:py-9 hover:bg-white lg:gap-6">
        <img :src="item.icon" class="ml-3 size-10 lg:size-15" alt="">
        <h3 class="text-4 text-primary leading-22px font-500 lg:text-5.5 lg:leading-[32px]">
          {{ item.title }}
        </h3>
        <p class="text-3.5 text-tertiary leading-16px lg:text-4.5 lg:leading-28px">
          {{ item.desc }}
        </p>
      </div>
    </div>
  </div>
</template>

<style>
.choose-item:hover {
  box-shadow: 0 2px 30px 0 rgba(199, 209, 214, 0.3);
}
</style>
