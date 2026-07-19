<script setup lang="ts">
import ecommerce from '@/assets/images/functions/roxy-ip/e-commerce.svg?url'
</script>

<template>
  <Container>
    <div class="pb-15 pt-5 gap-20 hidden items-center justify-center md:flex">
      <img class="max-w-105" :src="ecommerce" :alt="$t('专为跨境电商优化')">
      <div class="max-w-660px">
        <h2 class="text-8.5 color-[#111213] leading-11 font-700 multilingual-text xl:text-10 xl:leading-12">
          {{ $t('专为跨境电商优化') }}
        </h2>
        <div class="text-4.5 color-[#34393D] leading-7 mt-4">
          {{ $t('适配 Amazon、TikTok、SHEIN、Temu 等主流跨境平台。支持多账号独立隔离运营，彻底规避平台风控关联检测。') }}
        </div>
      </div>
    </div>

    <div class="pb-12 pt-12 flex flex-col gap-10 w-full items-center justify-center md:hidden">
      <h2 class="text-6 color-[#111213] leading-7 font-600 multilingual-text text-center">
        {{ $t('专为跨境电商优化') }}
      </h2>
      <img class="w-300px" :src="ecommerce" :alt="$t('专为跨境电商优化')">
      <div class="text-3.5 color-[#34393D] leading-5.5 text-center">
        {{ $t('适配 Amazon、TikTok、SHEIN、Temu 等主流跨境平台。支持多账号独立隔离运营，彻底规避平台风控关联检测。') }}
      </div>
    </div>
  </Container>
</template>

<style lang="scss" scoped></style>
