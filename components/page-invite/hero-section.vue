<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
import PageInviteHeroEnergyCanvasDesktop from './hero-energy-canvas-desktop.vue'
import PageInviteHeroEnergyCanvasMobile from './hero-energy-canvas-mobile.vue'
import PageInviteHeroCopyDesktop from './hero-copy-desktop.vue'
import PageInviteHeroCopyMobile from './hero-copy-mobile.vue'
import PageInviteLoginSignForm from './login/sign-form.vue'
import heroBg from '@/assets/svgs/intive/New.svg?url'
const { $t } = useRxI18n()

/** Invite Hero 卖点；highlightKey 保留供后续恢复关键字高亮 */
const HERO_BENEFIT_KEYS = [
  { textKey: 'invite.heroBenefitAntiBan', highlightKey: 'invite.heroBenefitAntiBanHighlight' },
  { textKey: 'invite.heroBenefitRoxyIp', highlightKey: 'invite.heroBenefitRoxyIpHighlight' },
  { textKey: 'invite.heroBenefitAiEfficiency', highlightKey: 'invite.heroBenefitAiEfficiencyHighlight' },
] as const

const benefits = computed(() => HERO_BENEFIT_KEYS)

const activeBannerIndex = ref(0)

const banners = computed(() => {
  const items = [
    {
      badge: $t('invite.heroBadge'),
      title: $t('invite.heroRegisterTitle'),
      subtitle: $t('invite.heroDiscountSubtitle'),
      highlight: '',
      primaryCta: $t('invite.heroPrimaryCta'),
      secondaryCta: $t('invite.heroSecondaryCta'),
    },
    {
      badge: $t('invite.heroBadge'),
      title: $t('invite.heroRegisterTitle'),
      subtitle: $t('invite.heroDiscountSubtitle'),
      highlight: '',
      primaryCta: $t('invite.heroPrimaryCta'),
      secondaryCta: $t('invite.heroSecondaryCta'),
    },
  ]

  return items.slice(0, 1)
})

const currentBanner = computed(() => {
  const firstBanner = banners.value[0]!
  return banners.value[activeBannerIndex.value] || firstBanner
})

function switchBanner(step: number) {
  const total = banners.value.length
  activeBannerIndex.value = (activeBannerIndex.value + step + total) % total
}

function goToBanner(index: number) {
  activeBannerIndex.value = index
}

/** 能量注入表单高亮开关（色板难与卡片完全统一时关闭，仅保留导线动画） */
const ENERGY_INJECT_HIGHLIGHT_ENABLED = false

/** 能量脉冲触达表单左缘时拉高亮度，CSS transition 缓慢熄灭 */
const formEnergized = ref(false)
let formGlowTimer: ReturnType<typeof setTimeout> | undefined

function handleEnergyArrive() {
  if (!ENERGY_INJECT_HIGHLIGHT_ENABLED)
    return
  formEnergized.value = true
  if (formGlowTimer)
    clearTimeout(formGlowTimer)
  formGlowTimer = setTimeout(() => {
    formEnergized.value = false
  }, 320)
}

onBeforeUnmount(() => {
  if (formGlowTimer)
    clearTimeout(formGlowTimer)
})
</script>

<template>
  <!-- 导线层上扩至 Header Logo 区，stack 避免 section overflow 裁切 -->
  <div class="invite-hero-stack relative">
    <section
      class="invite-hero-section relative overflow-hidden bg-[#030F3A] pb-[60px] pt-[96px] lg:(min-h-[829px] pt-[177px] pb-[0])"
    >
      <!-- 背景层：内联 z-index 确保 CSS 未就绪时也在文案下方 -->
      <div
        class="invite-hero-bg pointer-events-none absolute inset-0 overflow-hidden"
        style="z-index: 0"
        aria-hidden="true"
      >
        <img
          :src="heroBg"
          alt=""
          class="invite-hero-bg-base h-full w-full select-none object-cover object-top"
          draggable="false"
        >
        <PageInviteHeroEnergyCanvasDesktop @energy-arrive="handleEnergyArrive" />
        <PageInviteHeroEnergyCanvasMobile @energy-arrive="handleEnergyArrive" />
      </div>

      <button
        v-if="banners.length > 1"
        type="button"
        class="hidden text-white/90 h-12 w-12 border-none rounded-full bg-white/18 cursor-pointer absolute left-6 top-1/2 z-20 items-center justify-center transition-colors hover:bg-white/28 lg:flex"
        aria-label="Previous banner"
        @click="switchBanner(-1)"
      >
        <RxIcon name="base/rx_ic_chevron_right" size="24" color="#fff" class="rotate-180" />
      </button>
      <button
        v-if="banners.length > 1"
        type="button"
        class="hidden text-white/90 h-12 w-12 border-none rounded-full bg-white/18 cursor-pointer absolute right-6 top-1/2 z-20 items-center justify-center transition-colors hover:bg-white/28 lg:flex"
        aria-label="Next banner"
        @click="switchBanner(1)"
      >
        <RxIcon name="base/rx_ic_chevron_right" size="24" color="#fff" />
      </button>

      <!-- 前景层独立包裹：内联 z-index，dev 模式不依赖 UnoCSS 也能压在背景上 -->
      <div class="invite-hero-foreground-layer" style="position: relative; z-index: 10">
        <Container
          class="invite-hero-container relative flex flex-col gap-[40px] px-[20px] lg:(min-h-[520px] box-border grid grid-cols-[minmax(0,1fr)_minmax(400px,466px)] items-center gap-[80px] px-[40px]) xl:px-0"
        >
          <PageInviteHeroCopyDesktop
          :badge="currentBanner.badge"
          :title="currentBanner.title"
          :subtitle="currentBanner.subtitle"
          :highlight="currentBanner.highlight"
          :primary-cta="currentBanner.primaryCta"
          :secondary-cta="currentBanner.secondaryCta"
          :benefits="benefits"
          :banner-count="banners.length"
          :active-banner-index="activeBannerIndex"
          @go-to-banner="goToBanner"
        />

        <PageInviteHeroCopyMobile
          :badge="currentBanner.badge"
          :title="currentBanner.title"
          :subtitle="currentBanner.subtitle"
          :primary-cta="currentBanner.primaryCta"
          :secondary-cta="currentBanner.secondaryCta"
          :benefits="benefits"
          :banner-count="banners.length"
          :active-banner-index="activeBannerIndex"
          @go-to-banner="goToBanner"
        />

          <div class="invite-hero-form-col relative z-[2] w-full max-w-480px mx-auto mt-0 shrink-0 lg:(w-full max-w-[466px] mx-0 mt-0 justify-self-end self-center)">
            <PageInviteLoginSignForm :energized="formEnergized" />
          </div>
        </Container>
      </div>
    </section>
  </div>
</template>

<style scoped>
.invite-hero-bg-base {
  position: absolute;
  inset: 0;
}

</style>
