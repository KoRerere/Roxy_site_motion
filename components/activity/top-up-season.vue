<script setup lang="ts">
import { RxIcon } from '../rx-icon'

defineProps<{
  height: number
  handleClose: () => void
  scrolled?: boolean
}>()

const { width } = useRxWindowSize()
const { $t, isZh } = useRxI18n()

const topBgSrc = computed(() => {
  if (width.value < 768)
    return 'url(\'/activity/top-up-season/scrollTopBg.png\')'

  return isZh.value
    ? 'url(\'/activity/top-up-season/topBgZh.png\')'
    : 'url(\'/activity/top-up-season/topBgEn.png\')'
})

const { handleTopUpClick } = useTopUpNavigate()
</script>

<template>
  <ClientOnly>
    <div class="w-full relative overflow-hidden" :style="{ height: `${height}px` }">
      <div class="m-top-bg pointer-events-none inset-0 absolute z-0 md:hidden" />
      <div class="top-bg hidden pointer-events-none inset-0 absolute z-0 md:block" />
      <Container class="h-full relative z-1">
        <div class="text-white flex h-full transition-all duration-300 items-center justify-center" :class="width >= 768 ? 'gap-8' : 'flex-col gap-4'">
          <template v-if="width >= 768">
            <div class="flex gap-2 items-baseline" :class="isZh ? 'ml-13' : 'ml-25'">
              <p class="text-3.75 leading-18px font-600 whitespace-nowrap">
                {{ $t('Roxy 超级充值季') }}
              </p>
              <p class="top-up-season-subtitle text-3.75 color-white/80 font-600 leading-5">
                <rx-i18n-t :keypath="$t('单笔充值最高 {bouns}', { bouns: '{bouns}' })">
                  <template #bouns>
                    <span class="top-up-season-bouns">
                      <span v-if="isZh" class="top-up-season-bonus-label">{{ $t('赠送') }}</span>
                      <span class="top-up-season-bonus-percent">{{ $t('55%') }}</span>
                    </span>
                  </template>
                </rx-i18n-t>
              </p>
            </div>

            <button
              type="button" class="now-btn text-3.5 text-white leading-20px font-500 px-3 py-1.5 rounded-1.5 border-none flex shrink-0 gap-1 cursor-pointer items-center backdrop-blur-16"
              style="background: linear-gradient(115deg, #05CAED 0%, #47D769 100%)" @click="handleTopUpClick"
            >
              <span>{{ $t('立即充值') }}</span>
              <RxIcon name="base/rx_ic_chevron_right" size="16" />
            </button>
          </template>

          <template v-else>
            <div class="text-center flex flex-col gap-3 items-center">
              <p class="text-4 leading-4.5 font-600">
                {{ $t('Roxy 超级充值季') }}
              </p>

              <p class="top-up-season-promo text-5.5 color-white leading-8.5 font-700">
                <rx-i18n-t :keypath="$t('单笔充值最高 {bouns}', { bouns: '{bouns}' })">
                  <template #bouns>
                    <span class="top-up-season-bouns">
                      <span v-if="isZh" class="top-up-season-bonus-label">{{ $t('赠送') }}</span>
                      <span class="top-up-season-bonus-percent">{{ $t('55%') }}</span>
                    </span>
                  </template>
                </rx-i18n-t>
              </p>
            </div>

            <button
              type="button" class="now-btn text-3.5 text-white leading-20px font-500 px-3 py-1.5 rounded-1.5 border-none flex shrink-0 gap-1 cursor-pointer items-center backdrop-blur-16"
              style="background: linear-gradient(115deg, #05CAED 0%, #47D769 100%)" @click="handleTopUpClick"
            >
              <span>{{ $t('立即充值') }}</span>
              <RxIcon name="base/rx_ic_chevron_right" size="16" />
            </button>
          </template>
        </div>
      </Container>
    </div>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.top-bg {
  background-image: v-bind(topBgSrc);
  background-size: auto 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #000000;
}

.m-top-bg {
  background-image: v-bind(topBgSrc);
  background-size: 100% auto;
  background-position: bottom center;
  background-repeat: no-repeat;
  background-color: #000000;
}

.light-text {
  background: linear-gradient(97deg, #05caed 0%, #47d769 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 移动端活动顶栏：赠送 / 55% 拆分样式 */
@media (max-width: 767px) {
  .top-up-season-promo {
    display: inline-flex;
    align-items: flex-end;
    justify-content: center;
    flex-wrap: nowrap;
    white-space: nowrap;
    /* 与 leading-8.5 一致，避免「赠送」比白字矮 */
    line-height: 34px;
  }

  .top-up-season-bouns {
    display: inline-flex;
    align-items: flex-end;
    margin-left: 4px;
    white-space: nowrap;
  }

  .top-up-season-bonus-label {
    font-size: 22px;
    line-height: 34px;
    background: linear-gradient(93deg, #05CAED 0%, #20CFB7 99.08%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .top-up-season-bonus-percent {
    margin-left: 4px;
    font-size: 26px;
    line-height: 34px;
    background: linear-gradient(97deg, #21D0B4 0%, #44D670 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

@media (min-width: 768px) {
  /* PC 端顶栏副标题：三段 flex，「赠送」距左右各 4px */
  .top-up-season-subtitle {
    display: flex;
    flex-wrap: nowrap;
    align-items: baseline;
  }

  .top-up-season-bouns {
    display: inline-flex;
    align-items: baseline;
    margin-left: 4px;
  }

  /* PC 端顶栏「赠送」：12px / 700 / 20px + 专属渐变 */
  .top-up-season-bonus-label {
    margin-right: 4px;
    font-size: 15px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
    background: linear-gradient(93deg, #05CAED 0%, #20CFB7 99.08%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* PC 端顶栏「55%」：13px / 700 / 20px + 专属渐变 */
  .top-up-season-bonus-percent {
    font-family: Inter, sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
    background: linear-gradient(97deg, #21D0B4 0%, #44D670 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.now-btn {
  background: linear-gradient(97deg, #05caed 0%, #47d769 100%);
  backdrop-filter: blur(16px);
}
</style>
