<script setup lang="ts">
import type { CtaAction, FeatureSlide } from './config'
import { RxIcon } from '@/components/rx-icon'
import { useAuth } from '~/hooks/useAuth'
import * as authStore from '~/store/auth'
import { useAiAutomationDemo } from './use-ai-automation-demo'

const props = defineProps<{
  slide: FeatureSlide
}>()

const { openDemoFromCta } = useAiAutomationDemo()

function isLinkAction(action: CtaAction): action is { type: 'link', to: string } {
  return action.type === 'link'
}

function onWatchDemoClick() {
  if (props.slide.id === 'aiAutomation')
    openDemoFromCta()
}

const { login } = useAuth()
const { public: { roxyBrowserUrl } } = useRuntimeConfig()
const localePath = useLocalePath()
const MOBILE_HEADER_MEDIA = '(max-width: 1123px)'

function isMobileHeaderViewport() {
  return import.meta.client && window.matchMedia(MOBILE_HEADER_MEDIA).matches
}

function gotoRegister() {
  if (isMobileHeaderViewport()) {
    if (authStore.loggedIn.value) {
      navigateTo(localePath('/download'))
      return
    }

    login()
    return
  }

  if (authStore.loggedIn.value) {
    window.open(roxyBrowserUrl, '_blank')
    return
  }

  login()
}
</script>

<template>
  <div class="feature-slide-copy main-ff flex flex-col w-full lg:h-full lg:min-h-0 lg:items-stretch">
    <!-- 主文案区：<1024px 自然高度贴顶，≥1024px 与右侧视觉区垂直居中 -->
    <div class="feature-slide-copy__main flex flex-col gap-4 w-full items-center lg:flex-1 lg:gap-9 md:gap-8 xl:gap-10 lg:min-h-0 lg:items-stretch">
      <div class="flex flex-col gap-3 w-full relative lg:gap-4.5 md:gap-4 xl:gap-5">
        <div class="feature-slide-copy__badge mb-3px flex justify-center lg:mb-[-8px] lg:justify-start" :class="slide.badgeClass">
          <span
            class="feature-carousel-badge text-3.5 text-white leading-normal font-600 px-3 py-1 rounded-full flex gap-2.5 items-center lg:text-4.5 md:text-4 xl:text-4.5 lg:leading-6.5 md:leading-6 xl:leading-[1.5] md:px-4 md:py-1.5 xl:px-4 xl:py-1.5 md:-rotate-6"
            :style="{ background: slide.badgeLinearGradient }"
          >
            <img v-if="slide.badgeIcon" :src="slide.badgeIcon" class="h-5 w-5 md:h-5 md:w-5 xl:h-6 xl:w-6">
            {{ slide.badge }}
          </span>
        </div>

        <h2 class="text-36px text-white leading-48px font-700 text-center whitespace-pre-line lg:text-10 md:text-14 xl:text-15.5 lg:leading-13 md:leading-16 xl:leading-16 lg:text-left">
          <template v-if="typeof slide.title === 'string'">
            {{ slide.title }}
          </template>
          <component :is="slide.title" v-else />
        </h2>

        <div
          v-if="slide.subtitleBeforeHighlight"
          class="text-4 text-white leading-6 mt-3 flex flex-col gap-1 items-center lg:hidden"
        >
          <span class="font-500">{{ slide.subtitlePrefix }}</span>
          <span class="flex gap-1 items-center">
            <span class="font-500">{{ slide.subtitleBeforeHighlight }}</span>
            <span
              v-if="slide.subtitleHighlight"
              class="feature-carousel-gradient-text font-600"
              :class="{ ff: slide.subtitleHighlightMainFF }"
              :style="{ backgroundImage: slide.subtitleHighlightGradient }"
            >
              {{ slide.subtitleHighlight }}
            </span>
          </span>
        </div>
        <p
          class="text-4 text-white leading-6 mt-3 flex flex-wrap gap-1 items-center justify-center lg:text-5 md:text-4.5 xl:text-5 lg:leading-7.5 md:leading-7 xl:leading-7.5 lg:mt-0 lg:gap-1 lg:justify-start"
          :class="slide.subtitleBeforeHighlight ? 'hidden lg:flex' : ''"
        >
          <span class="font-500">{{ slide.subtitlePrefix }}</span>
          <span v-if="slide.subtitleBeforeHighlight" class="font-500">{{ slide.subtitleBeforeHighlight }}</span>
          <span
            v-if="slide.subtitleHighlight"
            class="feature-carousel-gradient-text font-600"
            :class="{ ff: slide.subtitleHighlightMainFF }"
            :style="{ backgroundImage: slide.subtitleHighlightGradient }"
          >
            {{ slide.subtitleHighlight }}
          </span>
        </p>
      </div>

      <div class="flex flex-col gap-5 w-full items-center lg:gap-5 md:gap-5 xl:gap-5 lg:items-stretch">
        <div
          class="feature-slide-cta-actions font-500 flex flex-wrap gap-3 items-center justify-center lg:gap-4 md:gap-3.5 xl:gap-15px lg:justify-start"
        >
          <button
            v-if="slide.primaryCta.action.type === 'register'"
            class="feature-slide-cta-actions__btn feature-carousel-primary-btn text-4 leading-6 px-5 py-2 shrink-0 h-12 md:text-4 md:leading-6 lg:px-8 lg:py-2 md:px-5 md:py-2 xl:px-8 xl:py-2"
            :btn-text="slide.primaryCta.text"
            icon="base/rx_ic_right"
            :icon-size="20"
            :auto-download="true"
            @click="gotoRegister"
          >
            {{ slide.primaryCta.text }}
            <RxIcon name="base/rx_ic_right" size="20" />
          </button>
          <NuxtLinkLocale
            v-else-if="isLinkAction(slide.primaryCta.action)"
            :to="slide.primaryCta.action.to"
            class="feature-slide-cta-actions__btn primary-btn-wrap text-4 text-white leading-6 font-600 px-5 py-2 rounded-2 inline-flex shrink-0 gap-1.5 h-12 cursor-pointer items-center md:px-5 md:py-2 xl:px-5 xl:py-2"
          >
            {{ slide.primaryCta.text }}
            <RxIcon name="base/rx_ic_right" size="20" />
          </NuxtLinkLocale>

          <template v-if="slide.secondaryCta">
            <button
              v-if="slide.secondaryCta.action.type === 'demo'"
              type="button"
              class="feature-slide-cta-actions__btn feature-slide-cta-actions__btn--secondary text-4 text-white leading-6 font-500 px-5 py-2 rounded-2 inline-flex shrink-0 gap-1.5 h-12 cursor-pointer items-center md:px-5 md:py-2 xl:px-5 xl:py-2"
              @click="onWatchDemoClick"
            >
              {{ slide.secondaryCta.text }}
              <RxIcon name="base/rx_ic_play_full" size="20" />
            </button>
            <NuxtLinkLocale
              v-else-if="isLinkAction(slide.secondaryCta.action)"
              :to="slide.secondaryCta.action.to"
              class="feature-slide-cta-actions__btn feature-slide-cta-actions__btn--secondary text-4 text-white leading-6 font-500 px-5 py-2 rounded-2 inline-flex shrink-0 gap-1.5 h-12 cursor-pointer items-center md:px-5 md:py-2 xl:px-5 xl:py-2"
            >
              {{ slide.secondaryCta.text }}
              <RxIcon name="base/rx_ic_chevron_right" size="20" />
            </NuxtLinkLocale>
          </template>
        </div>

        <ul
          class="m-0 p-0 list-none flex flex-wrap gap-x-5 gap-y-2 justify-center lg:gap-x-5.5 md:gap-x-5 md:gap-y-2 xl:gap-x-6 lg:justify-start"
          :class="slide.highlightsMultiline ? 'max-w-130' : ''"
        >
          <li
            v-for="(item, idx) in slide.highlights"
            :key="idx"
            class="text-4 text-white/80 leading-6 font-500 flex gap-1.5 items-center md:text-4 md:leading-6 lg:gap-1.5 xl:gap-1.5"
          >
            <img
              v-if="item.useCheckIcon !== false"
              src="/home/feature-carousel/rx_ic_check_fill.svg"
              class="shrink-0 size-4"
              draggable="false"
              loading="lazy"
            >
            <span v-else class="rounded-full bg-[#12a3fc] shrink-0 h-2 w-2" />
            <span>{{ item.text }}</span>
          </li>
        </ul>
        <div v-if="slide.extraFooter" class="flex justify-center lg:justify-start">
          <component :is="slide.extraFooter" />
        </div>
      </div>
      <slot name="desktop-progress" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-ff {
  font-family:
    -apple-system, BlinkMacSystemFont, Inter, 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', 'Segoe UI', sans-serif;
}

/* ≥1024px 左右并排时，让文案块与右侧视觉图上下居中对齐 */
.feature-slide-copy__main {
  @media (min-width: 1024px) {
    justify-content: center;
  }
}

.feature-slide-copy__badge {
  @media (min-width: 1024px) {
    transform: translateY(-16px);
  }
}

.feature-carousel-primary-btn {
  @apply flex items-center justify-center gap-6px rounded-8px text-white;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(0deg, #12a3fc 0%, #12a3fc 100%), linear-gradient(99deg, #238aff 67.78%, #f9b3b4 107.9%);
  box-shadow: 0 4px 8px 0 rgba(18, 163, 252, 0.36);

  &:hover {
    background:
      linear-gradient(0deg, rgba(0, 0, 0, 0.06) 0%, rgba(0, 0, 0, 0.06) 100%),
      linear-gradient(0deg, #12a3fc 0%, #12a3fc 100%), linear-gradient(99deg, #238aff 67.78%, #f9b3b4 107.9%);
  }
}

.feature-carousel-gradient-text {
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.primary-btn-wrap:deep(button),
.primary-btn-wrap:deep(a) {
  border-radius: 8px;
  background: linear-gradient(0deg, #12a3fc 0%, #12a3fc 100%), linear-gradient(99deg, #238aff 67.78%, #f9b3b4 107.9%);
  box-shadow: 0 4px 8px 0 rgba(18, 163, 252, 0.36);
}

.feature-slide-cta-actions {
  @media (max-width: 767px) {
    gap: 0.375rem;
    row-gap: 0.75rem;
    width: 100%;
  }

  &__btn {
    justify-content: center;
    white-space: nowrap;

    @media (max-width: 767px) {
      flex: 0 1 auto;
      min-width: 0;
      padding-inline: 1.25rem;
    }
  }

  &__btn--secondary {
    color: #fff;
    background: rgba(0, 0, 0, 0.4);

    &:hover {
      background: rgba(0, 0, 0, 0.6);
    }
  }
}

.ff {
  font-family: Archivo;
  font-weight: 600;
}
</style>
