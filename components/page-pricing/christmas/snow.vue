<script setup lang="ts">
interface Snowflake {
  /** 初始 X 位置 (0-1) */
  startX: number
  /** 当前 Y 进度 (0-1) */
  progress: number
  /** X 偏移量 */
  offsetX: number
  /** yoyo 时间点 (0.3-0.8) */
  yoyoTime: number
  /** 半径 */
  radius: number
  /** 下落速度 (每帧进度增量) */
  speed: number
  /** 透明度 */
  opacity: number
}

const props = defineProps({
  snowflakeCount: {
    type: Number,
    default: 140,
  },
  speed: {
    type: Number,
    default: 1,
  },
})

function getRandomIntByRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const canvasRef = useTemplateRef('content')

const MAX_SCREEN_WIDTH = 1920 // 基准屏幕宽度
const MAX_SNOWFLAKE_COUNT = props.snowflakeCount

// 根据当前屏幕宽度计算雪花数量
function calculateSnowflakeCount(width: number): number {
  if (width >= MAX_SCREEN_WIDTH) {
    return MAX_SNOWFLAKE_COUNT
  }
  // 按比例减少，但至少保留30%的雪花
  const ratio = Math.max(width / MAX_SCREEN_WIDTH, 0.3)
  return Math.floor(MAX_SNOWFLAKE_COUNT * ratio)
}

let animationId: number = 0
let snowflakes: Snowflake[] = []
let ctx: CanvasRenderingContext2D | null = null
let canvasWidth = 0
let canvasHeight = 0
let currentSnowflakeCount = MAX_SNOWFLAKE_COUNT
let resizeObserver: ResizeObserver | null = null
let resizeTimer: ReturnType<typeof setTimeout> | null = null
let initTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  // 延迟初始化：等待容器有真实高度后再开始绘制
  const tryInit = () => {
    const canvas = canvasRef.value
    if (!canvas) {
      initTimer = setTimeout(tryInit, 50)
      return
    }

    const rect = canvas.getBoundingClientRect()
    // 等待容器宽高都大于 0，再进行初始化
    if (rect.width > 0 && rect.height > 0) {
      initCanvas()
      setupResizeObserver()
      initTimer = null
    }
    else {
      initTimer = setTimeout(tryInit, 50)
    }
  }

  requestIdleCallback(tryInit)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  if (resizeTimer) {
    clearTimeout(resizeTimer)
  }
  if (initTimer) {
    clearTimeout(initTimer)
  }
  snowflakes = []
  ctx = null
})

function setupResizeObserver() {
  const canvas = canvasRef.value
  if (!canvas)
    return

  resizeObserver = new ResizeObserver(() => {
    // 防抖处理，避免频繁resize
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }
    resizeTimer = setTimeout(() => {
      handleResize()
    }, 100)
  })
  resizeObserver.observe(canvas)
}

function handleResize() {
  const canvas = canvasRef.value
  if (!canvas || !ctx)
    return

  const rect = canvas.getBoundingClientRect()
  const newWidth = rect.width
  const newHeight = rect.height

  // 如果尺寸没有变化，不需要重新初始化
  if (newWidth === canvasWidth && newHeight === canvasHeight)
    return

  const widthChanged = newWidth !== canvasWidth

  canvasWidth = newWidth
  canvasHeight = newHeight

  // 高 DPI 适配
  const dpr = window.devicePixelRatio || 1
  canvas.width = canvasWidth * dpr
  canvas.height = canvasHeight * dpr
  ctx.scale(dpr, dpr)

  // 只有宽度变化时，才根据新宽度动态调整雪花数量
  if (widthChanged) {
    const newCount = calculateSnowflakeCount(canvasWidth)
    if (newCount !== currentSnowflakeCount) {
      adjustSnowflakeCount(newCount)
      currentSnowflakeCount = newCount
    }
  }
  // 高度变化但宽度未变：保持现有雪花状态即可，让动画自然适应新高度

  // 如果当前没有在播放动画（例如首次渲染时高度为 0 导致 animate 提前返回），重新启动动画
  if (!animationId) {
    animate()
  }
}

function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas)
    return

  const context = canvas.getContext('2d')
  if (!context)
    return

  ctx = context

  const rect = canvas.getBoundingClientRect()
  canvasWidth = rect.width
  canvasHeight = rect.height

  // 根据初始宽度计算雪花数量
  currentSnowflakeCount = calculateSnowflakeCount(canvasWidth)

  // 高 DPI 适配
  const dpr = window.devicePixelRatio || 1
  canvas.width = canvasWidth * dpr
  canvas.height = canvasHeight * dpr
  ctx.scale(dpr, dpr)

  initSnowflakes()
  animate()
}

function createSnowflake(index?: number, total?: number): Snowflake {
  const yoyoTime = getRandomIntByRange(30, 80) / 100
  const fallDuration = getRandomIntByRange(10, 30)
  // 速度 = 1 / (duration * 60fps) * speedMultiplier
  const speed = (1 / (fallDuration * 60)) * props.speed

  let initialProgress: number
  if (typeof index === 'number' && typeof total === 'number' && total > 1) {
    // 基于索引在 0-1 区间均匀铺开，再叠加少量随机扰动
    const baseProgress = index / (total - 1)
    const jitter = (Math.random() - 0.5) * (1 / total) * 2
    initialProgress = Math.min(1, Math.max(0, baseProgress + jitter))
  }
  else {
    // 动态新增的雪花：在 0-1 范围内随机一个进度
    initialProgress = Math.random()
  }

  return {
    startX: Math.random(),
    progress: initialProgress,
    offsetX: getRandomIntByRange(-10, 10) / 100,
    yoyoTime,
    radius: Math.random() * 4 + 1,
    speed,
    opacity: Math.random() * 0.8 + 0.2,
  }
}

function initSnowflakes() {
  // 初次初始化：根据 currentSnowflakeCount 均匀铺开整条高度
  snowflakes = Array.from({ length: currentSnowflakeCount }, (_v, index) =>
    createSnowflake(index, currentSnowflakeCount))
}

function adjustSnowflakeCount(newCount: number) {
  // 动态增减雪花数量：保留已有雪花的状态，只对差额做增删
  const currentCount = snowflakes.length
  if (newCount === currentCount)
    return

  if (newCount < currentCount) {
    // 直接裁剪数组，移除多余的雪花（通常是“最新”的那一批）
    snowflakes.splice(newCount)
  }
  else {
    const toAdd = newCount - currentCount
    for (let i = 0; i < toAdd; i++) {
      // 为新增的雪花创建随机进度的初始状态
      snowflakes.push(createSnowflake())
    }
  }
}

function calculateX(flake: Snowflake, width: number): number {
  const { startX, progress, offsetX, yoyoTime } = flake

  let currentOffset: number
  if (progress < yoyoTime) {
    // 第一阶段：向 offsetX 方向移动
    const t = progress / yoyoTime
    currentOffset = offsetX * t
  }
  else {
    // 第二阶段：向 offsetX/2 方向回摆
    const t = (progress - yoyoTime) / (1 - yoyoTime)
    currentOffset = offsetX - (offsetX / 2) * t
  }

  return (startX + currentOffset) * width
}

function animate() {
  if (!ctx)
    return

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  for (const flake of snowflakes) {
    const x = calculateX(flake, canvasWidth)
    const y = flake.progress * canvasHeight

    // 设置阴影模糊效果，让雪花边缘更柔和
    ctx.shadowBlur = flake.radius * 2
    ctx.shadowColor = `rgba(255, 255, 255, ${flake.opacity})`

    // 绘制雪花
    ctx.beginPath()
    ctx.arc(x, y, flake.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
    ctx.fill()

    // 清除阴影设置，避免影响其他绘制
    ctx.shadowBlur = 0
    ctx.shadowColor = 'transparent'

    // 更新进度
    flake.progress += flake.speed

    // 循环回顶部
    if (flake.progress > 1) {
      flake.progress = 0
      flake.startX = Math.random()
    }
  }

  animationId = requestAnimationFrame(() => animate())
}
</script>

<template>
  <canvas
    ref="content"
    class="bg-transparent h-full w-full block [mask-image:linear-gradient(to_bottom,#fff_0%,#fff_70%,transparent_100%)] absolute"
  />
</template>
