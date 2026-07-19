<script setup lang="tsx">
import DedicatedIp from '~/components/page-functions/roxy-ip/dedicated-ip.vue'
import HeroBanner from '~/components/page-functions/roxy-ip/hero-banner.vue'
import MultipleScene from '~/components/page-functions/roxy-ip/multiple-scene.vue'
import ProductAdvantages from '~/components/page-functions/roxy-ip/product-advantages.vue'
import TrustedProxiesAccess from '~/components/page-functions/roxy-ip/trusted-proxies-access.vue'
import { useRxI18n } from '~/composables/useRxI18n'

const { $t } = useRxI18n()

useBackTop(useTemplateRef('root'))

useHead({
  title: $t('RoxyIP 住宅代理 IP - 跨境电商账号防关联首选 | Roxy 浏览器'),
  meta: [
    {
      name: 'title',
      content: $t('RoxyIP 住宅代理 IP - 跨境电商账号防关联首选 | Roxy 浏览器'),
    },
    {
      name: 'description',
      content: $t('RoxyIP 提供 9000 万+ 真实住宅代理 IP,覆盖 200+ 国家,深度适配 Amazon、TikTok、SHEIN、Temu 等跨境平台。配合 Roxy 浏览器指纹隔离,彻底防止账号关联,稳定保障跨境业务。'),
    },
  ],
})

const faqList = computed(() => [
  {
    title: $t('RoxyIP 覆盖哪些国家和地区？'),
    desc: $t('RoxyIP 覆盖全球 200+ 国家和地区，支持美国、英国、德国、日本、韩国、新加坡、加拿大、澳大利亚等主流跨境业务地区。用户可根据电商平台、社媒平台、广告投放或数据采集需求，选择对应国家和地区的代理 IP。'),
  },
  {
    title: $t('RoxyIP 是住宅 IP 吗？IP 池规模有多大？'),
    desc: $t('是的，Roxy 提供高质量住宅代理 IP，拥有 9000万+ 纯净住宅 IP 池，可满足跨境电商、社媒矩阵、广告投放、数据采集等多种业务场景。相比普通机房 IP，住宅 IP 更接近真实用户网络环境，适合对账号稳定性要求较高的业务。'),
  },
  {
    title: $t('RoxyIP 支持城市级定位吗？'),
    desc: $t('支持。RoxyIP 可根据业务需求选择国家、地区或城市级定位，适合本地化运营、区域广告投放、价格监测、市场调研等场景。对于需要模拟真实本地访问环境的用户，可以更精准地匹配目标市场。'),
  },
  {
    title: $t('RoxyIP 的速度和稳定性怎么样？'),
    desc: $t('RoxyIP 主打高速稳定连接，页面标注速度可达 100Mb，适合浏览网页、账号运营、广告管理、数据采集等高频使用场景。同时提供掉线包退机制，降低用户在业务使用过程中的连接风险。'),
  },
  {
    title: $t('RoxyIP 适合哪些业务场景？'),
    desc: [
      $t('RoxyIP 适合跨境电商多店铺运营、TikTok / Instagram / Facebook 社媒矩阵、广告账户管理、数据采集、价格监测、本地化测试等场景。通过为不同账号配置独立 IP，可以降低账号之间因网络环境相同而产生的关联风险。'),
    ],
  },
  {
    title: $t('RoxyIP 可以直接在 RoxyBrowser 中使用吗？'),
    desc: [
      $t('可以。RoxyBrowser 内置优质代理 IP，用户无需额外寻找第三方代理 IP 服务，即可在浏览器环境中直接配置和使用。对于多账号运营用户来说，可以将浏览器环境、账号资料和代理 IP 统一管理，提升使用效率和账号隔离效果。'),
    ],
  },
])
</script>

<template>
  <main ref="root" class="bg-[#F8FAFB] flex flex-col items-center">
    <HeroBanner />
    <TrustedProxiesAccess />
    <ProductAdvantages />
    <DedicatedIp />
    <MultipleScene />
    <Faq :fqa-list="faqList" class="func-faq fqa-container" />
  </main>
</template>

<style lang="scss" scoped>
.func-faq {
  @media (max-width: 1280px) {
    width: 100%;
  }
}
</style>
