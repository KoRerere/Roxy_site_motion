<script setup lang="ts">
import { CONTACT_US_PATH } from '@/constants/contact-us'
import { getSiteOrigin } from '@/utils/docsSitemap'

const { $t, locale } = useRxI18n()
const { public: { ENV, isChinaSite } } = useRuntimeConfig()
const isDev = ENV === 'development'

const internationalOrigin = getSiteOrigin(isDev, false)
const chinaOrigin = getSiteOrigin(isDev, true)

// Contact Us SEO：TDK + 跨域 hreflang/canonical 均在此页注入。
// layout useCustomHead 对 /contact-us 会跳过 i18n 默认 link/meta，避免与下方标签重复（见 layouts/hooks/useCustomHead.ts）。
useSeoMeta({
  title: () => $t('contactUs.seo标题'),
  description: () => $t('contactUs.seo描述'),
})

// 中文 TDK 已是完整 Title，避免 layout 再追加「| Roxy指纹浏览器」
useHead({
  titleTemplate: isChinaSite ? '%s' : undefined,
})

// hreflang：en → .com，zh-Hans → .cn，ru → .com/ru；国内站 x-default → .cn，国际站 → .com
useHead(() => {
  const canonical = (isChinaSite || locale.value === 'zh')
    ? `${chinaOrigin}${CONTACT_US_PATH}`
    : locale.value === 'ru'
      ? `${internationalOrigin}/ru${CONTACT_US_PATH}`
      : `${internationalOrigin}${CONTACT_US_PATH}`

  const xDefaultHref = isChinaSite
    ? `${chinaOrigin}${CONTACT_US_PATH}`
    : `${internationalOrigin}${CONTACT_US_PATH}`

  return {
    link: [
      { rel: 'canonical', href: canonical },
      { rel: 'alternate', hreflang: 'en', href: `${internationalOrigin}${CONTACT_US_PATH}` },
      { rel: 'alternate', hreflang: 'zh-Hans', href: `${chinaOrigin}${CONTACT_US_PATH}` },
      { rel: 'alternate', hreflang: 'ru', href: `${internationalOrigin}/ru${CONTACT_US_PATH}` },
      { rel: 'alternate', hreflang: 'x-default', href: xDefaultHref },
    ],
  }
})
</script>

<template>
  <main class="bg-white">
    <PageContactUsBanner />
    <PageContactUsAboutRoxy />
    <PageContactUsSectionDivider />
    <PageContactUsCompanyInfo />
    <PageContactUsSectionDivider />
    <PageContactUsFollowUs />
    <PageContactUsSectionDivider />
    <PageContactUsJoinUs />
  </main>
</template>
