<script setup lang="ts">
/**
 * Canvas 云朵动画：从右进入、向左移出，循环。
 * 透明度模拟景深（远=淡=慢，近=浓=快），速度由景深推算，更逼真。
 * 需放在 position: relative 的容器内，会 absolute inset-0 铺满容器。
 */
interface Cloud {
  x: number
  y: number
  scale: number
  opacity: number
  speed: number
}

const props = withDefaults(
  defineProps<{
    imageSrc?: string
    cloudCount?: number
    baseSpeed?: number
    baseSize?: number
  }>(),
  {
    imageSrc: '/activity/chinese-new-year/icon_new_year_cloud.svg',
    cloudCount: 5,
    baseSpeed: 0.25,
    baseSize: 160,
  },
)

/** 参考透明度：以此为基准速度，比它淡的云更慢，比它浓的云更快 */
const OPACITY_REF = 0.4

const wrapRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let clouds: Cloud[] = []
let cloudImage: HTMLImageElement | null = null
let rafId = 0
let lastTimestamp = 0
let sceneWidth = 0
let sceneHeight = 0

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function initClouds(width: number, height: number) {
  clouds = Array.from({ length: props.cloudCount }, () => {
    const opacity = rand(0.2, 0.55)
    // 景深：远的云更小更淡且更慢，近的云更大更浓且更快
    const depthFactor = opacity / OPACITY_REF // <1 表示更远，>1 表示更近
    // 速度使用 px/s，避免高刷屏（120Hz/144Hz）看起来更快
    const speed = props.baseSpeed * 60 * depthFactor * rand(0.92, 1.08)
    return {
      x: rand(0, width + 300),
      y: rand(height * 0.08, height * 0.82),
      scale: 0.5 + opacity * 0.85, // 0.2->0.67, 0.55->0.97，远小近大
      opacity,
      speed,
    }
  })
}

function resizeCanvas(width: number, height: number) {
  const canvas = canvasRef.value
  if (!canvas)
    return
  const ctx = canvas.getContext('2d')
  if (!ctx)
    return

  const dpr = Math.min(2, window.devicePixelRatio || 1)
  if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
}

function resizeClouds(nextWidth: number, nextHeight: number) {
  if (!clouds.length) {
    initClouds(nextWidth, nextHeight)
    sceneWidth = nextWidth
    sceneHeight = nextHeight
    return
  }

  if (sceneWidth <= 0 || sceneHeight <= 0) {
    sceneWidth = nextWidth
    sceneHeight = nextHeight
    return
  }

  if (sceneWidth === nextWidth && sceneHeight === nextHeight)
    return

  const ratioX = nextWidth / sceneWidth
  const ratioY = nextHeight / sceneHeight
  for (const c of clouds) {
    c.x *= ratioX
    c.y *= ratioY
  }
  sceneWidth = nextWidth
  sceneHeight = nextHeight
}

function run(timestamp = 0) {
  const canvas = canvasRef.value
  const wrap = wrapRef.value
  if (!canvas || !wrap || !cloudImage?.complete)
    return

  const ctx = canvas.getContext('2d')
  if (!ctx)
    return

  const width = wrap.clientWidth
  const height = wrap.clientHeight
  if (width <= 0 || height <= 0) {
    lastTimestamp = timestamp
    rafId = requestAnimationFrame(run)
    return
  }

  resizeCanvas(width, height)
  resizeClouds(width, height)

  const imgW = cloudImage.naturalWidth || props.baseSize
  const imgH = cloudImage.naturalHeight || props.baseSize

  const dtSeconds = lastTimestamp
    ? Math.min(0.05, (timestamp - lastTimestamp) / 1000)
    : 1 / 60
  lastTimestamp = timestamp

  ctx.clearRect(0, 0, width, height)

  for (const c of clouds) {
    const w = props.baseSize * c.scale
    const h = (imgH / imgW) * w

    ctx.save()
    ctx.globalAlpha = c.opacity
    ctx.drawImage(cloudImage, c.x - w / 2, c.y - h / 2, w, h)
    ctx.restore()

    c.x -= c.speed * dtSeconds
    if (c.x < -w) {
      c.x = width + w + rand(0, 150)
      c.y = rand(height * 0.08, height * 0.82)
    }
  }

  rafId = requestAnimationFrame(run)
}

function loadAndStart() {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    cloudImage = img
    run()
  }
  img.src = props.imageSrc
}

onMounted(() => {
  loadAndStart()
})

onBeforeUnmount(() => {
  if (rafId)
    cancelAnimationFrame(rafId)
  lastTimestamp = 0
})
</script>

<template>
  <div ref="wrapRef" class="pointer-events-none inset-0 absolute">
    <canvas ref="canvasRef" class="h-full w-full block" />
  </div>
</template>
