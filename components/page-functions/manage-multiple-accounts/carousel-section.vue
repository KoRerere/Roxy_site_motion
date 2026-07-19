<script setup lang="ts">
import { useRxWindowSize } from '~/composables/useRxWindowSize'
import SectionTitle from '../section-title.vue'
import CarouselMobileSection from './carousel-mobile-section.vue'
import CarouselPcSection from './carousel-pc-section.vue'

const { width } = useRxWindowSize()

const slides = [
  {
    title: $t('多窗口同步操作'),
    description: $t('一键同步你的所有活动。只需一次点击，就能同时更新所有活动窗口，适合批量发帖、互动或监控。'),
    image: 'functions/manage-multiple-accounts/scroll-cards-img-1',
  },
  {
    title: $t('无缝团队协作'),
    description: $t('无需分享账号密码，就能让团队成员安全地访问已登录的配置文件。你可以分享单个窗口、一个文件夹，甚至整个工作区。'),
    image: 'functions/manage-multiple-accounts/scroll-cards-img-2',
  },
  {
    title: $t('规模化自动化'),
    description: $t('通过我们的 API 连接你的自定义工具和脚本。从创建账号到内容发布，自动处理重复性任务，为你省下宝贵时间。'),
    image: 'functions/manage-multiple-accounts/scroll-cards-img-3',
  },
  {
    title: $t('隔离、安全的窗口配置'),
    description: $t('每个账号都在自己独特的指纹环境中运行，杜绝任何跨账号关联或平台检测。'),
    image: 'functions/manage-multiple-accounts/scroll-cards-img-4',
  },
]
</script>

<template>
  <div class="carousel-section">
    <SectionTitle
      :title="$t('一款指纹浏览器，轻松管理所有账号。')"
      :description="$t('RoxyBrowser 让你可以在同一设备上高效管理和运营多个账号，实现业务规模化，同时确保隐私和安全。')"
    />
    <template v-if="width >= 960">
      <CarouselPcSection :slides="slides" />
    </template>
    <span />
    <template v-if="width < 960">
      <CarouselMobileSection :slides="slides" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.carousel-section {
  padding: 80px 20px;
  width: 100%;
  background: url('~/assets/images/functions/manage-multiple-accounts/carousel-bg.svg') no-repeat center center;
  background-size: cover;

  @media (max-width: 960px) {
    padding: 40px 20px;
  }

  :deep(.section-title) {
    .title,
    .description {
      color: #fff;
    }
  }
}
</style>
