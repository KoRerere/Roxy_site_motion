<script setup lang="ts">
// import { useElementBounding } from '@vueuse/core'
import { useScrollScale } from '~/composables/useScrollScale'

const { target } = useScrollScale()
</script>

<template>
  <div ref="target" class="autosize-banner">
    <div class="max-w-1280px w-full flex flex-col gap-2 md:gap-7">
      <div>{{ $t("但是，只改变 IP 是不够的。 如果你的浏览器指纹保持不变，频繁切换 IP 地址反而会增加被检测的风险。") }}</div>
      <div class="h-[132px] relative">
        <img src="@/assets/images/functions/tags.png" alt="autosize-banner" class="tags-img">
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.autosize-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 100px;
  max-width: 1600px;
  width: 100%;
  background: url('@/assets/images/functions/autosize-banner-bg.svg') no-repeat center center / cover;
  color: #fff;
  text-align: center;
  font-family: Archivo;
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 44px; /* 137.5% */
  border-radius: 20px;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 20px;
    font-size: 22px;
    line-height: 28px;
  }
}

.tags-img {
  position: absolute;
  height: 100%;
  transform: translateX(-50%);

  @media (max-width: 900px) {
    transform: translateX(-50%) scale(0.6);
  }
}
</style>
