<template>
  <section>
    <Container class="pt-28px md:pt-20">
      <div class="sticky top-20 lg:top-25">
        <h2 
          class="text-primary text-center section-title"
        >
          {{ $t('集成式账户管理解决方案') }}
          <!-- All-in-One Account Management -->
        </h2>
        <p class="text-[#042144] text-center font-400 mt-2 text-14px leading-20px md:text-body">
          {{ $t('同步 RoxyBrowser 核心研究成果，定义安全多账户协同标准') }}
          <!-- Keep up with RoxyBrowser's latest research and exclusive insights on secure multi-account management -->
        </p>
      </div>

      <div ref="scrollContainerRef">
        <div 
          class="mt-6 md:mt-12 bg-white rounded-5 h-auto overflow-hidden sticky top-170px sm:top-180px lg:top-230px" 
          :style="style"
        >
          <!-- Websites aggressively trace your online surfing, triggering account bans and privacy leaks. -->
          <Temp 
            label="base/rx_ic_chrome2"
            :title="$t('未启用\nRoxyBrowser')"
            :desc="$t('网站不遗余力地追踪您的在线活动，而浏览器指纹暴露了您的专属特征，因而导致账号封禁和隐私泄露。')"
            setp1="useBeforeScan"
            setp2="useBefore"
          />
        </div>

        <div 
          class="mt-6 md:mt-100px bg-white rounded-5 h-auto overflow-hidden relative z-10" 
        >
        <!-- With advanced fingerprint fine-tune, RoxyBrowser crafts a unique, authentic environment for every profile, letting you focus on business execution. -->
          <Temp 
            label="base/rx_ic_roxy_chrome"
            :title="$t('启用\nRoxyBrowser')"
            :desc="$t('凭借尖端指纹技术，RoxyBrowser 为每个浏览器窗口打造独特真实的环境、助力隐私保护与业务无缝增长。')"
            setp1="useAfterScan"
            setp2="useAfter"
            :titleClasses="usingStyle['linear-gradient-text']"
          />
        </div>
      </div>
    </Container>

    <h3 class="text-center text-primary font-400 text-4 leading-24px md:text-h6 mt-10">
      <!-- Supports a Wide Range of Platforms -->
      {{ $t("广泛业务平台支持") }}
    </h3>
    <Container>
      <div 
        class="flex flex-wrap justify-center gap-4 sm:gap-5 mx-auto max-w-800px mt-5 md:mt-30px"
        ref="platformsRef"
      >
        <img 
          v-for="platform in platforms" 
          :src="platform.url" 
          :alt="platform.alt" 
          draggable="false" 
          class="size-11 sm:size-12 wh-full object-cover"
        />
      </div>
    </Container>
  </section>
</template>

<script setup>
import { useScroll, useMotionValueEvent } from 'motion-v'
import Temp from './Temp.vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useDebounceFn } from '@vueuse/core'

const usingStyle = useCssModule('usingStyle')

const platformsRef = useTemplateRef('platformsRef')

const platformsList = [
  '/home/supports-platforms/rx_accounts_aliexpress.svg',
  '/home/supports-platforms/rx_accounts_amazon.svg',
  '/home/supports-platforms/rx_accounts_chatgpt.svg',
  '/home/supports-platforms/rx_accounts_ebay.svg',
  '/home/supports-platforms/rx_accounts_etsy.svg',
  '/home/supports-platforms/rx_accounts_facebook.svg',
  '/home/supports-platforms/rx_accounts_gemini.svg',
  '/home/supports-platforms/rx_accounts_hbo.svg',
  '/home/supports-platforms/rx_accounts_instagram.svg',
  '/home/supports-platforms/rx_accounts_line.svg',
  '/home/supports-platforms/rx_accounts_linkedin.svg',
  '/home/supports-platforms/rx_accounts_netflix.svg',
  '/home/supports-platforms/rx_accounts_okcupid.svg',
  '/home/supports-platforms/rx_accounts_reddit.svg',
  '/home/supports-platforms/rx_accounts_shopee.svg',
  '/home/supports-platforms/rx_accounts_steam.svg',
  '/home/supports-platforms/rx_accounts_telegram.svg',
  '/home/supports-platforms/rx_accounts_twitter.svg',
  '/home/supports-platforms/rx_accounts_youtube.svg',
  '/home/supports-platforms/rx_accounts_claude.svg',
]

// 提取平台名字当成img的alt
const extractPlatformName = (url) => {
  const urls = url.split('/')
  const svgName = urls[urls.length - 1].split('.')[0];
  const split = svgName.split('_')
  const alt = split[split.length - 1];
  return alt
}

const platforms = ref(platformsList.map(p => ({
  alt: extractPlatformName(p),
})))

const { stop } = useIntersectionObserver(platformsRef, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    platforms.value = platformsList.map(url => ({
      url: `${url}?v=2`,
      alt: extractPlatformName(url)
    }))
    stop();
  }
})

const style = reactive({
  transform: `scale(1)`,
  opacity: 1,
  filter: `blur(0px)`
})

const scrollContainerRef = useTemplateRef('scrollContainerRef');

let clientHeight;
let innerHeight;

const resize = useDebounceFn(() => {
  clientHeight = scrollContainerRef.value.clientHeight;
  innerHeight = window.innerHeight;
}, 100)

onMounted(() => {
  clientHeight = scrollContainerRef.value.clientHeight;
  innerHeight = window.innerHeight;

  window.addEventListener('resize', resize);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
  });

  useMotionValueEvent(scrollYProgress, "change", (__latest) => {
    let latest = __latest;
    if (clientHeight <= innerHeight) {
      latest = 1 - __latest;
    }
    style.transform = `scale(${1 - 0.15 * latest})`
    style.opacity = `${1 - 0.7 * latest}`
    style.filter = `blur(${15 * latest}px)`;
    console.log('latest', latest)
  });

  onUnmounted(() => {
    window.removeEventListener('resize', resize);
  })
})

</script>

<style module="usingStyle">
.linear-gradient-text {
  background: linear-gradient(270deg, #C481FA 0%, #12A3FC 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
</style>

