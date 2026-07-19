<script setup lang="tsx">
import CommonPanel from './common-panel.vue'

const { $t } = useRxI18n()
const isChinaSite = process.env.SITE_VARIANT === 'china'

function splitChunks<T>(items: T[], chunkSize: number): T[][] {
  return items.reduce((acc: T[][], _, index) => {
    if (index % chunkSize === 0) {
      acc.push(items.slice(index, index + chunkSize))
    }
    return acc
  }, [] as T[][])
}

const coreFeatures = computed(() => splitChunks([
  ...[
    {
      icon: 'menu/social-networks',
      title: $t('社媒运营'),
      desc: $t('轻松运营多个社交媒体账号，降低关联与风险'),
      link: '/use-cases/social-media-marketing',
    },
    {
      icon: 'menu/e-commerce',
      title: $t('跨境电商'),
      desc: $t('为不同电商店铺配置独立身份，安全高效运营'),
      link: '/use-cases/ecommerce-marketing',
    },
    {
      icon: 'menu/traffic-trade',
      title: $t('SEO 优化'),
      desc: $t('在不同账号安全操作，实现更高效的 SEO 优化和推广'),
      link: '/use-cases/seo-content-marketing',
    },
    {
      icon: 'menu/ad-strategy',
      title: $t('广告投放'),
      desc: $t('通过独立浏览器环境安全管理多个付费广告投放账户'),
      link: '/use-cases/paid-search-advertising',
    },
  ],
  ...[
    {
      icon: 'menu/affiliate-market',
      title: $t('联盟营销'),
      desc: $t('利用防检测浏览器提高转化，扩大联盟营销收益'),
      link: '/use-cases/affiliate-marketing',
    },
    {
      icon: 'menu/web-scraping',
      title: $t('数据爬取'),
      desc: $t('高效采集网站数据，同时避免封禁与访问限制'),
      link: '/use-cases/web-scraping',
    },
    {
      icon: 'menu/crypto-gains',
      title: $t('加密货币'),
      desc: $t('在多个交易所安全管理账户，保障加密货币交易'),
      link: '/use-cases/cryptocurrency-trading',
      hidden: isChinaSite,
    },
  ].filter(item => !item.hidden),
], isChinaSite ? 3 : 4))

const blogInfo = computed(() => ({
  title: $t('5 种方法绕开 YouTube 限制，随时随地在油管刷视频！'),
  excerpt: $t('无论是学校、公司还是某些地区特意设置的“访问限制”，都有办法解决，让你可以不受限制地浏览油管视频。'),
  feature_image: 'home/nav-banner-img1',
  // CommonPanel使用link决定是否展示，cn暂不展示
  link: isChinaSite ? '' : '/blog/how-to-get-youtube-unblocked',
}))
</script>

<template>
  <CommonPanel :title="$t('应用场景')" :items="coreFeatures" :blog-info="blogInfo" />
</template>
