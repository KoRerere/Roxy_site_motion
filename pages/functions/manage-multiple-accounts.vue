<script setup lang="tsx">
import DownloadNow from '~/components/page-functions/download-now.vue'
import BgEffect from '~/components/page-functions/manage-multiple-accounts/bg-effect.vue'
import CarouselSection from '~/components/page-functions/manage-multiple-accounts/carousel-section.vue'
import HeroBanner from '~/components/page-functions/manage-multiple-accounts/hero-banner.vue'
import IntroSection from '~/components/page-functions/manage-multiple-accounts/intro-section.vue'
import ShowcaseSection from '~/components/page-functions/manage-multiple-accounts/showcase-section.vue'
import TrustedSection from '~/components/page-functions/manage-multiple-accounts/trusted-section.vue'
import { useRxI18n } from '~/composables/useRxI18n'

const { $t, locale } = useRxI18n()
const isChinaSite = process.env.SITE_VARIANT === 'china'

useSeoMeta({
  title: isChinaSite ? '多账号批量管理神器：一站式搞定社媒与电商矩阵运营' : $t('零封号实现多账号运营'),
  description: isChinaSite ? '还在为管理海量账号而焦头烂额？使用 Roxy指纹浏览器，一键创建无限物理级隔离窗口，轻松实现批量导入、环境同步与权限分配。为您打造最纯净的多开环境，让跨境电商与社媒矩阵运营变得安全、极速、高效。' : $t('用 RoxyBrowser 轻松实现多账号运营。我们的反检测技术通过提供纯净的账号环境和灵活的定制选项为你规避封号风险。'),
})

useBackTop(useTemplateRef('mainRef'))

useHead({
  title: isChinaSite ? '多账号批量管理神器：一站式搞定社媒与电商矩阵运营' : $t('真正保护你的在线隐私，超越普通无痕模式'),
  meta: [
    {
      name: 'title',
      content: isChinaSite ? '多账号批量管理神器：一站式搞定社媒与电商矩阵运营' : $t('真正保护你的在线隐私，超越普通无痕模式'),
    },
    {
      name: 'description',
      content: isChinaSite ? '还在为管理海量账号而焦头烂额？使用 Roxy指纹浏览器，一键创建无限物理级隔离窗口，轻松实现批量导入、环境同步与权限分配。为您打造最纯净的多开环境，让跨境电商与社媒矩阵运营变得安全、极速、高效。' : $t('使用 RoxyBrowser 确保你的上网行为安全且不可追踪。享受完全匿名、独立配置的浏览环境，以及对数字身份的全面掌控。'),
    },
  ],
})

const faqList = computed(() => [
  {
    title: $t('RoxyBrowser 如何帮助我安全地管理多个账号？'),
    desc: $t('RoxyBrowser 专为安全的多账号管理而设计。每个账号都在独立的浏览环境中运行，拥有独特的指纹和代理 IP。这能阻止平台将你的多个账号关联起来——而这正是账号被封禁的主要原因。无论你是管理电商店铺、社交媒体账号，还是广告账号，RoxyBrowser 都能确保它们彼此隔离、安全无忧。'),
  },
  {
    title: $t('指纹浏览器的“反检测”是什么意思？'),
    desc: $t('反检测就是让每个浏览器配置文件都看起来像一个不同的、真实的“人”。由于平台不仅会检查你的 IP 地址，还会查看你的浏览器信息、时区，甚至屏幕尺寸，而这些线索容易暴露你的账号之间存在关联。RoxyBrowser 能伪装这些细节，让每个账号保持独立和安全。'),
  },
  {
    title: $t('RoxyBrowser 到底是怎么实现账号隔离的？'),
    desc: $t('RoxyBrowser 中的每个配置文件就像一台独立的“虚拟电脑”。它有自己的指纹、Cookie、缓存和代理 IP 设置。你可以为不同的配置文件分配不同的 IP，这样即便你同时运行多个账号，它们也不会关联到一起。在外部看来，每个账号都像是来自不同的用户，在不同的地方运行。'),
  },
  {
    title: $t('RoxyBrowser 还有哪些其他功能？'),
    desc: $t('账号隔离是基础，但 RoxyBrowser 的功能远不止于此。你可以在浏览器内直接管理代理 IP，省去复杂的设置；还能安全地与团队成员共享账号环境，方便协作；甚至可以自动化重复性任务，帮你节省时间。告别那些麻烦的“曲线救国”方式，RoxyBrowser 让你用一个工具就能轻松、安全地处理所有事情。'),
  },
  {
    title: $t('RoxyBrowser 支持哪些设备和操作系统？'),
    desc: $t('RoxyBrowser 同时支持 Windows 和 macOS。你可以在办公室的 Windows 电脑上安装，也可以在出门在外时用 MacBook。macOS 支持 Intel 和 Apple Silicon 芯片，Windows 则支持 32 位和 64 位系统。'),
  },
])

const features = [$t('隐藏真实身份'), $t('防止网站追踪'), $t('零痕迹上网')]
</script>

<template>
  <BgEffect />
  <main ref="mainRef" class="pb-20 bg-[#F8FAFB] flex flex-col gap-15 items-center md:gap-20">
    <HeroBanner
      :title="$t('真正的隐私浏览方案{icon}\n——超越普通无痕模式', { icon: '{icon}' })"
      icon="functions/rx_ic_private_browsing"
      :description="$t('RoxyBrowser 给你真正的隐私保护，不只是清空历史记录。')"
      :features="features"
      class="panel px-4 z-1"
    />
    <ShowcaseSection class="panel px-4" />
    <IntroSection class="panel px-4" />
    <CarouselSection />
    <TrustedSection />
    <div class="px-4 flex flex-col w-full items-center">
      <DownloadNow :title="$t('RoxyBrowser：满足各领域的多账号运营需求。')" class="panel" />
    </div>
    <Faq :fqa-list="faqList" class="func-faq fqa-container py-2" />
  </main>
</template>

<style lang="scss" scoped>
:where(.panel) {
  display: flex;
  flex-direction: column;
  gap: 48px;
  align-items: center;
  width: min(100%, 1280px);
}

.func-faq {
  @media (max-width: 1280px) {
    width: 100%;
  }
}
</style>
