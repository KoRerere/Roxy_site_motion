<script setup lang="ts">
import { animate } from 'motion-v'
import animationSvg from './animation.svg?raw'

const props = defineProps<{
  /** 当前 slide 是否为激活态，由轮播父级传入 */
  active?: boolean
}>()

interface FloatIcon {
  el: SVGGElement
  dx: number
  dy: number
  rot: number
  delay: number
  bobAmp: number
  bobDur: number
  /** 是否从底部升入（其余图标原地，仅轻微缩放） */
  rise: boolean
}

const svgRoot = ref<HTMLElement | null>(null)

let icons: FloatIcon[] = []
let controls: ReturnType<typeof animate>[] = []

function readVar(el: Element, name: string): number {
  return Number.parseFloat(getComputedStyle(el).getPropertyValue(name)) || 0
}

function collectIcons() {
  if (!svgRoot.value)
    return
  icons = Array.from(
    svgRoot.value.querySelectorAll<SVGGElement>('.float-icon'),
  ).map(el => ({
    el,
    dx: readVar(el, '--dx'),
    dy: readVar(el, '--dy'),
    rot: readVar(el, '--rot'),
    delay: readVar(el, '--delay'),
    bobAmp: readVar(el, '--bob-amp'),
    bobDur: readVar(el, '--bob-dur'),
    rise: el.classList.contains('float-icon--rise'),
  }))
}

function stopAll() {
  controls.forEach(c => c.stop())
  controls = []
}

/** 入场结束后从静止位 y=0 无缝起步的持续漂浮 */
function startBob(icon: FloatIcon) {
  controls.push(
    animate(
      icon.el,
      { y: [0, -icon.bobAmp] },
      {
        duration: icon.bobDur / 2,
        ease: 'easeInOut',
        repeat: Number.POSITIVE_INFINITY,
        repeatType: 'reverse',
      },
    ),
  )
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// motion 只负责 transform（升起 + 漂浮）；透明度由 CSS 的 --animating 负责，
// 故即便这里整段抛错，图标仍会被 CSS 淡入并停在最终位置（优雅降级）。
function playEnter() {
  stopAll()
  if (!icons.length)
    return

  if (prefersReducedMotion()) {
    icons.forEach(({ el }) => {
      animate(el, { x: 0, y: 0, rotate: 0, scale: 1 }, { duration: 0 })
    })
    return
  }

  icons.forEach((icon) => {
    if (icon.rise) {
      // 轻弹性 spring 从底部升入，到位后无缝转入漂浮
      controls.push(
        animate(
          icon.el,
          { x: [icon.dx, 0], y: [icon.dy, 0], rotate: [icon.rot, 0], scale: [0.94, 1] },
          {
            type: 'spring',
            bounce: 0.18,
            visualDuration: 0.7,
            delay: icon.delay,
            onComplete: () => startBob(icon),
          },
        ),
      )
    }
    else {
      // 原地出现（仅轻微缩放），随后从静止位漂浮
      controls.push(
        animate(
          icon.el,
          { scale: [0.94, 1] },
          {
            type: 'spring',
            bounce: 0.12,
            visualDuration: 0.5,
            delay: icon.delay,
            onComplete: () => startBob(icon),
          },
        ),
      )
    }
  })
}

/** 复位 transform 供下次激活重放（透明度交给 CSS，不在此处碰），并停掉所有漂浮 */
function resetTransforms() {
  stopAll()
  icons.forEach((icon) => {
    animate(
      icon.el,
      {
        x: icon.rise ? icon.dx : 0,
        y: icon.rise ? icon.dy : 0,
        rotate: icon.rise ? icon.rot : 0,
        scale: 0.94,
      },
      { duration: 0 },
    )
  })
}

onMounted(() => {
  try {
    collectIcons()
    if (props.active)
      playEnter()
  }
  catch (err) {
    // 透明度由 CSS 兜底，图标仍可见；仅记录以便排查。
    // 另外把升起图标的 transform 清回最终位，避免它们被 CSS 的底部初始位卡住。
    svgRoot.value
      ?.querySelectorAll<SVGGElement>('.float-icon--rise')
      .forEach((el) => { el.style.transform = 'none' })
    console.error('[fingerprint-visual] motion driver failed:', err)
  }
})

watch(
  () => props.active,
  (isActive) => {
    if (!icons.length)
      return
    if (isActive)
      playEnter()
    else
      resetTransforms()
  },
)

onUnmounted(() => {
  stopAll()
})
</script>

<template>
  <div
    class="fingerprint-visual-stage select-none"
    :class="{
      'fingerprint-visual-stage--active': active,
      'fingerprint-visual-stage--animating': active,
    }"
    aria-hidden="true"
  >
    <div
      ref="svgRoot"
      class="fingerprint-visual-stage__svg"
      v-html="animationSvg"
    />
  </div>
</template>

<style scoped lang="scss">
.fingerprint-visual-stage {
  /* 与轮播视觉区标准画布 590×522 一致，保证等比缩放 */
  aspect-ratio: 590 / 522;
  width: min(100%, 590px);
  max-width: 100%;
  max-height: 100%;
  height: auto;
  min-height: 0;
  flex-shrink: 1;
  margin-inline: auto;

  @media (min-width: 768px) {
    margin-left: auto;
    margin-right: 0;
  }

  &__svg {
    width: 100%;
    height: 100%;
    transform: translateZ(0);
    will-change: transform, opacity;
  }

  :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
    shape-rendering: geometricPrecision;
    transform: translateZ(0);
  }
}
</style>
