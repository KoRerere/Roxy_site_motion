<template>
  <!-- 背景/装饰共用；移动端与 PC 分块渲染，避免 lg:contents 导致 PC 文字错位 -->
  <div
    class="invite-benefit-card relative box-border self-stretch min-h-66px overflow-hidden rounded-[12px] border border-solid border-black/6 bg-[#F9F9F9] bg-[linear-gradient(180deg,rgba(18,163,252,0.11)_0%,rgba(18,163,252,0.05)_100%)] bg-white"
  >
    <!-- 移动端：图标左 + 两行文案 -->
    <div class="relative z-2 flex items-start gap-2 px-[24px] py-[20px] lg:hidden">
      <BenefitCardIcon class="shrink-0" />
      <div class="flex min-w-0 flex-1 flex-col gap-1">
        <span class="font-[Inter] text-[16px] leading-[22px] font-500 text-primary">
          {{ $t('解锁您的新用户权益：') }}
        </span>
        <span class="font-[Inter] text-[16px] leading-[22px] font-600 text-[#11A3FD]">
          {{ $t('静态住宅 IP、动态住宅 IP (流量包)、终身折扣 任选其一！') }}
        </span>
      </div>
    </div>

    <!-- PC 端：结构与 card.vue 一致，单行横向排列 -->
    <div class="relative z-2 hidden text-4 text-primary leading-28px px-6 py-5 lg:(flex flex-row flex-wrap items-center gap-[4px_8px])">
      <BenefitCardIcon />
      <span class="text-primary font-500">{{ $t('解锁您的新用户权益：') }}</span>
      <span class="text-4.5 text-[#11A3FD] font-600 text-center">{{ $t('静态住宅 IP、动态住宅 IP (流量包)、终身折扣 任选其一！') }}</span>
    </div>

    <img
      src="/pricing/cards-bg.svg"
      alt="card"
      class="invite-benefit-card-bg pointer-events-none absolute z-1"
      aria-hidden="true"
      draggable="false"
    >
  </div>
</template>

<script setup lang="ts">
import BenefitCardIcon from './pricing-benefit-card-icon.vue'
</script>

<style scoped>
/* 移动端：卡片更窄，需缩小并右移装饰图以贴合设计稿右下角光晕 */
@media (max-width: 1023px) {
  .invite-benefit-card-bg {
    right: -20px;
    bottom: -12px;
    height: 72px;
    width: auto;
  }
}

/* PC 端：与定价页 card.vue 保持一致 */
@media (min-width: 1024px) {
  .invite-benefit-card-bg {
    right: -6.25rem;
    bottom: -3rem;
  }
}
</style>
