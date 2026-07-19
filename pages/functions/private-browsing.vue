<script setup lang="tsx">
import TrustedProxiesAccess from '~/components/page-functions/change-ip-address/trusted-proxies-access.vue'
import DownloadNow from '~/components/page-functions/download-now.vue'
import HeroBanner from '~/components/page-functions/hero-banner.vue'
import BgEffect from '~/components/page-functions/private-browsing/bg-effect.vue'
import CarouselGallerySection from '~/components/page-functions/private-browsing/carousel-gallery-section.vue'
import FeaturesSection from '~/components/page-functions/private-browsing/features-section.vue'
import IncognitoSection from '~/components/page-functions/private-browsing/incognito-section.vue'
import MaskSection from '~/components/page-functions/private-browsing/mask-section.vue'
import VsIncognitoModeSection from '~/components/page-functions/private-browsing/vs-incognito-mode-section.vue'
import { useRxI18n } from '~/composables/useRxI18n'

const { $t, locale } = useRxI18n()

useBackTop(useTemplateRef('mainRef'))

useHead({
  title: $t('真正保护你的在线隐私，超越普通无痕模式'),
  meta: [
    {
      name: 'title',
      content: $t('真正保护你的在线隐私，超越普通无痕模式'),
    },
    {
      name: 'description',
      content: $t('使用 RoxyBrowser 确保你的上网行为安全且不可追踪。享受完全匿名、独立配置的浏览环境，以及对数字身份的全面掌控。'),
    },
  ],
})

const faqList = computed(() => [
  {
    title: $t('RoxyBrowser 的隐私浏览和普通无痕模式有什么不同？'),
    desc: $t('大多数浏览器的“无痕模式”只在本地隐藏历史记录，但依然会把 IP 地址和设备指纹等数据泄露给网站。而 RoxyBrowser 会伪装你的数字身份，管理 Cookies，并隐藏 IP 信息。这确保你不仅从设备上隐藏了活动，更从网络追踪者和平台那里真正实现了隐身。'),
  },
  {
    title: $t('RoxyBrowser 指纹浏览器能防止广告商追踪吗？'),
    desc: $t('可以。广告商会通过追踪 Cookies、设备指纹和位置数据来生成用户画像，而你可以使用 RoxyBrowser 来自定义这些身份信息，防止广告商将你在不同会话的活动关联起来，从而阻止任何定向广告的骚扰。'),
  },
  {
    title: $t('RoxyBrowser 指纹浏览器能突破地区限制吗？'),
    desc: $t('可以。RoxyBrowser 将私密浏览与 IP 切换相结合，你可以访问那些有地区限制的内容。这对于流媒体服务、电商价格测试，甚至是验证不同市场的广告都起着关键作用。使用 RoxyBrowser 进行浏览时，你的操作会被判断成源自本地，同时你的真实信息也受到保护。'),
  },
  {
    title: $t('网站会知道我正在使用指纹浏览器吗？'),
    desc: $t('不会。RoxyBrowser 的设计旨在模仿真实用户的浏览行为。与那些容易被怀疑的隐私插件或 VPN 不同，我们的浏览器会提供一个真实的指纹。网站会将你的会话视为一个真实用户、真实设备发出的请求，如果再配合合适的代理 IP，被检测出来的可能性几乎为零。'),
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
      class="px-4 z-1"
    />
    <MaskSection class="panel px-4" />
    <FeaturesSection class="panel px-4" />
    <CarouselGallerySection />
    <TrustedProxiesAccess />
    <IncognitoSection class="panel px-4" />
    <VsIncognitoModeSection class="panel px-4" />
    <div class="px-4 flex flex-col w-full items-center">
      <DownloadNow :title="$t('实现真正隐身，就选 RoxyBrowser')" class="panel" />
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
