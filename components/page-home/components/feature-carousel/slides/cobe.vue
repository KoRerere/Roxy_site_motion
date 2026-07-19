<script setup lang="ts">
import type { Arc, Globe, Marker } from 'cobe'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useId,
} from 'vue'
import RxIcon from '@/components/rx-icon/svg-icon.vue'

const props = defineProps<{
  cobeLeft?: boolean
}>()

const globeOffset = computed<[number, number]>(() =>
  props.cobeLeft ? [-90, 60] : [0, 0],
)
const globeScale = computed(() => (props.cobeLeft ? 1.2 : 1))
const thetaBase = computed(() => (props.cobeLeft ? 0.2 : 0.14))

const canvasRef = ref<HTMLCanvasElement | null>(null)
const globeShellRef = ref<HTMLDivElement | null>(null)
/** SVG textPath 需全局唯一 id（页面上多块 globe 时） */
const orbitPathId = `cobe-orbit-${useId().replace(/[^\w-]/g, '')}`
const labelHostRef = ref<HTMLDivElement | null>(null)
const globeRef = shallowRef<Globe | null>(null)
const teleportTarget = shallowRef<HTMLElement | null>(null)
const isMdWidth = useRxMaxMd()
const { isZh } = useRxI18n()

/** 中文用「万」，其他语言用 M */
function formatIpCountLabel(wan: number): string {
  if (isZh.value)
    return `${wan}万+IPs`
  return `${wan}M+IPs`
}

const PHI_STEP = 0.0028
const PHI_DRAG_SENS = 0.005
const THETA_DRAG_SENS = 0.0025

function clampThetaUser(v: number) {
  return Math.max(-0.35, Math.min(0.35, v))
}

/** 与 [COBE 官网](https://cobe.vercel.app/) default demo 一致的环形文案 */
const ORBIT_REPEAT_PHRASE
  = `High-Reputation Global Proxies Trusted by ${isZh.value ? '3w+' : '3M+'} Cross-Border Professionals`
const orbitTickerText = ORBIT_REPEAT_PHRASE.repeat(4)

type ArcDef = Arc & { fromId: string, toId: string, label: string }

/** cobe Marker.color 为 0–1，与标签背景 / 箭头共用 */
function markerLabelAccentStyle(rgb: NonNullable<Marker['color']>) {
  const [r, g, b] = rgb.map(c =>
    Math.round(Math.min(1, Math.max(0, c)) * 255),
  )
  return { '--cobe-marker-lbl-accent': `rgb(${r} ${g} ${b})` }
}

/** 颜色按地理簇拉开色相；ipCountWan 为中文「万」单位，展示时按语言格式化 */
const markerDefsBase: (Marker & { ipCountWan: number })[] = [
  {
    id: 'US',
    location: [38.8951, -77.0364],
    size: 0.042,
    color: [0.95, 0.32, 0.42],
    ipCountWan: 16.2,
  },
  {
    id: 'CA',
    location: [45.4215, -75.6972],
    size: 0.036,
    color: [0.14, 0.42, 0.96],
    ipCountWan: 10.1,
  },
  {
    id: 'MX',
    location: [19.4326, -99.1332],
    size: 0.034,
    color: [0.62, 0.92, 0.28],
    ipCountWan: 7.6,
  },
  {
    id: 'HK',
    location: [22.3193, 114.1694],
    size: 0.036,
    color: [0.15, 0.88, 0.95],
    ipCountWan: 5.8,
  },
  {
    id: 'JP',
    location: [35.6762, 139.6503],
    size: 0.04,
    color: [0.98, 0.52, 0.78],
    ipCountWan: 4.9,
  },
  {
    id: 'AE',
    location: [24.4539, 54.3773],
    size: 0.035,
    color: [0.96, 0.62, 0.38],
    ipCountWan: 4.3,
  },
  {
    id: 'SG',
    location: [1.3521, 103.8198],
    size: 0.04,
    color: [0.98, 0.48, 0.14],
    ipCountWan: 3.8,
  },
  {
    id: 'KR',
    location: [37.5665, 126.978],
    size: 0.038,
    color: [0.78, 0.22, 0.68],
    ipCountWan: 3.4,
  },
  {
    id: 'ID',
    location: [-6.2088, 106.8456],
    size: 0.035,
    color: [0.12, 0.74, 0.48],
    ipCountWan: 3.1,
  },
  {
    id: 'PH',
    location: [14.5995, 120.9842],
    size: 0.034,
    color: [0.58, 0.95, 0.66],
    ipCountWan: 2.8,
  },
  {
    id: 'IN',
    location: [28.6139, 77.209],
    size: 0.039,
    color: [0.92, 0.62, 0.88],
    ipCountWan: 2.55,
  },
  {
    id: 'TH',
    location: [13.7563, 100.5018],
    size: 0.034,
    color: [0.48, 0.28, 0.92],
    ipCountWan: 2.35,
  },
  {
    id: 'GB',
    location: [51.5072, -0.1276],
    size: 0.038,
    color: [0.38, 0.58, 0.52],
    ipCountWan: 2.1,
  },
  {
    id: 'FR',
    location: [48.8566, 2.3522],
    size: 0.036,
    color: [0.9, 0.24, 0.38],
    ipCountWan: 1.9,
  },
  {
    id: 'DE',
    location: [52.52, 13.405],
    size: 0.036,
    color: [0.95, 0.76, 0.22],
    ipCountWan: 1.7,
  },
  {
    id: 'IT',
    location: [41.9028, 12.4964],
    size: 0.034,
    color: [0.2, 0.82, 0.42],
    ipCountWan: 1.5,
  },
  {
    id: 'ES',
    location: [40.4168, -3.7038],
    size: 0.034,
    color: [0.52, 0.55, 0.96],
    ipCountWan: 1.3,
  },
  {
    id: 'AU',
    location: [-35.2809, 149.13],
    size: 0.035,
    color: [0.68, 0.86, 0.98],
    ipCountWan: 1.1,
  },
  {
    id: 'BR',
    location: [-15.7939, -47.8828],
    size: 0.035,
    color: [0.18, 0.88, 0.52],
    ipCountWan: 0.85,
  },
  {
    id: 'ZA',
    location: [-25.7479, 28.2293],
    size: 0.032,
    color: [0.72, 0.48, 0.34],
    ipCountWan: 0.65,
  },
]

const markerDefs = computed(() =>
  markerDefsBase.map(({ ipCountWan, ...marker }) => ({
    ...marker,
    label: formatIpCountLabel(ipCountWan),
  })),
)

const arcDefsBase: Omit<ArcDef, 'label'>[] = [
  {
    id: 'US-JP',
    fromId: 'US',
    toId: 'JP',
    from: [38.8951, -77.0364],
    to: [35.6762, 139.6503],
    color: [0.55, 0.75, 1],
  },
  {
    id: 'GB-US',
    fromId: 'GB',
    toId: 'US',
    from: [51.5072, -0.1276],
    to: [38.8951, -77.0364],
    color: [0.95, 0.55, 0.5],
  },
  {
    id: 'AE-SG',
    fromId: 'AE',
    toId: 'SG',
    from: [24.4539, 54.3773],
    to: [1.3521, 103.8198],
    color: [0.75, 0.6, 1],
  },
  {
    id: 'SG-AU',
    fromId: 'SG',
    toId: 'AU',
    from: [1.3521, 103.8198],
    to: [-35.2809, 149.13],
    color: [0.45, 0.9, 0.85],
  },
  {
    id: 'JP-AU',
    fromId: 'JP',
    toId: 'AU',
    from: [35.6762, 139.6503],
    to: [-35.2809, 149.13],
    color: [0.5, 0.95, 0.65],
  },
  {
    id: 'BR-US',
    fromId: 'BR',
    toId: 'US',
    from: [-15.7939, -47.8828],
    to: [38.8951, -77.0364],
    color: [1, 0.75, 0.45],
  },
  {
    id: 'DE-JP',
    fromId: 'DE',
    toId: 'JP',
    from: [52.52, 13.405],
    to: [35.6762, 139.6503],
    color: [0.9, 0.65, 0.85],
  },
  {
    id: 'ZA-GB',
    fromId: 'ZA',
    toId: 'GB',
    from: [-25.7479, 28.2293],
    to: [51.5072, -0.1276],
    color: [0.65, 0.7, 1],
  },
]

const arcDefs: ArcDef[] = arcDefsBase.map(row => ({
  ...row,
  label: `${row.fromId} → ${row.toId}`,
}))

const markers: Marker[] = markerDefsBase.map(({ ipCountWan: _ip, ...m }) => m)
/** 仅传 cobe 支持的字段；弧中点锚点为 `--cobe-arc-${id}`，与文档一致 */
const arcs: Arc[] = arcDefs.map(
  ({ label: _l, fromId: _f, toId: _t, ...a }) => a,
)

/** 当前 globe 实例写入的 :root 可见性样式（避免首页多块 cobe 互相覆盖） */
let cobeVisibilityStyleEl: HTMLStyleElement | null = null

function findInstanceCobeVisibilityStyleEl(): HTMLStyleElement | null {
  const styles = [...document.querySelectorAll('style')].filter(
    (s): s is HTMLStyleElement =>
      s instanceof HTMLStyleElement
      && !!s.textContent?.includes('--cobe-visible-'),
  )
  return styles.at(-1) ?? null
}

function patchCobeVisibleVars() {
  if (!cobeVisibilityStyleEl)
    cobeVisibilityStyleEl = findInstanceCobeVisibilityStyleEl()
  const el = cobeVisibilityStyleEl
  if (!el?.textContent?.includes(':N'))
    return
  el.textContent = el.textContent.replace(
    /(--cobe-visible(?:-arc)?-[^:]+):N\b/g,
    '$1:1',
  )
}

function readAnchorName(el: HTMLElement): string | null {
  const raw
    = el.style.anchorName
      || el.style.cssText.match(/anchor-name:\s*([^;]+)/i)?.[1]
  return raw ? String(raw).trim() : null
}

function resolveVisibleCssVar(varName: string): number {
  const styleText = cobeVisibilityStyleEl?.textContent
  if (!styleText)
    return 0
  const escaped = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = styleText.match(new RegExp(`${escaped}:([^;\\}]+)`))
  const raw = match?.[1]?.trim() ?? ''
  if (raw === '1' || raw === 'N')
    return 1
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? n : 0
}

/**
 * 不依赖 CSS Anchor API：按 cobe 写入的 1×1 锚点 div 贴标签。
 * 注意：createGlobe 会在 canvas 外包一层 position:relative 的 div，锚点挂在该层上（见 cobe 源码 insertBefore + append），
 * 必须用 canvas.parentElement 遍历，不能用更外层的 globeShellRef。
 */
function syncDomLabels(anchorRoot: HTMLElement, host: HTMLElement) {
  const hr = host.getBoundingClientRect()

  for (const m of markerDefs.value) {
    const el = host.querySelector(
      `[data-lbl="m-${m.id}"]`,
    ) as HTMLElement | null
    if (!el)
      continue
    const want = `--cobe-${m.id}`
    let anchor: HTMLElement | null = null
    for (let i = 0; i < anchorRoot.children.length; i++) {
      const c = anchorRoot.children[i]!
      if (c === host || c.tagName === 'CANVAS')
        continue
      if (c.tagName !== 'DIV')
        continue
      const name = readAnchorName(c as HTMLElement)
      if (name === want) {
        anchor = c as HTMLElement
        break
      }
    }
    if (!anchor) {
      el.style.opacity = '0'
      continue
    }
    const ar = anchor.getBoundingClientRect()
    const cx = ar.left + ar.width / 2 - hr.left
    const top = ar.top - hr.top
    el.style.left = `${cx}px`
    el.style.top = `${top}px`
    el.style.transform = 'translate(-50%, calc(-100% - 8px))'
    el.style.opacity = String(resolveVisibleCssVar(`--cobe-visible-${m.id}`))
  }

  for (const a of arcDefs) {
    const el = host.querySelector(
      `[data-lbl="a-${a.id}"]`,
    ) as HTMLElement | null
    if (!el)
      continue
    const want = `--cobe-arc-${a.id}`
    let anchor: HTMLElement | null = null
    for (let i = 0; i < anchorRoot.children.length; i++) {
      const c = anchorRoot.children[i]!
      if (c === host || c.tagName === 'CANVAS')
        continue
      if (c.tagName !== 'DIV')
        continue
      const name = readAnchorName(c as HTMLElement)
      if (name === want) {
        anchor = c as HTMLElement
        break
      }
    }
    if (!anchor) {
      el.style.opacity = '0'
      continue
    }
    const ar = anchor.getBoundingClientRect()
    const cx = ar.left + ar.width / 2 - hr.left
    const top = ar.top - hr.top
    el.style.left = `${cx}px`
    el.style.top = `${top}px`
    // 弧中点：标签略靠上，避免与弧线重叠
    el.style.transform = 'translate(-50%, calc(-100% - 10px))'
    el.style.opacity = String(
      resolveVisibleCssVar(`--cobe-visible-arc-${a.id}`),
    )
  }
}

function globeDpr() {
  return Math.min(
    globalThis.devicePixelRatio || 1,
    globalThis.innerWidth < 640 ? 1.8 : 2,
  )
}

function readGlobeLogicalSize(canvas: HTMLCanvasElement) {
  const w = canvas.offsetWidth
  const h = canvas.offsetHeight
  // 取较短边，避免 canvas 被 CSS 拉扁时 cobe 仍按宽边渲染
  const side = Math.min(w, h)
  return side > 0 ? side : Math.min(500, globalThis.innerWidth - 32)
}

let rafId = 0
/** 自动旋转累加角 */
let phiAuto = 0
/** 用户拖拽留下的水平旋转偏移（持久） */
let phiUser = 0
/** 相对 thetaBase 的俯仰偏移 */
let thetaUser = 0
let pointerDragging = false
let lastPointer: { x: number, y: number } | null = null

let resizeObserver: ResizeObserver | null = null
let cobeModulePromise: Promise<typeof import('cobe')> | null = null
let globeInitPromise: Promise<void> | null = null

function loadCobeModule() {
  cobeModulePromise ??= import('cobe')
  return cobeModulePromise
}

function onGlobePointerDown(e: PointerEvent) {
  const el = canvasRef.value
  if (!el)
    return
  pointerDragging = true
  lastPointer = { x: e.clientX, y: e.clientY }
  el.setPointerCapture(e.pointerId)
  el.style.cursor = 'grabbing'
}

function onGlobePointerMove(e: PointerEvent) {
  if (!pointerDragging || lastPointer === null)
    return
  const dx = e.clientX - lastPointer.x
  const dy = e.clientY - lastPointer.y
  lastPointer = { x: e.clientX, y: e.clientY }
  phiUser += dx * PHI_DRAG_SENS
  thetaUser = clampThetaUser(thetaUser + dy * THETA_DRAG_SENS)
}

function onGlobePointerUp(e: PointerEvent) {
  pointerDragging = false
  lastPointer = null
  const el = canvasRef.value
  if (el?.hasPointerCapture?.(e.pointerId)) {
    try {
      el.releasePointerCapture(e.pointerId)
    }
    catch {
      /* noop */
    }
  }
  if (el)
    el.style.cursor = 'grab'
}

function onGlobeLostPointerCapture() {
  pointerDragging = false
  lastPointer = null
  const el = canvasRef.value
  if (el)
    el.style.cursor = 'grab'
}

async function initGlobe() {
  if (globeRef.value)
    return
  if (globeInitPromise)
    return globeInitPromise

  globeInitPromise = (async () => {
    await nextTick()
    await new Promise<void>(r => requestAnimationFrame(() => r()))
    const canvas = canvasRef.value
    if (!canvas)
      return

    const { default: createGlobe } = await loadCobeModule()
    const logical = readGlobeLogicalSize(canvas)
    const dpr = globeDpr()

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: logical,
      height: logical,
      phi: 0,
      theta: thetaBase.value,
      dark: 0,
      diffuse: 1.5,
      scale: globeScale.value,
      mapSamples: 16000,
      mapBrightness: 10,
      mapBaseBrightness: 0,
      baseColor: [1, 1, 1],
      markerColor: [0.3, 0.45, 0.85],
      glowColor: [1, 1, 1],
      offset: globeOffset.value,
      markers,
      arcs,
      arcColor: [0.5, 0.75, 1],
      arcWidth: 0.42,
      arcHeight: 0.3,
      markerElevation: 0,
    })

    globeRef.value = globe
    cobeVisibilityStyleEl = findInstanceCobeVisibilityStyleEl()

    await nextTick()
    const shell = globeShellRef.value ?? canvas.parentElement
    teleportTarget.value = shell
    patchCobeVisibleVars()

    resizeObserver = new ResizeObserver(() => {
      const g = globeRef.value
      if (!g || !canvasRef.value)
        return
      const next = readGlobeLogicalSize(canvasRef.value)
      if (next > 0)
        g.update({ width: next, height: next })
    })
    resizeObserver.observe(canvas)

    const loop = () => {
      if (!pointerDragging)
        phiAuto += PHI_STEP
      globe.update({
        phi: phiAuto + phiUser,
        theta: thetaBase.value + thetaUser,
      })
      patchCobeVisibleVars()
      const anchorRoot = canvas.parentElement
      const host = labelHostRef.value
      if (anchorRoot && host)
        syncDomLabels(anchorRoot, host)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
  })()

  try {
    await globeInitPromise
  }
  finally {
    if (!globeRef.value)
      globeInitPromise = null
  }
}

onMounted(() => {
  void initGlobe()
})

onBeforeUnmount(() => {
  globeInitPromise = null
  cancelAnimationFrame(rafId)
  resizeObserver?.disconnect()
  resizeObserver = null
  teleportTarget.value = null
  cobeVisibilityStyleEl = null
  pointerDragging = false
  lastPointer = null
  globeRef.value?.destroy()
  globeRef.value = null
})
</script>

<template>
  <div
    class="cobe-stack"
    :class="{ 'cobe-left': cobeLeft }"
  >
    <div class="cobe-wrap relative">
      <div ref="globeShellRef" class="cobe-globe-shell relative z-2">
        <canvas
          ref="canvasRef"
          class="cobe-canvas"
          @pointerdown="onGlobePointerDown"
          @pointermove="onGlobePointerMove"
          @pointerup="onGlobePointerUp"
          @pointercancel="onGlobePointerUp"
          @lostpointercapture="onGlobeLostPointerCapture"
        />
        <div class="cobe-orbit-ring" aria-hidden="true">
          <svg class="cobe-orbit-svg" viewBox="0 0 100 100">
            <defs>
              <path
                :id="orbitPathId"
                d="M 50,50 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0"
              />
            </defs>
            <text
              class="cobe-orbit-text text-1 md:text-0.75"
              dominant-baseline="middle"
            >
              <textPath :href="`#${orbitPathId}`" startOffset="0%">
                {{ orbitTickerText }}
              </textPath>
            </text>
          </svg>
        </div>
        <!-- <div class="cobe-globe-overlay">
          <h1 class="cobe-brand-title">
            ROXY
          </h1>
        </div> -->
        <Teleport v-if="teleportTarget" :to="teleportTarget">
          <div ref="labelHostRef" class="cobe-label-host">
            <span
              v-for="m in markerDefs"
              :key="m.id"
              class="marker-lbl"
              :data-lbl="`m-${m.id}`"
              :style="m.color ? markerLabelAccentStyle(m.color) : undefined"
            >
              <span class="cobe-lbl-body flex gap-1.5 items-center">
                <RxIcon
                  v-if="!isMdWidth"
                  :name="(`country-code/${m.id}` as any)"
                />
                <span class="cobe-lbl-text text-2.5 md:text-3.5">{{
                  m.label
                }}</span>
              </span>
              <span class="cobe-lbl-arrow" aria-hidden="true" />
            </span>
            <!-- <span
              v-for="a in arcDefs"
              :key="a.id"
              class="arc-lbl arc-label"
              :data-lbl="`a-${a.id}`"
            >
              <span class="cobe-lbl-body cobe-lbl-body--arc">
                <span class="cobe-lbl-text">{{ a.label }}</span>
              </span>
              <span class="cobe-lbl-arrow" aria-hidden="true" />
            </span> -->
          </div>
        </Teleport>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cobe-stack {
  /* 与轮播视觉区标准画布 590×522 一致，保证等比缩放 */
  aspect-ratio: 590 / 522;
  width: min(100%, 590px);
  max-width: 100%;
  max-height: 100%;
  height: auto;
  min-height: 0;
  flex-shrink: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-inline: auto;

  @media (min-width: 768px) {
    margin-left: auto;
    margin-right: 0;
    justify-content: flex-end;
  }
}

.cobe-wrap {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  min-height: 0;
}

.cobe-globe-shell {
  grid-area: 1 / 1;
  box-sizing: border-box;
  aspect-ratio: 1 / 1;
  /* 父级为 590×522 宽盒：以高度为基准锁死正圆，避免 width:100% 横向拉扁 */
  height: min(100%, 520px);
  width: auto;
  max-width: 100%;
  min-height: 0;
  position: relative;
  /* 允许光晕完整露出，避免球体上下被裁切 */
  overflow: visible;
  perspective: 700px;
  transform-style: preserve-3d;
  /* 不用 contain，避免光晕边缘被裁切 */
  user-select: none;
}

.cobe-orbit-ring {
  position: absolute;
  inset: 0;
  pointer-events: none;
  /* 圆环轨道文字颜色（SVG text 通过 currentColor 继承） */
  color: #bbbbbb;
  /* 须在 canvas 之上（WebGL 不透明）；且高于城市/弧线标签 */
  z-index: 5;
  transform: translate(0, 2%) scale(1.1);
  mask-image: linear-gradient(to bottom, rgb(0 0 0 / 8%) 35%, #000 50%, #000 100%);
  -webkit-mask-image: linear-gradient(to bottom, rgb(0 0 0 / 8%) 35%, #000 50%, #000 100%);
}

.cobe-orbit-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
  /* 静态倾斜，停转圆环轨道 */
  transform: rotateX(62deg);
}

.cobe-orbit-text {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  fill: currentColor;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.cobe-globe-overlay {
  position: absolute;
  inset: 0;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  animation: cobe-fade-in 1.5s ease 0.2s both;
}

/**
 * 官网使用自定义像素线字体；此处用渐变模拟横向条纹字效（见 COBE 演示）
 */
.cobe-brand-title {
  margin: 0;
  line-height: 1;
  letter-spacing: 0.15em;
  text-indent: 0.15em;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-weight: 800;
  font-size: min(16vw, 4.5rem);
  background: repeating-linear-gradient(
    180deg,
    rgb(51, 102, 255) 0,
    rgb(51, 102, 255) 3px,
    transparent 3px,
    transparent 6px
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  paint-order: stroke fill;
}

@keyframes cobe-orbit-spin {
  from {
    transform: rotateX(62deg) rotateZ(0deg);
  }

  to {
    transform: rotateX(62deg) rotateZ(-360deg);
  }
}

@keyframes cobe-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.cobe-label-host {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.cobe-canvas {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  touch-action: none;
  cursor: grab;
}

.cobe-canvas:active {
  cursor: grabbing;
}

.marker-lbl,
.arc-lbl.arc-label {
  position: absolute;
  left: 0;
  top: 0;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  max-width: min(220px, 45vw);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  pointer-events: none;
  transition: opacity 0.2s ease;
  will-change: transform, opacity;
  overflow: visible;
}

.arc-lbl.arc-label {
  max-width: min(200px, 50vw);
  transition: opacity 0.3s ease;
  z-index: 1;
}

.cobe-lbl-body {
  width: 100%;
  padding: 0.25rem 0.5rem;
  background: var(--cobe-marker-lbl-accent, #1a1a1a);
  color: #fff;
  font-size: 0.75rem;
  line-height: 1.2;
  border-radius: 4px;
  font-weight: 500;
  box-sizing: border-box;
}

.cobe-lbl-body--arc {
  padding: 0.25rem 0.45rem;
  font-size: 0.7rem;
}

.cobe-lbl-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #fff;
  font-family: 'JetBrains Mono';
  font-weight: 500;
}

.cobe-lbl-arrow {
  width: 0;
  height: 0;
  margin-top: -1px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid var(--cobe-marker-lbl-accent, #1a1a1a);
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .cobe-canvas {
    pointer-events: none;
    touch-action: auto;
    cursor: default;
  }

  .cobe-brand-title {
    font-size: min(14vw, 3.2rem);
  }

  .marker-lbl,
  .arc-lbl.arc-label {
    max-width: min(200px, 55vw);
  }

  .cobe-lbl-body {
    padding: 0.2rem 0.4rem;
    font-size: 0.65rem;
  }

  .cobe-lbl-body--arc {
    font-size: 0.62rem;
    padding: 0.2rem 0.4rem;
  }

  .cobe-lbl-arrow {
    border-left-width: 4px;
    border-right-width: 4px;
    border-top-width: 5px;
  }
}

.cobe-left {
  justify-content: flex-start;

  .cobe-wrap {
    place-items: center start;
    width: 100%;
  }

  .cobe-orbit-ring {
    transform: translate(-45px, 30px) scale(1.2);
  }
}
</style>
