<template>
  <div class="relative rounded-3 overflow-hidden" v-bind="$attrs">
    <div class="px-10 py-10 md:py-34px flex flex-col md:flex-row justify-between items-center gap-15 relative z-10">
      <p class="text-6 font-300 text-white leading-9">
        <rx-i18n-t
          :keypath="$t('最大程度利用 {name} 技术优势，保持竞争力，并探索更多业务增长方式。', { name: '{name}' })"
        >
          <template #name>
            <span class="font-700">
              <slot></slot>
            </span>
          </template>
        </rx-i18n-t>
      </p>

      <NuxtLinkLocale 
        to="/download"
        class="py-4 px-5 hover:bg-black/20 bg-white/20 border-none outline-none rounded-6px text-white flex items-center gap-10px cursor-pointer whitespace-pre"
        @click="handleClick"
      >
        <RxIcon name="base/rx_ic_download" size="20" />{{ $t('立即下载') }}
      </NuxtLinkLocale>
    </div>

    <img :src="svg" class="absolute top-0 left-0 w-full h-full object-cover select-none" alt="" />
    <img 
      src="/panel-download-noise.svg" 
      class="absolute top-0 left-0 w-full h-full object-cover opacity-10 select-none" 
      alt="" 
    />
  </div>
</template>

<script setup>
import { RxIcon } from "@/components/rx-icon"
const { initializeDownload, triggerAutoDownload } = useDownload()

const breakpoints = useRxBreakpoints();
const smWidth = breakpoints.smallerOrEqual('sm')

const svg = computed(() => {
  return smWidth.value ? '/panel-download-small.svg' : '/panel-download.svg'
})

const handleClick = async () => {
  await initializeDownload()
  triggerAutoDownload()
}
</script>

<style scoped>

</style>
