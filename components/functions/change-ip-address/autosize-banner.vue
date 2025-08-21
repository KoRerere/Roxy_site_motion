<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'

const el = useTemplateRef('el')
const { x, y, top, right, bottom, left, width, height } = useElementBounding(el)

// 默认宽度占窗口宽度80%，滚动后到窗口中间时，占用屏幕宽度96%，后逐渐缩小
const bannerWidth = computed(() => {
  const maxHeight = (window.innerHeight - height.value) / 2

  return width.value
})
</script>

<template>
  <div ref="el" class="autosize-banner">
    <div class="max-w-1280px w-full flex flex-col gap-7">
      <div>{{ $t("但是，只改变 IP 是不够的。 如果你的浏览器指纹保持不变，频繁切换 IP 地址反而会增加被检测的风险。") }}</div>
      <img src="@/assets/images/functions/tags.png" alt="autosize-banner" class="h-[132px] object-cover">
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
  // width: 80%;
  width: min(100%, 1280px);
  min-height: 368px;
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
}
</style>
