<script setup lang="tsx">
import AntidetectVsTraditionalPanel from '~/components/functions/change-ip-address/antidetect-vs-traditional-panel.vue'
import AutosizeBanner from '~/components/functions/change-ip-address/autosize-banner.vue'
import DownloadNow from '~/components/functions/change-ip-address/download-now.vue'
import IpFingerprintGuard from '~/components/functions/change-ip-address/ip-fingerprint-guard.vue'
import SectorDifferencePanel from '~/components/functions/change-ip-address/sector-difference-panel.vue'
import TrustedProxiesAccess from '~/components/functions/change-ip-address/trusted-proxies-access.vue'
import WhatIsIpAddress from '~/components/functions/change-ip-address/what-is-ip-address.vue'
import WhyChangeYourIpAddress from '~/components/functions/change-ip-address/why-change-your-ip-address.vue'
import HeroBanner from '~/components/functions/hero-banner.vue'

useBackTop(useTemplateRef('mainRef'))

useHead({
  meta: [
    {
      name: 'title',
      content: $t('更改IP地址最安全有效的方法！无需VPN'),
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
    desc: $t('把你的 IP 地址想象成你在网上的家庭住址。它会告诉网站你在哪里。如果你不希望每个平台、广告商，甚至是不法分子都掌握你的真实位置，那么更换 IP 地址就是明智之举。RoxyBrowser 可以让你即时切换 IP，让你的浏览活动保持隐私、灵活，更难被追溯。'),
  },
  {
    title: $t('更换 IP 地址会降低浏览速度吗？'),
    desc: $t('有些 VPN 或代理因为额外的路由，会让浏览变得奇慢无比。但 RoxyBrowser 的设计与众不同，它经过了优化，能在保证匿名的同时，尽量让你的网速保持正常。唯一的变量就是你使用的代理。你可以在 RoxyBrowser 应用内直接购买可靠的住宅代理，我们合作的代理商会为用户提供更优惠的价格。'),
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
    desc: () => (
      <>
        <p>{$t('RoxyBrowser 没有限制切换IP的次数。你可以创建独立的配置文件（可理解成浏览器窗口），每个配置文件都有自己独立的指纹、cookies 和 IP。你可以随时切换到另一个窗口来即时更换 IP，或者在不清除缓存或重启的情况下，直接更新配置文件的代理。')}</p>
        <p>{$t('你甚至可以同时打开多个窗口，每个窗口都在不同的 IP 地址下，并排管理它们。')}</p>
        <p>{$t('简单来说：你想换就换，甚至可以同时更换多个 IP，只需使用不同的配置文件即可。')}</p>
      </>
    ),
  },
])
</script>

<template>
  <BgEffect />
  <main ref="mainRef" class="flex flex-col items-center gap-20 px-6 pb-20 bg-[#F8FAFB]">
    <HeroBanner />
    <WhatIsIpAddress />
    <WhyChangeYourIpAddress />
    <AutosizeBanner />
    <IpFingerprintGuard />
    <TrustedProxiesAccess />
    <SectorDifferencePanel class="panel" />
    <AntidetectVsTraditionalPanel class="panel" />
    <DownloadNow class="panel" />
    <Faq :fqa-list="faqList" class="fqa-container py-2" />
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
</style>
