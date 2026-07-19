<script setup lang="ts">
import { NuxtLinkLocale } from '#components'
import { animate, motionValue, useMotionValueEvent } from 'motion-v'
import { RxIcon } from '@/components/rx-icon'
import DownloadIcon from './download-icon.vue'

interface Props {
  iconSize?: number
  autoDownload?: boolean
  icon?: string
  onClick?: () => void | Promise<void>
  btnText?: string
  tag?: string
  mobileChevron?: boolean
  showHat?: boolean
  showHatIcon?: boolean
}

const { iconSize = 24, autoDownload = true, onClick, mobileChevron = false } = defineProps<Props>()

const d = motionValue('42%')
const r = ref('42%')
const { redirectMobileDownloadToLogin } = useMobileDownloadRedirect()

async function handleClick(_e: MouseEvent) {
  if (redirectMobileDownloadToLogin(_e)) {
    return
  }

  await onClick?.()
  if (autoDownload && import.meta.client) {
    globalThis.$downloadApp()
  }
}

useMotionValueEvent(d, 'change', (value) => {
  r.value = value
})
</script>

<template>
  <!-- <button
    class="btn-effect text-white font-500 px-6 py-3 rounded-2 bg-[#11A3FD] flex gap-2 cursor-pointer items-center"
    :style="{ background: `linear-gradient(315deg, #F9B3B4 0%, #238AFF ${r})` }"
    v-bind="$attrs"
    role="button"
    type="button"
    @mouseenter="animate(d, '82%')"
    @mouseleave="animate(d, '42%')"
    @click.prevent="handleClick"
  >
    <ClientOnly>
      <DownloadIcon v-if="autoDownload" :size="iconSize" />
      <RxIcon v-else name="base/rx_ic_download" />
    </ClientOnly>
    <slot />
  </button> -->
  <component
    :is="tag || NuxtLinkLocale"
    class="text-white font-500 px-6 py-3 rounded-2 bg-[#11A3FD] flex gap-2 cursor-pointer items-center relative"
    :style="{ background: `linear-gradient(315deg, #F9B3B4 0%, #238AFF ${r})` }"
    v-bind="$attrs"
    role="button"
    to="/download"
    @mouseenter="animate(d, '82%')"
    @mouseleave="animate(d, '42%')"
    @click.capture="redirectMobileDownloadToLogin"
  >
    <RxIcon :class="mobileChevron ? 'inline-flex max-[1123px]:hidden' : undefined" :name="icon || 'base/rx_ic_download'" :size="iconSize" />
    {{ btnText || $t('免费使用') }}
    <RxIcon v-if="mobileChevron" class="hidden max-[1123px]:inline-flex" name="base/rx_ic_chevron_right" :size="iconSize" />

    <img v-if="showHat" src="/pricing/christmas/hat.png" class="w-full right-0 absolute en-US:-top-8px ru-RU:-top-14px zh-CN:-top-7px">
    <div v-if="showHatIcon" class="rotate-35 absolute -right-4 -top-4">
      <RxIcon name="color/rx-rl-hat" size="36" />
    </div>
  </component>
</template>
