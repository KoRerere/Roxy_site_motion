<script setup lang="ts">
import PanelDownload from '@/components/panel-download.vue'
import { RxIcon } from '@/components/rx-icon'
import Faq from '../../components/faq.vue'
import AnimateCurve from './components/AnimateCurve.vue'
import { cityConnections } from './components/city'
import { platformList } from './components/config'
// import CountUp from './components/CountUp.vue'
import HomeBg from './components/HomeBg.vue'
// import LatestVisit from './components/LatestVisit.vue'
import Marquee from './components/Marquee.vue'
import Media from './components/Media.vue'
import Realtime from './components/realtime/index.vue'
import RisingStar from './components/RisingStar.vue'
import Interaction from './interaction/index.vue'
import KernelSync from './kernel-sync.vue'
import Tech from './tech.vue'
import Using from './using/index.vue'

const breakpoints = useRxBreakpoints()
const lgWidth = breakpoints.smallerOrEqual('lg')

useBackTop(useTemplateRef('usingAndInteractionRef'))
useBackTop(useTemplateRef('communityRef'))

const { $t } = useRxI18n()

const { locale } = useRxI18n()

const apiDocs = computed(() => {
  return locale.value === 'zh' ? 'https://faq.roxybrowser.org/zh/api-documentation/api-reference.html' : 'https://faq.roxybrowser.org/api-documentation/api-reference.html'
})

const Aurora = computed(() => {
  return defineAsyncComponent(() => import('./components/Aurora.vue'))
})

const ElectricBg = computed(() => {
  return defineAsyncComponent(() => import('./components/ElectricBg.vue'))
})

const GithubGlobeV2 = computed(() => {
  return defineAsyncComponent(() => import('./components/GithubGlobeV2.vue'))
})

const globeConfig = {
  rings: 1,
  maxRings: 0,
  globeColor: '#141838', // 灰色
  polygonColor: '#D9D9D9', // 黑色
  showAtmosphere: true,
  atmosphereColor: '#000000',
  arcTime: 2000, // 弧线动画时间（毫秒）
  arcLength: 0.5, // 弧线长度比例
  autoRotate: true, // 自动旋转
}

const ParticlesBg = defineAsyncComponent(() => import('./components/ParticlesBg.vue'))

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
</script>

<template>
  <main>
    <div class="hero relative text-white">
      <section>
        <ClientOnly>
          <Aurora class="absolute top-0 left-0 z-0" :speed="0.5" />
          <RisingStar />
        </ClientOnly>

        <div class="section-main mt-[108px] md:mt-[138px]">
          <Container class="relative z-1 flex flex-col gap-4 md:gap-6 justify-center">
            <div class="flex justify-center">
              <ul class="grid grid-cols-4 md:grid-cols-3 justify-center gap-y-2 md:gap-y-8 gap-x-8 list-none">
                <li class="col-span-2 md:col-span-1">
                  <a href="https://www.g2.com/products/roxybrowser/reviews" target="_blank">
                    <img src="/home/g2.svg" alt="" draggable="false" class="select-none">
                  </a>
                </li>
                <li class="col-span-2 md:col-span-1">
                  <a href="https://www.producthunt.com/products/roxybrowser/reviews" target="_blank">
                    <img src="/home/ph.svg" alt="" draggable="false" class="select-none">
                  </a>
                </li>
                <li class="col-span-4 md:col-span-1 flex justify-center">
                  <a href="https://uk.trustpilot.com/review/roxybrowser.com" target="_blank">
                    <img src="/home/tp.svg" alt="" class="w-auto md:w-full select-none" draggable="false">
                  </a>
                </li>
              </ul>
            </div>

            <h1 class="text-8 leading-[1.2] md:text-h1 font-700 font-[Archivo] text-center whitespace-pre-line h1-title">
              <rx-i18n-t :keypath="$t('行业领先的商务指纹浏览器{block}工作流潜力', { block: '{block}' })">
                <template #block>
                  <br>
                  <AnimateCurve />
                </template>
              </rx-i18n-t>
            </h1>

            <div class="text-center text-white/60 font-[Archivo] font-400 text-4 leading-[1.5] md:text-5">
              {{ $t('提升您的网络之旅，RoxyBrowser：轻盈、安全、无界') }}
            </div>

            <div class="flex justify-center mt-5 md:mt-0">
              <div class="flex flex-col md:flex-row gap-y-5 gap-x-3 justify-center">
                <DownloadBtn auto-download>
                  {{ $t('立即下载') }}
                </DownloadBtn>

                <LiveChat class="flex justify-center">
                  <button class="flex gap-2 items-center py-3 px-6 rounded-2 bg-white/10 text-white font-500 border-none cursor-pointer text-4">
                    <RxIcon name="base/rx_ic_headphone_2" size="24" />
                    {{ $t('联系我们') }}
                  </button>
                </LiveChat>
              </div>
            </div>
          </Container>
        </div>

        <Container class="my-10 sm:my-11 relative z-1 perspective-1400px">
          <HomeBg />
          <ClientOnly>
            <ElectricBg v-if="!lgWidth" />
          </ClientOnly>
        </Container>

        <div>
          <p class="text-4 leading-100% md:text-body md:leading-body text-center mb-5 font-400">
            {{ $t('RoxyBrowser 为您使用各种平台保驾护航') }}
          </p>
          <ClientOnly>
            <RxLazy>
              <Media v-if="!lgWidth" />
              <Marquee v-else class="[--duration:20s]">
                <ul class="list-none items-center flex gap-5">
                  <li v-for="item in platformList">
                    <img :src="item" alt="" draggable="false" class="select-none">
                  </li>
                </ul>
              </Marquee>
            </RxLazy>
          </ClientOnly>
        </div>
      </section>

      <section class="mt-84px md:mt-120px lg:mt-240px relative">
        <Container class="relative">
          <div class="relative z-1">
            <div class="flex flex-col gap-5 justify-center">
              <h2 class="section-title text-white">
                {{ $t('全球业务覆盖及稳定支持') }}
              </h2>
              <p class="w-full md:w-60% text-white/60 font-500 text-18px lg:text-features-body lg:leading-body">
                {{ $t('RoxyBrowser 致力于服务来自世界各地的企业和个人用户，助力全球业务高效流转。') }}
              </p>
            </div>

            <ClientOnly>
              <!-- <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-100px mt-20 list-none text-white">
                <li class="flex flex-col gap-0 lg:gap-3">
                  <p class="globe-text-label">
                    {{ $t('已处理 API 请求数量') }}
                  </p>
                  <CountUp cache-key="hours-served" class="globe-text-value" />
                </li>
                <li class="flex flex-col gap-0 lg:gap-3">
                  <p class="globe-text-label">
                    {{ $t('实时保护窗口总数') }}
                  </p>
                  <CountUp cache-key="profiles-protected" class="globe-text-value" />
                </li>
                <li class="flex flex-col gap-0 lg:gap-3">
                  <p class="globe-text-label">
                    {{ $t('最近访问源自') }}
                  </p>
                  <LatestVisit class="globe-text-value" />
                </li>
              </ul> -->
              <Realtime />
            </ClientOnly>

            <p class="leading-[1.4] text-white/60 pt-20 pb-10 lg:pt-160px lg:pb-130px w-full md:w-60%">
              <rx-i18n-t key="1" :keypath="$t('快速构建业务所需环境，优化工作流体验并轻松拓展新市场。从我们的 {techSupport} 获得专业的集成指导，并通过参考 {docs} 接入第三方工具实现浏览器操作的自动化需求。', { techSupport: '{techSupport}', docs: '{docs}' })">
                <template #docs>
                  <a class="text-[#11A3FD] text-decoration-underline" :href="apiDocs" target="_blank">
                    {{ $t('API 文档') }}
                  </a>
                </template>
                <template #techSupport>
                  <LiveChat class="inline-block">
                    <span class="text-[#11A3FD] text-decoration-underline">
                      {{ $t('技术支持') }}
                    </span>
                  </LiveChat>
                </template>
              </rx-i18n-t>
            </p>

            <!-- 不可删除该元素，疑似 vue 的 mount 的有 bug ?? -->
            <template />

            <PanelDownload key="2" class="mb-15">
              RoxyBrowser
            </PanelDownload>
          </div>
        </Container>

        <ClientOnly>
          <ParticlesBg class="particles inset-0" :quantity="100" :ease="100" refresh />
          <div
            ref="globeRef" :class="cn(
              'absolute z-0 transform',
              'top-1/2 -translate-y-60% sm:-translate-y-1/2',
              '3xl:size-[clamp(1800px,100vw,2200px)] 3xl:-right-974px',
              'xl:size-[clamp(1600px,100vw,1800px)] xl:-right-40vw',
              'lg:size-120vw lg:-right-50vw',
              'md:size-130vw md:-right-50vw',
              'size-1000px -right-520px',
            )"
          >
            <GithubGlobeV2 :data="cityConnections" :globe-config="globeConfig" class="w-full h-full" />
          </div>
        </ClientOnly>
      </section>
    </div>

    <div ref="usingAndInteractionRef" class="bg-[#F3F4F7]">
      <Using />
      <Interaction />
      <KernelSync />
    </div>

    <Tech />
    <div ref="communityRef" class="bg-[radial-gradient(100%_100%_at_50%_0%,_#E8EFF2_0%,_#FFF_100%)]">
      <RxLazy tag="section" class="min-h-500px" :sync-comp-import="() => import('./community.vue')" />
      <Faq :fqa-list="fqaList" />
      <Container>
        <PanelDownload2 />
      </Container>
    </div>
  </main>
</template>

<style lang="scss" scoped>
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
  @apply text-18px leading-150% lg:text-h6 font-700 text-nowrap;
}

.globe-text-value {
  @apply text-white text-8 !leading-150% lg:text-h2 font-700;
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
// }
</style>
