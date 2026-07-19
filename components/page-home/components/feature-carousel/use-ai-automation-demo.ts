import type { FeatureCarouselAutoplayControl } from './config'
import posterImgEn from '@/assets/images/home/mcp-agent/poster-en.png?format=avif'
import posterImgZh from '@/assets/images/home/mcp-agent/poster-zh.png?format=avif'
import { featureCarouselAutoplayKey } from './config'

interface DesktopVideoInstance { startPlayback: () => void }
interface MobileVideoInstance { startPlayback: (options?: { mobileFullscreen?: boolean }) => void }

/** 模块级状态：slide-copy CTA 与 ai-automation-visual 共用同一播放器 */
const showDesktopVideo = ref(false)
const showMobilePlayer = ref(false)
const activeCardId = ref<string | null>(null)

const activeVideoSrc = ref<string | null>(null)
const activeVideoPoster = ref<string | null>(null)
const desktopVideoRef = shallowRef<DesktopVideoInstance | null>(null)
const mobileVideoRef = shallowRef<MobileVideoInstance | null>(null)

let mobileFullscreenCleanup: (() => void) | undefined

function getFullscreenElement(): Element | null {
  return document.fullscreenElement
    ?? (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement
    ?? null
}

function clearMobileFullscreenListeners() {
  mobileFullscreenCleanup?.()
  mobileFullscreenCleanup = undefined
}

/**
 * AI 自动化 Demo 视频（与 ai-automation-visual 一致）
 * 视频路径：zh → mcp-zh.mp4，其余 → mcp-en.mp4
 */
export function useAiAutomationDemo() {
  const { locale } = useRxI18n()
  const isMobile = useRxBreakpoints().smaller('md')
  const carouselAutoplay = inject<FeatureCarouselAutoplayControl | null>(
    featureCarouselAutoplayKey,
    null,
  )

  const defaultVideoSrc = computed(() =>
    locale.value === 'zh' ? '/home/mcp-agent/mcp-zh.mp4' : '/home/mcp-agent/mcp-en.mp4',
  )
  const defaultVideoPoster = computed(() =>
    locale.value === 'zh' ? posterImgZh : posterImgEn,
  )
  const videoSrc = computed(() => activeVideoSrc.value ?? defaultVideoSrc.value)
  const videoPoster = computed(() => activeVideoPoster.value ?? defaultVideoPoster.value)

  function setActiveDemoMedia(video?: string, poster?: string) {
    activeVideoSrc.value = video ?? null
    activeVideoPoster.value = poster ?? null
  }

  function clearActiveDemoMedia() {
    activeVideoSrc.value = null
    activeVideoPoster.value = null
  }

  function openDesktopDemo(
    cardId: string | null = null,
    video?: string,
    poster?: string,
  ) {
    setActiveDemoMedia(video, poster)
    activeCardId.value = cardId
    showDesktopVideo.value = true
    carouselAutoplay?.pauseAutoplay()
    nextTick(() => desktopVideoRef.value?.startPlayback())
  }

  async function waitForMobileVideoRef(attempts = 12): Promise<MobileVideoInstance | null> {
    for (let i = 0; i < attempts; i++) {
      if (mobileVideoRef.value)
        return mobileVideoRef.value
      await nextTick()
    }
    return null
  }

  async function openMobileDemo(video?: string, poster?: string) {
    setActiveDemoMedia(video, poster)
    carouselAutoplay?.pauseAutoplay()
    clearMobileFullscreenListeners()
    showMobilePlayer.value = true

    const onFullscreenChange = () => {
      if (!getFullscreenElement())
        closeMobileDemo()
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('webkitfullscreenchange', onFullscreenChange)
    mobileFullscreenCleanup = () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
    }

    const player = await waitForMobileVideoRef()
    if (!player) {
      closeMobileDemo()
      return
    }

    try {
      player.startPlayback({ mobileFullscreen: true })
    }
    catch {
      closeMobileDemo()
    }
  }

  /** CTA「观看 Demo」：按端打开对应播放器，使用 MCP 默认视频 */
  function openDemoFromCta() {
    clearActiveDemoMedia()
    if (isMobile.value)
      openMobileDemo()
    else
      openDesktopDemo()
  }

  function closeMobileDemo() {
    showMobilePlayer.value = false
    clearMobileFullscreenListeners()
    clearActiveDemoMedia()
    carouselAutoplay?.resumeAutoplay()
  }

  function closeDesktopDemo() {
    showDesktopVideo.value = false
    activeCardId.value = null
    clearActiveDemoMedia()
    carouselAutoplay?.resumeAutoplay()
  }

  function cleanupDemoPlayers() {
    if (showDesktopVideo.value)
      closeDesktopDemo()
    if (showMobilePlayer.value)
      closeMobileDemo()
    clearMobileFullscreenListeners()
  }

  return {
    showDesktopVideo,
    showMobilePlayer,
    activeCardId,
    isMobile,
    videoSrc,
    videoPoster,
    desktopVideoRef,
    mobileVideoRef,
    openDesktopDemo,
    openMobileDemo,
    openDemoFromCta,
    closeDesktopDemo,
    closeMobileDemo,
    cleanupDemoPlayers,
  }
}
