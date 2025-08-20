<template>
  <NuxtLinkLocale to="/download" :class="[type]" class="px-6 py-3 rounded-2 flex items-center gap-1 text-sub-title font-500 bg-white transition-all duration-200 try-btn" v-bind="$attrs" @click="handleClick">
    {{ $t('免费试用') }}
    <RxIcon name="base/rx_ic_right" size="24" />
  </NuxtLinkLocale>
</template>

<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
import { useDownload } from '~/composables/useDownload'

defineProps<{
  type?: 'primary' | 'secondary'
}>()

const { initializeDownload, triggerAutoDownload } = useDownload()

const handleClick = async () => {
  await initializeDownload()
  triggerAutoDownload()
}
</script>

<style lang="scss" scoped>
:where(.try-btn) {
  &.primary {
    color: #fff;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0);
    background: linear-gradient(0deg, #12a3fc 0%, #12a3fc 100%), linear-gradient(99deg, #238aff 67.78%, #f9b3b4 107.9%);
  }
}

:where(.try-btn:hover) {
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16);
}
</style>