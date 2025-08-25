<script setup lang="ts">
import TryItNow from '~/components/page-use-cases/components/TryItNow.vue'

const features = [$t('无需配置 VPN'), $t('无需繁琐设置'), $t('告别封号风险')]
</script>

<template>
  <div class="max-w-250 pt-36 flex flex-col gap-4 justify-center items-center">
    <h1 class="title whitespace-pre-line">
      <rx-i18n-t :keypath="$t('用 RoxyBrowser 轻松切换 IP 地址{icon}\n——更安全，更简单，更隐秘', { icon: '{icon}' })">
        <template #icon>
          <span>
            <rx-icon-svg-icon class="translate-y-2 rotate-15 w-9 h-9 md:w-14 md:h-14" name="functions/rx_ic_ip-address" />
          </span>
        </template>
      </rx-i18n-t>
    </h1>
    <div class="color-secondary text-4.5 leading-28px">
      {{ $t('一键同步更换 IP 与浏览器指纹，隐匿行踪，保障安全。') }}
    </div>
    <div class="flex items-center gap-4 flex-wrap mx-auto justify-center">
      <div v-for="feature in features" :key="feature" class="flex items-center gap-2">
        <rx-icon-svg-icon name="base/rx_ic_check_fill" />
        <span>{{ feature }}</span>
      </div>
    </div>

    <TryItNow class="mt-5" type="primary" :text="$t('立即下载')" />
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
    line-height: 120%;
    /* 33.6px */
  }
}
</style>
