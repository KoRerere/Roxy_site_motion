<script setup lang="ts">
import HeroBg from '@/assets/images/functions/roxy-ip/hero_bg.svg?url'
import HeroBgM from '@/assets/images/functions/roxy-ip/hero_bg_m.svg?url'

// import { useRealtime } from '~/composables/useRealtime'
import AnimateCurve from './AnimateCurve.vue'

import Cobe from './cobe.vue'

// const { public: { isChinaSite } } = useRuntimeConfig()
// const { downloadText } = useDownload()
useBackTop(useTemplateRef('usingAndInteractionRef'))
useBackTop(useTemplateRef('communityRef'))

// const isShowGlobe = ref(false)
// const { $isRealUser } = useNuxtApp()
const breakpoints = useRxBreakpoints()
const isMobile = breakpoints.smallerOrEqual('sm')
// const isMdWidth = useRxMaxMd()
// const isXlWidth = useRxMinXl()

const { $t } = useRxI18n()

const data = computed(() => [
  {
    label: $t('业务成功率'),
    value: '99%+',
  },
  {
    label: $t('真实住宅 IP 池规模'),
    value: $t('9000万+'),
  },
  {
    label: $t('国家 / 地区代理 IP 覆盖'),
    value: '200+',
  },
])
</script>

<template>
  <div class="pt-96px w-full relative overflow-hidden md:pb-60px md:pt-120px xl:pt-140px md:h-668px xl:h-700px">
    <img :src="HeroBg" class="h-full w-full hidden inset-0 absolute object-cover md:block">
    <img :src="HeroBgM" class="h-full w-full block inset-0 absolute object-cover md:hidden">

    <Container class="flex flex-col gap-40px h-full relative z-1 md:flex-row md:gap-0 xl:gap-48px">
      <div class="flex flex-col max-w-440px relative z-1 xl:max-w-652px md:justify-around">
        <div>
          <h1 class="text-7 color-[#111213] leading-8 font-700 multilingual-text text-center whitespace-pre-line md:text-9.5 xl:text-12 md:leading-11.5 xl:leading-15 md:text-left xl:text-left">
            <rx-i18n-t :keypath="$t('{color}\n{block}防关联解决方案', { color: '{color}', block: '{block}' })">
              <template #color>
                <span class="roxyip">{{ $t('Roxy浏览器 × RoxyIP') }}</span>
              </template>
              <template #block>
                <AnimateCurve />
              </template>
            </rx-i18n-t>
          </h1>
          <h3 class="text-4 color-[#34393D] leading-6 mt-4 text-center md:text-4.5 md:leading-7 md:text-left">
            {{ $t('Roxy浏览器先进的浏览器指纹隔离技术，与 RoxyIP 海量高匿代理 IP 池无缝结合，彻底消除浏览器与 IP 的关联风险，为您的业务保驾护航。') }}
          </h3>
          <div class="mt-4 flex justify-center relative md:mt-6 md:justify-start">
            <CtaDownloadBtnByHome :btn-text="$t('免费体验')" mobile-chevron />
          </div>
        </div>
        <div class="min-h-72px hidden relative xl:min-h-80px md:block">
          <div class="gap-6 w-max hidden bottom-0 left-0 absolute md:flex xl:gap-10">
            <div v-for="item in data" :key="item.label" class="flex flex-col gap-2.5">
              <div class="text-4 color-[#575D60] leading-22px font-500">
                {{ item.label }}
              </div>
              <div class="text-7.5 color-[#111213] leading-10 font-700 xl:text-9 xl:leading-48px">
                {{ `${item.value?.toLocaleString()}` }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <client-only>
        <Cobe v-if="!isMobile" />
      </client-only>
      <div v-if="isMobile" class="flex h-400px relative">
        <div class="flex flex-col gap-6 h-full justify-center absolute z-1">
          <div v-for="item in data" :key="item.label" class="flex flex-col gap-1">
            <div class="text-3.25 color-[#575D60] leading-4.5 font-500">
              {{ item.label }}
            </div>
            <div class="text-7 color-[#111213] leading-9 font-700">
              {{ `${item.value?.toLocaleString()}` }}
            </div>
          </div>
        </div>
        <div class="h-full w-full left-2/5 absolute">
          <client-only>
            <Cobe />
          </client-only>
        </div>
      </div>
    </Container>
  </div>
</template>

<style lang="scss" scoped>
.roxyip {
  background: linear-gradient(94deg, #3990f8 -1.41%, #13dd8d 99.64%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

[lang='zh-CN'] .h1-title {
  line-height: 1.3;
  letter-spacing: 1px;
}
</style>
