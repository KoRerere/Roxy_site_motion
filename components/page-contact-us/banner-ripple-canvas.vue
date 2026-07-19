<script setup lang="ts">
/**
 * Contact Us Banner 水波纹 — 纯 Qoder 单色相实现（CTA 卡片同款逻辑）
 * @see https://qoder.com.cn/qoderwork
 *
 * 与 Qoder 一致：rgb(108,181,249) + 径向渐变透明度递减 + 6 道错峰扩散
 * 卡片校准：1062×306 面积小于 Qoder CTA(~1290×409)，降低 stop alpha / 减少道数，避免叠加深
 */
const QODER_BLUE = [108, 181, 249] as const

/** Qoder CTA 原 stop 位置与 alpha；stop 0 改为 0，峰值外移到 ~0.12，避免圆心最浓闪点 */
const QODER_GRADIENT = [
  [0, 0],
  [0.12, 1],
  [0.28, 0.85],
  [0.5, 0.7],
  [0.72, 0.55],
  [1, 0.4],
] as const

/**
 * 卡片尺寸校准系数（仅缩放 stop alpha，保留 Qoder waveAlpha = 1 - progress）
 * PC 卡片 ~325k px² vs Qoder CTA ~528k px² → 约 0.62，取 0.52 留余量
 */
const CARD_STOP_ALPHA_SCALE = 0.52

/** 周期前 12% 淡入，消除 progress 从 1→0 跳变时的「重生闪点」 */
const BIRTH_FADE = 0.12

const RIPPLE_COLOR_STOPS: ReadonlyArray<readonly [number, number, number, number, number]> = QODER_GRADIENT.map(
  ([stop, alpha]) => [stop, QODER_BLUE[0], QODER_BLUE[1], QODER_BLUE[2], alpha * CARD_STOP_ALPHA_SCALE],
)

/** 卡片上少 1 道波纹，减轻中心叠加 */
const RIPPLE_COUNT = 5
/** 单道波纹周期（Qoder 原 10s，卡片上略加快） */
const CYCLE_MS = 15_000
const STAGGER_MS = CYCLE_MS / RIPPLE_COUNT

const canvasRef = ref<HTMLCanvasElement | null>(null)

let rafId = 0
let resizeObserver: ResizeObserver | undefined
let reducedMotionQuery: MediaQueryList | undefined
let handleResize: (() => void) | undefined

/** progress=0 时为 0，BIRTH_FADE 内 smoothstep 淡入，消除循环重生闪点 */
function birthEase(progress: number): number {
  if (progress <= 0)
    return 0
  if (progress >= BIRTH_FADE)
    return 1
  const t = progress / BIRTH_FADE
  return t * t * (3 - 2 * t)
}

function drawRipples(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const dpr = ctx.getTransform().a || 1
  const width = canvas.width / dpr
  const height = canvas.height / dpr
  const centerX = width / 2
  /** Qoder CTA：圆心略低于底边 */
  const centerYOffset = width >= 900 ? 40 : Math.max(0, width * 0.02)
  const centerY = height + centerYOffset
  const maxRadius = 1.1 * Math.hypot(centerX, centerY)
  const now = performance.now()

  ctx.clearRect(0, 0, width, height)

  /** Qoder CTA 背景：白 → #e8f0fd */
  const bgGradient = ctx.createLinearGradient(0, height, 0, 0)
  bgGradient.addColorStop(0, '#ffffff')
  bgGradient.addColorStop(0.5, '#ffffff')
  bgGradient.addColorStop(1, '#e8f0fd')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, width, height)

  for (let i = 0; i < RIPPLE_COUNT; i++) {
    const progress = ((now + STAGGER_MS * i) % CYCLE_MS) / CYCLE_MS
    /** Qoder CTA 半径曲线；透明度 = 淡出 × 出生淡入 */
    const radius = maxRadius * (0.15 + 0.9 * progress)
    const waveAlpha = (1 - progress) * birthEase(progress)
    if (waveAlpha <= 0 || radius <= 0)
      continue

    const radial = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
    for (const [stop, r, g, b, a] of RIPPLE_COLOR_STOPS) {
      radial.addColorStop(stop, `rgba(${r}, ${g}, ${b}, ${a * waveAlpha})`)
    }
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fillStyle = radial
    ctx.fill()
  }
}

function resizeCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const rect = canvas.getBoundingClientRect()
  if (!rect.width || !rect.height)
    return

  canvas.width = Math.floor(rect.width * dpr)
  canvas.height = Math.floor(rect.height * dpr)
  canvas.style.width = `${rect.width}px`
  canvas.style.height = `${rect.height}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function startAnimation() {
  const canvas = canvasRef.value
  if (!canvas)
    return

  const ctx = canvas.getContext('2d')
  if (!ctx)
    return

  const render = () => {
    drawRipples(ctx, canvas)
    if (!reducedMotionQuery?.matches)
      rafId = requestAnimationFrame(render)
  }

  handleResize = () => {
    resizeCanvas(canvas, ctx)
    if (reducedMotionQuery?.matches)
      drawRipples(ctx, canvas)
  }

  handleResize()
  render()

  resizeObserver = new ResizeObserver(handleResize)
  resizeObserver.observe(canvas)
  window.addEventListener('resize', handleResize)
}

function stopAnimation() {
  cancelAnimationFrame(rafId)
  resizeObserver?.disconnect()
  resizeObserver = undefined
  if (handleResize)
    window.removeEventListener('resize', handleResize)
  handleResize = undefined
}

onMounted(() => {
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  startAnimation()
})

onBeforeUnmount(() => {
  stopAnimation()
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="contact-us-banner-ripple"
    aria-hidden="true"
  />
</template>

<style scoped lang="scss">
.contact-us-banner-ripple {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
