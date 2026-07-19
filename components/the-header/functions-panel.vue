<script setup>
import CommonPanel from './common-panel.vue'

const isChinaSite = process.env.SITE_VARIANT === 'china'

const coreFeatures = computed(() => [
  [
    {
      icon: 'menu/nav-multiple-accounts',
      title: $t('多账号管理{nav}', { nav: '' }),
      desc: $t('构建独立浏览器指纹环境，多账号彻底防关联防封禁'),
      link: '/functions/manage-multiple-accounts',
    },
    {
      icon: 'menu/nav-RoxyIP',
      title: $t('RoxyIP'),
      desc: $t('Roxy 官方直营原生 IP，保障业务稳定性 99%+'),
      link: '/functions/roxy-ip',
    },
  ],
  [
    {
      icon: 'menu/nav-change-ip',
      title: $t('更改 IP 地址'),
      desc: $t('轻松切换 IP 地址，突破访问限制，保障安全'),
      link: '/functions/change-ip-address',
    },
    {
      icon: 'menu/nav-private-browsing',
      title: $t('保护线上隐私'),
      desc: $t('超越普通无痕模式，真正保护个人隐私安全'),
      link: '/functions/private-browsing',
    },
  ],
])

const blogInfo = computed(() => ({
  title: $t('2025 新手指南：如何在不同系统内设置代理 IP？'),
  excerpt: $t('清晰展示代理 IP 配置的具体操作，以及进一步保护网络隐私的更佳方案。'),
  feature_image: 'home/nav-banner-img2',
  // CommonPanel使用link决定是否展示，cn暂不展示
  link: isChinaSite ? '' : '/blog/what-does-configure-proxy-mean',
}))
</script>

<template>
  <CommonPanel :title="$t('产品功能')" :items="coreFeatures" :blog-info="blogInfo" />
</template>
