<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

const { isZh } = useRxI18n()
const { redirectMobileDownloadToLogin } = useMobileDownloadRedirect()

const svgs = computed(() => {
  if (isZh.value) {
    return {
      pc: '/home/activity/zh-cards-pc.svg',
      mobile: '/home/activity/zh-cards-mobile.svg',
    }
  }
  else {
    return {
      pc: '/home/activity/cards-pc.svg',
      mobile: '/home/activity/cards-mobile.svg',
    }
  }
})
</script>

<template>
  <div class="activity-content top-0 sticky">
    <Container class="text-white flex flex-col items-center justify-between relative overflow-hidden lg:(px-15 flex-row)">
      <div class="pb-267px pt-120px text-center flex flex-col gap-3 justify-center lg:(pb-137px pt-166px text-left gap-5 w-560px)">
        <div class="hidden lg:block">
          <img src="/home/activity/free-proxy.svg" alt="free-proxy">
        </div>
        <div class="text-7 leading-120% font-700 flex flex-col gap-2 lg:(text-11 gap-1 zh-CN:text-52px)">
          <p class="en-US:font-[Archivo] zh-CN:hidden">
            {{ $t('代理 IP 免费送：') }}
          </p>
          <p class="text-transparent bg-[linear-gradient(90deg,#E983FA_0.55%,#3193FF_89.6%)] bg-clip-text">
            {{ $t('代理 IP / 流量包免费送') }}
          </p>
        </div>
        <p class="text-4 leading-140% flex flex-col gap-1 whitespace-pre-line lg:gap-2">
          <span>{{ $t('窗口每消费$7.00 ，可选下面赠品，赠送无上限：') }}</span>
          <span>{{ $t('动态住宅代理 IP 流量包 / 美国静态住宅代理 IP（30天）') }}</span>
        </p>
        <div class="pt-3 flex flex-col gap-2 items-center lg:items-start">
          <NuxtLinkLocale to="/download" class="px-9 py-2.5 rounded-2 bg-[linear-gradient(90deg,#E983FA_0.55%,#3193FF_89.6%)] flex gap-1.5 w-fit cursor-pointer items-center lg:py-3" @click.capture="redirectMobileDownloadToLogin">
            <span class="font-600">{{ $t('获取免费代理 IP') }}</span>
            <RxIcon name="base/cursor-right" size="20" />
          </NuxtLinkLocale>
        </div>
      </div>

      <img :src="svgs.pc" alt="activity-bg" class="hidden lg:(block top-1/2 absolute -translate-y-1/2 -right-10)">
      <img :src="svgs.mobile" class="block left-1/2 absolute lg:hidden -translate-x-1/2 -bottom-90px">
    </Container>
  </div>
</template>

<style scoped>
.activity-content {
  background:
    radial-gradient(56.06% 63.39% at 3.44% 0%, rgba(60, 70, 131, 0.7) 0%, rgba(88, 89, 92, 0) 100%),
    linear-gradient(0deg, #030b11 0%, #030b11 100%), #05101a;
}
</style>
