<script setup lang="ts">
/**
 * 推广落地页总装：不复用首页 page-home，保留 layout 级上报逻辑。
 */
const { getInviteSectionImage } = useInviteLocaleMedia()
const {
  getSocialDescriptions,
  getEcommerceDescriptions,
  getAdsDescriptions,
  getScrapingDescriptions,
} = useInviteDescriptions()

const { isZh } = useRxI18n()

/** 功能区块大标题：中文用系统栈，西文用 Archivo */
const featuresSectionTitleLatin = computed(() => !isZh.value)

/** 推广落地页功能卖点：设计稿五块中的前四块（第五块 AI 为独立视频区） */
const featureSections = computed(() => [
  {
    title: $t('invite.featureSocialTitle'),
    descriptions: getSocialDescriptions(),
    imageName: getInviteSectionImage(1),
    link: '/use-cases/social-media-marketing',
    reverse: false,
  },
  {
    title: $t('invite.featureEcommerceTitle'),
    descriptions: getEcommerceDescriptions(),
    imageName: getInviteSectionImage(2),
    link: '/use-cases/ecommerce-marketing',
    reverse: true,
  },
  {
    title: $t('invite.featureAdsTitle'),
    descriptions: getAdsDescriptions(),
    imageName: getInviteSectionImage(3),
    link: '/use-cases/paid-search-advertising',
    reverse: false,
  },
  {
    title: $t('invite.featureScrapingTitle'),
    descriptions: getScrapingDescriptions(),
    imageName: getInviteSectionImage(4),
    link: '/use-cases/web-scraping',
    reverse: true,
  },
])
</script>

<template>
  <main class="bg-white">
    <PageInviteHeroSection />

    <PageInvitePlatformSection />

    <!-- PC 端整块高度 1892px：功能标题 + 四个图文卖点 + AI 视频区 -->
    <section class="bg-white">
      <!-- 移动端：首段间距 32px，其余 40px；PC 保持 48px -->
      <Container class="flex flex-col py-[40px] lg:(gap-[48px] py-0 pt-20)">
        <!-- 移动端：24px/28px、字重 600；PC：48px/60px、字重 700；中文不指定 font-family -->
        <!-- PC 标题区与胶囊条间距 12px；标题不用 mb / text-h2 行高，仅用显式字号行高 -->
        <section class="shrink-0 flex w-full flex-col items-center gap-[12px]">
          <h2
            class="invite-features-section__title w-full max-w-[358px] text-center text-primary text-[24px] leading-[28px] font-600 lg:(max-w-none self-stretch text-[48px] leading-[60px] font-700)"
            :class="{ 'invite-features-section__title--latin': featuresSectionTitleLatin }"
          >
            {{ $t('invite.featuresSectionTitle') }}
          </h2>
          <PageInvitePromoBadges />
        </section>

        <div class="mt-[32px] flex flex-col gap-[40px] lg:(mt-0 contents)">
          <PageInviteFeatureSection
            v-for="(section, index) in featureSections"
            :key="index"
            v-bind="section"
            class="lg:(flex-none flex flex-col justify-center py-0) xl:(h-[400px] min-h-[400px] max-h-[400px])"
          />
        </div>

        <PageInviteAgentVideoSection class="mt-[40px] lg:(mt-0 flex-none flex flex-col justify-center py-0) xl:(h-[400px] min-h-[400px] max-h-[400px])" />
      </Container>
    </section>

    <PageInvitePricingSection />

    <!-- FAQ+CTA 区：顶圆角 24px；距定价区移动 40px / PC 125px -->
    <div class="invite-faq-cta-wrap mt-[40px] lg:mt-[148px] rounded-t-[24px]">
      <PageInviteFaqSection />
      <PageInviteCtaDownloadSection />
    </div>
  </main>
</template>

<style scoped>
/* 功能区块大标题：仅西文（英/俄）指定 Archivo */
.invite-features-section__title--latin {
  font-family: Archivo, sans-serif;
}

/* invite FAQ+CTA 外层：渐变背景（仅本页 wrapper，lg+ 与移动端各自独立声明，不误伤其他页） */
@media (max-width: 1023.98px) {
  .invite-faq-cta-wrap {
    background: radial-gradient(100% 100% at 50% 0%, #EFF3F6 0%, #FFF 100%);
  }
}

@media (min-width: 1024px) {
  .invite-faq-cta-wrap {
    background: radial-gradient(100% 100% at 50% 0%, #EFF3F6 0%, #FFF 100%);
  }
}
</style>
