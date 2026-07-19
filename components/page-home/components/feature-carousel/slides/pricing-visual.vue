<script setup lang="ts">
import visualImg from '@/assets/images/home/feature-carousel/pricing.png?format=webp'
</script>

<template>
  <div class="pricing-visual">
    <img
      :src="visualImg"
      alt=""
      class="pricing-visual__img"
      draggable="false"
      loading="lazy"
    >
  </div>
</template>

<style lang="scss" scoped>
.pricing-visual {
  /* 与轮播视觉区标准画布 590×522 一致，保证等比缩放 */
  aspect-ratio: 590 / 522;
  width: min(100%, 590px);
  max-width: 100%;
  max-height: 100%;
  height: auto;
  min-height: 0;
  flex-shrink: 1;
  margin-inline: auto;

  @media (min-width: 1024px) {
    margin-left: auto;
    margin-right: 0;
  }

  &__img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    user-select: none;
  }
}
</style>
