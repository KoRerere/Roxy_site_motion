<script setup lang="ts">
import { animate, motion, motionValue, useMotionValueEvent } from 'motion-v'
import coverage1 from '@/assets/images/functions/roxy-ip/coverage1.png'
import coverage2 from '@/assets/images/functions/roxy-ip/coverage2.png'
import coverage3 from '@/assets/images/functions/roxy-ip/coverage3.png'

/** 每页停留时长（秒）；进度条与自动切页与此一致 */
const SLIDE_DURATION_SEC = 8

const list = [
  {
    img: coverage1,
    title: $t('数据爬取'),
    description: $t('轻松获取每日百万级商品数据，稳定规避平台反爬检测，精准分析市场趋势，提升业务决策效率。'),
  },
  {
    img: coverage2,
    title: $t('营销推广'),
    description: $t('支持多协议高匿代理 IP，为全球营销活动提供纯净网络环境，确保广告投放与业务推广的平稳执行。'),
  },
  {
    img: coverage3,
    title: $t('社媒矩阵运营'),
    description: $t('专为 Facebook、TikTok、X (Twitter)、Instagram 等平台优化。支持多账号独立隔离运营，彻底规避风控关联，保障账号安全。'),
  },
]

const activeIndex = ref(0)
const progressFill = motionValue('0%')
const progressFillCss = ref('0%')

useMotionValueEvent(progressFill, 'change', v => progressFillCss.value = v)

let progressControls: ReturnType<typeof animate> | undefined

function stopProgress() {
  progressControls?.stop()
  progressControls = undefined
}

function goNext() {
  activeIndex.value = (activeIndex.value + 1) % list.length
}

function goPrev() {
  activeIndex.value = (activeIndex.value - 1 + list.length) % list.length
}

/** 移动端（小于 md）：图片区域横向滑动切页，与 Tailwind md 断点对齐 */
const breakpoints = useRxBreakpoints()
const isMobileSwipeCarousel = breakpoints.smaller('md')

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

function startProgressCycle() {
  if (import.meta.server)
    return
  stopProgress()
  progressFill.set('0%')
  progressFillCss.value = '0%'
  progressControls = animate(progressFill, '100%', {
    duration: SLIDE_DURATION_SEC,
    ease: 'linear',
    onComplete: goNext,
  })
}

watch(activeIndex, () => {
  nextTick(startProgressCycle)
}, { immediate: true })

onUnmounted(() => {
  stopProgress()
})
</script>

<template>
  <Container class="pb-12 flex flex-col items-center md:pb-15 md:pt-15">
    <h2 class="text-6 color-[#111213] leading-7 font-600 multilingual-text text-center md:text-8.5 xl:text-10 md:leading-11 xl:leading-12 md:font-700">
      {{ $t('多场景覆盖') }}
    </h2>
    <div class="text-3.5 color-[#34393D] leading-5 mt-2 text-center max-w-265 md:text-4.5 md:leading-7">
      {{ $t("海量 IP 池支持多协议，高匿代理 IP + 指纹隔离双重防护，保障数据爬取、营销推广及社媒矩阵运营的流畅执行。") }}
    </div>

    <div class="multiple-scene-wrap mx-auto mt-8 px-0 flex max-w-300 w-full justify-center xl:mt-12">
      <div class="rounded-6 bg-white w-full shadow-[0_12px_40px_-12px_rgb(17_18_19_/_08%)] overflow-hidden">
        <div class="pa-0 flex flex-col gap-5 md:pa-8 xl:pa-15 md:flex-row md:gap-8 xl:gap-12 md:items-stretch" @touchstart.passive="onSwipeTouchStart" @touchend.passive="onSwipeTouchEnd">
          <!-- 文案 -->
          <div class="pa-5 flex flex-col gap-10 justify-between md:pa-0 md:w-[48%]">
            <div class="md:min-h-[200px]">
              <template v-for="(item, idx) in list" :key="idx">
                <motion.div
                  v-if="activeIndex === idx" class="carousel-copy" :initial="{ opacity: 0, y: 14 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }"
                >
                  <h3 class="text-5 color-[#111213] leading-7 font-600 multilingual-text md:text-8.5 xl:text-10 md:leading-11 xl:leading-12 md:font-700">
                    {{ item.title }}
                  </h3>
                  <p class="text-3.5 color-[#5C636A] leading-5.5 mt-3 md:text-4.5 md:leading-7">
                    {{ item.description }}
                  </p>
                </motion.div>
              </template>
            </div>

            <!-- 进度指示：当前项变宽，内部绿色条随停留时长线性自增 -->
            <div class="mt-4 px-6 py-4 rounded-full bg-[#f1f5f8] w-fit hidden md:block">
              <div class="flex gap-2 items-center">
                <div
                  v-for="(_, idx) in list" :key="idx" class="indicator-item rounded-full shrink-0 h-2 cursor-pointer relative overflow-hidden" :class="{ 'is-active': activeIndex === idx }"
                  role="button" tabindex="0" :aria-label="`Go to slide ${idx + 1}`" @click="activeIndex = idx" @keydown.enter="activeIndex = idx" @keydown.space.prevent="activeIndex = idx"
                >
                  <span v-if="activeIndex !== idx" class="rounded-full bg-[#d4dfe7] h-full w-full block" />
                  <span v-else class="indicator-track">
                    <span class="indicator-progress" :style="{ width: progressFillCss }" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 图 -->
          <div class="flex flex-1 min-h-245px select-none items-center justify-center touch-pan-y md:mt-0 md:min-h-270px xl:min-h-360px md:select-auto">
            <motion.div
              :key="activeIndex" class="flex w-full items-center justify-center" :initial="{ opacity: 0, scale: 0.985 }" :animate="{ opacity: 1, scale: 1 }"
              :transition="{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }"
            >
              <img :src="list[activeIndex]!.img" :alt="list[activeIndex]!.title" class="rounded-3 max-w-550px w-full select-none object-contain" draggable="false">
            </motion.div>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto mt-4 px-6 py-4 rounded-full bg-[#f1f5f8] w-fit self-start md:hidden">
      <div class="flex gap-2 items-center" aria-hidden="true">
        <div v-for="(_, idx) in list" :key="idx" class="indicator-item rounded-full shrink-0 h-2 relative overflow-hidden" :class="{ 'is-active': activeIndex === idx }">
          <span v-if="activeIndex !== idx" class="rounded-full bg-[#d4dfe7] h-full w-full block" />
          <span v-else class="indicator-track">
            <span class="indicator-progress" :style="{ width: progressFillCss }" />
          </span>
        </div>
      </div>
    </div>
  </Container>
</template>

<style lang="scss" scoped>
.indicator-item {
  transition:
    width 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.2s ease;

  &:not(.is-active) {
    width: 16px;
  }

  &.is-active {
    width: 68px;
  }
}

.indicator-track {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background-color: #d4dfe7;
  position: relative;
}

.indicator-progress {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 999px;
  background: linear-gradient(87deg, #03c1d9 0%, #57da48 107.49%);
  width: 0%;
}
</style>
