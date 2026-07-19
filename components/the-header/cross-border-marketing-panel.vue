<script setup>
import CommonPanel from './common-panel.vue'

const { public: { roxyHomeUrl } } = useRuntimeConfig()

const coreFeatures = computed(() => [
  [
    {
      icon: 'menu/core-service',
      title: $t('核心服务'),
      desc: $t('基于全球 20,000+素人矩阵，量身定制增长方案'),
      link: `${roxyHomeUrl}/roxy-geo/#services`,
    },
    {
      icon: 'menu/use-cases',
      title: $t('客户案例'),
      desc: $t('Roxy跨境出海打造现象级爆款，助力品牌快速增长'),
      link: `${roxyHomeUrl}/roxy-geo/#cases`,
    },
  ],
  [
    {
      icon: 'menu/delivery-process',
      title: $t('交付流程'),
      desc: $t('标准化6步履约流程，全面掌握业务交付各个环节'),
      link: `${roxyHomeUrl}/roxy-geo/#process`,
    },
    {
      icon: 'menu/pricing',
      title: $t('价格方案'),
      desc: $t('选择适合你的业务套餐，或定制专属视频服务方案'),
      link: `${roxyHomeUrl}/roxy-geo/#pricing`,
    },
  ],
])

// 跨境营销面板仅展示功能模块，不展示右侧博客卡片
const blogInfo = computed(() => ({
  title: '',
  excerpt: '',
  feature_image: '',
  link: '',
}))
</script>

<template>
  <CommonPanel :title="$t('跨境营销')" :items="coreFeatures" :blog-info="blogInfo" />
</template>
