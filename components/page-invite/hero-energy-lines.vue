<script setup lang="ts">
/**
 * Invite Hero 能量导线（13 根）
 * - 画布上扩至 Header Logo，下抵 Hero 底边
 * - 左摊右握：左侧摊到 Logo / 底边（旁线长），右侧握于同一点（中线短、直线）
 */
interface EnergyLine {
  d: string
  pathLen: number
  straight?: boolean
  charge?: boolean
  duration?: number
  delay?: number
  variant?: 'cyan' | 'pink'
}

const VIEW_W = 2400

const rootRef = ref<HTMLElement | null>(null)

/** 上扩高度：导线层伸入固定 Header / Logo 区域 */
const headerExtend = ref(80)

/** 动态画布高度（含上扩），与 viewBox 对齐 */
const canvasViewH = ref(700)

const inject = ref({ x: 1680, y: 350 })
const outerTopY = ref(36)
const outerBottomY = ref(680)

const INNER_FAN_GAP = [34, 58, 86, 118, 154] as const

/**
 * 左侧按 startY 摊开；右侧全部汇入握点 (ix, iy)
 * 旁线 startY 离中心越远 → 路径越长；中间直线最短
 */
function buildCurvedPath(ix: number, iy: number, startY: number, isTop: boolean) {
  const c1x = ix * 0.09
  const inward = Math.abs(startY - iy) * 0.44
  const c1y = isTop ? iy - inward : iy + inward
  const c2x = ix * 0.96
  const c2y = iy + (startY - iy) * 0.04
  return `M 0 ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ix} ${iy}`
}

/** 估算路径长度，驱动充电动画（外线长、内线短） */
function estimatePathLen(ix: number, iy: number, startY: number) {
  const dy = Math.abs(startY - iy)
  return Math.round(Math.sqrt(ix * ix + dy * dy * 0.72) * 1.08)
}

function scaleDurationByLength(base: number, pathLen: number, centerLen: number) {
  return base * (pathLen / centerLen)
}

function buildEnergyLines(ix: number, iy: number, vh: number, topY: number, bottomY: number): EnergyLine[] {
  const lines: EnergyLine[] = []
  const centerLen = ix

  // 中间直线：最短
  lines.push({
    d: `M 0 ${iy} L ${ix} ${iy}`,
    pathLen: centerLen,
    straight: true,
    charge: true,
    variant: 'cyan',
    duration: 5.6,
    delay: 0,
  })

  for (let i = 0; i < 6; i++) {
    const startY = i === 5 ? topY : iy - INNER_FAN_GAP[i]!
    const pathLen = estimatePathLen(ix, iy, startY)
    lines.push({
      d: buildCurvedPath(ix, iy, startY, true),
      pathLen,
      charge: i === 2,
      variant: i % 2 === 0 ? 'pink' : 'cyan',
      duration: scaleDurationByLength(5.8, pathLen, centerLen),
      delay: -(i + 1) * 0.55,
    })
  }

  for (let i = 0; i < 6; i++) {
    const startY = i === 5 ? bottomY : iy + INNER_FAN_GAP[i]!
    const pathLen = estimatePathLen(ix, iy, startY)
    lines.push({
      d: buildCurvedPath(ix, iy, startY, false),
      pathLen,
      charge: i === 2,
      variant: i % 2 === 0 ? 'cyan' : 'pink',
      duration: scaleDurationByLength(6.0, pathLen, centerLen),
      delay: -(i + 1) * 0.65,
    })
  }

  return lines
}

const energyLines = computed(() =>
  buildEnergyLines(inject.value.x, inject.value.y, canvasViewH.value, outerTopY.value, outerBottomY.value),
)

const emit = defineEmits<{
  energyArrive: []
}>()

function onChargeArrive() {
  emit('energyArrive')
}

/** 读取 Header Logo 垂直中心，作为最上一根线的起点 */
function measureLogoCenterY(canvasTop: number): number | null {
  const logo = document.querySelector('.rx-header img[alt="Roxy浏览器"]')
    ?? document.querySelector('.rx-header header img')
  if (!logo)
    return null
  const rect = logo.getBoundingClientRect()
  return rect.top + rect.height / 2 - canvasTop
}

function updateLayout() {
  const stack = rootRef.value?.parentElement
  const section = stack?.querySelector('.invite-hero-section')
  const formCol = stack?.querySelector('.invite-hero-form-col')
  if (!rootRef.value || !stack || !section || !formCol)
    return

  const heroRect = section.getBoundingClientRect()
  const logo = document.querySelector('.rx-header header img, .rx-header img[alt="Roxy浏览器"]')
  const logoRect = logo?.getBoundingClientRect()
  const logoTop = logoRect?.top ?? 24

  // 上扩量：Hero 顶到 Logo 顶，留 8px 余量
  headerExtend.value = Math.max(72, Math.round(heroRect.top - logoTop + 8))

  const canvasRect = rootRef.value.getBoundingClientRect()
  const fRect = formCol.getBoundingClientRect()
  const w = canvasRect.width
  const h = canvasRect.height
  if (!w || !h)
    return

  canvasViewH.value = h

  // 注入点：表单左缘中心，坐标与动态 viewBox 高度一致
  inject.value = {
    x: ((fRect.left - canvasRect.left) / w) * VIEW_W,
    y: fRect.top + fRect.height / 2 - canvasRect.top,
  }

  const logoY = measureLogoCenterY(canvasRect.top)
  outerTopY.value = logoY ?? h * 0.05
  outerBottomY.value = Math.min(h - 12, heroRect.bottom - canvasRect.top - 8)
}

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  updateLayout()
  const stack = rootRef.value?.parentElement
  if (!stack || typeof ResizeObserver === 'undefined')
    return
  resizeObserver = new ResizeObserver(() => updateLayout())
  resizeObserver.observe(stack)
  const section = stack.querySelector('.invite-hero-section')
  const formCol = stack.querySelector('.invite-hero-form-col')
  if (section)
    resizeObserver.observe(section)
  if (formCol)
    resizeObserver.observe(formCol)
  window.addEventListener('resize', updateLayout)
  window.addEventListener('scroll', updateLayout, { passive: true })
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', updateLayout)
  window.removeEventListener('scroll', updateLayout)
})
</script>

<template>
  <!-- z-50：低于 Header(z-100)，高于 Hero 背景；上扩覆盖 Logo 区域 -->
  <div
    ref="rootRef"
    class="invite-hero-energy-lines pointer-events-none absolute left-0 right-0 z-[50] hidden overflow-hidden lg:block"
    :style="{
      top: `-${headerExtend}px`,
      height: `calc(100% + ${headerExtend}px)`,
    }"
    aria-hidden="true"
  >
    <svg
      class="h-full w-full select-none"
      :viewBox="`0 0 ${VIEW_W} ${canvasViewH}`"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="invite-track-fade-in"
          gradientUnits="userSpaceOnUse"
          x1="0"
          :y1="inject.y"
          x2="280"
          :y2="inject.y"
        >
          <stop offset="0%" stop-color="#fff" stop-opacity="0" />
          <stop offset="18%" stop-color="#fff" stop-opacity="0" />
          <stop offset="42%" stop-color="#fff" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#fff" stop-opacity="0.16" />
        </linearGradient>

        <linearGradient
          id="invite-charge-cyan"
          gradientUnits="userSpaceOnUse"
          x1="0"
          :y1="inject.y"
          :x2="inject.x"
          :y2="inject.y"
        >
          <stop offset="0%" stop-color="#00F0FF" stop-opacity="0" />
          <stop offset="12%" stop-color="#00F0FF" stop-opacity="0.15" />
          <stop offset="55%" stop-color="#00F0FF" stop-opacity="0.85" />
          <stop offset="82%" stop-color="#FFFFFF" stop-opacity="1" />
          <stop offset="100%" stop-color="#00F0FF" stop-opacity="0" />
        </linearGradient>

        <linearGradient
          id="invite-charge-pink"
          gradientUnits="userSpaceOnUse"
          x1="0"
          :y1="inject.y"
          :x2="inject.x"
          :y2="inject.y"
        >
          <stop offset="0%" stop-color="#FF00E5" stop-opacity="0" />
          <stop offset="12%" stop-color="#FF00E5" stop-opacity="0.12" />
          <stop offset="55%" stop-color="#E301B2" stop-opacity="0.9" />
          <stop offset="82%" stop-color="#F86F8F" stop-opacity="1" />
          <stop offset="100%" stop-color="#FF00E5" stop-opacity="0" />
        </linearGradient>

        <filter id="invite-charge-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <clipPath id="invite-lines-clip">
          <rect x="0" y="0" :width="inject.x + 2" :height="canvasViewH" />
        </clipPath>
      </defs>

      <g clip-path="url(#invite-lines-clip)">
        <g v-for="(line, index) in energyLines" :key="index">
          <path
            :d="line.d"
            class="invite-energy-track"
            stroke="url(#invite-track-fade-in)"
            :stroke-width="line.straight ? 0.9 : 0.75"
          />
          <path
            v-if="line.charge"
            :d="line.d"
            class="invite-energy-charge"
            :class="line.variant === 'cyan' ? 'invite-energy-charge--cyan' : 'invite-energy-charge--pink'"
            :style="{
              '--charge-duration': `${line.duration}s`,
              '--charge-delay': `${line.delay}s`,
              '--path-len': `${line.pathLen}`,
              'stroke-dasharray': `56 ${line.pathLen - 56}`,
            }"
            :stroke-width="line.straight ? 2.5 : 2"
            filter="url(#invite-charge-glow)"
            @animationiteration="onChargeArrive"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.invite-energy-track {
  fill: none;
  stroke-linecap: round;
}

.invite-energy-charge {
  fill: none;
  stroke-linecap: round;
  stroke-dashoffset: var(--path-len, 1600);
  animation: invite-energy-inject var(--charge-duration, 5.6s) linear infinite;
  animation-delay: var(--charge-delay, 0s);
}

.invite-energy-charge--cyan {
  stroke: url(#invite-charge-cyan);
}

.invite-energy-charge--pink {
  stroke: url(#invite-charge-pink);
}

@keyframes invite-energy-inject {
  0% {
    stroke-dashoffset: var(--path-len, 1600);
    opacity: 0;
  }
  8% {
    opacity: 0.35;
  }
  18% {
    opacity: 1;
  }
  92% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  96% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .invite-energy-charge {
    animation: none;
    stroke-dashoffset: 0;
    opacity: 0.3;
  }
}
</style>
