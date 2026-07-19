<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'

const props = defineProps<{
  slides: {
    title: string
    description: string
    image: string
  }[]
}>()

const activeSlide = ref(0)
const lastActiveSlide = ref(0)
const progress = ref(0)

// 每16ms更新一次进度，6 秒内从 0 减到 100，然后切换到下一个
const SLIDE_DURATION = 10000 // 10秒
const INTERVAL_MS = 16 // 16毫秒间隔
const PROGRESS_STEP = 100 / (SLIDE_DURATION / INTERVAL_MS) // 每次减少的进度值
const targetIsVisible = ref(false)

const target = useTemplateRef<HTMLDivElement>('target')
useIntersectionObserver(
  target,
  ([entry]) => {
    // 当元素的可见比例 >= 0.8 时认为满足条件
    targetIsVisible.value = entry?.intersectionRatio >= 0.8
  },
  {
    threshold: Array.from({ length: 101 }, (_, i) => i / 100), // 0 ~ 1 分段
  },
)

const { resume, pause } = useIntervalFn(() => {
  progress.value += PROGRESS_STEP
  if (progress.value >= 99) {
    const index = (activeSlide.value + 1) % props.slides.length
    switchSlide(index)
  }
}, INTERVAL_MS, {
  immediate: false,
})

function switchSlide(index: number) {
  if (index === activeSlide.value) {
    return
  }

  activeSlide.value = index
  progress.value = 0
}

watch(activeSlide, (newVal, oldVal) => {
  lastActiveSlide.value = oldVal
})

watch(targetIsVisible, (visible) => {
  console.log('targetIsVisible', visible)
  if (visible) {
    resume()
    switchSlide(0)
  }
  else {
    pause()
    switchSlide(0)
  }
}, {
  immediate: true,
  flush: 'post',
})
</script>

<template>
  <div ref="target" class="carousel">
    <div class="carousel-images">
      <template v-for="(slide, index) in slides" :key="slide.title">
        <Transition :name="index === activeSlide ? 'fadeIn' : 'fadeOut'">
          <div v-show="index === activeSlide">
            <RxResponsiveImage
              :key="slide.image" :name="slide.image"
              :alt="`${slide.title} - ${slide.description}`"
              :title="slide.title" class="carousel-image inset-0 absolute object-cover"
              :style="{ zIndex: index === activeSlide ? 10 : 1 }"
            />
          </div>
        </Transition>
      </template>
    </div>
    <div class="carousel-content" :style="{ '--progress': `${progress}%` }">
      <div
        v-for="(slide, index) in slides" :key="slide.title" class="carousel-content-item"
        :class="{ active: activeSlide === index }" @click="switchSlide(index)"
      >
        <h3 class="carousel-content-title multilingual-text">
          {{ slide.title }}
        </h3>
        <div class="carousel-content-description">
          {{ slide.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.carousel {
  display: grid;
  grid-template-columns: 610px 1fr;
  gap: 68px;
  width: min(100%, 1280px);
  margin: 48px auto 0;

  @media (max-width: 1300px) {
    grid-template-columns: 450px 1fr;
  }
}

.carousel-images {
  display: flex;
  flex-direction: row;
  gap: 48px;
  max-height: 440px;
  position: relative;

  :deep(.carousel-image) {
    width: 100%;
    border-radius: 12px;
    max-height: 440px;
  }
}

.fadeIn-enter-active,
.fadeOut-enter-active,
.fadeOut-leave-active {
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fadeIn-enter-from,
.fadeOut-enter-from,
.fadeOut-leave-to {
  opacity: 0;
}

.carousel-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.carousel-content-item {
  display: flex;
  flex-direction: column;
  padding: 24px 24px 24px 32px;
  align-items: flex-start;
  flex: 1 0 0;
  transition: all 0.3s ease;
  border-radius: 8px;
  cursor: pointer;

  @media (max-width: 1300px) {
    padding: 12px 8px 12px 16px;
  }

  &.active {
    gap: 12px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);

    &::before {
      content: '';
      position: absolute;
      top: 8px;
      left: -2px;
      width: 4px;
      border-radius: 4px;
      background: #11a3fd;
      height: var(--progress);
      max-height: calc(100% - 16px);
    }

    .carousel-content-description {
      height: calc-size(auto, size);
    }
  }

  &:not(.active):hover {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
  }
}

.carousel-content-title {
  cursor: pointer;
  color: #fff;
  font-size: var(--Heading-H5, 26px);
  font-style: normal;
  font-weight: 600;
  line-height: var(--line-H5, 36px);
  /* 138.462% */

  @media (max-width: 1300px) {
    font-size: 20px;
    line-height: 28px;
    /* 140% */
  }
}

.carousel-content-description {
  height: 0;
  overflow: hidden;
  color: #fff;

  /* sub-title */
  font-family: Inter;
  font-size: var(--sub-title, 16px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-sub-title, 24px);
  transition: height 0.3s ease;

  @media (max-width: 1300px) {
    font-size: 15px;
    line-height: 150%;
    /* 22.5px */
  }
}
</style>
