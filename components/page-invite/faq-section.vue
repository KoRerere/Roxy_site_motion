<script setup lang="ts">
/** 落地页 FAQ：文案与官网首页 page-home 保持一致 */
const faqList = computed(() => [
  {
    title: $t('RoxyBrowser 如何助力我的业务？'),
    desc: $t('RoxyBrowser 以先进的指纹反追踪技术赋能您的业务，确保巅峰性能。'),
  },
  {
    title: $t('我的数据在 RoxyBrowser 中完全安全吗？'),
    desc: $t('您在 RoxyBrowser 中的浏览活动和个人信息完全私密，我们采用端到端加密保护您的数据，为多账号敏感操作提供必要的安全保障。'),
  },
  {
    title: $t('RoxyBrowser 使用起来复杂吗？'),
    desc: $t('RoxyBrowser 提供直观界面，兼顾简洁与强大功能。核心功能快速上手，高级定制选项满足资深用户需求。'),
  },
  {
    title: $t('RoxyBrowser 有何独特之处？'),
    desc: $t('RoxyBrowser 凭借独家指纹算法和跨平台稳定性脱颖而出。我们的技术在高安全平台上也能防止检测，同时保持媲美原生应用的性能。'),
  },
  {
    title: $t('我可以免费试用 RoxyBrowser 吗？'),
    desc: $t('当然可以，RoxyBrowser 提供永久免费计划，包含 5 个配置文件。对于需要更多功能的用户，我们提供 7 天全面免费试用，让您在真实业务环境中测试我们的解决方案。'),
  },
  {
    title: $t('如果我未及时续费会怎样？'),
    desc: $t('订阅过期后，您的配置文件和数据仍安全存储。此期间无法启动配置文件，但所有设置完整保留。随时续费即可恢复完整访问，无需重新配置，无数据丢失。'),
  },
])
</script>

<template>
  <!-- 移动端 px 20px / pt 60px / pb 0；PC lg:pt-80px、lg:pb-0；PC「在线技术支持」样式对齐 pricing 页 Faq 默认 -->
  <Faq
    :fqa-list="faqList"
    row-class="xl:gap-[20px]"
    title-class="max-xl:(w-full self-stretch text-center font-[Archivo] !text-[24px] !font-600 leading-normal) xl:!mt-[20px]"
    subtitle-class="max-xl:(w-full self-stretch text-center font-[Inter] text-[14px] font-400 leading-[20px] tracking-[-0.042px] !mt-[8px]) xl:!mt-[24px]"
    mobile-support-title-class="font-[Archivo] !text-[16px] font-500 !leading-[24px] tracking-[-0.048px] text-[#042144] !mt-[20px]"
    accordion-item-class="xl:!pt-[28px] xl:!pr-[20px] xl:!pb-[28px] xl:!pl-0"
    accordion-item-title-class="max-xl:(font-[Archivo] !text-[18px] font-500 !leading-[24px] tracking-[-0.054px] invite-faq-item-title--mobile) xl:!font-500"
    accordion-item-content-class="max-xl:(font-[Inter] !text-[16px] font-400 !leading-[24px] tracking-[-0.048px] !text-primary)"
    accordion-item-content-wrap-class="max-xl:!pt-[8px]"
    class="invite-faq-section fqa-container max-lg:(!px-[20px] !pt-[60px] !pb-0) lg:pt-[80px] lg:pb-0"
  />
</template>

<style scoped>
/* 移动端 FAQ 条目标题：设计稿 font-feature-settings liga/calt off */
@media (max-width: 1279.98px) {
  :deep(.invite-faq-item-title--mobile) {
    font-feature-settings: 'liga' off, 'calt' off;
  }
}

/* PC「在线技术支持」：对齐 pricing Faq（text-h5 / Inter / 500 / mb-6 / mt-15） */
@media (min-width: 1280px) {
  .invite-faq-section :deep(.hidden.xl\:block > p) {
    font-family: Inter, sans-serif;
    font-size: var(--Heading-H5);
    line-height: var(--line-H5);
    font-weight: 500;
    margin-bottom: 24px;
    margin-top: 60px;
    color: var(--color-text-primary);
  }
}

/* PC FAQ 手风琴列表容器：左侧补 20px 内边距（仅 invite 页） */
@media (min-width: 1024px) {
  :deep(.pr-3.w-full.left-0.top-0) {
    padding-left: 20px;
  }
}
</style>
