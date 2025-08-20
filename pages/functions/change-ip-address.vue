<script setup lang="ts">
import AntidetectVsTraditionalPanel from '~/components/functions/change-ip-address/antidetect-vs-traditional-panel.vue'
import AutosizeBanner from '~/components/functions/change-ip-address/autosize-banner.vue'
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
      content: $t('The Safest Way to Change IP Address Without VPN Risks'),
    },
    {
      name: 'description',
      content: $t('Change IP address in 1 click with RoxyBrowser. Reliable IPs + fingerprint spoofing prevent bans. Simple setup, high security. Switch IPs invisibly.'),
    },
  ],
})
</script>

<template>
  <BgEffect />
  <main ref="mainRef" class="flex flex-col items-center px-6">
    <HeroBanner />
    <WhatIsIpAddress class="mt-15" />
    <WhyChangeYourIpAddress class="mt-15" />
    <AutosizeBanner class="mt-15" />
    <IpFingerprintGuard class="mt-15" />
    <TrustedProxiesAccess class="mt-15" />
    <SectorDifferencePanel class="mt-15 panel" />
    <AntidetectVsTraditionalPanel class="mt-15 panel" />
  </main>
</template>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 48px;
  align-items: center;
  width: min(100%, 1280px);
}
</style>
