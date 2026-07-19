<script setup lang="ts">
import DirectionSection from '../direction-section.vue'

const introList = [
  {
    title: $t('隐藏你的真实身份'),
    cover: 'functions/private-browsing/info-section-img-1',
    descItems: [
      $t('用 RoxyBrowser 轻松创建虚拟身份，自定义浏览器指纹信息，让每个操作都像真实用户一样自然。'),
      $t('你的真实信息永远不会被暴露、被追踪，或与你的线上活动相关联，网站只能看到和记录你的假身份。'),
    ],
  },
  {
    title: $t('浏览记录绝不外泄'),
    cover: 'functions/private-browsing/info-section-img-2',
    descItems: [
      $t('使用 RoxyBrowser 时，你的所有浏览记录都密封在独立的窗口配置里。关闭窗口后，任何痕迹都不会泄露到你的主浏览器或桌面。'),
      $t('没有历史记录共享，没有浏览痕迹残留，实现真正的“无痕浏览”。'),
    ],
  },
  {
    title: $t('每个窗口均为“不同用户”'),
    cover: 'functions/private-browsing/info-section-img-3',
    descItems: [
      $t('你可以打开任意数量的窗口，每个窗口都有独立的 IP 和数字指纹，让你可以在同一台设备上操作多个不同身份的账号。'),
      $t('没有交叉污染，没有身份暴露，安心切换、随心使用。'),
    ],
  },
]
</script>

<template>
  <DirectionSection :title="$t('隐身上网，从此不留痕迹')" :description="$t('和普通无痕模式不同，RoxyBrowser 每次打开都会给你一个全新的、无法追踪的身份。')" :intro-list />
</template>
