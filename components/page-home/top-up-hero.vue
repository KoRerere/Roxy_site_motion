<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

const { isZh } = useRxI18n()

const bannerSrc = computed(() =>
  isZh.value
    ? 'url(\'/activity/top-up-season/bannerZh.png\')'
    : 'url(\'/activity/top-up-season/bannerEn.png\')',
)

const mobileBannerSrc = computed(() =>
  isZh.value
    ? 'url(\'/activity/top-up-season/mobileZh.png\')'
    : 'url(\'/activity/top-up-season/mobileEn.png\')',
)

const { countdown, padTime } = useTopUpPromoCountdown()

const countdownUnits = computed(() => [
  { value: padTime(countdown.value.days), label: $t('天') },
  { value: padTime(countdown.value.hours), label: $t('时') },
  { value: padTime(countdown.value.minutes), label: $t('分') },
  { value: padTime(countdown.value.seconds), label: $t('秒') },
])

let heroContentObserver: IntersectionObserver | undefined

const heroContentRef = useTemplateRef<HTMLElement>('heroContent')
const { $eventBus } = useNuxtApp()
const { handleTopUpClick } = useTopUpNavigate()

const MOBILE_HEADER_ROOT_MARGIN = '-56px 0px 0px 0px'

onMounted(() => {
  if (heroContentRef.value) {
    heroContentObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry)
          return

        $eventBus.emit('topUpHeroContentVisible', entry.isIntersecting)
      },
      { threshold: 0, rootMargin: MOBILE_HEADER_ROOT_MARGIN },
    )
    heroContentObserver.observe(heroContentRef.value)
  }
})

onUnmounted(() => {
  heroContentObserver?.disconnect()
})
</script>

<template>
  <section class="text-white pt-27.5 bg-black min-h-[740px] w-full relative overflow-hidden md:(pb-0 h-[780px])">
    <div class="m-banner pointer-events-none inset-0 absolute z-0 md:hidden" />
    <div class="banner hidden pointer-events-none inset-0 absolute z-0 md:block" />
    <Container class="flex flex-col gap-6 relative z-1 max-md:(px-5 pb-[280px]) md:(flex-row gap-10 items-center)">
      <div ref="heroContent" class="top-up-hero-content text-center flex flex-col gap-4 w-full items-center relative z-2 md:(text-left gap-6 items-start)">
        <div class="top-up-promo-badge px-4 py-1.5 flex gap-2 items-center justify-center md:px-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="19" viewBox="0 0 14 19" fill="none">
            <path
              d="M7 0C6.33333 2.66667 5 4.83333 3 6.5C1 8.16667 0 10 0 12C0 13.8565 0.737498 15.637 2.05025 16.9497C3.36301 18.2625 5.14348 19 7 19C8.85652 19 10.637 18.2625 11.9497 16.9497C13.2625 15.637 14 13.8565 14 12C14 10.9181 13.6491 9.86548 13 9C13 9.66304 12.7366 10.2989 12.2678 10.7678C11.7989 11.2366 11.163 11.5 10.5 11.5C9.83696 11.5 9.20107 11.2366 8.73223 10.7678C8.26339 10.2989 8 9.66304 8 9C8 7 9.5 6 9.5 4C9.5 2.66667 8.66667 1.33333 7 0Z"
              fill="url(#paint0_linear_10848_92456)"
            />
            <defs>
              <linearGradient id="paint0_linear_10848_92456" x1="15" y1="17" x2="13.938" y2="2.80735" gradientUnits="userSpaceOnUse">
                <stop stop-color="#9229F5" />
                <stop offset="1" stop-color="#DF93EE" />
              </linearGradient>
            </defs>
          </svg>
          <span class="top-up-promo-badge__text text-transparent font-600 bg-clip-text" style="background-image: linear-gradient(100deg, #DF93EE 0.26%, #9229F5 99.74%)">
            {{ $t('Roxy 史上力度最大充值活动') }}
          </span>
        </div>

        <div class="hero-title-block flex flex-col w-full items-center max-md:gap-2 md:items-start">
          <span class="hero-main-title max-md:px-1">
            {{ $t('Roxy 超级充值季') }}
          </span>

          <div class="hero-title text-white font-700">
            <rx-i18n-t :keypath="$t('单笔充值最高 {bouns}', { bouns: '{bouns}' })">
              <template #bouns>
                <span class="hero-title-bouns">
                  <span v-if="isZh" class="font-700 hero-title-bonus-label">{{ $t('赠送') }}</span>
                  <span class="font-700 hero-title-bonus-percent">{{ $t('55%') }}</span>
                </span>
              </template>
            </rx-i18n-t>
          </div>

          <!-- 移动端：描述与按钮之间无 gap -->
          <div class="hero-desc-cta flex flex-col w-full items-center max-md:gap-0 gap-4 md:items-start">
            <div class="hero-desc text-24 text-white/80 md:mb-6">
              {{ $t('活动期间多充多送，新老用户均可参与') }}
            </div>

            <button type="button" class="top-up-cta-btn mb-4 border-none w-auto cursor-pointer" @click="handleTopUpClick">
              <span>{{ $t('立即充值') }}</span>
              <RxIcon name="base/rx_ic_chevron_right" size="16" />
            </button>
          </div>
        </div>

        <div class="hero-countdown-block flex flex-col w-full items-center md:(gap-4 items-start)">
          <div class="hero-countdown-label text-white font-400">
            {{ $t('活动倒计时（6.17-7.01）') }}
          </div>

          <div class="hero-countdown-row flex items-center justify-center">
            <template v-for="(unit, index) in countdownUnits" :key="unit.label">
              <div class="hero-countdown-item flex flex-col items-center">
                <div class="hero-countdown-num not-italic">
                  {{ unit.value }}
                </div>
                <span class="hero-countdown-unit" translate="no">
                  {{ $t(unit.label) }}
                </span>
              </div>

              <div v-if="index < countdownUnits.length - 1" class="hero-countdown-separator flex flex-col items-center self-start justify-center">
                <span class="hero-countdown-dot rounded-full bg-white shrink-0" />
                <span class="hero-countdown-dot rounded-full bg-white shrink-0" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>

<style scoped>
.banner {
  background-image: v-bind(bannerSrc);
  background-size: auto 100%;
  background-position: center;
  background-repeat: no-repeat;
}

.m-banner {
  background-image: v-bind(mobileBannerSrc);
  background-size: 100% auto;
  background-position: bottom center;
  background-repeat: no-repeat;
}

.light-text {
  background: linear-gradient(97deg, #05caed 0%, #47d769 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.top-up-cta-btn {
  display: flex;
  /* 移动端按钮内边距 */
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background: linear-gradient(97deg, #05caed 0%, #47d769 100%);
  color: #fff;
  text-align: center;
  font-family: Inter, sans-serif;
  /* 移动端「立即充值」：14px / 500 / 20px */
  font-size: var(--Font-Size-text-lg, 14px);
  font-weight: 500;
  line-height: var(--Line-Height-text-lg, 20px);
}

@media (min-width: 768px) {
  .top-up-cta-btn {
    min-width: 88px;
    padding: 12px 20px;
    /* PC 端保持原 18px 字号 */
    font-size: 18px;
  }
}

.top-up-promo-badge {
  border-radius: 60px;
  border: 1px solid #df93ee;
  background: linear-gradient(92deg, rgba(223, 147, 238, 0.2) -0.26%, rgba(146, 41, 245, 0.2) 99.74%);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
}

/* 移动端活动角标文案：13px / 600 / 18px */
.top-up-promo-badge__text {
  font-size: 13px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px;
}

@media (min-width: 768px) {
  /* PC 端保持原 text-4 / leading-24px */
  .top-up-promo-badge__text {
    font-size: 16px;
    line-height: 24px;
  }
}

.top-up-hero-content {
  --hero-fluid-range: 1122;

  --hero-title-size: clamp(36px, calc(36px + (100vw - 390px) * 20 / var(--hero-fluid-range)), 56px);
  --hero-title-leading: clamp(44px, calc(44px + (100vw - 390px) * 22 / var(--hero-fluid-range)), 66px);
  --hero-desc-size: clamp(14px, calc(14px + (100vw - 390px) * 2 / var(--hero-fluid-range)), 16px);
  --hero-desc-leading: clamp(20px, calc(20px + (100vw - 390px) * 4 / var(--hero-fluid-range)), 24px);
  --hero-countdown-label-size: clamp(16px, calc(16px + (100vw - 390px) * 4 / var(--hero-fluid-range)), 20px);
  --hero-countdown-num-size: clamp(28px, calc(28px + (100vw - 390px) * 20 / var(--hero-fluid-range)), 48px);
  --hero-countdown-num-leading: clamp(36px, calc(36px + (100vw - 390px) * 24 / var(--hero-fluid-range)), 60px);
  --hero-countdown-box-size: clamp(60px, calc(60px + (100vw - 390px) * 30 / var(--hero-fluid-range)), 90px);
  --hero-countdown-box-radius: clamp(10px, calc(10px + (100vw - 390px) * 2 / var(--hero-fluid-range)), 12px);
  --hero-countdown-unit-size: clamp(12px, calc(12px + (100vw - 390px) * 2 / var(--hero-fluid-range)), 14px);
  --hero-countdown-unit-leading: clamp(16px, calc(16px + (100vw - 390px) * 2 / var(--hero-fluid-range)), 18px);
  --hero-countdown-dot-size: clamp(4px, calc(4px + (100vw - 390px) * 2 / var(--hero-fluid-range)), 6px);
}

.hero-main-title {
  color: #fff;
  font-family: Archivo, sans-serif;
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 44px;
  white-space: nowrap;
}

@media (max-width: 767px) {
  .hero-main-title {
    /* 移动端允许换行，避免英文标题贴边溢出 */
    max-width: 100%;
    white-space: normal;
  }
}

@media (min-width: 768px) {
  .hero-main-title {
    font-size: var(--hero-title-size);
    line-height: var(--hero-title-leading);
  }
}

/* 移动端副标题「单笔充值最高 赠送 55%」：32px / 700 / 44px */
.hero-title {
  font-size: 32px;
  font-weight: 700;
  line-height: 44px;
}

@media (max-width: 767px) {
  /* 移动端单行展示「单笔充值最高赠送 55%」 */
  .hero-title {
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
    white-space: nowrap;
    /* 与「单笔充值最高」保持同一行高，避免「赠送」视觉偏矮 */
    line-height: 44px;
  }

  .hero-title-bouns {
    display: inline-flex;
    align-items: flex-end;
    margin-left: 4px;
    white-space: nowrap;
  }

  .hero-title-bonus-label {
    font-size: 32px;
    line-height: 44px;
    background: linear-gradient(93deg, #05CAED 0%, #20CFB7 99.08%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero-title-bonus-percent {
    margin-left: 4px;
    font-size: 38px;
    line-height: 44px;
    background: linear-gradient(97deg, #21D0B4 0%, #44D670 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

@media (min-width: 768px) {
  /* PC 端「Roxy 超级充值季」与副标题行间距 8px */
  .hero-title-block {
    gap: 8px;
  }

  /* PC 端 Hero 副标题：三段 flex 上下居中，「赠送」距左右各 8px */
  .hero-title {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    font-size: var(--hero-title-size);
    line-height: var(--hero-title-leading);
  }

  .hero-title-bouns {
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
  }

  /* PC 端「赠送」：56px / 700 / 90px + 专属渐变 */
  .hero-title-bonus-label {
    margin-right: 8px;
    font-family: Inter, sans-serif;
    font-size: 56px;
    font-style: normal;
    font-weight: 700;
    line-height: 90px;
    background: linear-gradient(93deg, #05CAED 0%, #20CFB7 99.08%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* PC 端「55%」：68px / 700 / 90px + 专属渐变 */
  .hero-title-bonus-percent {
    font-family: Inter, sans-serif;
    font-size: 68px;
    font-style: normal;
    font-weight: 700;
    line-height: 90px;
    background: linear-gradient(97deg, #21D0B4 0%, #44D670 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.hero-title-bonus {
  background: linear-gradient(97deg, #05caed 0%, #47d769 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-title-percent-zh {
  font-family: Inter, sans-serif;
  font-size: var(--hero-title-size);
  font-style: normal;
  font-weight: 700;
  line-height: var(--hero-title-leading);
  background: linear-gradient(97deg, #21d0b4 0%, #44d670 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media (min-width: 768px) {
  .hero-title-percent-zh {
    font-size: 68px;
    line-height: 90px;
  }
}

.hero-desc {
  font-size: var(--hero-desc-size);
  line-height: var(--hero-desc-leading);
  font-weight: 400;
}

@media (max-width: 767px) {
  .hero-desc-cta {
    gap: 0;
  }

  .hero-desc {
    margin-bottom: 24px;
  }
}

/* 移动端「活动倒计时」文案 */
.hero-countdown-label {
  color: #fff;
  text-align: center;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

@media (min-width: 768px) {
  .hero-countdown-label {
    font-size: var(--hero-countdown-label-size);
    line-height: var(--hero-desc-leading);
  }
}

/* 移动端倒计时整体间距 */
.hero-countdown-block {
  gap: 12px;
}

.hero-countdown-row {
  gap: 16px;
}

.hero-countdown-item {
  gap: 12px;
}

.hero-countdown-separator {
  gap: 6px;
  height: 56px;
}

@media (min-width: 768px) {
  .hero-countdown-block {
    gap: 16px;
  }

  .hero-countdown-row {
    gap: 12px;
  }

  .hero-countdown-item {
    gap: 8px;
  }

  .hero-countdown-separator {
    gap: 8px;
    height: var(--hero-countdown-box-size);
  }
}

/* 移动端倒计时数字方块 */
.hero-countdown-num {
  display: flex;
  width: 56px;
  height: 56px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.40);
  background: rgba(132, 132, 132, 0.30);
  color: #fff;
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

@media (min-width: 768px) {
  .hero-countdown-num {
    width: var(--hero-countdown-box-size);
    height: var(--hero-countdown-box-size);
    flex-direction: row;
    gap: 0;
    border-radius: var(--hero-countdown-box-radius);
    border-width: 2px;
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--hero-countdown-num-size);
    line-height: var(--hero-countdown-num-leading);
  }
}

/* 移动端天/时/分/秒单位文案 */
.hero-countdown-unit {
  width: 56px;
  color: rgba(255, 255, 255, 0.70);
  text-align: center;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

@media (min-width: 768px) {
  .hero-countdown-unit {
    width: auto;
    font-size: var(--hero-countdown-unit-size);
    line-height: var(--hero-countdown-unit-leading);
  }
}

.hero-countdown-dot {
  width: var(--hero-countdown-dot-size);
  height: var(--hero-countdown-dot-size);
}
</style>
