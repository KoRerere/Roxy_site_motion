<script setup lang="tsx">
import AntidetectVsTraditionalPanel from '~/components/page-functions/change-ip-address/antidetect-vs-traditional-panel.vue'
import AutosizeBanner from '~/components/page-functions/change-ip-address/autosize-banner.vue'
import IpFingerprintGuard from '~/components/page-functions/change-ip-address/ip-fingerprint-guard.vue'
import SectorDifferencePanel from '~/components/page-functions/change-ip-address/sector-difference-panel.vue'
import TrustedProxiesAccess from '~/components/page-functions/change-ip-address/trusted-proxies-access.vue'
import WhatIsIpAddress from '~/components/page-functions/change-ip-address/what-is-ip-address.vue'
import WhyChangeYourIpAddress from '~/components/page-functions/change-ip-address/why-change-your-ip-address.vue'
import DownloadNow from '~/components/page-functions/download-now.vue'
import HeroBanner from '~/components/page-functions/hero-banner.vue'
import { useRxI18n } from '~/composables/useRxI18n'

const { $t } = useRxI18n()

useBackTop(useTemplateRef('mainRef'))
const isChinaSite = process.env.SITE_VARIANT === 'china'

useHead({
  title: isChinaSite ? '更改IP地址防关联：一键配置纯净独享网络环境' : $t('更改 IP 地址最安全有效的方法！无需 VPN'),
  meta: [
    {
      name: 'title',
      content: $t('更改 IP 地址最安全有效的方法！无需 VPN'),
    },
    {
      name: 'description',
      content: $t('使用 RoxyBrowser一键更改 IP 地址！可靠的 IP 和指纹伪装可防止封锁。设置简单，安全性高。隐形切换 IP。'),
    },
  ],
})

const faqList = computed(() => [
  {
    title: $t('为什么要用 RoxyBrowser 来更换 IP 地址？'),
    desc: $t('把你的 IP 地址想象成你在网上的家庭住址，它会告诉网站你在哪里。如果你不希望每个平台、广告商，甚至是不法分子都掌握你的真实位置，那么更换 IP 地址就是明智之举。RoxyBrowser 可以让你即时切换 IP，让你的浏览活动保持隐私、灵活，更难被追溯。'),
  },
  {
    title: $t('更换 IP 地址会降低浏览速度吗？'),
    desc: $t('有些 VPN 或代理 IP 因为额外的路由，会让浏览变得奇慢无比。但 RoxyBrowser 的设计与众不同，它经过了优化，能在保证匿名的同时，尽量让你的网速保持正常。唯一的变量就是你使用的代理 IP。你可以在 RoxyBrowser 应用内直接购买可靠的住宅代理 IP，我们合作的代理 IP 商会为用户提供更优惠的价格。'),
  },
  {
    title: $t('如果我更换了 IP，网站还能追踪到我吗？'),
    desc: $t('从技术的角度来说是可以的。很多网站不光看你的 IP，还会检查你的浏览器指纹、cookies 和其他一些隐藏信息。这就是为什么只切换 IP 是不够的。RoxyBrowser 同时处理你的 IP 和指纹，让网站无法轻易将这些信息拼凑起来，从而识别出你。它是一个完整的反侦测解决方案，而不仅仅是简单的伪装。'),
  },
  {
    title: $t('更换 IP 地址合法吗？'),
    desc: $t('当然合法。人们出于各种正当理由，比如保护隐私、远程办公或测试网站在不同国家的显示效果，经常会更换 IP 地址。唯一的例外是你的用途。例如，绕过政府的限制可能会触犯当地法律，但在大多数地方，使用像 RoxyBrowser 这样的工具来保护个人隐私是完全合法且正常的。'),
  },
  {
    title: $t('使用 RoxyBrowser 可以多久更换一次 IP？'),
    desc: [
      $t('RoxyBrowser 没有限制切换 IP 的次数。你可以创建独立的配置文件（可理解成浏览器窗口），每个配置文件都有自己独立的指纹、cookies 和 IP。你可以随时切换到另一个窗口来即时更换 IP，或者在不清除缓存或重启的情况下，直接更新配置文件的代理 IP。'),
      $t('你甚至可以同时打开多个窗口，每个窗口都在不同的 IP 地址下，并排管理它们。'),
      $t('简单来说：你想换就换，甚至可以同时更换多个 IP，只需使用不同的配置文件即可。'),
    ],
  },
])

const features = [$t('无需配置 VPN'), $t('无需繁琐设置'), $t('告别封号风险')]
</script>

<template>
  <BgEffect />
  <main ref="mainRef" class="px-0 pb-20 bg-[#F8FAFB] flex flex-col gap-15 items-center md:gap-20">
    <HeroBanner
      icon="functions/rx_ic_ip-address"
      :title="$t('用 RoxyBrowser 轻松切换 IP 地址{icon}\n——更安全，更简单，更隐秘', { icon: '{icon}' })"
      :description="$t('一键同步更换 IP 与浏览器指纹，隐匿行踪，保障安全。')"
      :features="features" class="px-4"
    />
    <WhatIsIpAddress class="px-4" />
    <WhyChangeYourIpAddress class="px-4" />
    <div class="px-3 flex flex-col w-full items-center">
      <AutosizeBanner />
    </div>
    <IpFingerprintGuard class="px-4" />
    <TrustedProxiesAccess />
    <SectorDifferencePanel class="panel px-4" />
    <AntidetectVsTraditionalPanel class="panel px-4" />
    <div class="px-4 flex flex-col w-full items-center">
      <DownloadNow :title="$t('使用 RoxyBrowser 更换 IP，真正实现隐身。')" class="panel" />
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
