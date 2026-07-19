<script setup lang="ts">
import type { Lane, Pulse } from './hero-energy-canvas-utils'
import {
  buildPulses,
  buildVerticalLane,
  drawLane,
  drawPulse,
} from './hero-energy-canvas-utils'

/** 脉冲头距路径末端小于该值时视为触达表单上缘（握点） */
const ARRIVAL_EPSILON = 6

const emit = defineEmits<{
  energyArrive: []
}>()

const rootRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasHeight = ref('100%')
/** 首帧布局测量完成后再显示，避免错误导线闪动 */
const isLayoutReady = ref(false)

let ctx: CanvasRenderingContext2D | null = null
let width = 0
let height = 0
let ratio = 1
let lanes: Lane[] = []
let pulses: Pulse[] = []
let lastFrame = 0
let animationId = 0
let resizeObserver: ResizeObserver | undefined
let reducedMotionQuery: MediaQueryList | undefined
let desktopLayoutQuery: MediaQueryList | undefined
let lastArriveAt = 0

function isMobileLayout() {
  return !desktopLayoutQuery?.matches
}

function resizeCanvas() {
  const canvas = canvasRef.value
  const root = rootRef.value
  if (!canvas || !root)
    return

  const section = root.closest('.invite-hero-section')
  const formCol = section?.querySelector('.invite-hero-form-col')
  const formShell = formCol?.querySelector('.invite-form-shell')
  const shellRect = formShell?.getBoundingClientRect()
  const rootRect = root.getBoundingClientRect()
  // 握点贴表单壳层上边框；高度与几何同帧计算，避免 style 更新后 rootRect 滞后
  const gripY = shellRect ? shellRect.top - rootRect.top : null
  const gripX = shellRect ? shellRect.left + shellRect.width * 0.5 - rootRect.left : null

  width = rootRect.width
  if (gripY !== null && shellRect) {
    height = Math.max(1, gripY + shellRect.height * 0.12)
    canvasHeight.value = `${height}px`
  }
  else {
    height = rootRect.height
    canvasHeight.value = '100%'
  }

  if (!width || !height)
    return

  ratio = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.floor(width * ratio)
  canvas.height = Math.floor(height * ratio)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  ctx = canvas.getContext('2d')
  ctx?.setTransform(ratio, 0, 0, ratio, 0, 0)

  const samples = reducedMotionQuery?.matches ? 90 : 160
  const laneCount = 13
  const centerIndex = Math.floor(laneCount / 2)
  const convergenceSpreadScale = 0.045
  const startY = height * 0.04
  // 握点 X 为表单水平中心，Y 为壳层上边框（非壳层内部偏移）
  const convergeX = gripX ?? width * 0.5
  const convergeY = gripY ?? height * 0.86
  const halfSpread = Math.min(convergeX, width - convergeX)

  // 与 PC 一致：自上缘各点向下汇聚至底部表单握点，脉冲沿路径向下抵达
  lanes = Array.from({ length: laneCount }, (_, index) => index).map((index) => {
    const factor = (index - centerIndex) / centerIndex
    const startX = convergeX + factor * halfSpread
    const targetY = convergeY
    const targetX = convergeX + width * factor * convergenceSpreadScale
    return buildVerticalLane(startY, targetY, targetX, startX, samples, 1.68)
  })

  pulses = buildPulses(lanes, !!reducedMotionQuery?.matches)
  isLayoutReady.value = true
}

/** 多根线同帧抵达时防抖，避免表单连闪 */
function triggerEnergyArrive() {
  const now = performance.now()
  if (now - lastArriveAt < 100)
    return
  lastArriveAt = now
  emit('energyArrive')
}

function animate(timestamp: number) {
  if (!ctx || !isMobileLayout())
    return

  if (!lastFrame)
    lastFrame = timestamp

  const delta = Math.min((timestamp - lastFrame) / 1000, 0.033)
  lastFrame = timestamp

  ctx.clearRect(0, 0, width, height)
  lanes.forEach(lane => drawLane(ctx!, lane))

  pulses.forEach((pulse) => {
    const lane = lanes[pulse.laneIndex]
    if (!lane)
      return

    pulse.head += pulse.speed * delta

    if (!pulse.arrived && pulse.head >= lane.length - ARRIVAL_EPSILON) {
      pulse.arrived = true
      triggerEnergyArrive()
    }

    if (pulse.head - pulse.segmentLength > lane.length + pulse.gap) {
      pulse.head = -pulse.gap
      pulse.arrived = false
    }
    drawPulse(ctx!, pulse, lanes)
  })

  animationId = requestAnimationFrame(animate)
}

function startAnimation() {
  cancelAnimationFrame(animationId)
  lastFrame = 0
  animationId = requestAnimationFrame(animate)
}

function stopAnimation() {
  cancelAnimationFrame(animationId)
}

function handleVisibilityChange() {
  if (document.hidden)
    stopAnimation()
  else
    startAnimation()
}

function handleReducedMotionChange() {
  resizeCanvas()
  if (isMobileLayout())
    startAnimation()
}

function handleLayoutBreakpointChange() {
  isLayoutReady.value = false
  if (isMobileLayout()) {
    resizeCanvas()
    startAnimation()
  }
  else {
    stopAnimation()
  }
}

function observeLayoutTargets() {
  if (!rootRef.value || typeof ResizeObserver === 'undefined')
    return

  resizeObserver = new ResizeObserver(() => {
    resizeCanvas()
  })
  resizeObserver.observe(rootRef.value)

  const section = rootRef.value.closest('.invite-hero-section')
  const formCol = section?.querySelector('.invite-hero-form-col')
  const formShell = formCol?.querySelector('.invite-form-shell')
  if (section?.classList.contains('invite-hero-section'))
    resizeObserver.observe(section)
  if (formCol)
    resizeObserver.observe(formCol)
  if (formShell)
    resizeObserver.observe(formShell)
}

onMounted(() => {
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  desktopLayoutQuery = window.matchMedia('(min-width: 1024px)')
  resizeCanvas()
  if (isMobileLayout())
    startAnimation()
  observeLayoutTargets()

  window.addEventListener('resize', resizeCanvas)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  reducedMotionQuery.addEventListener('change', handleReducedMotionChange)
  desktopLayoutQuery.addEventListener('change', handleLayoutBreakpointChange)
})

onBeforeUnmount(() => {
  stopAnimation()
  resizeObserver?.disconnect()
  window.removeEventListener('resize', resizeCanvas)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  reducedMotionQuery?.removeEventListener('change', handleReducedMotionChange)
  desktopLayoutQuery?.removeEventListener('change', handleLayoutBreakpointChange)
})
</script>

<template>
  <!-- 移动端能量导线：自上缘向下汇入表单握点，仅 <lg 显示 -->
  <div
    ref="rootRef"
    class="invite-hero-energy-canvas-mobile block lg:hidden"
    :class="{ 'is-layout-ready': isLayoutReady }"
    :style="{
      width: '100%',
      height: canvasHeight,
    }"
    aria-hidden="true"
  >
    <canvas ref="canvasRef" class="invite-hero-energy-canvas-mobile__canvas" />
  </div>
</template>

<style scoped>
.invite-hero-energy-canvas-mobile {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  overflow: hidden;
}

.invite-hero-energy-canvas-mobile__canvas {
  display: block;
  width: 100%;
  height: 100%;
  user-select: none;
}
</style>
