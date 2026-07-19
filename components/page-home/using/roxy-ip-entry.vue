<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
// import { useRealtime } from '~/composables/useRealtime'
// import AnimateCurve2 from './AnimateCurve2.vue'
import AnimateCurve from '../../page-functions/roxy-ip/AnimateCurve.vue'

import Cobe from '../../page-functions/roxy-ip/cobe.vue'

// const { public: { isChinaSite } } = useRuntimeConfig()
// const { downloadText } = useDownload()
useBackTop(useTemplateRef('usingAndInteractionRef'))
useBackTop(useTemplateRef('communityRef'))

const isMdWidth = useRxMaxMd()
const cobeViewportRef = useTemplateRef<HTMLElement>('cobeViewportRef')
const shouldRenderCobe = ref(false)

useIntersectionObserver(
  cobeViewportRef,
  ([{ isIntersecting }]) => {
    shouldRenderCobe.value = isIntersecting
  },
  { rootMargin: '100px' },
)

const { $t } = useRxI18n()
</script>

<template>
  <div class="w-full relative overflow-hidden">
    <Container class="mt-40px flex flex-col relative z-1 lg:mb-40px lg:mt-120px md:mt-48px md:flex-row md:gap-40px md:gap-48px">
      <div
        v-if="!isMdWidth"
        ref="cobeViewportRef"
        class="cobe-entry-slot ml-10 flex-1 max-w-550px overflow-hidden"
      >
        <ClientOnly>
          <Cobe v-if="shouldRenderCobe" cobe-left />
        </ClientOnly>
      </div>
      <div class="mb-40px flex flex-col justify-center relative z-1 overflow-hidden md:mb-0 md:flex-1">
        <h2 class="text-7 color-[#111213] leading-8 font-700 multilingual-text text-center whitespace-pre-line md:text-9 xl:text-12 md:leading-12 xl:leading-15 md:text-left">
          <rx-i18n-t :keypath="$t('{color}\n{block}防关联解决方案', { color: '{color}', block: '{block}' })">
            <template #color>
              <span class="roxyip">{{ $t('Roxy浏览器 × RoxyIP') }}</span>
            </template>
            <template #block>
              <AnimateCurve />
            </template>
          </rx-i18n-t>
        </h2>
        <h3 class="text-4 color-[#34393D] leading-6 mt-4 text-center md:text-4.5 md:leading-7 md:text-left">
          {{ $t('Roxy浏览器先进的浏览器指纹隔离技术，与 RoxyIP 海量高匿代理 IP 池无缝结合，彻底消除浏览器与 IP 的关联风险，为您的业务保驾护航。') }}
        </h3>
        <div class="cta-actions mx-auto mt-6 flex flex-wrap gap-3 justify-center md:mx-0 md:justify-start">
          <CtaDownloadBtnByHome class="cta-actions__btn shrink-0 whitespace-nowrap" :btn-text="$t('免费体验')" mobile-chevron />

          <NuxtLinkLocale to="/functions/roxy-ip" class="cta-actions__btn entry-btn text-4 leading-6 font-500 px-6 py-3 rounded-2 flex shrink-0 cursor-pointer whitespace-nowrap items-center justify-center md:justify-start">
            <span>{{ $t('查看详情') }}</span>
          </NuxtLinkLocale>
        </div>
      </div>
      <div v-if="isMdWidth" class="flex relative">
        <img src="/home/roxy-ip/earth.png" class="earth-entry-img" loading="eager" fetchpriority="high" width="780" height="640" :alt="$t('Roxy浏览器 × RoxyIP')">
        <!-- <NuxtImg
          src="/home/roxy-ip/earth.png"
          format="avif,webp"
          quality="85"
          class="earth-entry-img"
          loading="eager"
          fetchpriority="high"
          width="780"
          height="640"
          :alt="$t('Roxy浏览器 × RoxyIP')"
        /> -->
      </div>
    </Container>
  </div>
</template>

<style lang="scss" scoped>
.cobe-entry-slot {
  min-height: min(500px, 70vh);

  @media (max-width: 768px) {
    min-height: 320px;
  }
}

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

// 英文 <394px、俄语 <410px：单列 grid，两按钮同宽（以较宽者为准）
@mixin cta-actions-equal-width-grid {
  display: inline-grid;
  width: fit-content;
  max-width: 100%;
  grid-template-columns: 1fr;

  .cta-actions__btn {
    width: 100%;
    justify-content: center;
  }
}

html[lang='en-US'] .cta-actions {
  @media (width < 394px) {
    @include cta-actions-equal-width-grid;
  }
}

html[lang='ru-RU'] .cta-actions {
  @media (width < 410px) {
    @include cta-actions-equal-width-grid;
  }
}

.entry-btn {
  color: #11a3fd;
  border: 1px solid #11a3fd;
  transition: all 0.3s ease;

  &:hover {
    color: #0282d4;
    border-color: #0282d4;
  }
}
</style>
