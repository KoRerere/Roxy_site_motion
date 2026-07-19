<script setup lang="ts">
const accountsIcons = [
  '/home/feature-carousel/carousel/banner-svgs/01.svg', // 跨境电商店铺
  '/home/feature-carousel/carousel/banner-svgs/02.svg', // 跨境电商店铺
  '/home/feature-carousel/carousel/banner-svgs/03.svg', // 海外社媒矩阵
  '/home/feature-carousel/carousel/banner-svgs/04.svg', // 跨境电商店铺
  '/home/feature-carousel/carousel/banner-svgs/05.svg',
  '/home/feature-carousel/carousel/banner-svgs/06.svg', // 跨境电商店铺
  '/home/feature-carousel/carousel/banner-svgs/07.svg', // 海外社媒矩阵
  '/home/feature-carousel/carousel/banner-svgs/08.svg', // 跨境电商店铺
  '/home/feature-carousel/carousel/banner-svgs/09.svg',
  '/home/feature-carousel/carousel/banner-svgs/10.svg',
]
</script>

<template>
  <div class="flex flex-wrap gap-3 justify-center lg:gap-3 md:gap-2.5 xl:gap-3.5 md:justify-start">
    <div class="flex gap-2 lg:gap-2 md:gap-1.5">
      <div v-for="icon in accountsIcons" :key="icon" class="size-28px lg:size-28px md:size-[26px]">
        <img :src="icon" class="select-none" draggable="false" loading="lazy">
      </div>
    </div>
    <div class="gradient-text text-13px leading-18px font-500 flex items-center lg:text-14px md:text-13px lg:leading-20px md:leading-18px xl:leading-22px">
      {{ $t('专为平台定制优化') }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gradient-text {
  background: linear-gradient(94deg, #3990f8 -1.41%, #13dd8d 99.64%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
