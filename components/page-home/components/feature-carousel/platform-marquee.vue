<script setup lang="ts">
/** 与 Figma 底部 Logo 条一致，路径均指向已存在的静态资源 */
const carouselPlatformLogos = [
  '/home/feature-carousel/platforms/aliexpress.svg',
  '/home/feature-carousel/platforms/shopify.svg',
  '/home/feature-carousel/platforms/ebay.svg',
  '/home/feature-carousel/platforms/facebook.svg',
  '/home/feature-carousel/platforms/etsy.svg',
  '/home/feature-carousel/platforms/amazon.svg',
]
</script>

<template>
  <div class="flex flex-col gap-3 items-center">
    <p class="text-3.5 text-black/60 leading-5 font-normal text-center">
      {{ $t('我们支持的主流平台：') }}
    </p>
    <div class="flex gap-10 w-full items-center justify-center overflow-hidden">
      <div v-for="logo in carouselPlatformLogos" :key="logo" class="flex-shrink-0 h-10 md:h-72px">
        <img :src="logo" alt="" class="h-full select-none object-contain" draggable="false" loading="lazy">
      </div>
    </div>
  </div>
</template>
