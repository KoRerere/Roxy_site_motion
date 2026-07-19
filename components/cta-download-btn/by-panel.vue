<script setup>
import { RxIcon } from '@/components/rx-icon'

const breakpoints = useRxBreakpoints()
const smWidth = breakpoints.smallerOrEqual('sm')
const { redirectMobileDownloadToLogin } = useMobileDownloadRedirect()

const svg = computed(() => {
  return smWidth.value ? '/panel-download-small.svg' : '/panel-download.svg'
})
</script>

<template>
  <div class="rounded-3 relative overflow-hidden" v-bind="$attrs">
    <div class="px-10 py-10 flex flex-col gap-15 items-center justify-between relative z-10 md:py-34px md:flex-row">
      <p class="text-6 text-white leading-9">
        <rx-i18n-t
          :keypath="$t('最大程度利用 {name} 技术优势，保持竞争力，并探索更多业务增长方式。', { name: '{name}' })"
        >
          <template #name>
            <span class="font-700">
              <slot />
            </span>
          </template>
        </rx-i18n-t>
      </p>

      <!-- <button
        class="text-white px-5 py-4 outline-none rounded-1.5 border-none bg-white/20 flex gap-2.5 cursor-pointer cursor-pointer whitespace-pre items-center hover:bg-black/20"
        @click="handleClick"
      >
        <ClientOnly>
          <DownloadIcon :size="24" />
        </ClientOnly>
        {{ downloadText }}
      </button> -->

      <NuxtLinkLocale class="text-white px-5 py-4 outline-none rounded-1.5 border-none bg-white/20 flex gap-2.5 cursor-pointer cursor-pointer whitespace-pre items-center hover:bg-black/20" to="/download" @click.capture="redirectMobileDownloadToLogin">
        <RxIcon name="base/rx_ic_download" class="inline-flex text-white max-[1123px]:hidden" size="24" />
        {{ $t('免费使用') }}
        <RxIcon name="base/rx_ic_chevron_right" class="hidden text-white max-[1123px]:inline-flex" size="24" />
      </NuxtLinkLocale>
    </div>

    <img :src="svg" class="h-full w-full select-none left-0 top-0 absolute object-cover" alt="">
    <img
      src="/panel-download-noise.svg"
      class="opacity-10 h-full w-full select-none left-0 top-0 absolute object-cover"
      alt=""
    >
  </div>
</template>

<style scoped>
</style>
