<template>
  <div class="rx-slider" ref="sliderRoot" v-bind="$attrs">
    <!-- 渐变轨道 -->
    <div class="rx-slider__track__gradient"></div>

    <!-- 刻度点 -->
    <div 
      v-for="(mark, index) in marks" 
      :class="[
        `rx-slider__mark mark-${index}`,
        mark <= modelValue ? 'active' : ''
      ]"
      :style="{ 
        left: `calc(${markPositions[index]}% - ${markSize / 2}px)`
      }"
      @click.stop="handleMarkClick(mark)"
    >
      <div 
        :class="[
          'rx-slider__mark-label',
          mark === modelValue ? 'active' : ''
        ]"
      >{{ markFormatter(mark) }}</div>
    </div>

    <!-- 滑块 -->
    <div 
      class="rx-slider__thumb"
      :style="{ left: `${currentPosition}%` }"
      @mousedown="handleThumbDragStart"
      @touchstart="handleThumbTouchStart"
    >
      <div class="rx-slider__thumb-popup" v-if="modelValue > 0">
        {{ popupFormatter(modelValue) }} 
      </div>
    </div>

    <div 
      class="absolute top-13 -translate-x-50%"
      @mousedown="handleThumbDragStart" 
      :style="{ left: `${Math.min(100 - maxWidth, mousePercent)}%` }"
    >
      <slot :maxWidth="maxWidth" :percent="mousePercent" :profile="modelValue" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef, type PropType, computed, ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  thumbSize: {
    type: Number,
    default: 26
  },
  markSize: {
    type: Number,
    default: 10
  },
  // 刻度点
  marks: {
    type: Array as PropType<number[]>,
    default: () => []
  },
  markFormatter: {
    type: Function,
    default: (mark: number) => mark
  },
  popupFormatter: {
    type: Function,
    default: (mark: number) => mark
  },
  // 步长
  step: {
    type: Object,
    default: () => ({})
  },
  // 0 - 1
  scale: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: 0
  }
})

const modelValue = defineModel<number>({ default: 0 });

const thumbSizeCSS = computed(() => props.thumbSize + 'px')
const markSizeCSS = computed(() => props.markSize + 'px')

const sliderRoot = useTemplateRef('sliderRoot');
// 缓存 slider root 的 getBoundingClientRect 信息
const sliderRootRect = ref<DOMRect>()

const maxWidth = computed(() => 222 / 2 / sliderRootRect.value?.width * 100)
const trackGradientCSS = computed(() => 100 - currentPosition.value - (props.thumbSize / sliderRootRect.value?.width * 100) + '%')

const currentPosition = ref(0);
// 计算每个刻度点的位置
// const markPositions = computed(() => props.marks.map((_, index) => ((index / (props.marks.length - 1)) * 100)))
const markStart = computed(() => props.scale * 100)
const markEnd = computed(() => 100 - markStart.value * 2)
const markPositions = computed(() => {
  return props.marks.map((_, index) => (markStart.value + index / (props.marks.length - 1) * markEnd.value))
})

const mousePercent = ref(0)

function generatePricePositionMaps() {
  const points = []
  const positionPoints = []
  let currentPosition = markStart.value

  if (!props.marks.length) {
    return { points: [], positionPoints: [] }
  }

  for (let i = 1; i < props.marks.length; i++) {
    const start = props.marks[i - 1] as number
    const end = props.marks[i] as number
    const step = props.step[start] as number
    // 在这段间隔里面，需要多少个步长
    const steps = (end - start) / step

    // 每个步长需要占的比例
    const positionStep = (markPositions.value[i] - markPositions.value[i - 1]) / steps

    for (let j = 0; j < steps; j++) {
      currentPosition += positionStep
      positionPoints.push(currentPosition)
      points.push(start + j * step + step)
    }
  }

  return { points, positionPoints }
}

// 生成价格和位置映射
const { points, positionPoints } = generatePricePositionMaps()

// 初始化thumb的位置
const init = () => {
  if (sliderRoot.value) {
    const rect = sliderRoot.value.getBoundingClientRect()
    sliderRootRect.value = rect
    const index = points.findIndex(p => p === modelValue.value)
    mousePercent.value = positionPoints[index]
    currentPosition.value = positionPoints[index] - (props.thumbSize / 2 / rect.width * 100)
  }
}

// 查找最近的刻度位置
function findNearestPosition(position: number) {
  for (let i = 1; i < positionPoints.length; i++) {
    if (position > positionPoints[i - 1] && position <= positionPoints[i]) {
      return [positionPoints[i - 1], positionPoints[i]]
    }
  }
  return null
}

// 处理滑块拖动
const handlePositionUpdate = (clientX: number) => {
  if (!sliderRoot.value) return

  const rect = sliderRootRect.value!
  // 滑块移动了多少
  const positionPercent = ((clientX - rect.left) / rect.width) * 100

  const maxPosition = positionPoints[positionPoints.length - 1]
  const minPosition = positionPoints[points.findIndex(p => p === props.min)]

  // 处理边界情况（最小值）
  if (positionPercent <= minPosition) {
    modelValue.value = props.min
    return
  }

  // 处理边界情况（最大值）
  if (positionPercent >= maxPosition && positionPercent > maxPosition / 2) {
    modelValue.value = props.marks[props.marks.length - 1] as number
    return
  }

  // 处理普通情况
  const nearestPositions = findNearestPosition(positionPercent)
  if (nearestPositions) {
    const [prevPos, nextPos] = nearestPositions
    // if (positionPercent >= prevPos + ((nextPos - prevPos) / 2)) {
    //   modelValue.value = points[positionPoints.indexOf(nextPos)]
    // } else {
    //   modelValue.value = points[positionPoints.indexOf(prevPos)]
    // }
    if (positionPercent >= prevPos + ((nextPos - prevPos) / 2)) {
      modelValue.value = points[positionPoints.indexOf(nextPos)] == 5 ? 0 : points[positionPoints.indexOf(nextPos)]
    } else {
      modelValue.value = points[positionPoints.indexOf(prevPos)] == 5 ? 0 : points[positionPoints.indexOf(prevPos)]
    }
  }
}

const handleThumbDragStart = (event: MouseEvent) => {
  event.preventDefault()
  const handleMouseMove = (e: MouseEvent) => handlePositionUpdate(e.clientX)
  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

const handleThumbTouchStart = (event: TouchEvent) => {
  event.preventDefault()
  const handleTouchMove = (e: TouchEvent) => handlePositionUpdate(e.touches[0].clientX)
  const handleTouchEnd = () => {
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('touchend', handleTouchEnd)
  }
  window.addEventListener('touchmove', handleTouchMove)
  window.addEventListener('touchend', handleTouchEnd)
}

const handleMarkClick = (mark: number) => {
  if (mark >= props.min) {
    modelValue.value = mark
  }
}

watch(modelValue, (newVal) => {
  if (newVal === 0) {
    currentPosition.value = 0.2
    mousePercent.value = 0.2
  } else {
    const index = points.findIndex(p => p === newVal)
    mousePercent.value = positionPoints[index]
    currentPosition.value = positionPoints[index] - (props.thumbSize / 2 / sliderRootRect.value!.width * 100)
  }
})

onMounted(() => {
  init();
  window.addEventListener('resize', init);

  onUnmounted(() => {
    window.removeEventListener('resize', init);
  })
})

</script>

<style scoped lang="scss">

.rx-slider {
  position: relative;
  height: 20px;
  background-color: #F0F3F5;
  border-radius: 12px;
  cursor: pointer;
  // width: 100%;
  border: 1px solid #E4E8EB;
  width: 103%;
  transform: translateX(-1.5%);
  
  box-sizing: border-box;
  margin-bottom: 26px;
}

.rx-slider__track__gradient {
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 12px;
  background: linear-gradient(90deg, #12A3FC 0%, #EC51F7 100%);
  // background: linear-gradient(90deg, #FCC3C4 0%, #117EFA 100%);
  clip-path: inset(0% v-bind(trackGradientCSS) 0% 0% round 0px 12px 12px 0px);
}

.rx-slider__mark {
  position: absolute;
  width: v-bind(markSizeCSS);
  height: v-bind(markSizeCSS);
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba($color: #000000, $alpha: 0.2);
  // background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.rx-slider__mark.active {
  background-color: rgba(255, 255, 255, 0.6) !important;
}

.rx-slider__mark-label {
  position: absolute;
  transform: translateX(-50%);
  top: 100%;
  margin-top: 14px;
  font-size: 16px;
  color: #909399;
  user-select: none;
  left: 50%;
}

.rx-slider__mark-label.active {
  color: #EC51F7;
}

.rx-slider__thumb {
  border: 5px solid #fff;
  border-radius: 50%;
  cursor: grab;
  height: v-bind(thumbSizeCSS);
  width: v-bind(thumbSizeCSS);
  outline: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: transform .2s;
}

.rx-slider__thumb-popup {
  position: absolute;
  top: -38px;
  left: 50%;
  transform: translateX(-50%);
  color: #FFF;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 2px 10px;
  border-radius: 4px;
  /* 不让文本换行 */
  white-space: nowrap;
}

</style>