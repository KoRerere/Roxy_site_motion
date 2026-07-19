<script setup lang="ts">
// Canvas 光束动画：与背景 mix-blend-mode: screen 混合使用，替代 CSS 动画以改善 Firefox 等性能

interface Props {
  /** 光束整体旋转角度（度），负值=从右上往左下，绝对值越大越斜，默认 -38 */
  rotateDeg?: number
  /** 光束整体上移量，相对光束高度的比例，默认 0.12（-12%） */
  translateYPercent?: number
  /** 光束整体右移量，相对容器宽度的比例，正值往右，默认 0.08 */
  translateXPercent?: number
  /** 光束区域相对容器的扩展比例（inset -30% 即 0.3），默认 0.3 */
  insetPercent?: number
}

const props = withDefaults(defineProps<Props>(), {
  rotateDeg: -38,
  translateYPercent: 0.12,
  translateXPercent: 0.08,
  insetPercent: 0.3,
})

const containerRef = ref<HTMLElement | null>(null)
const beamCanvas = ref<HTMLCanvasElement | null>(null)

function easeInOut(t: number) {
  return t <= 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t)
}

function cycleEase(elapsed: number, period: number) {
  const x = (elapsed % period) / period
  const t = x <= 0.5 ? 2 * x : 2 * (1 - x)
  return easeInOut(t)
}

// 镭射渐变：光带加宽，柔和但有清晰中心
function createBeamGradient(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w / 2
  const cy = h / 2
  const L = Math.max(w, h) * 0.85
  const lg = ctx.createLinearGradient(cx - L, cy - L, cx + L, cy + L)
  lg.addColorStop(0, 'rgba(0,0,0,0)')
  lg.addColorStop(0.42, 'rgba(90,150,255,0)')
  lg.addColorStop(0.46, 'rgba(90,150,255,0.28)')
  lg.addColorStop(0.49, 'rgba(70,110,255,0.48)')
  lg.addColorStop(0.5, 'rgba(70,110,255,0.52)')
  lg.addColorStop(0.51, 'rgba(120,80,255,0.42)')
  lg.addColorStop(0.54, 'rgba(200,150,255,0.22)')
  lg.addColorStop(0.58, 'rgba(90,150,255,0)')
  lg.addColorStop(0.62, 'rgba(0,0,0,0)')
  return lg
}

// 白光核心：光带加宽，柔和且有一条清晰亮芯
function createCoreGradient(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w / 2
  const cy = h / 2
  const L = Math.max(w, h) * 0.85
  const lg = ctx.createLinearGradient(cx - L, cy - L, cx + L, cy + L)
  lg.addColorStop(0.44, 'rgba(255,255,255,0)')
  lg.addColorStop(0.47, 'rgba(255,255,255,0.22)')
  lg.addColorStop(0.5, 'rgba(255,255,255,0.5)')
  lg.addColorStop(0.53, 'rgba(255,255,255,0.22)')
  lg.addColorStop(0.56, 'rgba(255,255,255,0)')
  return lg
}

function createMaskGradient(
  ctx: CanvasRenderingContext2D,
  h: number,
  stops: [number, number][],
) {
  const mg = ctx.createLinearGradient(0, 0, 0, h)
  for (const [pos, alpha] of stops) mg.addColorStop(pos, `rgba(0,0,0,${alpha})`)
  return mg
}

// 垂直遮罩：只保留正中间更短一段，光照长度更短（沿光束方向 0=一端 1=另一端）
const MASK_LONG: [number, number][] = [[0, 0], [0.47, 1], [0.53, 1], [0.6, 0.25], [1, 0]]
const MASK_SHORT: [number, number][] = [[0, 0], [0.47, 1], [0.52, 1], [0.6, 0.25], [1, 0]]
const MASK_CORE: [number, number][] = [[0, 0], [0.47, 1], [0.52, 1], [0.6, 0.25], [1, 0]]

let rafId = 0
let offscreenCanvas: HTMLCanvasElement | null = null
let offscreenCtx: CanvasRenderingContext2D | null = null
const startTime = typeof performance !== 'undefined' ? performance.now() : 0

function resizeCanvas() {
  const container = containerRef.value
  const canvas = beamCanvas.value
  if (!container || !canvas)
    return
  const cw = container.clientWidth
  const ch = container.clientHeight
  const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)
  canvas.width = cw * dpr
  canvas.height = ch * dpr
  canvas.style.width = `${cw}px`
  canvas.style.height = `${ch}px`
  if (!offscreenCanvas || offscreenCanvas.width !== canvas.width || offscreenCanvas.height !== canvas.height) {
    offscreenCanvas = document.createElement('canvas')
    offscreenCanvas.width = canvas.width
    offscreenCanvas.height = canvas.height
    offscreenCtx = offscreenCanvas.getContext('2d')
  }
}

function drawBeams() {
  const canvas = beamCanvas.value
  const container = containerRef.value
  if (!canvas || !container || !offscreenCanvas || !offscreenCtx)
    return
  const ctx = canvas.getContext('2d')
  if (!ctx)
    return

  const cw = container.clientWidth
  const ch = container.clientHeight
  const dpr = canvas.width / cw
  const w = cw * dpr
  const h = ch * dpr

  const inset = props.insetPercent
  const beamW = (1 + 2 * inset) * cw * dpr
  const beamH = (1 + 2 * inset) * ch * dpr
  const elapsed = (typeof performance !== 'undefined' ? performance.now() : 0) - startTime

  const eLong = cycleEase(elapsed, 9600)
  const eShort = cycleEase(elapsed, 7900)
  const eCore = cycleEase(elapsed, 8800)

  const txLong = -4 + 8 * eLong
  const tyLong = -2 + 4 * eLong
  const sLong = 1.02 + 0.04 * eLong

  const txShort = 2 + (-5.5) * eShort
  const tyShort = -2 + 4.8 * eShort
  const sShort = 1.01 + 0.04 * eShort

  const txCore = 1.2 + (-3.8) * eCore
  const tyCore = -1.2 + 3.4 * eCore
  const sCore = 1 + 0.04 * eCore

  const rad = (props.rotateDeg * Math.PI) / 180
  const tyOffsetPx = props.translateYPercent * beamH
  const txOffsetPx = props.translateXPercent * cw * dpr

  function applyBeamWrapTransform(c: CanvasRenderingContext2D) {
    c.translate(w / 2, h / 2)
    c.translate(txOffsetPx, 0)
    c.rotate(rad)
    c.translate(-w / 2 - cw * inset * dpr, -h / 2 - ch * inset * dpr)
    c.translate(0, -tyOffsetPx)
  }

  function drawLayer(
    c: CanvasRenderingContext2D,
    tx: number,
    ty: number,
    s: number,
    gradient: CanvasGradient,
    maskStops: [number, number][],
    opacity: number,
  ) {
    const cx = beamW / 2
    const cy = beamH / 2
    const txx = (tx / 100) * beamW
    const tyy = (ty / 100) * beamH
    c.save()
    c.translate(cx, cy)
    c.scale(s, s)
    c.translate(-cx, -cy)
    c.translate(txx, tyy)
    c.globalAlpha = opacity
    c.fillStyle = gradient
    c.fillRect(0, 0, beamW, beamH)
    c.globalAlpha = 1
    c.globalCompositeOperation = 'destination-in'
    c.fillStyle = createMaskGradient(c, beamH, maskStops)
    c.fillRect(0, 0, beamW, beamH)
    c.globalCompositeOperation = 'source-over'
    c.restore()
  }

  const beamGrad = createBeamGradient(ctx, beamW, beamH)
  const BEAM_FILTER = 'blur(10px) saturate(200%) contrast(150%)'
  const CORE_FILTER = 'blur(3px) contrast(180%)'

  ctx.clearRect(0, 0, w, h)

  // long：先画到 offscreen，再以 filter 绘制到主画布（与 CSS .beamLayer filter 一致）
  offscreenCtx!.clearRect(0, 0, w, h)
  offscreenCtx!.save()
  applyBeamWrapTransform(offscreenCtx!)
  drawLayer(offscreenCtx!, txLong, tyLong, sLong, beamGrad, MASK_LONG, 0.62)
  offscreenCtx!.restore()
  ctx.filter = BEAM_FILTER
  ctx.drawImage(offscreenCanvas, 0, 0)
  ctx.filter = 'none'

  // short：同上，再 lighter 叠上去
  offscreenCtx!.clearRect(0, 0, w, h)
  offscreenCtx!.save()
  applyBeamWrapTransform(offscreenCtx!)
  drawLayer(offscreenCtx!, txShort, tyShort, sShort, createBeamGradient(offscreenCtx!, beamW, beamH), MASK_SHORT, 0.44)
  offscreenCtx!.restore()
  ctx.filter = BEAM_FILTER
  ctx.globalCompositeOperation = 'lighter'
  ctx.drawImage(offscreenCanvas, 0, 0)
  ctx.globalCompositeOperation = 'source-over'
  ctx.filter = 'none'

  // core：白光用 blur(6px) contrast(190%)，与 CSS .core 一致
  offscreenCtx!.clearRect(0, 0, w, h)
  offscreenCtx!.save()
  applyBeamWrapTransform(offscreenCtx!)
  drawLayer(offscreenCtx!, txCore, tyCore, sCore, createCoreGradient(offscreenCtx!, beamW, beamH), MASK_CORE, 0.82)
  offscreenCtx!.restore()
  ctx.filter = CORE_FILTER
  ctx.globalCompositeOperation = 'lighter'
  ctx.drawImage(offscreenCanvas, 0, 0)
  ctx.globalCompositeOperation = 'source-over'
  ctx.filter = 'none'

  rafId = requestAnimationFrame(drawBeams)
}

function startBeamAnimation() {
  resizeCanvas()
  rafId = requestAnimationFrame(drawBeams)
}

function stopBeamAnimation() {
  if (rafId)
    cancelAnimationFrame(rafId)
  rafId = 0
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  nextTick(() => {
    startBeamAnimation()
    if (typeof ResizeObserver !== 'undefined' && containerRef.value) {
      resizeObserver = new ResizeObserver(() => resizeCanvas())
      resizeObserver.observe(containerRef.value)
    }
  })
})

onUnmounted(() => {
  stopBeamAnimation()
  if (resizeObserver && containerRef.value) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<template>
  <div ref="containerRef" class="beam-canvas-wrap">
    <canvas ref="beamCanvas" class="beam-canvas" aria-hidden="true" />
  </div>
</template>

<style scoped lang="scss">
.beam-canvas-wrap {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.beam-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  mix-blend-mode: screen;
  pointer-events: none;
}
</style>
