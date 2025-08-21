<script setup lang="ts">
import TryItNow from '~/components/page-use-cases/components/TryItNow.vue'

const features = [$t('无需配置 VPN'), $t('无需繁琐设置'), $t('告别封号风险')]
</script>

<template>
  <div class="max-w-[950px] pt-36 flex flex-col gap-4 justify-center items-center">
    <div class="title">
      <pre class="whitespace-pre-line">{{ $t('用 RoxyBrowser 轻松切换 IP 地址\n——更安全，更简单，更隐秘') }}</pre>
    </div>
    <div class="flex items-center gap-4 flex-wrap mx-auto justify-center">
      <div v-for="feature in features" :key="feature" class="flex items-center gap-2">
        <rx-icon-svg-icon name="base/rx_ic_check_fill" />
        <span>{{ feature }}</span>
      </div>
    </div>
    <div class="color-secondary text-3.5">
      {{ $t('一键同步更换 IP 与浏览器指纹，隐匿行踪，保障安全。') }}
    </div>

    <TryItNow class="mt-5" type="primary" />
  </div>
</template>

<style lang="scss" scoped>
.title {
  color: var(--colors-text-text-primary, #111213);
  text-align: center;
  font-family: Archivo;
  font-size: var(--Heading-H2, 48px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H2, 60px);
}

@media (max-width: 768px) {
  .title {
    color: var(--colors-text-text-primary, #111213);
    text-align: center;
    font-family: Archivo;
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 33.6px */
  }
}
</style>
