<script setup>
import CommonPanel from './common-panel.vue'

const isChinaSite = process.env.SITE_VARIANT === 'china'
const { $t, locale } = useRxI18n()

const { public: { roxyHomeUrl } } = useRuntimeConfig()

function getFaqLink() {
  if (isChinaSite) {
    return `${roxyHomeUrl}/docs/`
  }
  return locale.value === 'en' ? `${roxyHomeUrl}/docs/` : `${roxyHomeUrl}/docs/${locale.value}/`
}
function getApiDocsLink() {
  if (isChinaSite) {
    return `${roxyHomeUrl}/docs/api-documentation/api-reference.html`
  }
  return locale.value === 'en' ? `${roxyHomeUrl}/docs/api-documentation/api-reference.html` : `${roxyHomeUrl}/docs/${locale.value}/api-documentation/api-reference.html`
}

const coreFeatures = computed(() => [
  [
    {
      icon: 'contact-us/nav-whoer',
      title: $t('Whoer.net'),
      desc: $t('使用 Whoer.net'),
      link: '/whoer',
    },
    {
      icon: 'menu/blog',
      title: $t('博客'),
      desc: $t('查阅最新教程与实用技巧，掌握 RoxyBrowser 前沿动态'),
      link: '/blog',
    },
    {
      icon: 'menu/faq',
      title: $t('常见问题'),
      desc: $t('快速获取常见问题解答，轻松解决使用时产生的疑惑'),
      link: '/faqs',
    },
    {
      icon: 'menu/user-guide',
      title: $t('使用指南'),
      desc: $t('详细使用指南，循序渐进掌握 RoxyBrowser 的全部功能'),
      link: getFaqLink(),
      target: '_blank',
    },
  ],
  [
    {
      icon: 'menu/about-us',
      title: $t('关于我们'),
      desc: $t('走近 RoxyBrowser，了解我们的团队使命和初衷'),
      link: '/about-us',
    },
    {
      icon: 'menu/changelog',
      title: $t('更新日志'),
      desc: $t('随时了解 RoxyBrowser 的重要更新和优化内容'),
      link: '/changelog',
    },
    {
      icon: 'menu/partner',
      title: $t('合作伙伴'),
      desc: $t('与 RoxyBrowser 合作，共同开启更多元、更长远的商业可能'),
      link: '/partners',
    },
    {
      icon: 'menu/api-flow',
      title: $t('API 调用'),
      desc: $t('Roxy浏览器支持通过接口调用方式使用浏览器功能'),
      link: getApiDocsLink(),
      target: '_blank',
    },
  ],
])

const blogInfo = computed(() => ({
  title: $t('6 种方法提高 Twitter 曝光，不再被平台随意限流！'),
  excerpt: $t('了解推特限流的几种现象，及时做出应对方法，彻底解决限流问题。'),
  feature_image: 'home/nav-banner-img3',
  // CommonPanel使用link决定是否展示，cn暂不展示
  link: isChinaSite ? '' : '/blog/am-i-shadowbanned-on-twitter',
}))
</script>

<template>
  <CommonPanel :title="$t('资源')" :items="coreFeatures" :blog-info="blogInfo" />
</template>
