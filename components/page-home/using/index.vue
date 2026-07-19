<script setup>
import { useMotionValueEvent, useScroll } from 'motion-v'
import RoxyIpEntry from './roxy-ip-entry.vue'
import Temp from './Temp.vue'

const isMaxMd = useRxMaxMd()
const usingStyle = useCssModule('usingStyle')

const platforms = computed(() => {
  const list = [
    { url: '/home/platforms/01.svg', alt: 'facebook' },
    { url: '/home/platforms/02.svg', alt: 'instagram' },
    { url: '/home/platforms/03.svg', alt: 'tiktok' },
    { url: '/home/platforms/04.svg', alt: 'temu' },
    { url: '/home/platforms/05.svg', alt: 'amazon' },
    { url: '/home/platforms/06.svg', alt: 'etsy' },
    { url: '/home/platforms/07.svg', alt: 'lazada' },
    { url: '/home/platforms/08.svg', alt: 'paypal' },
    { url: '/home/platforms/09.svg', alt: 'shopify' },
    { url: '/home/platforms/10.svg', alt: 'shopee' },
    { url: '/home/platforms/11.svg', alt: 'meta' },
    { url: '/home/platforms/12.svg', alt: 'worldfirst' },
    { url: '/home/platforms/13.svg', alt: 'ebay' },
    { url: '/home/platforms/14.svg', alt: 'payoneer' },
    { url: '/home/platforms/15.svg', alt: 'twiter' },
    { url: '/home/platforms/16.svg', alt: 'jumiao' },
    { url: '/home/platforms/17.svg', alt: 'aliexpress' },
    { url: '/home/platforms/18.svg', alt: 'manomano' },
    { url: '/home/platforms/19.svg', alt: 'microsoft' },
    { url: '/home/platforms/20.svg', alt: 'rakuten' },
  ]
  if (isMaxMd.value) {
    return list.slice(0, 18)
  }
  return list
})

const style = reactive({
  transform: `scale(1)`,
  opacity: 1,
  filter: `blur(0px)`,
})

const scrollContainerRef = useTemplateRef('scrollContainerRef')

onMounted(() => {
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    trackContentSize: true,
  })

  useMotionValueEvent(scrollYProgress, 'change', (__latest) => {
    const p = typeof __latest === 'number' && Number.isFinite(__latest)
      ? Math.min(1, Math.max(0, __latest))
      : 0
    const ch = scrollContainerRef.value?.clientHeight ?? 0
    let latest = p
    if (ch <= window.innerHeight) {
      latest = 1 - p
    }
    style.transform = `scale(${1 - 0.15 * latest})`
    style.opacity = `${1 - 0.7 * latest}`
    style.filter = `blur(${15 * latest}px)`
  })
})
</script>

<template>
  <section class="pb-10 pt-7 lg:pb-15 md:pt-20 xl:pb-20">
    <Container>
      <div class="top-20 sticky lg:top-25">
        <h2
          class="section-title text-primary text-center"
        >
          {{ $t('集成式账户管理解决方案') }}
        </h2>
        <p class="text-14px text-primary font-400 mt-2 text-center md:text-body max-md:leading-20px">
          {{ $t('同步 RoxyBrowser 核心研究成果，定义安全多账户协同标准') }}
        </p>
      </div>
      <div ref="scrollContainerRef">
        <div
          class="mt-6 rounded-5 bg-white h-auto top-170px sticky overflow-hidden md:mt-12 lg:top-230px sm:top-180px"
          :style="style"
        >
          <Temp
            label="color/rx-ic-chrome"
            :title="$t('未启用\nRoxyBrowser')"
            :desc="$t('网站不遗余力地追踪您的在线活动，而浏览器指纹暴露了您的专属特征，因而导致账号封禁和隐私泄露。')"
            setp1="useBeforeScan"
            setp2="useBefore"
          />
        </div>

        <div
          class="mt-6 rounded-5 bg-white h-auto relative z-10 overflow-hidden md:mt-100px"
        >
          <Temp
            label="color/rx_ic_roxy_chrome"
            :title="$t('启用\nRoxyBrowser')"
            :desc="$t('凭借尖端指纹技术，RoxyBrowser 为每个浏览器窗口打造独特真实的环境、助力隐私保护与业务无缝增长。')"
            setp1="useAfterScan"
            setp2="useAfter"
            :title-classes="usingStyle['linear-gradient-text']"
          />
        </div>
      </div>
    </Container>
    <RoxyIpEntry />
    <Container>
      <h2 class="text-6 text-primary leading-normal font-700 mt-12 text-center lg:(text-h2 mt-20) en-US:font-[Archivo]">
        {{ $t("我们保护您使用的每一个平台") }}
      </h2>
      <p class="text-3.5 text-primary leading-20px mt-2 text-center lg:(text-body)">
        {{ $t('专为商业卓越定制') }}
      </p>
      <div
        class="mt-6 gap-3 grid grid-cols-3 lg:(mt-12 px-10 gap-6 grid-cols-5) xl:gap-8 md:grid-cols-4"
      >
        <img
          v-for="platform in platforms"
          :key="platform.alt"
          :src="platform.url"
          :alt="platform.alt"
          draggable="false"
          loading="lazy"
          class="rounded-2 bg-white w-full select-none object-cover lg:rounded-5"
        >
      </div>
    </Container>
  </section>
</template>

<style module="usingStyle">
.linear-gradient-text {
  background: linear-gradient(270deg, #c481fa 0%, #12a3fc 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
</style>
