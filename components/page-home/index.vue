<script setup lang="ts">
import { useBreakpoints, useElementVisibility } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { RxIcon } from '@/components/rx-icon'
import Faq from '../../components/faq.vue'
import RxDialog from '../rx-dialog.vue'
import LogoBrand from './brand.vue'
import CertificationNew from './certification-new.vue'
import Community from './community.vue'
import AnimateCurve2 from './components/AnimateCurve2.vue'
import AnimateCurve from './components/AnimateCurve.vue'
import FeatureCarousel from './components/feature-carousel/index.vue'
import HomeBg from './components/HomeBg.vue'
import Realtime from './components/realtime/index.vue'
import Youtube from './components/youtube.vue'
import Interaction from './interaction/index.vue'
import KernelSync from './kernel-sync.vue'
import Tech from './tech.vue'
import TopUpHero from './top-up-hero.vue'
import Using from './using/index.vue'

const { public: { isChinaSite } } = useRuntimeConfig()
const { $eventBus } = useNuxtApp()
const breakpoints = useRxBreakpoints()
const { downloadText } = useDownload()
const lgWidth = breakpoints.smallerOrEqual('lg')
useBackTop(useTemplateRef('usingAndInteractionRef'))
useBackTop(useTemplateRef('communityRef'))

const isShowGlobe = ref(false)
const kernelSyncAnimating = ref(false)
const { $isRealUser } = useNuxtApp()
const pageHomeHeroRef = useTemplateRef<HTMLDivElement>('pageHomeHero')
const targetIsVisible = useElementVisibility(pageHomeHeroRef, {
  rootMargin: '-60px', // 要完全进入视口 60px 才触发
})

const { $t } = useRxI18n()

const { locale } = useRxI18n()

const { public: { roxyHomeUrl } } = useRuntimeConfig()
const localePath = useLocalePath()
const mobileGiftDialogVisible = ref(false)
const MOBILE_HEADER_MEDIA = '(max-width: 1123px)'

function closeMobileGiftDialog() {
  mobileGiftDialogVisible.value = false
}

function openMobileGiftDialog() {
  if (import.meta.client && window.matchMedia(MOBILE_HEADER_MEDIA).matches) {
    mobileGiftDialogVisible.value = true
    return
  }

  navigateTo(localePath('/download'))
}

function copyOfficialSiteUrl() {
  const officialSiteUrl = roxyHomeUrl || window.location.origin
  copyText(officialSiteUrl)
  toast.success($t('复制成功'))
  closeMobileGiftDialog()
}

const apiDocs = computed(() => {
  const apiDocPath = 'api-documentation/api-reference.html'
  let prefix = `${roxyHomeUrl}/docs/`

  if (locale.value === 'ru') {
    prefix = `${prefix}ru/`
  }

  return prefix + apiDocPath
})

const heroUseCaseLinks = computed(() => [
  { label: $t('跨境电商'), to: '/use-cases/ecommerce-marketing' },
  { label: $t('海外社媒'), to: '/use-cases/social-media-marketing' },
  { label: $t('广告投放'), to: '/use-cases/paid-search-advertising' },
  { label: $t('联盟营销'), to: '/use-cases/affiliate-marketing' },
  { label: $t('数据爬取'), to: '/use-cases/web-scraping' },
  { label: $t('SEO 优化'), to: '/use-cases/seo-content-marketing' },
])
// const Aurora = defineAsyncComponent(() => import('./components/Aurora.vue'))

const ElectricBg = defineAsyncComponent(() => import('./components/ElectricBg.vue'))

// const GithubGlobeV2 = defineAsyncComponent(() => import('./components/GithubGlobeV2.vue'))

// const ParticlesBg = defineAsyncComponent(() => import('./components/ParticlesBg.vue'))

const fqaList = [
  {
    title: $t('RoxyBrowser 如何助力我的业务？'),
    desc: $t('RoxyBrowser 以先进的指纹反追踪技术赋能您的业务，确保巅峰性能。'),
  },
  {
    title: $t('我的数据在 RoxyBrowser 中完全安全吗？'),
    desc: $t('您在 RoxyBrowser 中的浏览活动和个人信息完全私密，我们采用端到端加密保护您的数据，为多账号敏感操作提供必要的安全保障。'),
  },
  {
    title: $t('RoxyBrowser 使用起来复杂吗？'),
    desc: $t('RoxyBrowser 提供直观界面，兼顾简洁与强大功能。核心功能快速上手，高级定制选项满足资深用户需求。'),
  },
  {
    title: $t('RoxyBrowser 有何独特之处？'),
    desc: $t('RoxyBrowser 凭借独家指纹算法和跨平台稳定性脱颖而出。我们的技术在高安全平台上也能防止检测，同时保持媲美原生应用的性能。'),
  },
  {
    title: $t('我可以免费试用 RoxyBrowser 吗？'),
    desc: $t('当然可以，RoxyBrowser 提供永久免费计划，包含 5 个配置文件。对于需要更多功能的用户，我们提供 7 天全面免费试用，让您在真实业务环境中测试我们的解决方案。'),
  },
  {
    title: $t('如果我未及时续费会怎样？'),
    desc: $t('订阅过期后，您的配置文件和数据仍安全存储。此期间无法启动配置文件，但所有设置完整保留。随时续费即可恢复完整访问，无需重新配置，无数据丢失。'),
  },
]

watch(targetIsVisible, (visible) => {
  $eventBus.emit('pageHomeHeroVisible', visible)
}, { flush: 'post' })

onMounted(() => {
  if ($isRealUser) {
    requestIdleCallback(() => {
      isShowGlobe.value = true
    })
  }
})
</script>

<template>
  <main id="home-content" class="relative">
    <!-- <TopUpHero /> -->
    <!--
    <div
      class="relative overflow-hidden"
      :style="{ background: 'linear-gradient(180deg, #AED6F0 0%, rgba(174, 214, 240, 0.00) 30%), #DCEDF7' }"
    >
      <RoxyAgent />
    </div> -->
    <!-- <FeatureCarousel @open-gift-dialog="openMobileGiftDialog" /> -->

    <div class="relative z-10">
      <div ref="pageHomeHero" class="hero text-white pb-15 relative lg:pb-150px">
        <section>
          <ClientOnly>
            <RxLazy
              v-if="isWebGLSupported()" :sync-comp-import="() => import('./components/Aurora.vue')"
              :comp-props="{ speed: 0.5, paused: kernelSyncAnimating, class: 'left-0 top-0 absolute z-0' }"
            />
            <RxLazy v-if="isWebGLSupported()" :sync-comp-import="() => import('./components/RisingStar.vue')" />
          </ClientOnly>

          <div class="section-main mt-[108px] md:mt-[138px]">
            <Container class="flex flex-col gap-4 justify-center relative z-1 md:gap-6">
              <div class="flex justify-center">
                <ul class="list-none gap-x-8 gap-y-2 grid grid-cols-4 justify-center md:gap-y-8 md:grid-cols-3">
                  <li class="col-span-2 md:col-span-1">
                    <a
                      href="https://www.g2.com/products/roxybrowser/reviews" target="_blank" rel="noopener noreferrer"
                      :aria-label="$t('在 G2 查看 RoxyBrowser 评价')"
                    >
                      <img src="/home/g2.svg" alt="" draggable="false" class="h-7 select-none">
                    </a>
                  </li>
                  <li class="col-span-2 md:col-span-1">
                    <a
                      href="https://www.producthunt.com/products/roxybrowser/reviews" target="_blank"
                      rel="noopener noreferrer" :aria-label="$t('在 Product Hunt 查看 RoxyBrowser')"
                    >
                      <img src="/home/ph.svg" alt="" draggable="false" class="h-7 select-none">
                    </a>
                  </li>
                  <li class="flex col-span-4 justify-center md:col-span-1">
                    <a
                      href="https://uk.trustpilot.com/review/roxybrowser.com" target="_blank" rel="noopener noreferrer"
                      :aria-label="$t('在 Trustpilot 查看 RoxyBrowser 评价')"
                    >
                      <img src="/home/tp.svg" alt="" class="h-7 w-auto select-none md:w-full" draggable="false">
                    </a>
                  </li>
                </ul>
              </div>

              <!-- <div class="flex items-center justify-center">
              <NuxtLinkLocale to="/blog/christmas-new-year-special-offer" class="text-white px-3 py-1.5 rounded-1.5 flex gap-2.5 cursor-pointer items-center justify-center active:bg-black/30 hover:bg-black/20">
                <RxIcon name="color/rx-rl-tree" size="24" />
                <span class="text-4.5 leading-24px font-[Archivo] font-600 ru-RU:text-4">{{ $t('RoxyBrowser 双旦活动大促') }}</span>
                <RxIcon name="color/rx-rl-gift2" size="24" />
              </NuxtLinkLocale>
            </div> -->

              <template v-if="locale === 'zh'">
                <h1
                  class="h1-title text-8 font-700 multilingual-text text-center whitespace-pre-line md:text-h1 max-md:leading-[1.2]"
                >
                  <!-- {{ $t('全球多账号指纹浏览器\n深受 {block} 出海从业者的信赖') }} -->
                  <rx-i18n-t v-if="isChinaSite" :keypath="$t('全球多账号指纹浏览器\n深受 {block} 出海从业者的信赖', { block: '{block}' })">
                    <template #block>
                      <AnimateCurve2 />
                    </template>
                  </rx-i18n-t>
                  <rx-i18n-t v-else :keypath="$t('全球多账号指纹浏览器\n深受{block}从业者的信赖', { block: '{block}' })">
                    <template #block>
                      <AnimateCurve2 />
                    </template>
                  </rx-i18n-t>
                </h1>

                <div class="mt-5 flex justify-center md:mt-0">
                  <div class="flex flex-col gap-x-3 gap-y-5 justify-center md:flex-row">
                    <CtaDownloadBtnByHome mobile-chevron>
                      {{ downloadText }}
                    </CtaDownloadBtnByHome>

                    <LiveChat class="hidden justify-center md:flex">
                      <button
                        class="text-4 text-white font-500 px-6 py-3 rounded-2 border-none bg-white/10 flex gap-2 cursor-pointer items-center"
                      >
                        <RxIcon name="base/rx_ic_headphone_2" size="24" />
                        {{ $t('联系我们') }}
                      </button>
                    </LiveChat>
                  </div>
                </div>

                <div class="text-4 text-white/60 leading-[1.5] font-400 multilingual-text text-center flex flex-wrap gap-x-1 gap-y-1 items-center justify-center md:text-5">
                  <template v-for="(item, index) in heroUseCaseLinks" :key="item.to">
                    <span v-if="index > 0" class="select-none">｜</span>
                    <NuxtLinkLocale
                      :to="item.to"
                      class="underline underline-offset-6 cursor-pointer transition-colors hover:text-white/90"
                    >
                      {{ item.label }}
                    </NuxtLinkLocale>
                  </template>
                </div>
              </template>

              <template v-else>
                <h1
                  class="h1-title text-8 font-700 multilingual-text text-center whitespace-pre-line md:text-h1 max-md:leading-[1.2]"
                >
                  <rx-i18n-t :keypath="$t('行业领先的商务指纹浏览器\n{block}工作流潜力', { block: '{block}' })">
                    <template #block>
                      <AnimateCurve />
                    </template>
                  </rx-i18n-t>
                </h1>

                <div class="mt-5 flex justify-center md:mt-0">
                  <div class="flex flex-col gap-x-3 gap-y-5 justify-center md:flex-row">
                    <CtaDownloadBtnByHome mobile-chevron>
                      {{ downloadText }}
                    </CtaDownloadBtnByHome>

                    <LiveChat class="hidden justify-center md:flex">
                      <button
                        class="text-4 text-white font-500 px-6 py-3 rounded-2 border-none bg-white/10 flex gap-2 cursor-pointer items-center"
                      >
                        <RxIcon name="base/rx_ic_headphone_2" size="24" />
                        {{ $t('联系我们') }}
                      </button>
                    </LiveChat>
                  </div>
                </div>

                <div class="text-4 text-white/60 leading-[1.5] font-400 multilingual-text text-center md:text-5">
                  {{ $t('提升您的网络之旅，RoxyBrowser：轻盈、安全、无界') }}
                </div>
              </template>
            </Container>
          </div>

          <Container class="my-10 perspective-1400px relative z-1 sm:my-11 sm:mt-11">
            <HomeBg />
            <ElectricBg v-if="!lgWidth" />
          </Container>

          <div>
            <p class="md:leading-body text-4 font-400 mb-5 text-center md:text-body max-md:leading-100%">
              {{ $t('RoxyBrowser 为您使用各种平台保驾护航') }}
            </p>
            <!-- <LogoBrand /> -->
            <div class="h-15">
              <RxLazy :sync-comp-import="() => import('./brand.vue')" />
            </div>
          </div>
        </section>

        <section class="mt-84px relative lg:mt-240px md:mt-120px">
          <Container class="relative">
            <div class="relative z-1">
              <div class="flex flex-col gap-5 justify-center">
                <h2 class="section-title text-white whitespace-pre-line">
                  {{ $t('全球业务覆盖及稳定支持') }}
                </h2>
                <p class="lg:leading-body text-18px text-white/60 font-500 w-full lg:text-features-body md:w-60%">
                  {{ $t('RoxyBrowser 致力于服务来自世界各地的企业和个人用户，助力全球业务高效流转。') }}
                </p>
              </div>

              <ClientOnly>
                <Realtime />
              </ClientOnly>

              <div class="text-white/60 leading-[1.4] pb-10 pt-20 w-full lg:pb-130px lg:pt-160px md:w-60%">
                <rx-i18n-t
                  :keypath="$t('快速构建业务所需环境，优化工作流体验并轻松拓展新市场。从我们的 {techSupport} 获得专业的集成指导，并通过参考 {docs} 接入第三方工具实现浏览器操作的自动化需求。', { techSupport: '{techSupport}', docs: '{docs}' })"
                >
                  <template #docs>
                    <a class="text-decoration-underline text-[#11A3FD]" :href="apiDocs" target="_blank">
                      {{ $t('API 文档') }}
                    </a>
                  </template>
                  <template #techSupport>
                    <LiveChat class="inline-block" show-before-ready>
                      <span class="text-decoration-underline text-[#11A3FD]">
                        {{ $t('技术支持') }}
                      </span>
                    </LiveChat>
                  </template>
                </rx-i18n-t>
              </div>

              <CtaDownloadBtnByPanel class="mb-15">
                RoxyBrowser
              </CtaDownloadBtnByPanel>
            </div>
          </Container>

          <ClientOnly>
            <RxLazy
              v-if="isShowGlobe && $isRealUser && isWebGLSupported()"
              :sync-comp-import="() => import('./roxy-globe.vue')"
            />
          </ClientOnly>
        </section>
      </div>

      <div ref="usingAndInteractionRef" class="bg-[#F3F4F7]">
        <KernelSync @animation-state="kernelSyncAnimating = $event" />
        <Using />
        <Youtube />
        <Interaction />
      </div>

      <Tech />

      <div ref="communityRef" class="pt-3 bg-[radial-gradient(100%_100%_at_50%_0%,_#E8EFF2_0%,_#FFF_100%)] lg:pt-20 md:pt-10">
        <CertificationNew />
        <Community />
        <Faq :fqa-list="fqaList" />
        <Container>
          <CtaDownloadBtnByPanel2 />
        </Container>
      </div>
    </div>

    <RxDialog
      v-model:visible="mobileGiftDialogVisible"
      :pt="{ mask: 'mobile-gift-dialog-mask' }"
    >
      <template #container>
        <div class="mx-5 px-5 py-3 border border-[#AFB7BB] rounded-3 border-solid bg-white max-w-525px w-[calc(100vw-40px)] shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
          <div class="flex gap-4 items-start justify-between">
            <div class="text-[18px] text-[#111213] leading-normal font-['Microsoft_YaHei_UI'] font-600">
              {{ $t('新用户礼包，下载就送') }}
            </div>
            <button class="border-none bg-transparent flex shrink-0 size-8 cursor-pointer items-center justify-center" @click="closeMobileGiftDialog">
              <RxIcon name="base/rx_ic_delete" size="24" color="#575D60" />
            </button>
          </div>
          <div class="text-[14px] text-black leading-5 font-['Microsoft_YaHei_UI'] font-400 mt-3">
            {{ $t('请使用电脑访问官网并下载 APP，登录后即可自动发放礼包') }}
          </div>
          <button
            class="text-[14px] text-white leading-5 font-500 mt-6 px-4 py-2.5 border-1 border-[#0282D4] rounded-2 border-solid bg-[#11A3FD] flex gap-2 min-w-88px w-full cursor-pointer shadow-[0_4px_4px_-1px_rgba(0,0,0,0.02),0_1px_1px_0_rgba(0,0,0,0.06)] items-center justify-center"
            @click="copyOfficialSiteUrl"
          >
            {{ $t('复制官网链接') }}
          </button>
          <button
            class="text-[14px] text-[#111213] leading-6 font-400 mt-3 border-none bg-transparent h-10 w-full cursor-pointer"
            @click="closeMobileGiftDialog"
          >
            {{ $t('我知道了') }}
          </button>
        </div>
      </template>
    </RxDialog>
  </main>
</template>

<style lang="scss" scoped>
:global(.mobile-gift-dialog-mask.rx-dialog-mask--modal) {
  background: rgba(0, 0, 0, 0.5);
}

[lang='zh-CN'] .h1-title {
  line-height: 1.3;
  letter-spacing: 1px;
}

.hero {
  background-image: linear-gradient(180deg, hsl(217 95% 18% / 1) 0%, #726a6d 100%);
  width: 100%;
  overflow: hidden;
}

.aurora {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

// .globe {
//   width: 1800px;
//   height: 1800px;
//   position: absolute;
//   right: -757px;
//   bottom: -640px;
//   margin: auto;
//   z-index: 0;
// }

.img-container {
  position: relative;
  z-index: 2;
  perspective: 1400px;
}

.notes {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-style: normal;
  padding: 128px 0;
}

.underlines {
  font-weight: 800;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 85%;
    width: 100%;
    left: 0;
    height: 8px;
    border-radius: 2px;
    background: linear-gradient(111.3deg, #eaa0f6 9.6%, #3193ff 93.6%);
  }
}

.globe-text-label {
  @apply text-18px max-lg:leading-150% lg:text-h6 font-700 text-nowrap;
}

.globe-text-value {
  @apply text-white text-8 !max-lg:leading-150% lg:text-h2 font-700;
}

// @property --direc {
//   syntax: '<angle>';
//   inherits: false;
//   initial-value: 331deg;
// }

// .btn-effect {
//   --direc: 331deg;
//   background: linear-gradient(315deg, #F9B3B4 0%, #238AFF 52%);
//   transition: background 0.3s ease;

//   &:hover {
//     background: linear-gradient(315deg, #F9B3B4 0%, #238AFF 82%);
//   }
// }

// .btn-effect:hover {
//   animation-name: rotate-forward;
// }

// .btn-effect:not(:hover) {
//   animation-name: rotate-backward;
// }

// @keyframes rotate-forward {
//   to {
//     --direc: 315deg;
//   }
// }

// @keyframes rotate-backward {
//   from {
//     --direc: 315deg;
//   }
//   to {
//     --direc: 331deg;
//   }
</style>
