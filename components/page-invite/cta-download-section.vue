<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

const localePath = useLocalePath()

/** 整块 CTA 点击直接跳转下载页（PC / 移动端一致） */
function handlePanelClick() {
  navigateTo(localePath('/download'))
}
</script>

<template>
  <!-- 从 CtaDownloadBtnByPanel2 复制，invite 页独立维护；整块可点击 -->
  <Container
    class="invite-cta-download my-[40px] rounded-3 relative cursor-pointer overflow-hidden lg:(my-[60px] rounded-10)"
    role="link"
    tabindex="0"
    @click="handlePanelClick"
    @keydown.enter="handlePanelClick"
  >
    <div class="bottom-0 left-0 right-0 top-0 absolute z-9">
      <RxResponsiveImage
        name="download/panel-bg"
        alt=""
        class="h-full w-full object-cover"
      />
      <div class="bg-black/10 bottom-0 left-0 right-0 top-0 absolute z-10" />
    </div>

    <div class="pointer-events-none flex flex-col items-center pb-10 pt-30px relative z-10 lg:py-[60px]">
      <RxIcon name="base/rx_ic_logo" size="72" />
      <div class="my-6 text-center">
        <h2
          class="multilingual-text text-white font-700 text-5 leading-24px md:text-7 md:leading-8 lg:text-9 lg:leading-32px xl:text-40px xl:leading-40px"
        >
          {{ $t('隐私保护，从 RoxyBrowser 启航') }}
        </h2>
        <p
          class="multilingual-text text-white font-400 text-4.5 leading-32px md:text-5 lg:text-6 lg:leading-48px"
        >
          {{ $t('匿名浏览，远离追踪') }}
        </p>
      </div>
      <span class="text-16px text-white font-500 px-5 py-3 rounded-2 bg-[#11A3FD] inline-flex gap-2 items-center">
        <RxIcon name="base/rx_ic_download" class="inline-flex text-white" size="24" />
        {{ $t('免费使用') }}
      </span>
    </div>
  </Container>
</template>

<style scoped>
/* 移动端左右 20px 外边距，与上方 FAQ 区 px-[20px] 对齐 */
@media (max-width: 1023.98px) {
  .invite-cta-download {
    margin-inline: 20px;
  }
}
</style>
