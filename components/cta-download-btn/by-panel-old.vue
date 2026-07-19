<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
import DownloadIcon from './download-icon.vue'

const { downloadText } = useDownload()
const { redirectMobileDownloadToLogin } = useMobileDownloadRedirect()
</script>

<template>
  <Container v-bind="$attrs">
    <div
      class="gradient-bg mx-auto rounded-b-4 rounded-t-4 gap-5 grid grid-cols-1 overflow-hidden md:rounded-b-0 md:grid-cols-2"
    >
      <div class="px-5 pt-5 flex flex-col col-span-1 items-center md:pl-10 md:pr-0 md:pt-10 md:block">
        <h2
          class="text-6 text-primary font-700 multilingual-text text-center whitespace-pre-wrap lg:text-h3 sm:text-8 max-lg:leading-32px md:text-left"
        >
          {{ $t('隐私保护，从 RoxyBrowser 启航') }}
        </h2>
        <p class="text-sub-title text-[#575D60] leading-32px font-400 text-center md:text-left">
          {{ $t('匿名浏览，远离追踪') }}
        </p>

        <div class="inline-block">
          <!-- <button
            class="text-[#FFF] font-500 my-10 px-32px py-14px border-0 rounded-2 bg-[#33A9FF] flex gap-2 cursor-pointer items-center md:mb-8 md:mt-50px"
          >
            <ClientOnly>
              <DownloadIcon />
            </ClientOnly>
            {{ downloadText }}
          </button> -->

          <NuxtLinkLocale class="text-[#FFF] font-500 my-10 px-32px py-14px border-0 rounded-2 bg-[#33A9FF] flex gap-2 cursor-pointer items-center md:mb-8 md:mt-50px" to="/download" @click.capture="redirectMobileDownloadToLogin">
            <RxIcon name="base/rx_ic_download" class="inline-flex text-white max-[1123px]:hidden" size="24" />
            {{ $t('免费使用') }}
            <RxIcon name="base/rx_ic_chevron_right" class="hidden text-white max-[1123px]:inline-flex" size="24" />
          </NuxtLinkLocale>
        </div>
      </div>
      <div class="col-span-1 hidden relative md:block">
        <RxResponsiveImage name="illustrated" alt="" class="pt-6 wh-full object-cover object-left-top" />
      </div>
    </div>
  </Container>
</template>

<style scoped lang="scss">
.gradient-bg {
  background-image:
    linear-gradient(180deg, #e9f2fe 0%, #f5f9ff 100%), linear-gradient(0deg, #d8ecfd 0%, #d8ecfd 100%),
    linear-gradient(90deg, #e6f2fd 0%, #e6f2fd 100%);
}

</style>
