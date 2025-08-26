import { ref, onMounted, onBeforeUnmount } from 'vue'
import { animate } from 'motion-v'

interface UseScrollScaleOptions {
  maxScale?: number        // 最大缩放值
  minScale?: number        // 最小缩放值
  duration?: number        // 动画时长
  plateau?: [number, number] // 最大值保持范围 [start, end]
  shrinkEnd?: number       // 完全缩小到 minScale 的位置（默认 1）
}

export function useScrollScale(
  options: UseScrollScaleOptions = {}
) {
  const {
    maxScale = 1,
    minScale = 0.96,
    duration = 0.2,
    plateau = [0.35, 0.7],
    shrinkEnd = 0.8,
  } = options

  const target = ref<HTMLElement | null>(null)
  let frameId: number

  const update = () => {
    if (!target.value) return

    const rect = target.value.getBoundingClientRect()
    const windowHeight = window.innerHeight

    // 元素中心相对屏幕位置 (0=顶部, 1=底部)
    const progress = (rect.top + rect.height / 2) / windowHeight

    let scale = minScale

    if (progress < plateau[0]) {
      // 下半部分 → 从 minScale 逐渐放大到 maxScale
      const t = Math.min(progress / plateau[0], 1)
      scale = minScale + t * (maxScale - minScale)
    } else if (progress <= plateau[1]) {
      // plateau 区间内保持最大值
      scale = maxScale
    } else if (progress <= shrinkEnd) {
      // plateauEnd → shrinkEnd 逐渐缩小
      const t = Math.min((progress - plateau[1]) / (shrinkEnd - plateau[1]), 1)
      scale = maxScale - t * (maxScale - minScale)
    } else {
      // shrinkEnd 之后保持最小值
      scale = minScale
    }

    animate(target.value, { scale }, { duration })
  }

  const loop = () => {
    update()
    frameId = requestAnimationFrame(loop)
  }

  onMounted(() => {
    loop()
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(frameId)
  })

  return { target }
}
