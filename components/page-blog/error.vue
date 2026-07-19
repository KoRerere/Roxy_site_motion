<template>
  <div class="h-[calc(100dvh-132px)] w-full flex justify-center items-center">
    <div class="text-center">
      <RxIcon name="other/rx_illustration_star" size="140" />
      <h1 class="text-primary multilingual-text text-h6 mt-3">
        {{ $t('网络错误') }}
      </h1>
      <p class="text-primary multilingual-text text-body">
        {{ $t('请检查您的网络设置并重试。') }}
      </p>
      <div class="inline-flex justify-center items-center gap-3 mt-6">
        <button 
          @click="refresh" 
          class="border-none bg-[#11A3FD] text-white rounded-2 px-6 h-12 flex items-center justify-center text-sub-title"
        >
          {{ $t('刷新重试') }}
        </button>
        <NuxtLinkLocale 
          to="/" 
          class="px-6 h-12 flex items-center justify-center rounded-2 border-2 border-solid border-[#11A3FD] text-sub-title text-[#11A3FD]"
        >
          {{ $t('返回首页') }}
        </NuxtLinkLocale>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

const { $t } = useRxI18n()

const refresh = () => {
  window.location.reload()
}
</script>
