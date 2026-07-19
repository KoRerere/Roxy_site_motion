<script setup lang="ts">
import type { SlideVisualId } from './config'
import { animate, motion, motionValue, useMotionValueEvent } from 'motion-v'
import { RxIcon } from '@/components/rx-icon'
import AiAutomationDemoPlayer from './ai-automation-demo-player.vue'
import CampaignBanner from './campaign-banner.vue'
import CarouselProgress from './carousel-progress.vue'
import {
  FEATURE_CAROUSEL_PRELOAD,
  featureCarouselAutoplayKey,
  SLIDE_DURATION_SEC,
  slideVisualComponents,
  useFeatureCarouselSlides,
} from './config'
import ShaderGradientBg from './shader-gradient-bg.client.vue'
import SlideCopy from './slide-copy.vue'

const emit = defineEmits<{
  openGiftDialog: []
}>()
const slides = useFeatureCarouselSlides()
const slideCount = computed(() => slides.value.length)

useHead(() => ({
  link: [
    {
      rel: 'preconnect',
      href: 'https://esm.sh',
      crossorigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'image',
      href: FEATURE_CAROUSEL_PRELOAD.aiMapDesktop,
      type: 'image/svg+xml',
      fetchpriority: 'high',
      media: '(min-width: 1024px)',
    },
    {
      rel: 'preload',
      as: 'image',
      href: FEATURE_CAROUSEL_PRELOAD.aiMapMobile,
      type: 'image/svg+xml',
      fetchpriority: 'high',
      media: '(max-width: 1023px)',
    },
  ],
}))

const activeIndex = ref(0)
const progressFill = motionValue('0%')
const progressFillCss = ref('0%')

useMotionValueEvent(progressFill, 'change', v => progressFillCss.value = v)

let progressControls: ReturnType<typeof animate> | undefined
let progressCycleId = 0

const autoplayPaused = ref(false)

const activeSlide = computed(() => slides.value[activeIndex.value]!)

const mountedVisualIds = ref(new Set<SlideVisualId>())

watch(
  activeIndex,
  (idx) => {
    const id = slides.value[idx]?.id
    if (id)
      mountedVisualIds.value.add(id)
  },
  { immediate: true },
)

function stopProgress() {
  progressCycleId++
  progressControls?.stop()
  progressControls = undefined
}

function resetProgressFill() {
  progressFill.set('0%')
  progressFillCss.value = '0%'
}

function setActiveSlide(index: number) {
  if (index < 0 || index >= slideCount.value || index === activeIndex.value)
    return
  stopProgress()
  resetProgressFill()
  activeIndex.value = index
}

function getProgressRatio(): number {
  const raw = progressFillCss.value || String(progressFill.get())
  const n = Number.parseFloat(String(raw).replace('%', ''))
  if (!Number.isFinite(n))
    return 0
  return Math.max(0, Math.min(100, n)) / 100
}

function pauseAutoplay() {
  if (autoplayPaused.value)
    return
  autoplayPaused.value = true
  stopProgress()
}

function resumeAutoplay() {
  if (!autoplayPaused.value)
    return
  autoplayPaused.value = false
  startProgressCycle(true)
}

provide(featureCarouselAutoplayKey, {
  pauseAutoplay,
  resumeAutoplay,
})

function goNext() {
  setActiveSlide((activeIndex.value + 1) % slideCount.value)
}

function goPrev() {
  setActiveSlide((activeIndex.value - 1 + slideCount.value) % slideCount.value)
}

function goTo(index: number) {
  setActiveSlide(index)
}

const breakpoints = useRxBreakpoints()
// <1024px 为上下排列，启用滑动手势切页
const isMobileSwipeCarousel = breakpoints.smaller('lg')

let swipeTouchStartX = 0
let swipeTouchStartY = 0

function onSwipeTouchStart(e: TouchEvent) {
  if (!isMobileSwipeCarousel.value || e.targetTouches.length !== 1)
    return
  const t = e.targetTouches[0]
  swipeTouchStartX = t!.clientX
  swipeTouchStartY = t!.clientY
}

function onSwipeTouchEnd(e: TouchEvent) {
  if (!isMobileSwipeCarousel.value || !e.changedTouches.length)
    return
  const t = e.changedTouches[0]!
  const dx = t.clientX - swipeTouchStartX
  const dy = t.clientY - swipeTouchStartY
  const threshold = 44
  if (Math.abs(dx) < threshold)
    return
  if (Math.abs(dx) < Math.abs(dy) * 0.75)
    return
  if (dx < 0)
    goNext()
  else
    goPrev()
}

function startProgressCycle(resume = false) {
  if (import.meta.server || autoplayPaused.value)
    return
  stopProgress()

  if (!resume)
    resetProgressFill()

  const ratio = resume ? getProgressRatio() : 0
  const remainingDuration = SLIDE_DURATION_SEC * (1 - ratio)
  if (remainingDuration <= 0.05) {
    goNext()
    return
  }

  const activeCycleId = progressCycleId
  progressControls = animate(progressFill, '100%', {
    duration: remainingDuration,
    ease: 'linear',
    onComplete: () => {
      if (activeCycleId !== progressCycleId)
        return
      goNext()
    },
  })
}

watch(activeIndex, () => {
  if (!autoplayPaused.value)
    nextTick(() => startProgressCycle())
}, { immediate: true })

onUnmounted(() => {
  stopProgress()
})
</script>

<template>
  <section class="feature-carousel feature-carousel--bg-v3 relative overflow-hidden">
    <ClientOnly>
      <ShaderGradientBg />
    </ClientOnly>
    <div class="feature-carousel__atmosphere" aria-hidden="true" />
    <div class="feature-carousel__dot-field" aria-hidden="true" />
    <div class="feature-carousel__shade" aria-hidden="true" />
    <div class="feature-carousel__v3-accent" aria-hidden="true" />
    <AiAutomationDemoPlayer v-if="activeSlide.id === 'aiAutomation'" />

    <div class="feature-carousel__flow w-full relative z-1">
      <div class="carousel-main mx-auto mt-96px px-5 pb-8 w-full md:mt-160px md:px-0 md:pb-20">
        <div class="carousel-main__nav-slot carousel-main__nav-slot--prev">
          <button
            type="button"
            class="feature-carousel-nav feature-carousel-nav--dark"
            :aria-label="$t('上一张')"
            @click="goPrev"
          >
            <RxIcon name="base/rx_ic_left" size="24" class="text-white" color="white" />
          </button>
        </div>

        <div
          class="carousel-main__content"
          @touchstart.passive="onSwipeTouchStart"
          @touchend.passive="onSwipeTouchEnd"
        >
          <div
            class="carousel-main__row flex flex-col gap-5 max-w-full min-w-0 w-full lg:flex-row md:gap-4 xl:gap-10"
            :class="{ 'carousel-main__row--performance': activeSlide.id === 'performance' }"
          >
            <div class="carousel-main__copy-col align-center flex flex-col max-w-full min-w-0 w-full lg:shrink-0 lg:max-w-630px lg:w-[50%] lg:items-stretch">
              <div class="feature-carousel-copy max-w-full w-full">
                <div class="feature-carousel-copy__slides">
                  <motion.div
                    v-for="(slide, idx) in slides"
                    :key="slide.id"
                    class="feature-carousel-copy__pane"
                    :initial="false"
                    :animate="{
                      opacity: activeIndex === idx ? 1 : 0,
                      y: activeIndex === idx ? 0 : 14,
                      scale: activeIndex === idx ? 1 : 0.985,
                    }"
                    :transition="{
                      duration: 0.46,
                      ease: [0.16, 1, 0.3, 1],
                    }"
                    :aria-hidden="activeIndex !== idx"
                    :style="{ pointerEvents: activeIndex === idx ? 'auto' : 'none' }"
                  >
                    <SlideCopy :slide="slide">
                      <template v-if="activeIndex === idx" #desktop-progress>
                        <div class="feature-carousel-copy__progress hidden lg:flex">
                          <CarouselProgress
                            dark
                            :count="slideCount"
                            :active-index="activeIndex"
                            :progress-fill-css="progressFillCss"
                            @select="goTo"
                          />
                        </div>
                      </template>
                    </SlideCopy>
                  </motion.div>
                </div>
              </div>
            </div>

            <div class="carousel-main__visual-col feature-carousel-visual mx-auto flex flex-1 shrink-0 min-w-0 w-full select-none touch-pan-y lg:mx-0 lg:max-w-none">
              <div class="feature-carousel__orbits" aria-hidden="true">
                <div class="feature-carousel__orbit feature-carousel__orbit--middle" />
                <div class="feature-carousel__orbit feature-carousel__orbit--inner" />
                <div class="feature-carousel__orbit feature-carousel__orbit--halo" />
              </div>
              <motion.div
                v-for="(slide, idx) in slides"
                :key="slide.id"
                class="feature-carousel-visual__pane"
                :class="{ 'feature-carousel-visual__pane--active': activeIndex === idx }"
                :initial="false"
                :animate="{
                  opacity: activeIndex === idx ? 1 : 0,
                  y: activeIndex === idx ? 0 : 12,
                  scale: activeIndex === idx ? 1 : 0.992,
                }"
                :transition="{
                  delay: activeIndex === idx ? 0.08 : 0,
                  duration: 0.64,
                  ease: [0.22, 1, 0.36, 1],
                }"
                :aria-hidden="activeIndex !== idx"
              >
                <component
                  :is="slideVisualComponents[slide.id]"
                  v-if="mountedVisualIds.has(slide.id)"
                  :active="activeIndex === idx"
                />
              </motion.div>
            </div>

            <div class="flex w-full justify-center lg:hidden">
              <CarouselProgress
                dark
                :count="slideCount"
                :active-index="activeIndex"
                :progress-fill-css="progressFillCss"
                @select="goTo"
              />
            </div>
          </div>
        </div>

        <div class="carousel-main__nav-slot carousel-main__nav-slot--next">
          <button
            type="button"
            class="feature-carousel-nav feature-carousel-nav--dark"
            :aria-label="$t('下一张')"
            @click="goNext"
          >
            <RxIcon name="base/rx_ic_right" size="24" class="text-white" color="white" />
          </button>
        </div>
      </div>

      <!-- <CampaignBanner
        class="feature-carousel__banner mb-20px lg:mb-20"
        @open-gift-dialog="emit('openGiftDialog')"
      /> -->
    </div>
  </section>
</template>

<style lang="scss" scoped>
/* 桌面轮播主舞台高度：略高于视觉画布 522px，留出地球光晕/轨道呼吸空间 */
$feature-carousel-stage-height: 540px;
/* <1024px 上下排列，≥1024px 左右并排 */
$feature-carousel-stack-max: 1023px;
$feature-carousel-row-min: 1024px;
$feature-carousel-fallback-background:
  radial-gradient(ellipse at 18% 24%, rgb(0 0 128 / 80%) 0%, rgb(0 0 128 / 24%) 38%, transparent 68%),
  radial-gradient(ellipse at 76% 42%, rgb(52 136 143 / 58%) 0%, rgb(26 98 124 / 22%) 36%, transparent 68%),
  linear-gradient(180deg, #06164c 0%, #071a58 42%, #06134b 100%);

.feature-carousel {
  // 与 index.html body 底色一致，ShaderGradient 未加载/未覆盖区域也不露白
  isolation: isolate;
  background: $feature-carousel-fallback-background;
  transition: background 260ms ease;

  @media (max-width: 767px) {
    padding-top: 24px;
  }

  &--bg-v3 {
    background: $feature-carousel-fallback-background;
  }

  &--bg-v3 .feature-carousel__dot-field {
    opacity: 1;
  }

  &--bg-v3 .feature-carousel__dot-field {
    background-image: radial-gradient(circle, rgb(255 255 255 / 14%) 0 1px, transparent 1.4px);
    background-position: 0 0;
    background-size: 42px 42px;
    mix-blend-mode: normal;

    &,
    &::before {
      animation: none;
      transform: translate3d(0, 0, 0);
      will-change: auto;
    }

    &::before,
    &::after {
      display: none;
    }
  }
}

.feature-carousel__atmosphere {
  /* 纯装饰氛围层：不承载内容或交互，可整体移除以恢复基础背景 */
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  opacity: 0;
  background:
    radial-gradient(circle at 78% 24%, rgb(85 183 255 / 20%) 0 1px, transparent 1.5px) 0 0 / 54px 54px,
    radial-gradient(circle at 18% 62%, rgb(115 242 224 / 14%) 0 1px, transparent 1.5px) 12px 18px / 76px 76px,
    radial-gradient(circle at 44% 36%, rgb(151 220 255 / 12%) 0 0.8px, transparent 1.4px) 24px 8px / 118px 118px,
    radial-gradient(circle at 68% 72%, rgb(105 139 255 / 10%) 0 0.8px, transparent 1.5px) 6px 34px / 148px 148px;
  mask-image: linear-gradient(180deg, #000 0%, rgb(0 0 0 / 92%) 72%, transparent 100%);
  transition: opacity 260ms ease;

  &::before,
  &::after {
    position: absolute;
    content: '';
    pointer-events: none;
  }

  &::before {
    top: -18%;
    left: 46%;
    width: 54%;
    height: 42%;
    border-radius: 50%;
    background:
      radial-gradient(ellipse at 45% 50%, rgb(75 190 255 / 14%) 0%, rgb(75 190 255 / 0%) 62%),
      radial-gradient(ellipse at 66% 42%, rgb(94 123 255 / 10%) 0%, rgb(94 123 255 / 0%) 58%);
    filter: blur(54px);
    opacity: 0.9;
    transform: rotate(-5deg);
    animation: feature-atmosphere-drift 20s ease-in-out infinite alternate;
  }

  &::after {
    right: -12%;
    bottom: 4%;
    width: 58%;
    height: 26%;
    border-radius: 50%;
    background: rgb(21 124 255 / 24%);
    filter: blur(90px);
    transform: rotate(-9deg);
  }
}

.feature-carousel__orbits {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 0;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 260ms ease;
}

.feature-carousel__orbit {
  position: absolute;
  top: 0;
  left: 0;
  aspect-ratio: 1;
  border: 1px solid rgb(132 220 255 / 18%);
  border-radius: 50%;
  box-shadow:
    inset 0 0 34px rgb(31 184 255 / 5%),
    0 0 30px rgb(31 184 255 / 6%);
  transform: translate(-50%, -50%);

  &::before {
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #86eaff;
    box-shadow:
      0 0 5px #86eaff,
      0 0 18px rgb(70 217 255 / 90%);
    content: '';
  }

  &--middle {
    width: 37vw;
    min-width: 465px;
    border-color: rgb(98 205 255 / 13%);

    &::before {
      top: 21%;
      left: 8%;
      width: 4px;
      height: 4px;
      opacity: 0.72;
    }
  }

  &--inner {
    width: 30.5vw;
    min-width: 380px;
    border-color: rgb(111 148 255 / 14%);

    &::before {
      top: 11%;
      left: 16%;
      width: 5px;
      height: 5px;
      background: #8ba8ff;
      box-shadow:
        0 0 5px #8ba8ff,
        0 0 16px rgb(99 125 255 / 80%);
    }
  }

  &--halo {
    width: 24.5vw;
    min-width: 305px;
    border-color: rgb(137 158 255 / 10%);

    &::before {
      display: none;
    }
  }
}

@media (max-width: 767px) {
  .feature-carousel__orbit {
    min-width: 0;
  }

  .feature-carousel__orbit--middle {
    width: 300px;
  }

  .feature-carousel__orbit--inner {
    width: 230px;
  }

  .feature-carousel__orbit--halo {
    width: 165px;
  }
}

.feature-carousel__dot-field {
  position: absolute;
  inset: -8% -6%;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  background-image:
    radial-gradient(circle, rgb(255 255 255 / 13%) 0 0.85px, transparent 1.35px),
    radial-gradient(circle, rgb(160 210 255 / 6%) 0 0.75px, transparent 1.25px);
  background-position:
    0 0,
    11px 13px;
  background-size:
    22px 22px,
    44px 44px;
  mask-image:
    radial-gradient(ellipse at 42% 36%, #000 0%, rgb(0 0 0 / 92%) 42%, rgb(0 0 0 / 26%) 68%, transparent 100%),
    linear-gradient(180deg, #000 0%, #000 78%, transparent 100%);
  mix-blend-mode: screen;
  transform: translateZ(0);
  transition: opacity 260ms ease;
  contain: paint;

  &::before,
  &::after {
    position: absolute;
    inset: 0;
    content: '';
    pointer-events: none;
  }

  &::before {
    inset: -18%;
    background-image:
      radial-gradient(circle, rgb(255 255 255 / 96%) 0 0.9px, transparent 1.45px),
      radial-gradient(circle, rgb(185 224 255 / 70%) 0 0.78px, transparent 1.35px);
    background-position:
      8px 5px,
      18px 27px;
    background-size:
      30px 30px,
      60px 60px;
    mask-image:
      radial-gradient(ellipse at 58% 34%, #000 0%, rgb(0 0 0 / 96%) 18%, rgb(0 0 0 / 46%) 34%, transparent 56%),
      radial-gradient(ellipse at 28% 68%, rgb(0 0 0 / 72%) 0%, rgb(0 0 0 / 32%) 20%, transparent 44%),
      linear-gradient(
        112deg,
        transparent 0%,
        transparent 30%,
        rgb(0 0 0 / 82%) 46%,
        rgb(0 0 0 / 64%) 56%,
        transparent 74%
      );
    mask-repeat: no-repeat;
    opacity: 0.84;
    transform: translate3d(-5%, -3%, 0);
    animation: feature-dot-wave-sweep 12s ease-in-out infinite alternate;
    will-change: transform, opacity;
  }

  &::after {
    background:
      radial-gradient(
        ellipse at 64% 28%,
        transparent 0%,
        rgb(0 0 0 / 8%) 24%,
        rgb(0 0 0 / 46%) 64%,
        rgb(0 0 0 / 62%) 100%
      ),
      radial-gradient(ellipse at 28% 70%, transparent 0%, rgb(0 0 0 / 10%) 20%, rgb(0 0 0 / 36%) 52%, transparent 78%),
      linear-gradient(90deg, rgb(0 0 0 / 40%) 0%, transparent 24%, transparent 68%, rgb(0 0 0 / 44%) 100%);
    mix-blend-mode: multiply;
    opacity: 0.72;
  }
}

@media (prefers-reduced-motion: reduce) {
  .feature-carousel__atmosphere::before,
  .feature-carousel__dot-field::before {
    animation: none;
  }
}

.feature-carousel__shade {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  background: linear-gradient(
    0deg,
    rgb(1 7 33 / 42%) 0%,
    rgb(1 8 38 / 20%) 26%,
    rgb(1 8 38 / 6%) 52%,
    rgb(0 0 0 / 0%) 78%
  );
  transition: opacity 260ms ease;
}

.feature-carousel__v3-accent {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  background-image:
    repeating-linear-gradient(112deg, rgb(255 255 255 / 4%) 0 1px, transparent 1px 28px),
    repeating-linear-gradient(22deg, rgb(74 190 255 / 3%) 0 1px, transparent 1px 44px);
  background-position:
    0 0,
    0 0;
  background-size:
    100% 100%,
    100% 100%;
  transition: opacity 260ms ease;

  &::before {
    display: none;
  }

  &::after {
    display: none;
  }
}

@keyframes feature-atmosphere-drift {
  from {
    transform: translate3d(-2%, -1%, 0) rotate(-8deg);
  }

  to {
    transform: translate3d(4%, 3%, 0) rotate(-2deg);
  }
}

@keyframes feature-dot-wave-sweep {
  0% {
    opacity: 0.64;
    transform: translate3d(-5%, -3%, 0);
  }

  46% {
    opacity: 0.95;
    transform: translate3d(1%, 1%, 0);
  }

  100% {
    opacity: 0.72;
    transform: translate3d(6%, 4%, 0);
  }
}

.feature-carousel-copy {
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;

  @media (max-width: $feature-carousel-stack-max) {
    min-height: auto;
  }

  @media (min-width: $feature-carousel-row-min) {
    display: flex;
    flex-direction: column;
    height: $feature-carousel-stage-height;
    min-height: $feature-carousel-stage-height;
    justify-content: center;
  }

  &__slides {
    @media (max-width: $feature-carousel-stack-max) {
      position: relative;
    }

    @media (min-width: $feature-carousel-row-min) {
      position: relative;
      height: 100%;
      min-height: 0;
    }
  }

  &__progress {
    flex-shrink: 0;
    justify-content: flex-start;
  }

  &__pane {
    display: flex;
    width: 100%;
    max-width: 100%;
    min-width: 0;

    @media (max-width: $feature-carousel-stack-max) {
      position: relative;
      align-items: flex-start;
      overflow: visible;

      /* 非当前 slide 脱离文档流，避免撑高容器产生大块空白 */
      &[aria-hidden='true'] {
        position: absolute;
        inset: 0 auto auto 0;
        width: 100%;
        visibility: hidden;
        pointer-events: none;
      }
    }

    @media (min-width: $feature-carousel-row-min) {
      position: absolute;
      inset: 0;
      align-items: center;
      overflow: visible;
    }
  }
}

.feature-carousel-visual {
  position: relative;
  width: 100%;

  @media (max-width: $feature-carousel-stack-max) {
    display: none;
    height: auto;
    max-width: min(100%, 360px);
    overflow: visible;
  }

  @media (min-width: $feature-carousel-row-min) {
    height: $feature-carousel-stage-height;
    max-height: $feature-carousel-stage-height;
    overflow: visible;
  }

  &__pane {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1);
    transform: translateZ(0);
    will-change: opacity, transform;
    pointer-events: none;

    @media (max-width: $feature-carousel-stack-max) {
      position: absolute;
      inset: auto;
      top: 0;
      left: 0;
      width: 100%;
      height: 0;
      overflow: hidden;
      align-items: flex-start;
      justify-content: center;
    }

    @media (min-width: $feature-carousel-row-min) {
      justify-content: flex-end;
    }

    &--active {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;

      @media (max-width: $feature-carousel-stack-max) {
        position: relative;
        height: auto;
        overflow: visible;
      }
    }

    @media (min-width: $feature-carousel-row-min) {
      > img {
        flex: 0 0 auto;
        width: auto;
        margin-left: auto;
        margin-right: 0;
      }
    }

    :deep(.pricing-visual),
    :deep(.performance-visual),
    :deep(.ai-automation-visual),
    :deep(.fingerprint-visual-stage),
    :deep(.cobe-stack) {
      flex-shrink: 1;
      min-height: 0;
      max-height: 100%;
      margin: 0 auto;

      @media (min-width: $feature-carousel-row-min) {
        flex: 0 0 auto;
        margin-left: auto;
        margin-right: 0;
      }
    }

    :deep(.cobe-wrap) {
      width: 100%;
      max-width: 100%;
      max-height: 100%;
      min-height: 0;
    }
  }

  @media (max-width: $feature-carousel-stack-max) {
    :deep(.cobe-wrap) {
      min-height: 0;
      max-height: 100%;
    }
  }
}

.carousel-main {
  display: grid;
  width: 100%;
  max-width: 1532px;
  align-items: center;
  grid-template-columns: 52px minmax(0, 1fr) 52px;

  @media (min-width: 1480px) {
    column-gap: 40px;
  }

  @media (max-width: $feature-carousel-stack-max) {
    grid-template-columns: minmax(0, 1fr);
    column-gap: 0;
  }

  &__nav-slot {
    display: flex;
    align-items: center;

    @media (max-width: $feature-carousel-stack-max) {
      display: none;
    }

    &--prev {
      justify-content: flex-end;
    }

    &--next {
      justify-content: flex-start;
    }
  }

  &__content {
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;

    @media (max-width: $feature-carousel-stack-max) {
      overflow: visible;
    }

    @media (min-width: $feature-carousel-row-min) {
      display: flex;
      align-items: center;
      min-height: $feature-carousel-stage-height;
      overflow: visible;
      padding-left: 24px;
      padding-right: 24px;
    }
  }

  &__row {
    @media (min-width: $feature-carousel-row-min) {
      align-items: center;
      min-height: $feature-carousel-stage-height;
    }

    &--performance {
      @media (max-width: $feature-carousel-stack-max) {
        gap: 40px;
      }
    }
  }

  &__copy-col,
  &__visual-col {
    min-width: 0;
    max-width: 100%;

    @media (min-width: $feature-carousel-row-min) {
      align-self: center;
    }
  }

  &__copy-col {
    position: relative;
    z-index: 2;

    @media (min-width: $feature-carousel-row-min) {
      overflow: visible;
    }
  }

  &__visual-col {
    @media (min-width: $feature-carousel-row-min) {
      overflow: visible;
    }
  }
}

.feature-carousel__flow {
  display: flex;
  flex-direction: column;
}

.feature-carousel__banner {
  width: 100%;
  max-width: 1532px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 20px;

  @media (min-width: 768px) and (max-width: 1479px) {
    padding-left: 20px;
    padding-right: 20px;
  }

  @media (min-width: 1480px) {
    padding-left: 50px;
    padding-right: 50px;
  }
}

.feature-carousel-nav {
  display: flex;
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 26px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;

  &--dark {
    border: none;
    background: rgb(255 255 255 / 20%);

    &:hover {
      background: rgb(255 255 255 / 28%);
    }
  }
}
</style>
