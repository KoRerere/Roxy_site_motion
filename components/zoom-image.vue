<template>
    <!-- Thumbnail -->
    <img
      v-if="!hideThumbnail"
      ref="thumbRef"
      v-bind="$attrs"
      :src="src"
      :alt="alt"
      :class="imgClass"
      :style="imgStyle"
      @click="open()"
    />
  
    <!-- Fullscreen viewer -->
    <Teleport :to="teleportTo">
      <Transition name="zoom-fade">
        <div
          v-if="visible"
          class="zoom-overlay"
          :style="{ background: zoomBackground }"
          @click.self="closeOnBackdrop ? close() : undefined"
        >
          <img
            ref="viewerRef"
            :src="src"
            :alt="alt"
            class="zoom-viewer"
            :style="viewerStyle"
            @wheel="onWheel"
            @mousedown="onMouseDown"
            @dblclick="onDoubleClick"
            @touchstart="onTouchStart"
            @touchmove.prevent="onTouchMove"
            @touchend="onTouchEnd"
          />
          <button class="zoom-close" type="button" @click="close">×</button>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  
  interface Props {
    src: string
    alt?: string
    hideThumbnail?: boolean
    defaultVisible?: boolean
    imgClass?: string | string[] | Record<string, boolean>
    imgStyle?: string | Record<string, string>
    zoomBackground?: string
    teleportTo?: string
    closeOnBackdrop?: boolean
    minScale?: number
    maxScale?: number
    wheelStep?: number
  }
  
  const {
    hideThumbnail = false,
    defaultVisible = false,
    zoomBackground = 'rgba(0,0,0,0.85)',
    teleportTo = 'body',
    closeOnBackdrop = true,
    minScale = 0.7,
    maxScale = 5,
    wheelStep = 0.12
   } = defineProps<Props>()

   const emit = defineEmits<{
    (e: 'close'): void
   }>()
  
  const defaultScale = window.innerWidth < 768 ? 0.85 : 0.7
  const visible = ref(defaultVisible)
  const scale = ref(defaultScale)
  const x = ref(0)
  const y = ref(0)
  
  const thumbRef = ref<HTMLImageElement | null>(null)
  const viewerRef = ref<HTMLImageElement | null>(null) 
  
  // Animate from thumbnail rect → fullscreen
  const viewerStyle = computed(() => ({
    transform: `translate(${x.value}px, ${y.value}px) scale(${scale.value})`,
    transition: visible.value ? 'transform 0.25s ease' : 'none'
  }))
  
  function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n))
  }
  
  function open(thumb?: HTMLImageElement) {
    if (thumb) {
      thumbRef.value = thumb
    }

    if (!thumbRef.value) return
    const rect = thumbRef.value?.getBoundingClientRect()
  
    visible.value = true
    // 初始化缩略图位置
    x.value = rect.left + rect.width / 2 - window.innerWidth / 2
    y.value = rect.top + rect.height / 2 - window.innerHeight / 2
    scale.value = rect.width / window.innerWidth
  
    // 下一帧触发全屏动画
    requestAnimationFrame(() => {
      x.value = 0
      y.value = 0
      scale.value = defaultScale
    })
  
    lockScroll(true)
    window.addEventListener('keydown', onKeyDown)
  }
  
  function close() {
    if (!thumbRef.value) {
      visible.value = false
      emit('close')
      return
    }
    const rect = thumbRef.value.getBoundingClientRect()
    x.value = rect.left + rect.width / 2 - window.innerWidth / 2
    y.value = rect.top + rect.height / 2 - window.innerHeight / 2
    scale.value = rect.width / window.innerWidth
  
    // 等动画完成再关闭
    setTimeout(() => {
      visible.value = false
      resetTransform()
      lockScroll(false)
      emit('close')
    }, 250)
  
    window.removeEventListener('keydown', onKeyDown)
  }
  
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') close()
  }
  
  function resetTransform() {
    scale.value = defaultScale
    x.value = 0
    y.value = 0
  }
  
  function lockScroll(lock: boolean) {
    const body = document.body
    if (lock) {
      body.style.overflow = 'hidden'
      body.style.touchAction = 'none'
    } else {
      body.style.overflow = ''
      body.style.touchAction = ''
    }
  }
  
  function zoomAt(delta: number, cx: number, cy: number) {
    const old = scale.value
    const step = delta < 0 ? wheelStep : -wheelStep
    const next = clamp(old + step, minScale, maxScale)
    if (next === old) return
  
    const vw = window.innerWidth / 2
    const vh = window.innerHeight / 2
    const dx = cx - vw - x.value
    const dy = cy - vh - y.value
    const ratio = next / old - 1
    x.value -= dx * ratio
    y.value -= dy * ratio
    scale.value = next
  }
  
  function onWheel(e: WheelEvent) {
    e.preventDefault()
    zoomAt(e.deltaY, e.clientX, e.clientY)
  }
  
  let dragging = false
  let dragStartX = 0
  let dragStartY = 0
  
  function onMouseDown(e: MouseEvent) {
    e.preventDefault()
    dragging = true
    dragStartX = e.clientX - x.value
    dragStartY = e.clientY - y.value
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }
  
  function onMouseMove(e: MouseEvent) {
    if (!dragging) return
    x.value = e.clientX - dragStartX
    y.value = e.clientY - dragStartY
  }
  
  function onMouseUp() {
    dragging = false
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }
  
  let lastPinchDist = 0
  let lastPanX = 0
  let lastPanY = 0
  
  function touchDistance(touches: TouchList) {
    const [a, b] = [touches[0], touches[1]]
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
  }
  
  function touchCenter(touches: TouchList) {
    const [a, b] = [touches[0], touches[1]]
    return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 }
  }
  
  function onTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
      lastPanX = e.touches[0].clientX - x.value
      lastPanY = e.touches[0].clientY - y.value
    } else if (e.touches.length === 2) {
      lastPinchDist = touchDistance(e.touches)
    }
  }
  
  function onTouchMove(e: TouchEvent) {
    if (e.touches.length === 1) {
      const t = e.touches[0]
      x.value = t.clientX - lastPanX
      y.value = t.clientY - lastPanY
    } else if (e.touches.length === 2) {
      const dist = touchDistance(e.touches)
      const { x: cx, y: cy } = touchCenter(e.touches)
      if (lastPinchDist) {
        const delta = dist - lastPinchDist
        const old = scale.value
        const next = clamp(old + delta / 200, minScale, maxScale)
        if (next !== old) {
          const vw = window.innerWidth / 2
          const vh = window.innerHeight / 2
          const dx = cx - vw - x.value
          const dy = cy - vh - y.value
          const ratio = next / old - 1
          x.value -= dx * ratio
          y.value -= dy * ratio
          scale.value = next
        }
      }
      lastPinchDist = dist
    }
  }
  
  function onTouchEnd() {
    lastPinchDist = 0
  }
  
  function onDoubleClick(e: MouseEvent) {
    const target = scale.value > 1 ? 1 : 2
    zoomAt(scale.value < target ? -1 : 1, e.clientX, e.clientY)
    scale.value = target
  }
  
  onUnmounted(() => {
    lockScroll(false)
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  })

  defineExpose({
    open,
    close
  })
  </script>
  
  <style scoped>
  .zoom-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.zoom-viewer {
  max-width: 100%;
  user-select: none;
  touch-action: none;
  will-change: transform;
  cursor: grab;
}
.zoom-close {
  position: absolute;
  top: 12px;
  right: 14px;
  font-size: 28px;
  color: #fff;
  background: transparent;
  border: 0;
  cursor: pointer;
}
.zoom-fade-enter-active,
.zoom-fade-leave-active {
  transition: opacity 0.18s ease;
}
.zoom-fade-enter-from,
.zoom-fade-leave-to {
  opacity: 0;
}
</style>
  