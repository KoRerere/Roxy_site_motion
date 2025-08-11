<template>
  <NuxtLinkLocale to="/download" class="px-6 py-3 rounded-2 flex items-center gap-1 text-sub-title font-500 bg-white transition-all duration-200 tyr-btn" v-bind="$attrs" @click="handleClick">
    {{ $t('免费试用') }}
    <RxIcon name="base/rx_ic_right" size="24" />
  </NuxtLinkLocale>
</template>

<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
import { useDownload } from '~/composables/useDownload'

const { initializeDownload, triggerAutoDownload } = useDownload()

const handleClick = async () => {
  await initializeDownload()
  triggerAutoDownload()
}
</script>

<style>
:where(.tyr-btn:hover) {
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16);
}
</style>