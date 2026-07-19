<script setup lang="ts">
/** index.html startShaderGradientBackground 使用的 CDN 与 ShaderGradient 参数 */
const SHADER_GRADIENT_CDN = {
  react: 'https://esm.sh/react@18.2.0',
  reactDomClient: 'https://esm.sh/react-dom@18.2.0/client',
  shaderGradient: 'https://esm.sh/@shadergradient/react@2.4.20?deps=react@18.2.0,react-dom@18.2.0,three@0.158.0,@react-three/fiber@8.15.12',
} as const

const SHADER_GRADIENT_PROPS = {
  animate: 'on',
  axesHelper: 'off',
  bgColor1: '#000000',
  bgColor2: '#000000',
  brightness: 0.98,
  cAzimuthAngle: 180,
  cDistance: 3.9,
  cPolarAngle: 115,
  cameraZoom: 1,
  color1: '#000080',
  color2: '#34888f',
  color3: '#000024',
  destination: 'onCanvas',
  embedMode: 'off',
  envPreset: 'city',
  format: 'gif',
  fov: 45,
  frameRate: 30,
  gizmoHelper: 'hide',
  grain: 'off',
  lightType: '3d',
  pixelDensity: 1,
  positionX: -0.5,
  positionY: 0.1,
  positionZ: 0,
  range: 'disabled',
  rangeEnd: 40,
  rangeStart: 0,
  reflection: 0.06,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 235,
  shader: 'defaults',
  type: 'waterPlane',
  uAmplitude: 0,
  uDensity: 1.1,
  uFrequency: 5.5,
  uSpeed: 0.1,
  uStrength: 2.4,
  uTime: 0.2,
  wireframe: false,
} as const

let shaderGradientModulesPromise: Promise<[
  { createElement: (...args: unknown[]) => unknown },
  { createRoot: (el: Element) => { render: (...args: unknown[]) => void, unmount: () => void } },
  {
    ShaderGradientCanvas: unknown
    ShaderGradient: unknown
  },
]> | null = null

function loadShaderGradientModules() {
  shaderGradientModulesPromise ??= Promise.all([
    import(/* @vite-ignore */ SHADER_GRADIENT_CDN.react),
    import(/* @vite-ignore */ SHADER_GRADIENT_CDN.reactDomClient),
    import(/* @vite-ignore */ SHADER_GRADIENT_CDN.shaderGradient),
  ])
  return shaderGradientModulesPromise
}

const mountRef = ref<HTMLDivElement | null>(null)
const visible = ref(false)

let reactRoot: { render: (...args: unknown[]) => void, unmount: () => void } | null = null
let visibilityObserver: IntersectionObserver | null = null
let canvasObserver: MutationObserver | null = null
let isInViewport = true
let renderToken = 0
let revealFrame = 0

function cancelPendingReveal() {
  canvasObserver?.disconnect()
  canvasObserver = null
  window.cancelAnimationFrame(revealFrame)
  revealFrame = 0
}

function revealAfterFirstFrames(mount: HTMLDivElement, currentToken: number) {
  cancelPendingReveal()

  const scheduleReveal = (canvas: HTMLCanvasElement) => {
    canvasObserver?.disconnect()
    canvasObserver = null

    // React 提交 Canvas 并不代表 WebGL 已经绘出首帧。等待画布获得实际尺寸，
    // 再多留几个渲染帧给 shader 编译和首帧绘制，避免空画布突然跳成完整背景。
    let readyFrames = 0
    const waitForPaint = () => {
      if (
        currentToken !== renderToken
        || mountRef.value !== mount
        || document.hidden
        || !isInViewport
      ) {
        return
      }

      readyFrames = canvas.width > 0 && canvas.height > 0 ? readyFrames + 1 : 0
      if (readyFrames >= 4) {
        visible.value = true
        revealFrame = 0
        return
      }

      revealFrame = window.requestAnimationFrame(waitForPaint)
    }

    revealFrame = window.requestAnimationFrame(waitForPaint)
  }

  const canvas = mount.querySelector<HTMLCanvasElement>('canvas')
  if (canvas) {
    scheduleReveal(canvas)
    return
  }

  canvasObserver = new MutationObserver(() => {
    const nextCanvas = mount.querySelector<HTMLCanvasElement>('canvas')
    if (nextCanvas)
      scheduleReveal(nextCanvas)
  })
  canvasObserver.observe(mount, { childList: true, subtree: true })
}

function unmountShaderGradient() {
  renderToken++
  visible.value = false
  cancelPendingReveal()
  reactRoot?.unmount()
  reactRoot = null
}

async function mountShaderGradient() {
  const mount = mountRef.value
  if (!mount || reactRoot)
    return

  const currentToken = ++renderToken
  try {
    const [{ createElement }, { createRoot }, { ShaderGradientCanvas, ShaderGradient }] = await loadShaderGradientModules()

    if (currentToken !== renderToken || !mountRef.value || document.hidden || !isInViewport)
      return

    const root = createRoot(mount)
    root.render(
      createElement(
        ShaderGradientCanvas,
        {
          importedFiber: { gl: null },
          key: 'v3',
          style: {
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          },
        },
        createElement(ShaderGradient, { ...SHADER_GRADIENT_PROPS }),
      ),
    )
    reactRoot = root
    revealAfterFirstFrames(mount, currentToken)
  }
  catch (error) {
    console.warn('ShaderGradient background failed to load.', error)
  }
}

function syncShaderGradientVisibility() {
  if (document.hidden || !isInViewport) {
    unmountShaderGradient()
    return
  }
  void mountShaderGradient()
}

onMounted(() => {
  visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      isInViewport = Boolean(entry?.isIntersecting)
      syncShaderGradientVisibility()
    },
    { rootMargin: '240px 0px' },
  )
  if (mountRef.value)
    visibilityObserver.observe(mountRef.value)

  document.addEventListener('visibilitychange', syncShaderGradientVisibility)
  syncShaderGradientVisibility()
})

onUnmounted(() => {
  visibilityObserver?.disconnect()
  visibilityObserver = null
  document.removeEventListener('visibilitychange', syncShaderGradientVisibility)
  unmountShaderGradient()
})
</script>

<template>
  <div
    data-shader-gradient-bg
    class="shader-gradient-bg shader-gradient-bg--v3 pointer-events-none absolute overflow-hidden"
    aria-hidden="true"
  >
    <div
      ref="mountRef"
      class="shader-gradient-bg__canvas inset-0 absolute"
      :class="{ 'shader-gradient-bg__canvas--visible': visible }"
    />
  </div>
</template>

<style scoped lang="scss">
.shader-gradient-bg {
  inset: 0;
  z-index: 0;
  width: 100%;
  // 跟随父容器全高，覆盖轮播 + 底部礼包区域（不再限制 940px）
  height: 100%;
  contain: paint;

  &--v3 {
    inset: -12% -24%;
    width: auto;
    height: auto;
    overflow: visible;
    transform: none;
    transform-origin: center center;
  }

  &__canvas {
    opacity: 0;
    transition: opacity 2200ms linear 240ms;
    will-change: opacity;

    &--visible {
      opacity: 1;
    }
  }

  &__canvas :deep(> div),
  &__canvas :deep(canvas) {
    width: 100% !important;
    height: 100% !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .shader-gradient-bg__canvas {
    transition: none;
  }
}
</style>
