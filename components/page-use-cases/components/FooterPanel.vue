<script setup lang="ts">
import type { FooterPanelProps } from './interface'
import TryItNow from './TryItNow.vue'

defineProps<FooterPanelProps>()
</script>

<template>
  <div class="mb-20 p-6 rounded-3 bg-[linear-gradient(90deg,#F8FAFB_0%,_#F8FAFB_100%)] relative z-10 overflow-hidden lg:px-15 lg:py-10">
    <div class="flex flex-col items-start justify-between relative z-10 lg:flex-row lg:items-center">
      <div class="text-white pr-15 flex flex-col gap-3">
        <h2 class="text-6 multilingual-text font-600 lg:text-h5">
          {{ title }}
        </h2>
        <p class="text-3.5 whitespace-pre-line lg:text-body max-lg:leading-[20px]">
          {{ desc }}
        </p>
      </div>
      <TryItNow class="text-[#11A3FD] mt-6 shrink-0 lg:mt-0" />
    </div>
    <img :alt="alt" src="/use-cases/footer-effect.svg" class="w-full select-none left-0 top-0 absolute z-9 object-cover" draggable="false">
  </div>
</template>
