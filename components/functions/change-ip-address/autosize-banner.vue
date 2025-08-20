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
    <div>{{ $t("However, changing IP alone isn't enough. If your fingerprints stay the same, switching IPs can raise red flags and increase the risk of detection.") }}</div>
    <img src="@/assets/images/functions/tags.png" alt="autosize-banner" class="w-full">
  </div>
</template>

<style lang="scss" scoped>
.autosize-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 30px 100px;
  width: calc(100vw - 100px);
  min-height: 368px;
  background:
    linear-gradient(0deg, #172e3c 0%, #172e3c 100%), linear-gradient(180deg, rgba(18, 163, 252, 0.8) 0%, #12a3fc 100%),
    #fff;
  color: #fff;
  text-align: center;
  font-family: Archivo;
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 44px; /* 137.5% */
  border-radius: 20px;
}
</style>
