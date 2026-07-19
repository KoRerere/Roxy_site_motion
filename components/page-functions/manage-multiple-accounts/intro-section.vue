<script setup lang="ts">
import DirectionSection from '../direction-section.vue'

const introList = [
  {
    title: $t('独立指纹，专属身份'),
    cover: 'functions/manage-multiple-accounts/info-section-img-1',
    showDownloadBtn: true,
    descItems: [
      $t('每个浏览器配置文件的指纹都可以单独设置，包括浏览器类型、分辨率、字体、语言等，让你的每个账号都拥有独特而真实的身份特征。'),
      $t('平台无法轻易识别你的多账号操作，从而大幅降低在同一平台管理多个账号时被封号或限制的风险，保证日常运营的安全与顺畅。'),
    ],
  },
  {
    title: $t('完全隔离，互不干扰'),
    cover: 'functions/manage-multiple-accounts/info-section-img-2',
    showDownloadBtn: true,
    descItems: [
      $t('每个浏览环境相互独立运行，账号之间的数据完全分离，包括 Cookie、缓存等，确保不同账户之间没有任何关联。'),
      $t('这样不仅能有效防止平台的交叉追踪，还能消除隐藏的风险，让你在管理多个账号时，保持高度安全和隐私保护，操作更加安心可靠。'),
    ],
  },
  {
    title: $t('灵活代理，精准定位'),
    cover: 'functions/manage-multiple-accounts/info-section-img-3',
    showDownloadBtn: true,
    descItems: [
      $t('支持灵活配置代理 IP，你可以设置不同地区的 IP 地址，让每个账号都能精准模拟本地用户行为。'),
      $t('无论是测试广告效果、投放活动，还是跨区域管理多个账号，都能轻松实现高效操作，同时隐藏真实地址，确保安全与隐私不被泄露。'),
    ],
  },
]
</script>

<template>
  <DirectionSection
    :title="$t('RoxyBrowser 保护你全平台的所有账号，再无封号风险')"
    :description="$t('RoxyBrowser 不仅可以配合代理 IP 改变你的 IP 地址，更重要的是会为你生成真实的设备指纹信息，为你的每个账号\n分别打造一个独立、真实的运行环境。账号之间不再互相关联，100% 通过平台检测。')"
    :intro-list
    class="intro-section"
  />
</template>

<style lang="scss" scoped>
.intro-section {
  :deep(.intro-list) {
    gap: 60px;

    img {
      max-height: 440px;
      object-fit: contain;
    }
  }
}
</style>
