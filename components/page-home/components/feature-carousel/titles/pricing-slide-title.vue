<script setup lang="ts">
/** pricing 页标题中数字 5 的渐变色，与 badge / subtitleHighlight 一致 */
const PRICING_TITLE_HIGHLIGHT_GRADIENT = 'linear-gradient(91deg, #F7604A -1.89%, #E789EE 100.24%)'

const { $t } = useRxI18n()
</script>

<template>
  <rx-i18n-t :keypath="$t('免费 {highlight} 个窗口\n永久成员额度', { highlight: '{highlight}' })">
    <template #highlight>
      <span
        class="pricing-slide-title__highlight"
        :style="{ backgroundImage: PRICING_TITLE_HIGHLIGHT_GRADIENT }"
      >5</span>
    </template>
  </rx-i18n-t>
</template>

<style lang="scss" scoped>
.pricing-slide-title__highlight {
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
