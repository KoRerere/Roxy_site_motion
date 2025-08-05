<template>
  <div class="flex flex-col gap-6 lg:gap-10">
    <div class="flex flex-col gap-2 px-5 md:px-10 lg:px-15 xl:px-108px">
      <h2 class="text-6 lg:text-h3 text-center font-[Archivo]">{{ title }}</h2>
      <p class="text-3.5 leading-[20px] text-tertiary lg:text-body text-center whitespace-pre-line">{{ desc }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in items" class="py-6 lg:py-9 px-4 lg:px-6 flex flex-col gap-3 lg:gap-6 rounded-3 bg-white/60 backdrop-blur-12 transition-all duration-200 hover:bg-white choose-item">
        <img :src="item.icon" class="ml-3 size-10 lg:size-15" />
        <h3 class="text-primary font-500 text-4 lg:text-5.5 leading-[22px] lg:leading-[32px]">
          {{ item.title }}
        </h3>
        <p class="text-tertiary text-3.5 leading-[16px] lg:text-4.5 lg:leading-[28px]">
          {{ item.desc }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WhyChooseProps } from './interface';
defineProps<WhyChooseProps>()
</script>

<style>
.choose-item:hover {
  box-shadow: 0 2px 30px 0 rgba(199, 209, 214, 0.30);
}
</style>