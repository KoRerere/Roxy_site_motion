<script setup>
import { RxIcon } from '@/components/rx-icon'

const { redirectMobileDownloadToLogin } = useMobileDownloadRedirect()
</script>

<template>
  <Container class="my-8 rounded-3 relative overflow-hidden lg:my-15 lg:rounded-10">
    <div class="bottom-0 left-0 right-0 top-0 absolute z-9">
      <RxResponsiveImage
        name="download/panel-bg"
        alt=""
        class="h-full w-full object-cover"
      />
      <div class="bg-black/10 bottom-0 left-0 right-0 top-0 absolute z-10" />
    </div>

    <div class="pb-10 pt-30px flex flex-col items-center relative z-10">
      <RxIcon name="base/rx_ic_logo" size="72" />
      <div class="my-6 text-center">
        <h2
          class="multilingual-text text-white font-700 text-5 leading-24px md:text-7 md:leading-8 lg:text-9 lg:leading-32px xl:text-40px xl:leading-40px"
        >
          {{ $t('隐私保护，从 RoxyBrowser 启航') }}
        </h2>
        <p
          class="multilingual-text text-white font-400 text-4.5 leading-32px md:text-5 lg:text-6 lg:leading-48px"
        >
          {{ $t('匿名浏览，远离追踪') }}
        </p>
      </div>
      <NuxtLinkLocale class="text-16px text-white font-500 px-5 py-3 rounded-2 bg-[#11A3FD] flex gap-2 cursor-pointer items-center" to="/download" @click.capture="redirectMobileDownloadToLogin">
        <RxIcon name="base/rx_ic_download" class="inline-flex text-white max-[1123px]:hidden" size="24" />
        {{ $t('免费使用') }}
        <RxIcon name="base/rx_ic_chevron_right" class="hidden text-white max-[1123px]:inline-flex" size="24" />
      </NuxtLinkLocale>
    </div>
  </Container>
</template>
