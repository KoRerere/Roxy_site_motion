<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

const { isZh } = useRxI18n()

const bannerSrc = computed(() =>
  isZh.value
    ? '/activity/top-up-season/priceZh.png'
    : '/activity/top-up-season/priceEn.png',
)

const mobileBannerSrc = computed(() =>
  isZh.value
    ? '/activity/top-up-season/mobilePriceZh.png'
    : '/activity/top-up-season/mobilePriceEn.png',
)

const { handleTopUpClick } = useTopUpNavigate()
</script>

<template>
  <section class="text-white box-border relative overflow-x-hidden max-md:(pt-[88px] min-h-[604px]) md:(pt-0 h-[420px])">
    <div class="pointer-events-none inset-0 absolute z-0 md:hidden" aria-hidden="true">
      <img :src="mobileBannerSrc" alt="" class="h-full w-full inset-0 absolute object-cover object-bottom">
    </div>
    <div class="hidden pointer-events-none inset-0 absolute z-0 md:block" aria-hidden="true">
      <img :src="bannerSrc" alt="" class="h-full w-full inset-0 absolute object-cover">
    </div>

    <Container class="relative z-1 max-md:(pt-0 gap-5 w-full items-center) md:(pb-[46px] pt-[72px] flex flex-col h-full justify-center) !max-md:px-5">
      <div class="pricing-hero-content text-center flex flex-col items-center relative z-2 md:(text-left gap-6 items-start) max-md:w-full">
        <div class="top-up-promo-badge px-4 py-1.5 flex gap-2 items-center justify-center md:px-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="19" viewBox="0 0 14 19" fill="none" aria-hidden="true">
            <path
              d="M7 0C6.33333 2.66667 5 4.83333 3 6.5C1 8.16667 0 10 0 12C0 13.8565 0.737498 15.637 2.05025 16.9497C3.36301 18.2625 5.14348 19 7 19C8.85652 19 10.637 18.2625 11.9497 16.9497C13.2625 15.637 14 13.8565 14 12C14 10.9181 13.6491 9.86548 13 9C13 9.66304 12.7366 10.2989 12.2678 10.7678C11.7989 11.2366 11.163 11.5 10.5 11.5C9.83696 11.5 9.20107 11.2366 8.73223 10.7678C8.26339 10.2989 8 9.66304 8 9C8 7 9.5 6 9.5 4C9.5 2.66667 8.66667 1.33333 7 0Z"
              fill="url(#paint0_linear_pricing_hero)"
            />
            <defs>
              <linearGradient id="paint0_linear_pricing_hero" x1="15" y1="17" x2="13.938" y2="2.80735" gradientUnits="userSpaceOnUse">
                <stop stop-color="#9229F5" />
                <stop offset="1" stop-color="#DF93EE" />
              </linearGradient>
            </defs>
          </svg>
          <!-- 角标文案样式与首页 Hero 一致 -->
          <span class="top-up-promo-badge__text text-transparent font-600 bg-clip-text" style="background-image: linear-gradient(100deg, #DF93EE 0.26%, #9229F5 99.74%)">
            {{ $t('Roxy 史上力度最大充值活动') }}
          </span>
        </div>

        <div class="flex-col gap-4 hidden items-start md:flex">
          <div class="flex flex-nowrap gap-x-2 whitespace-nowrap items-center">
            <span class="pricing-hero-headline">
              {{ $t('Roxy 超级充值季') }}
            </span>
            <span class="pricing-hero-headline pricing-hero-headline--dot">·</span>
            <span class="pricing-hero-headline mr-2">
              {{ $t('单笔充值最高') }}
            </span>
            <span class="pricing-hero-headline-bouns inline-flex items-center">
              <span v-if="isZh" class="pricing-hero-headline-bonus-label">{{ $t('赠送') }}</span>
              <span class="pricing-hero-headline-bonus-percent">{{ $t('55%') }}</span>
            </span>
          </div>
          <div class="text-base text-white leading-normal">
            {{ $t('活动时间：6.17-7.01') }}
          </div>
        </div>

        <!-- 移动端红框：保留移植前 DOM 结构，避免 rx-i18n-t 导致「赠送」不显示 -->
        <div class="hero-title-block flex flex-col w-full items-center md:hidden">
          <div class="text-3.5 text-white/80 leading-5">
            {{ $t('活动时间：6.17-7.01') }}
          </div>

          <div class="hero-title-row flex flex-nowrap max-w-full whitespace-nowrap items-end justify-center">
            <span class="hero-title text-white font-700">{{ $t('单笔充值最高') }}</span>
            <span class="hero-title-bouns inline-flex items-end">
              <span v-if="isZh" class="font-700 hero-title-bonus-label">{{ $t('赠送') }}</span>
              <span class="font-700 hero-title-bonus-percent">{{ $t('55%') }}</span>
            </span>
          </div>
        </div>

        <button type="button" class="top-up-cta-btn border-none w-auto cursor-pointer" @click="handleTopUpClick">
          <span>{{ $t('立即充值') }}</span>
          <RxIcon name="base/rx_ic_chevron_right" size="16" />
        </button>
      </div>
    </Container>

    <div class="flex w-full bottom-6 left-0 justify-center absolute z-2 max-md:(px-5 box-border) md:bottom-0">
      <slot name="footer" />
    </div>
  </section>
</template>

<style scoped>
.top-up-cta-btn {
  display: flex;
  /* 移动端按钮内边距，与首页 Hero 一致 */
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

/* 移动端活动角标文案：13px / 600 / 18px，与首页 Hero 一致 */
.top-up-promo-badge__text {
  font-size: 13px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px;
}

@media (min-width: 768px) {
  .top-up-promo-badge__text {
    font-size: 16px;
    line-height: 24px;
  }
}

.pricing-hero-headline {
  color: #fff;
  font-family: Archivo, sans-serif;
  font-size: 44px;
  font-style: normal;
  font-weight: 700;
  line-height: 60px;
}

.pricing-hero-headline--dot {
  color: rgb(255 255 255 / 80%);
}

@media (min-width: 768px) {
  /* PC 端「赠送」：44px / 700 / 60px + 专属渐变 */
  .pricing-hero-headline-bonus-label {
    font-size: 44px;
    font-weight: 700;
    line-height: 60px;
    background: linear-gradient(93deg, #05CAED 0%, #20CFB7 99.08%); 
    background-clip:text; 
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent;
    margin-right: 10px;

  }

  /* PC 端「55%」：44px / 700 / 60px + 专属渐变 */
  .pricing-hero-headline-bonus-percent {
    font-size: 52px;
    font-weight: 700;
    line-height: 60px;
background: linear-gradient(97deg, #21D0B4 0%, #44D670 100%); 
background-clip:text;
 -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  }
}

/* 移动端 Pricing Hero 垂直间距（仅本页，不沿用全局 gap-2 的 24px） */
@media (max-width: 767px) {
  .pricing-hero-content {
    gap: 24px;
  }

  .hero-title-block {
    /* 活动时间与副标题视为一组，间距更紧凑 */
    gap: 8px;
  }
}

/* 移动端副标题「单笔充值最高」：32px / 700 / 44px */
.hero-title {
  font-size: 32px;
  font-weight: 700;
  line-height: 44px;
}

@media (max-width: 767px) {
  .hero-title-row {
    width: 100%;
  }

  .hero-title-bouns {
    /* 「最高」与「赠送」间距 */
    margin-left: 4px;
    white-space: nowrap;
  }

  /* 赠送 32px + 渐变；inline-block 保证 background-clip 生效 */
  .hero-title-bonus-label {
    display: inline-block;
    font-size: 32px;
    line-height: 44px;
    color: transparent;
    background: linear-gradient(93deg, #05CAED 0%, #20CFB7 99.08%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero-title-bonus-percent {
    display: inline-block;
    margin-left: 4px;
    font-size: 38px;
    line-height: 44px;
    color: transparent;
    background: linear-gradient(97deg, #21D0B4 0%, #44D670 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
