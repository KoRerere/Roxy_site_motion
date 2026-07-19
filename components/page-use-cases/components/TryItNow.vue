<script setup lang="ts">
import DownloadIcon from '@/components/cta-download-btn/download-icon.vue'
import { RxIcon } from '@/components/rx-icon'
import { useDownload } from '~/composables/useDownload'
import { useRxI18n } from '~/composables/useRxI18n'

defineProps<{
  text?: string
  type?: 'primary' | 'secondary'
}>()

const { $t } = useRxI18n()
const { initializeDownload, triggerAutoDownload, downloadText } = useDownload()
const { redirectMobileDownloadToLogin } = useMobileDownloadRedirect()

async function handleClick(event?: MouseEvent) {
  if (redirectMobileDownloadToLogin(event)) {
    return
  }

  await initializeDownload()
  triggerAutoDownload()
}
</script>

<template>
  <!-- <button
    :class="[type]" class="try-btn text-sub-title font-500 px-6 py-3 rounded-2 bg-white flex gap-2 cursor-pointer transition-all duration-200 items-center" v-bind="$attrs"
    @click="handleClick"
  >
    <DownloadIcon size="24" />
    {{ text || downloadText }}
  </button> -->

  <NuxtLinkLocale :class="[type]" class="try-btn text-sub-title font-500 px-6 py-3 rounded-2 bg-white flex gap-2 cursor-pointer transition-all duration-200 items-center" v-bind="$attrs" to="/download" @click.capture="redirectMobileDownloadToLogin">
    <RxIcon class="inline-flex max-[1123px]:hidden" name="base/rx_ic_download" size="24" />
    {{ text || $t('免费使用') }}
    <RxIcon class="hidden max-[1123px]:inline-flex" name="base/rx_ic_chevron_right" size="24" />
  </NuxtLinkLocale>
</template>

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
