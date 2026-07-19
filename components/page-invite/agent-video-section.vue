<script setup lang="ts">
import { useEventListener, useIntersectionObserver, useMediaQuery } from '@vueuse/core'
import { RxIcon } from '@/components/rx-icon'
import InviteChevronIcon from '@/components/page-invite/invite-chevron-icon.vue'

withDefaults(defineProps<{
  class?: string
  /** 查看详情跳转路径 */
  link?: string
}>(), {
  link: '/',
})

const { $t } = useRxI18n()
const { inviteAgentVideoSrc } = useInviteLocaleMedia()
const { isZh } = useRxI18n()

const sectionRef = ref<HTMLElement | null>(null)
/** 移动端视频容器：用于判断点击是否落在控件外 */
const mobileVideoContainerRef = ref<HTMLElement | null>(null)
/** 进入视口后再赋 src，避免首屏拉取大体积 mp4 */
const shouldLoadVideo = ref(false)
const isDesktop = useMediaQuery('(min-width: 1024px)')

const videoRef = ref<HTMLVideoElement>()
const isPaused = ref(true)
const isMuted = ref(true)
const currentTime = ref(0)
const duration = ref(0)
/** 与首页 rx-video 一致：hover 显示控件，否则显示剩余时长 */
const showControls = ref(false)

const { stop: stopVideoObserver } = useIntersectionObserver(
  sectionRef,
  ([entry]) => {
    if (entry?.isIntersecting) {
      shouldLoadVideo.value = true
      stopVideoObserver()
      nextTick(() => {
        videoRef.value?.play().catch(() => {
          isPaused.value = true
        })
      })
    }
  },
  { rootMargin: '200px 0px' },
)

onBeforeUnmount(() => stopVideoObserver())

const progressValue = computed(() => {
  if (!duration.value)
    return 0
  return Math.min(100, Math.max(0, (currentTime.value / duration.value) * 100))
})

const progressBackground = computed(() => `linear-gradient(90deg, #fff ${progressValue.value}%, rgba(255, 255, 255, 0.56) ${progressValue.value}%)`)

/** 未 hover 时展示的剩余播放时间（格式 0:56） */
const remainingTime = computed(() => {
  const remaining = duration.value - currentTime.value
  return formatTime(Math.max(0, remaining))
})

function getVideo() {
  return videoRef.value
}

async function toggleVideoPlayback() {
  const video = getVideo()
  if (!video)
    return

  if (isPaused.value) {
    await video.play().catch(() => undefined)
    isPaused.value = false
    // 恢复播放后收起控件，仅保留剩余时长角标（移动端无 hover）
    showControls.value = false
    return
  }

  video.pause()
  isPaused.value = true
}

function toggleMute() {
  isMuted.value = !isMuted.value
  const video = getVideo()
  if (video)
    video.muted = isMuted.value
}

function handleLoadedMetadata(event: Event) {
  const video = event.target as HTMLVideoElement
  duration.value = Number.isFinite(video.duration) ? video.duration : 0
}

function handleTimeUpdate(event: Event) {
  const video = event.target as HTMLVideoElement
  currentTime.value = video.currentTime
  duration.value = Number.isFinite(video.duration) ? video.duration : duration.value
}

function handleSeek(event: Event) {
  if (!duration.value)
    return

  const nextTime = (Number((event.target as HTMLInputElement).value) / 100) * duration.value
  const video = getVideo()
  if (video)
    video.currentTime = nextTime
  currentTime.value = nextTime
}

function formatTime(value: number) {
  const safeValue = Number.isFinite(value) ? Math.floor(value) : 0
  const minutes = Math.floor(safeValue / 60)
  const seconds = safeValue % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function handleVideoMouseEnter() {
  showControls.value = true
}

function handleVideoMouseLeave() {
  if (!isPaused.value)
    showControls.value = false
}

/** 移动端播放中：点击视频区域外或滚动时收起控件 */
function hideMobileVideoControls() {
  if (isDesktop.value || isPaused.value)
    return
  showControls.value = false
}

function handleMobileOutsideInteraction(event: Event) {
  if (isDesktop.value || isPaused.value)
    return
  const container = mobileVideoContainerRef.value
  const target = event.target as Node | null
  if (!container || !target || container.contains(target))
    return
  hideMobileVideoControls()
}

/** 移动端播放中点击画面：重新唤起控件（隐藏后 invisible 层不再挡点击） */
function handleMobileVideoTap(event: MouseEvent) {
  if (isDesktop.value || isPaused.value)
    return
  const target = event.target as HTMLElement | null
  if (target?.closest('button, input'))
    return
  showControls.value = true
}

// 捕获阶段监听，避免控件收起逻辑被内部 stopPropagation 绕过
useEventListener(document, 'pointerdown', handleMobileOutsideInteraction, { capture: true })
useEventListener(window, 'scroll', hideMobileVideoControls, { passive: true, capture: true })
</script>

<template>
  <section ref="sectionRef" class="flex flex-col" :class="$props.class">
    <!-- 移动端间距：标题↔配图 12px、配图↔文案 12px；文案↔链接由父级 gap-4 控制 -->
    <div class="invite-agent-video-mobile flex flex-col gap-[12px] lg:hidden">
      <h2 class="text-left text-secondary font-[Archivo] text-[20px] leading-[28px] font-600">
        {{ $t('invite.featureAiTitle') }}
      </h2>

      <div
        ref="mobileVideoContainerRef"
        class="invite-agent-video box-border h-[227px] overflow-hidden rounded-[16px] border border-[#E2E9EE] bg-[#030111]"
        :class="{ 'show-video-ui': showControls || isPaused }"
        @mouseenter="handleVideoMouseEnter"
        @mouseleave="handleVideoMouseLeave"
      >
        <video
          v-if="shouldLoadVideo && !isDesktop"
          :key="inviteAgentVideoSrc"
          ref="videoRef"
          class="block bg-[#030111] object-cover"
          :src="inviteAgentVideoSrc"
          :muted="isMuted"
          loop
          playsinline
          preload="auto"
          @loadedmetadata="handleLoadedMetadata"
          @pause="isPaused = true; showControls = true"
          @play="isPaused = false; showControls = false"
          @timeupdate="handleTimeUpdate"
          @click="handleMobileVideoTap"
        />
        <!-- 未 hover：展示剩余时长（对齐首页 rx-video） -->
        <div v-if="!showControls && !isPaused" class="invite-agent-video-remaining">
          {{ remainingTime }}
        </div>
        <div class="invite-agent-video-controls">
          <input
            class="invite-agent-video-progress"
            type="range"
            min="0"
            max="100"
            step="0.1"
            :value="progressValue"
            :style="{ background: progressBackground }"
            aria-label="视频进度"
            @input="handleSeek"
          >
          <div class="invite-agent-video-actions">
            <button
              type="button"
              class="invite-agent-video-play"
              :class="{ 'is-playing': !isPaused }"
              :aria-label="isPaused ? '播放视频' : '暂停视频'"
              @click="toggleVideoPlayback"
            >
              <RxIcon :name="isPaused ? 'base/rx_ic_play' : 'base/rx_ic_pause2'" size="24" />
            </button>
            <div class="invite-agent-video-meta">
              {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
              <button
                type="button"
                class="invite-agent-video-volume"
                :aria-label="isMuted ? '打开声音' : '静音'"
                @click="toggleMute"
              >
                <RxIcon :name="isMuted ? 'base/rx_ic_mute' : 'base/rx_ic_sound'" size="24" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="invite-agent-video-mobile__body flex flex-col gap-4">
        <div class="text-[15px] leading-[22.5px] font-400 text-secondary">
          {{ $t('invite.featureAiSubtitle') }}
        </div>

        <div class="text-[15px] leading-[22.5px] font-400 text-secondary">
          {{ $t('invite.featureAiBody1') }}
        </div>

        <div
          v-if="isZh"
          class="text-[15px] leading-[22.5px] font-400 text-secondary"
        >
          {{ $t('invite.featureAiBody2') }}
        </div>

        <NuxtLinkLocale
          v-if="link"
          :to="link"
          class="invite-agent-video-mobile__link w-fit inline-flex items-center gap-[6px] text-[var(--colors-text-text-link,#11A3FD)] text-sub-title font-400"
        >
          <span>{{ $t('查看详情') }}</span>
          <InviteChevronIcon :size="16" color="#11A3FD" />
        </NuxtLinkLocale>
      </div>
    </div>

    <div class="hidden w-full flex-1 lg:block lg:h-full">
      <div class="lg:(flex items-start justify-between gap-[40px]) xl:(h-[400px] gap-0)">
        <div class="invite-agent-video-copy lg:(min-w-0 flex-1 box-border pt-[48px] pl-[40px]) xl:(h-[400px] w-[542px] flex-none pl-[60px])">
          <h2 class="text-primary font-700 lg:(font-[Archivo] text-h4 leading-[48px])">
            {{ $t('invite.featureAiTitle') }}
          </h2>

          <!-- PC 段落区：高度随内容；段间固定 20px；justify-between 均分剩余空间 -->
          <div class="invite-feature-copy__paragraphs lg:(mt-[20px] flex flex-col justify-between gap-[20px])">
            <div class="invite-feature-copy__paragraph shrink-0 text-body text-secondary leading-[28px] font-400">
              {{ $t('invite.featureAiSubtitle') }}
            </div>
            <div class="invite-feature-copy__paragraph shrink-0 text-body text-secondary leading-[28px] font-400">
              {{ $t('invite.featureAiBody1') }}
            </div>
            <div
              v-if="isZh"
              class="invite-feature-copy__paragraph shrink-0 text-body text-secondary leading-[28px] font-400"
            >
              {{ $t('invite.featureAiBody2') }}
            </div>
          </div>

          <NuxtLinkLocale
            v-if="link"
            :to="link"
            class="mt-[20px] inline-flex items-center gap-[6px] text-[#11A3FD] text-[16px] leading-[24px] font-500"
          >
            <span>{{ $t('查看详情') }}</span>
            <InviteChevronIcon :size="20" color="#11A3FD" />
          </NuxtLinkLocale>
        </div>

        <div class="lg:(min-w-0 flex-1 flex items-center justify-end box-border h-[400px]) xl:(w-[630px] flex-none)">
          <div
            class="invite-agent-video h-full w-full overflow-hidden rounded-[16px] border-[4px] border-[rgba(255,255,255,0.4)] bg-[#030111] lg:(rounded-[20px] border-[6px])"
            :class="{ 'show-video-ui': showControls || isPaused }"
            @mouseenter="handleVideoMouseEnter"
            @mouseleave="handleVideoMouseLeave"
          >
            <video
              v-if="shouldLoadVideo && isDesktop"
              :key="inviteAgentVideoSrc"
              ref="videoRef"
              class="block bg-[#030111] object-cover"
              :src="inviteAgentVideoSrc"
              :muted="isMuted"
              loop
              playsinline
              preload="auto"
              @loadedmetadata="handleLoadedMetadata"
              @pause="isPaused = true; showControls = true"
              @play="isPaused = false"
              @timeupdate="handleTimeUpdate"
            />
            <div v-if="!showControls && !isPaused" class="invite-agent-video-remaining">
              {{ remainingTime }}
            </div>
            <div class="invite-agent-video-controls">
              <input
                class="invite-agent-video-progress"
                type="range"
                min="0"
                max="100"
                step="0.1"
                :value="progressValue"
                :style="{ background: progressBackground }"
                aria-label="视频进度"
                @input="handleSeek"
              >
              <div class="invite-agent-video-actions">
                <button
                  type="button"
                  class="invite-agent-video-play"
                  :class="{ 'is-playing': !isPaused }"
                  :aria-label="isPaused ? '播放视频' : '暂停视频'"
                  @click="toggleVideoPlayback"
                >
                  <RxIcon :name="isPaused ? 'base/rx_ic_play' : 'base/rx_ic_pause2'" size="24" />
                </button>
                <div class="invite-agent-video-meta">
                  {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                  <button
                    type="button"
                    class="invite-agent-video-volume"
                    :aria-label="isMuted ? '打开声音' : '静音'"
                    @click="toggleMute"
                  >
                    <RxIcon :name="isMuted ? 'base/rx_ic_mute' : 'base/rx_ic_sound'" size="24" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 红框正文/链接：站点默认系统字体栈；标题 h2 仍单独用 Archivo */
.invite-agent-video-mobile__body,
.invite-agent-video-copy {
  font-family: var(--family);
}

.invite-agent-video {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  isolation: isolate;
  contain: paint;
  clip-path: inset(0 round 16px);
  background-color: #030111;
  transform: translateZ(0);
}

.invite-agent-video video {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  backface-visibility: hidden;
  transform: translateZ(0);
  will-change: transform;
}

.invite-agent-video::after {
  position: absolute;
  inset: auto 0 0;
  height: 92px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(3, 1, 17, 0.56) 100%);
  content: "";
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  will-change: opacity;
  z-index: 1;
}

.invite-agent-video-controls {
  position: absolute;
  right: 24px;
  bottom: 16px;
  left: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #fff;
  opacity: 0;
  /* 隐藏时不拦截触摸，否则第二次无法点出控件 */
  pointer-events: none;
  transition: opacity 0.2s ease;
  will-change: opacity;
  z-index: 2;
}

.invite-agent-video-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.invite-agent-video-play,
.invite-agent-video-volume {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: #fff;
  cursor: pointer;
}

.invite-agent-video-play {
  width: 36px;
  height: 36px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.26);
  backdrop-filter: blur(4px);
}

/* 播放中 hover 态：对齐首页 rx-video .playing-btn */
.invite-agent-video-play.is-playing {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.2);
}

.invite-agent-video-volume {
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
}

.invite-agent-video-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  font-family: Inter;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
}

.invite-agent-video-progress {
  width: 100%;
  height: 4px;
  padding: 0;
  border: none;
  border-radius: 999px;
  appearance: none;
  cursor: pointer;
  outline: none;
}

.invite-agent-video-progress::-webkit-slider-thumb {
  width: 10px;
  height: 10px;
  border: none;
  border-radius: 999px;
  appearance: none;
  background: #fff;
}

.invite-agent-video-progress::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border: none;
  border-radius: 999px;
  background: #fff;
}

/* 未 hover 时仅展示剩余时长角标 */
.invite-agent-video-remaining {
  position: absolute;
  left: 16px;
  bottom: 18px;
  z-index: 2;
  display: flex;
  padding: 2px 10px;
  align-items: flex-end;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  pointer-events: none;
}

.invite-agent-video.show-video-ui .invite-agent-video-controls,
.invite-agent-video.show-video-ui::after {
  opacity: 1;
}

.invite-agent-video.show-video-ui .invite-agent-video-controls {
  pointer-events: auto;
}

@media (max-width: 1023px) {
  .invite-agent-video-controls {
    right: 12px;
    bottom: 10px;
    left: 12px;
    gap: 8px;
  }

  .invite-agent-video-remaining {
    left: 12px;
    bottom: 10px;
    font-size: 12px;
    line-height: 18px;
  }

  .invite-agent-video-meta {
    gap: 8px;
    font-size: 12px;
    line-height: 18px;
  }
}

@media (min-width: 1024px) {
  .invite-agent-video {
    clip-path: inset(0 round 20px);
  }
}
</style>
