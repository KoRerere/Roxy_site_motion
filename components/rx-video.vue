<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { RxIcon } from '@/components/rx-icon'

interface Props {
  src: string
  scale?: boolean
  fullscreen?: boolean
  autoplay?: boolean
  poster?: string
  autoStart?: boolean
  showClose?: boolean
}

const { scale = false, fullscreen = false, autoplay = true, autoStart = false, showClose = false } = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const videoPlayerRef = useTemplateRef('videoPlayer')
const videoRef = useTemplateRef('video')

const isMuted = ref(autoStart ? false : autoplay)
const isPlaying = ref(false)
const showControls = ref(autoStart ? true : !autoplay)
const duration = ref(0)
const currentTime = ref(0)
const isScale = ref(false)
const isPlayError = ref(false)
const isMobile = useRxMaxMd()
const isTryReLoading = ref(false)
/** 播放器容器/视频处于原生全屏（用 class 驱动样式，避免 scoped + :fullscreen 失效） */
const isNativeFullscreen = ref(false)

/** 底部控制栏高度，全屏时视频居中区域需扣除该高度（与 .controls height 一致） */
const FULLSCREEN_CONTROLS_HEIGHT = 72
const fullscreenVideoBottom = `${FULLSCREEN_CONTROLS_HEIGHT}px`

const percentage = computed(() => {
  const d = duration.value
  if (!Number.isFinite(d) || d <= 0)
    return '0%'
  const p = (currentTime.value / d) * 100
  return `${Math.min(100, Math.max(0, p))}%`
})

type VideoWithLegacyFullscreen = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void
  webkitRequestFullscreen?: () => Promise<void>
  msRequestFullscreen?: () => Promise<void>
}

/** 移动端全屏：与 roxy-agent 点击播放一致，进入系统全屏后仍显示 RxVideo 底部控制栏 */
async function requestVideoFullscreen(video: HTMLVideoElement) {
  const el = video as VideoWithLegacyFullscreen
  try {
    if (video.requestFullscreen)
      await video.requestFullscreen()
    else if (el.webkitRequestFullscreen)
      await el.webkitRequestFullscreen()
    else if (el.msRequestFullscreen)
      await el.msRequestFullscreen()
    else if (el.webkitEnterFullscreen)
      el.webkitEnterFullscreen()
  }
  catch {
    // 部分浏览器拒绝全屏时不阻断播放
  }
}

async function togglePlay() {
  const video = videoRef.value
  if (!video)
    return

  if (video.paused) {
    await video.play()

    if (isMobile.value)
      await requestVideoFullscreen(video)
  }
  else {
    video.pause()
  }
}

/** 全屏整个播放器容器，保留底部自定义控制栏；再次点击则退出全屏 */
async function onFullscreen() {
  const container = videoPlayerRef.value
  const video = videoRef.value
  if (!container && !video)
    return

  if (getFullscreenElement()) {
    try {
      if (document.exitFullscreen)
        await document.exitFullscreen()
      else
        (document as Document & { webkitExitFullscreen?: () => void }).webkitExitFullscreen?.()
    }
    catch {
      // 忽略退出全屏失败
    }
    return
  }

  const target = container ?? video!
  try {
    if (target.requestFullscreen)
      await target.requestFullscreen()
    else if ((target as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen)
      await (target as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen!()
    else if (video)
      await requestVideoFullscreen(video)
    syncNativeFullscreenState()
  }
  catch {
    // 部分浏览器拒绝全屏时不阻断播放
  }
}

function toggleVolume() {
  const video = videoRef.value
  if (!video)
    return
  isMuted.value = !video.muted
  video.muted = isMuted.value
}

function updateTime() {
  const video = videoRef.value
  if (!video)
    return
  const t = video.currentTime
  const d = duration.value
  // 保证 currentTime 不超过 duration，避免不自动播放或 loop 时显示错乱
  currentTime.value = Number.isFinite(d) && d > 0 ? Math.min(t, d) : t
}

function onPause() {
  isPlaying.value = false
  showControls.value = true
}

function onPlay() {
  isPlaying.value = true
  isPlayError.value = false
  isTryReLoading.value = false
  // 播放开始时从 video 同步一次时间和总长，避免不自动播放时状态不同步
  syncTimeFromVideo()
}

function syncDurationFromVideo() {
  if (videoRef.value) {
    const d = videoRef.value.duration
    if (Number.isFinite(d) && d >= 0) {
      duration.value = d
    }
  }
}

function syncTimeFromVideo() {
  const video = videoRef.value
  if (!video)
    return
  const t = video.currentTime
  const d = video.duration
  if (Number.isFinite(d) && d >= 0)
    duration.value = d
  currentTime.value = Number.isFinite(d) && d > 0 ? Math.min(t, d) : t
}

function onLoadedMetadata() {
  syncDurationFromVideo()
}

function seek() {
  const video = videoRef.value
  if (!video)
    return
  const d = duration.value
  const t = Number.isFinite(d) && d > 0
    ? Math.min(Math.max(0, currentTime.value), d)
    : Math.max(0, currentTime.value)
  currentTime.value = t
  video.currentTime = t
}

function handleMouseLeave() {
  if (isPlaying.value) {
    showControls.value = false
  }
}

let animation: Animation | undefined
let originalRect: DOMRect | undefined

function toggleScale() {
  const videoPlayer = videoPlayerRef.value
  if (!videoPlayer)
    return

  isScale.value = !isScale.value

  if (isScale.value) {
    // 进入全屏模式
    enterScale()
  }
  else {
    // 退出全屏模式
    exitScale()
  }
}

function enterScale() {
  const videoPlayer = videoPlayerRef.value
  if (!videoPlayer)
    return

  // 保存当前位置和尺寸
  originalRect = videoPlayer.getBoundingClientRect()

  // 计算目标尺寸（85vw宽度，保持16:9比例）
  const targetWidth = window.innerWidth * 0.85
  const targetHeight = targetWidth * (9 / 16)

  // 计算目标位置（屏幕中心）
  const targetLeft = (window.innerWidth - targetWidth) / 2
  const targetTop = (window.innerHeight - targetHeight) / 2

  // 设置初始状态
  videoPlayer.style.position = 'fixed'
  videoPlayer.style.zIndex = '1001' // 确保在mask之上
  videoPlayer.style.transformOrigin = 'top left'

  // 执行动画 - 直接动画到目标位置和尺寸
  animation = videoPlayer.animate([
    {
      left: `${originalRect.left}px`,
      top: `${originalRect.top}px`,
      width: `${originalRect.width}px`,
      height: `${originalRect.height}px`,
    },
    {
      left: `${targetLeft}px`,
      top: `${targetTop}px`,
      width: `${targetWidth}px`,
      height: `${targetHeight}px`,
    },
  ], {
    duration: 400,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fill: 'forwards',
  })
}

function exitScale() {
  if (!originalRect)
    return

  const videoPlayer = videoPlayerRef.value
  if (!videoPlayer)
    return

  // 获取当前的计算样式
  const currentStyles = window.getComputedStyle(videoPlayer)
  const currentLeft = Number.parseFloat(currentStyles.left) || 0
  const currentTop = Number.parseFloat(currentStyles.top) || 0
  const currentWidth = Number.parseFloat(currentStyles.width) || originalRect.width
  const currentHeight = Number.parseFloat(currentStyles.height) || originalRect.height

  // 执行反向动画
  const reverseAnimation = videoPlayer.animate([
    {
      left: `${currentLeft}px`,
      top: `${currentTop}px`,
      width: `${currentWidth}px`,
      height: `${currentHeight}px`,
    },
    {
      left: `${originalRect.left}px`,
      top: `${originalRect.top}px`,
      width: `${originalRect.width}px`,
      height: `${originalRect.height}px`,
    },
  ], {
    duration: 400,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fill: 'forwards',
  })

  reverseAnimation.onfinish = () => {
    // 恢复原始样式
    videoPlayer.style.position = ''
    videoPlayer.style.zIndex = ''
    videoPlayer.style.left = ''
    videoPlayer.style.top = ''
    videoPlayer.style.width = ''
    videoPlayer.style.height = ''
    videoPlayer.style.transform = ''
    videoPlayer.style.transformOrigin = ''

    animation = undefined
    originalRect = undefined
  }
}

function formatTime(time: number): string {
  if (!Number.isFinite(time) || time < 0) {
    return '0:00'
  }
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

// 剩余播放时间，格式为：0:15（避免 duration 未就绪时出现负数）
const remainingTime = computed(() => {
  const remaining = duration.value - currentTime.value
  return formatTime(Math.max(0, remaining))
})

function onPlayError() {
  isPlayError.value = true
  isTryReLoading.value = false
}

function reloadVideo() {
  isTryReLoading.value = true
  videoRef.value?.load()
  videoRef.value?.play().catch((err) => {
    console.error('Failed to replay:', err)
  })
}

// 监听空格键
useEventListener(document, 'keydown', (e) => {
  if (e.key === ' ') {
    togglePlay()
  }
})

// 监听窗口大小变化
useEventListener(window, 'resize', () => {
  if (isScale.value && originalRect) {
    // 如果在全屏状态下窗口大小发生变化，重新计算动画
    exitScale()
    // 延迟一帧后重新进入全屏，确保新的窗口尺寸已经生效
    nextTick(() => {
      isScale.value = true
      enterScale()
    })
  }
})

// 是否仍有元素处于全屏（兼容标准 / Safari / IE）
function getFullscreenElement(): Element | null {
  return document.fullscreenElement
    ?? (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement
    ?? (document as Document & { msFullscreenElement?: Element }).msFullscreenElement
    ?? null
}

function syncNativeFullscreenState() {
  const fs = getFullscreenElement()
  const player = videoPlayerRef.value
  const video = videoRef.value
  isNativeFullscreen.value = !!(fs && player && (fs === player || fs === video))
}

function onFullscreenChange() {
  syncNativeFullscreenState()
  if (getFullscreenElement())
    return
  // 已退出全屏：移动端若当前是我们在播，则同步暂停
  if (isMobile.value && videoRef.value && !videoRef.value.paused) {
    videoRef.value.pause()
  }
}

const viewPlayVideo = ref(autoStart)
function viewPlay() {
  viewPlayVideo.value = true
  togglePlay()
}

function startPlayback(options?: { mobileFullscreen?: boolean }) {
  viewPlayVideo.value = true
  showControls.value = true
  const video = videoRef.value
  if (!video)
    return
  video.muted = false
  isMuted.value = false
  video.play()
    .then(async () => {
      if (options?.mobileFullscreen && isMobile.value)
        await requestVideoFullscreen(video)
    })
    .catch((err) => {
      console.error('Failed to autoplay:', err)
    })
}

onMounted(() => {
  if (autoStart)
    nextTick(startPlayback)
})

defineExpose({ startPlayback })

useEventListener(document, 'fullscreenchange', onFullscreenChange)
useEventListener(document, 'webkitfullscreenchange', onFullscreenChange)
useEventListener(document, 'MSFullscreenChange', onFullscreenChange)
</script>

<template>
  <div
    ref="videoPlayer"
    class="video-player"
    :class="{ 'video-player--native-fullscreen': isNativeFullscreen }"
  >
    <button
      v-if="showClose"
      type="button"
      class="video-player__close"
      :aria-label="$t('关闭')"
      @click.stop="emit('close')"
    >
      <RxIcon name="base/rx_ic_delete" size="20" class="color-white" color="white" />
    </button>
    <div class="video-content" @mouseenter="showControls = true" @mouseleave="handleMouseLeave">
      <video
        ref="video"
        preload="none"
        :poster="poster" class="video" :src="src" :autoplay="autoplay" :muted="autoplay" loop
        @timeupdate="updateTime" @pause="onPause" @play="onPlay"
        @loadedmetadata="onLoadedMetadata" @durationchange="syncDurationFromVideo"
        @click.stop.prevent="togglePlay" @error="onPlayError"
      />

      <div v-if="!viewPlayVideo" class="mask flex-cc" @click="viewPlay">
        <div class="play-button">
          <div class="text-9 size-9 lg:(text-15 size-15)">
            <RxIcon name="base/rx_ic_play_full" size="1em" />
          </div>
          <span>{{ $t('查看演示') }}</span>
        </div>
      </div>

      <!-- 剩余播放时间 -->
      <template v-else>
        <div v-if="!showControls && !isPlayError" class="remaining-time">
          {{ remainingTime }}
        </div>

        <!-- 控件 -->
        <div class="controls" :class="{ hide: !showControls || isPlayError }">
          <!-- 进度条 -->
          <input v-model="currentTime" type="range" min="0" :max="duration" step="any" @input="seek">

          <div class="control-tools">
            <!-- 播放/暂停按钮 -->
            <div :class="{ 'playing-btn': isPlaying }" class="control-btn" @click.stop="togglePlay">
              <RxIcon :name="isPlaying ? 'base/rx_ic_pause2' : 'base/rx_ic_play'" size="24" />
            </div>

            <div class="control-right">
              <!-- 时间显示 -->
              <div class="time-text">
                {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
              </div>
              <div class="control-btn" @click="toggleVolume">
                <RxIcon :name="isMuted ? 'base/rx_ic_mute' : 'base/rx_ic_sound'" size="24" />
              </div>

              <div v-if="fullscreen" class="control-btn" @click.stop="onFullscreen">
                <RxIcon name="base/rx_ic_expand" size="24" />
              </div>

              <!-- 放大，新特性里面的视频用 -->
              <div v-if="scale" class="control-btn" @click="toggleScale">
                <RxIcon :name="isScale ? 'base/rx_ic_flod' : 'base/rx_ic_expand'" size="24" />
              </div>
            </div>
          </div>
        </div>

        <!-- 播放错误蒙层 -->
        <div v-if="isPlayError" class="play-error-mask">
          <div class="play-error-mask-content">
            <div class="play-error-mask-content-title">
              {{ $t('视频加载失败!') }}
            </div>
            <div class="play-error-mask-content-text">
              {{ $t('网络连接已断开。') }}
            </div>
            <div class="play-error-mask-content-btn" @click="reloadVideo">
              <RxIcon name="base/rx_ic_refresh" size="16" :class="{ loading: isTryReLoading }" />
              {{ isTryReLoading ? $t('加载中...') : $t('重试') }}
            </div>
          </div>
        </div>
      </template>
    </div>
    <slot name="after" />
  </div>
</template>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

input[type='range'] {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  appearance: none;
  background: linear-gradient(
    to right,
    #fff 0%,
    #fff v-bind(percentage),
    rgba(255, 255, 255, 0.5) v-bind(percentage),
    rgba(234, 234, 234, 0.5) 100%
  );
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  }
}

.video-player {
  position: relative;
  width: 100%;
  transform-origin: center;

  /* Figma 39915:53072，默认隐藏，由 showClose 控制 */
  &__close {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 8px;
    margin: 0;
    border: none;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.35);
    }
  }

}

/* 原生全屏布局（class 由 fullscreenchange 同步，不依赖 :fullscreen 伪类） */
.video-player--native-fullscreen {
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  background: #000;

  .video-content {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 0;
    overflow: hidden;
  }

  /* 在扣除控制栏后的区域内 object-fit 居中，避免画面视觉上偏上 */
  .video {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: v-bind(fullscreenVideoBottom);
    display: block;
    width: 100% !important;
    height: 100% !important;
    max-width: none;
    margin: 0;
    object-fit: contain;
    object-position: center center;
  }

  .controls {
    z-index: 2;
  }
}

.video-content {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.video {
  display: block;
  width: 100%;
}

.remaining-time {
  position: absolute;
  left: 16px;
  bottom: 18px;
  display: flex;
  padding: 2px 10px;
  align-items: flex-end;
  gap: 10px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
}

.controls {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  gap: 8px;
  color: #fff;
  height: 72px;
  padding: 12px 20px;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  align-self: stretch;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
  transition: opacity 0.15s ease-in-out;

  &.hide {
    opacity: 0;
  }
}

.control-tools {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.control-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.control-btn {
  cursor: pointer;
  display: flex;
  padding: 6px;
  align-items: center;
  gap: 10px;
}

.playing-btn {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.2);
}

.time-text {
  color: #fff;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  user-select: none;
}

.play-error-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
  aspect-ratio: 16/9;
  border-radius: 8px;
  background:
    linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.6) 100%),
    url(<path-to-image>) lightgray 0px -23.885px / 100.401% 124.178% no-repeat;

  .play-error-mask-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .play-error-mask-content-title {
    color: #fff;
    text-align: center;
    font-family: Inter;
    font-size: 24px;
  }

  .play-error-mask-content-text {
    color: #fff;
    text-align: center;
    font-family: Inter;
    font-size: 16px;
  }

  .play-error-mask-content-btn {
    display: flex;
    min-width: 88px;
    padding: 8px var(--spacing-2xl, 16px);
    justify-content: center;
    align-items: center;
    gap: var(--spacing-lg, 8px);
    border-radius: var(--radius-lg, 8px);
    border: 1px solid var(--colors-border-border-action, #c7d1d6);
    background: var(--colors-background-bg-action, #fff);
    /* shadow-sm */
    box-shadow:
      0px 4px 4px -1px rgba(0, 0, 0, 0.02),
      0px 1px 1px 0px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    color: #111213;
    text-align: center;
    font-family: Inter;
    font-size: var(--Font-Size-text-lg, 14px);
    font-style: normal;
    font-weight: 500;
    line-height: var(--Line-Height-text-lg, 20px);

    .loading {
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--colors-alpha-alpha-black-60, rgba(0, 0, 0, 0.6));
  color: #fff;
  cursor: pointer;
  transition: opacity 0.3s ease;
  z-index: 2;

  &:hover {
    background: var(--colors-alpha-alpha-black-40, rgba(0, 0, 0, 0.7));
  }

  .play-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: #fff;
    font-family: Inter;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 120%;
    /* 19.2px */
    transition: transform 0.3s ease;
  }

  &:hover .play-button {
    transform: scale(1.1);
  }

  // @media (min-width: 768px) {
  //   display: none;
  // }
}
</style>
