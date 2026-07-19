<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
import { useAiAutomationDemo } from '../use-ai-automation-demo'

interface DemoCard {
  id: string
  title: string
  preview: string
  video?: string
  style: {
    left: string
    top: string
    width: string
  }
  mobileStyle: {
    left: string
    top: string
    width: string
  }
}

const isMobile = useRxBreakpoints().smaller('md')
const {
  openDesktopDemo,
  openMobileDemo,
  cleanupDemoPlayers,
} = useAiAutomationDemo()

const demoCards = computed<DemoCard[]>(() => [
  {
    id: 'batch',
    title: $t('AI 批量操作'),
    preview: '/home/feature-carousel/carousel/ai-agent/dark/card-batch.jpg',
    video: '/home/feature-carousel/carousel/ai-agent/card-preview-ai.mp4',
    style: { left: '2.4%', top: '22.2%', width: '29.2%' },
    mobileStyle: { left: '2.374%', top: '22.222%', width: '29.83%' },
  },
  {
    id: 'script',
    title: $t('AI 智能养号'),
    preview: '/home/feature-carousel/carousel/ai-agent/dark/card-script.jpg',
    video: '/home/feature-carousel/carousel/ai-agent/card-preview-ai-execute.mp4',
    style: { left: '67.8%', top: '2.3%', width: '29.2%' },
    mobileStyle: { left: '67.797%', top: '2.299%', width: '29.83%' },
  },
  {
    id: 'creative',
    title: $t('手机远程控制'),
    preview: '/home/feature-carousel/carousel/ai-agent/dark/card-creative.jpg',
    video: '/home/feature-carousel/carousel/ai-agent/card-preview-claw.mp4',
    style: { left: '54.2%', top: '65.9%', width: '29.2%' },
    mobileStyle: { left: '54.237%', top: '65.899%', width: '29.83%' },
  },
])

function cardStyle(card: DemoCard) {
  return isMobile.value ? card.mobileStyle : card.style
}

function openCardDemo(card: DemoCard) {
  if (isMobile.value)
    openMobileDemo(card.video, card.preview)
  else
    openDesktopDemo(card.id, card.video, card.preview)
}

onUnmounted(() => {
  cleanupDemoPlayers()
})
</script>

<template>
  <div class="ai-automation-visual" :class="{ 'ai-automation-visual--mobile': isMobile }">
    <div class="ai-automation-visual__stage">
      <img
        src="/home/feature-carousel/carousel/ai-agent/dark/right_bg.svg"
        alt=""
        class="ai-automation-visual__bg"
        draggable="false"
        :loading="isMobile ? 'lazy' : 'eager'"
      >
    </div>

    <button
      v-for="card in demoCards"
      :key="card.id"
      type="button"
      class="ai-automation-card"
      :class="`ai-automation-card--${card.id}`"
      :style="cardStyle(card)"
      :aria-label="`${card.title} ${$t('查看Demo')}`"
      @click.stop="openCardDemo(card)"
      @touchstart.stop
      @touchend.stop
    >
      <img
        :src="card.preview"
        alt=""
        class="ai-automation-card__preview"
        draggable="false"
        loading="lazy"
      >
      <div class="ai-automation-card__body">
        <p class="ai-automation-card__title">
          {{ card.title }}
        </p>
        <span class="ai-automation-card__demo">
          {{ $t('查看Demo') }}
          <RxIcon name="base/rx_ic_play_full" :size="isMobile ? 9 : 14" class="color-[#11a3fd]" />
        </span>
      </div>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.ai-automation-visual {
  position: relative;
  /* 与轮播视觉区标准画布 590×522 一致，保证等比缩放 */
  aspect-ratio: 590 / 522;
  width: min(100%, 590px);
  max-width: 100%;
  max-height: 100%;
  height: auto;
  min-height: 0;
  flex-shrink: 1;
  margin-inline: auto;
  font-family: 'IBM Plex Sans SC';

  @media (min-width: 768px) {
    margin-left: auto;
    margin-right: 0;
  }

  &--mobile {
    max-width: 100%;
  }

  &__stage {
    position: relative;
    width: 100%;
    height: 100%;
  }

  &__bg {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 74.6%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    user-select: none;
    object-fit: contain;
  }
}

.ai-automation-card {
  position: absolute;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  margin: 0;
  border: 1.5px solid #3faaf6;
  border-radius: 10px;
  background: #030926;
  box-shadow: 0 6px 6px rgba(0, 0, 0, 0.06);
  text-align: left;
  cursor: pointer;
  --orbit-x-1: 0px;
  --orbit-y-1: 0px;
  --orbit-x-2: 0px;
  --orbit-y-2: 0px;
  --orbit-x-3: 0px;
  --orbit-y-3: 0px;
  animation: ai-automation-card-orbit 18s linear infinite;
  translate: 0 0;
  transform-origin: center center;
  /* 与轮播文案淡入相同的 ease-out 曲线，缩放更顺滑 */
  transition:
    box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  @media (hover: hover) {
    &:hover {
      transform: scale(1.08);
      border-color: #5eb8f8;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
  }

  &--batch {
    --orbit-x-1: 4px;
    --orbit-y-1: -5px;
    --orbit-x-2: 8px;
    --orbit-y-2: 0px;
    --orbit-x-3: 4px;
    --orbit-y-3: 5px;
  }

  &--script {
    --orbit-x-1: 5px;
    --orbit-y-1: 4px;
    --orbit-x-2: 0px;
    --orbit-y-2: 8px;
    --orbit-x-3: -5px;
    --orbit-y-3: 4px;
  }

  &--creative {
    --orbit-x-1: -5px;
    --orbit-y-1: 4px;
    --orbit-x-2: -8px;
    --orbit-y-2: 0px;
    --orbit-x-3: -5px;
    --orbit-y-3: -4px;
  }

  &__preview {
    display: block;
    width: 100%;
    aspect-ratio: 160 / 90;
    border-radius: 6px;
    object-fit: cover;
    user-select: none;
    pointer-events: none;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 4px 4px 8px;
  }

  &__title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
    color: #fff;
  }

  &__demo {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    line-height: 1.2;
    color: #11a3fd;
  }
}

@keyframes ai-automation-card-orbit {
  0%,
  100% {
    translate: 0 0;
  }

  25% {
    translate: var(--orbit-x-1) var(--orbit-y-1);
  }

  50% {
    translate: var(--orbit-x-2) var(--orbit-y-2);
  }

  75% {
    translate: var(--orbit-x-3) var(--orbit-y-3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ai-automation-card {
    animation: none;
  }
}

.ai-automation-visual--mobile {
  .ai-automation-card {
    gap: 5px;
    padding: 5px;
    border-width: 0.9px;
    border-radius: 6px;
    background: #030926;
    box-shadow: 0 3.66px 3.66px rgba(0, 0, 0, 0.06);
    animation-duration: 20s;

    &--batch {
      --orbit-x-1: 2px;
      --orbit-y-1: -2.5px;
      --orbit-x-2: 4px;
      --orbit-y-2: 0px;
      --orbit-x-3: 2px;
      --orbit-y-3: 2.5px;
    }

    &--script {
      --orbit-x-1: 2.5px;
      --orbit-y-1: 2px;
      --orbit-x-2: 0px;
      --orbit-y-2: 4px;
      --orbit-x-3: -2.5px;
      --orbit-y-3: 2px;
    }

    &--creative {
      --orbit-x-1: -2.5px;
      --orbit-y-1: 2px;
      --orbit-x-2: -4px;
      --orbit-y-2: 0px;
      --orbit-x-3: -2.5px;
      --orbit-y-3: -2px;
    }

    &__preview {
      aspect-ratio: 97.627 / 55.121;
      border-radius: 3.66px;
    }

    &__body {
      gap: 4px;
      padding: 2px 2px 5px;
    }

    &__title {
      font-size: 8.5px;
      color: #fff;
    }

    &__demo {
      gap: 2px;
      font-size: 7.3px;
    }
  }
}
</style>
