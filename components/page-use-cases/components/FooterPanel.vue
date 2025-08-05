<template>
  <div class="p-6 lg:px-15 lg:py-10 bg-[linear-gradient(90deg,#F8FAFB_0%,_#F8FAFB_100%)] relative z-10 overflow-hidden rounded-3 mb-20">
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between relative z-10">
      <div class="flex flex-col gap-3 text-white pr-15">
        <h2 class="text-6 lg:text-h5">{{ title }}</h2>
        <p class="text-3.5 leading-[20px] lg:text-body whitespace-pre-line">{{ desc }}</p>
      </div>
      <TryItNow class="shrink-0 mt-6 lg:mt-0 text-[#11A3FD]"/>
    </div>
    <img :alt="alt" src="/use-cases/footer-effect.svg" class="absolute top-0 left-0 w-full object-cover z-9 select-none" draggable="false" />
  </div>
</template>

<script setup lang="ts">
import type { FooterPanelProps } from './interface';
import TryItNow from './TryItNow.vue';
defineProps<FooterPanelProps>()
</script>  