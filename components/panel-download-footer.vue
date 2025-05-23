<template>
  <Container v-bind="$attrs">
    <div 
      class="rounded-b-4 md:rounded-b-0 rounded-t-4 gradient-bg mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 overflow-hidden" 
    >
      <div class="px-5 pt-5 md:pl-10 md:pr-0 md:pt-10 col-span-1 flex md:block flex-col items-center">
        <h2 
          class="text-primary font-700 font-[Archivo] whitespace-pre-wrap text-6 leading-32px sm:text-8 lg:text-h3 text-center md:text-left"
        >
          {{ $t('隐私保护，从 RoxyBrowser 启航') }}
        </h2>
        <p class="text-[#575D60] text-center md:text-left font-400 leading-32px text-sub-title">
          {{ $t('匿名浏览，远离追踪') }}
        </p>

        <div class="inline-block">
          <NuxtLinkLocale 
            to="/download"
            class="text-[#FFF] font-500 flex items-center gap-2 px-32px py-14px rounded-2 border-0 bg-[#33A9FF] cursor-pointer my-10 md:mt-50px md:mb-8"
          >
            <RxIcon name="base/rx_ic_download" />
            {{ $t('立即下载') }}
          </NuxtLinkLocale>
        </div>
      </div>
      <div class="col-span-1 hidden md:block relative">
        <RxResponsiveImage name='illustrated' alt="" class="pt-6 wh-full object-cover object-left-top" />
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
</script>

<style scoped lang="scss">
.gradient-bg {
  background-image: linear-gradient(180deg, #E9F2FE 0%, #F5F9FF 100%), linear-gradient(0deg, #D8ECFD 0%, #D8ECFD 100%), linear-gradient(90deg, #E6F2FD 0%, #E6F2FD 100%);
}
</style>
