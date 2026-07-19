<script setup lang="ts">
import TryItNow from '~/components/page-use-cases/components/TryItNow.vue'

const features = [
  $t('真实浏览器指纹，创建无限窗口配置'),
  $t('零账号封禁、永不被停用'),
  $t('账号之间完全隔离，互不关联'),
]
</script>

<template>
  <div class="hero-banner">
    <div class="hero-banner-content">
      <h1 class="title multilingual-text">
        {{ $t('实现各平台多账号管理，零封号风险') }}
      </h1>
      <div class="description">
        {{ $t('RoxyBrowser 让你在任何平台上安全运行多个账号，零关联，零风险。') }}
      </div>
      <div class="flex flex-col flex-wrap gap-x-4 gap-y-2 justify-center">
        <div v-for="feature in features" :key="feature" class="flex gap-2 items-center">
          <rx-icon-svg-icon name="base/rx_ic_check_fill" />
          <span class="text-3.5 sm:text-4">{{ feature }}</span>
        </div>
      </div>
      <TryItNow class="mt-5 flex-cc w-fit z-10 hidden! sm:flex!" type="primary" />
    </div>
    <RxResponsiveImage name="functions/manage-multiple-accounts/hero-illustration" class="max-w-[543px] w-full" :alt="$t('实现各平台多账号管理，零封号风险')" />
    <TryItNow class="mt-5 flex-cc w-full z-10 sm:hidden!" type="primary" />
  </div>
</template>

<style lang="scss" scoped>
.hero-banner {
  padding-top: 140px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media (max-width: 960px) {
    flex-direction: column;

    .hero-banner-content {
      width: 100%;
      max-width: 100%;
      align-self: flex-start;
    }
  }
}
.hero-banner-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 630px;
}
.title {
  color: var(--colors-text-text-primary, #111213);
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 60px;
  @media (max-width: 768px) {
    font-size: 28px;
    line-height: 36px;
  }
}
.description {
  color: var(--colors-text-text-secondary, #6b7280);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
