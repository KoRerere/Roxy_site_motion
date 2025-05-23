<template>
  <div class="grid grid-cols-5 border border-solid border-red-500">
    <div v-for="item in packages" :key="item.name" class="text-center package-panel">
      {{ item.name }}
    </div>
  </div>

  <div class="relative" ref="sliderRoot">
    <div class="rx-slider"></div>

    <div 
      v-for="mark in xAxis" 
      :class="cn('rx-slider__mark')"
      :style="{ 
        left: `calc(${mark.value}% - ${markSize / 2}px)`
      }"
    >
      <div 
        :class="[
          'rx-slider__mark-label',
          mark.name == modelValue ? 'active' : ''
        ]"
      >{{ markFormatter(mark.name) }}</div>
    </div>

    <!-- 滑块 -->
    <div 
      class="rx-slider__thumb"
      :style="{ left: `${currentPosition}%` }"
      @mousedown="handleThumbDragStart"
    >
      <div class="rx-slider__thumb-popup">
        {{ markFormatter(modelValue) }} 
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  packages: {
    type: Array as PropType<{
      name: string,
      min: number,
      max: number,
      setp: Record<number, number>
    }[]>,
    default: () => ([])
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100000
  },
  markSize: {
    type: Number,
    default: 10
  },
  thumbSize: {
    type: Number,
    default: 26
  },
  markFormatter: {
    type: Function,
    default: (mark: number) => mark
  },
})

const modelValue = defineModel<number>()

const thumbSizeCSS = computed(() => props.thumbSize + 'px')
const markSizeCSS = computed(() => props.markSize + 'px')

const sliderRoot = useTemplateRef('sliderRoot');
// 缓存 slider root 的 getBoundingClientRect 信息
const sliderRootRect = ref<DOMRect>()

const currentPosition = ref(0);

const data = computed(() => {
  const aliquotNum = 100 / props.packages.length;

  let prev = 0;
  const profiles = [0];
  const profilePositions = [];
  for (let i = 0; i < props.packages.length; i++) {
    const item = props.packages[i];
    const { min, max, setp } = item;
    
    let n = min, curSetp = setp[min];
    const _num = []
    while (n < max) {
      n += curSetp;
      profiles.push(n);
      _num.push(n);
      curSetp = setp[n] || curSetp;
    }

    const a = aliquotNum / _num.length;
    for (let j = 0; j < _num.length; j++) {
      profilePositions.push(prev + (a * j))
    }

    prev = prev + aliquotNum;
  }

  profilePositions.push(100)

  return {
    profiles,
    profilePositions
  }
})

const xAxis = computed(() => {
  const aliquotNum = 100 / props.packages.length;
  let prev = 0;
  const __xAxis = [];
  for (let i = 0; i < props.packages.length; i++) {
    const item = props.packages[i];
    const { setp } = item;
    const _setp = Object.keys(setp);
    const l = _setp.length;
    let n = aliquotNum / l;
    for (let j = 0; j < l; j++) {
      __xAxis.push({
        value: prev + (n * j),
        name: _setp[j]
      })
    }
    prev += aliquotNum;
  }
  __xAxis.push({
    value: 100,
    name: props.max
  })
  return __xAxis;
})

watch(modelValue, (newVal) => { 
  const index = data.value.profiles.findIndex(p => p === newVal)
  currentPosition.value = data.value.profilePositions[index] - (props.thumbSize / 2 / sliderRootRect.value!.width * 100)
})

// 查找最近的刻度位置
function findNearestPosition(position: number) {
  const positionPoints = data.value.profilePositions
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

  const positionPoints = data.value.profilePositions
  const maxPosition = positionPoints[positionPoints.length - 1]
  const minPosition = positionPoints[0]

  // 处理边界情况（最小值）
  if (positionPercent <= minPosition) {
    modelValue.value = props.min
    return
  }

  // 处理边界情况（最大值）
  if (positionPercent >= maxPosition && positionPercent > maxPosition / 2) {
    modelValue.value = props.max;
    return
  }

  // 处理普通情况
  const nearestPositions = findNearestPosition(positionPercent)
  if (nearestPositions) {
    const [prevPos, nextPos] = nearestPositions
    if (positionPercent >= prevPos + ((nextPos - prevPos) / 2)) {
      modelValue.value = data.value.profiles[positionPoints.indexOf(nextPos)]
    } else {
      modelValue.value = data.value.profiles[positionPoints.indexOf(prevPos)]
    }
  }
}

function handleThumbDragStart(event: MouseEvent) {
  event.preventDefault()
  const handleMouseMove = (e: MouseEvent) => handlePositionUpdate(e.clientX)
  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

const init = () => {
  if (sliderRoot.value) {
    const rect = sliderRoot.value.getBoundingClientRect()
    sliderRootRect.value = rect
    const index = data.value.profiles.findIndex(p => p === modelValue.value)
    currentPosition.value = data.value.profilePositions[index] - (props.thumbSize / 2 / rect.width * 100)
  }
}

onMounted(() => {
  init();
  window.addEventListener('resize', init);

  onUnmounted(() => {
    window.removeEventListener('resize', init);
  })
})
</script>

<style scoped lang="scss">
.package-panel:not(:last-child) {
  border-right: 1px solid black;
}

.rx-slider {
  position: relative;
  height: 20px;
  background-color: rgba(72, 189, 48);
  border-radius: 12px;
  cursor: pointer;
  width: 100%;
  
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
  // clip-path: inset(0% v-bind(trackGradientCSS) 0% 0% round 0px 12px 12px 0px);
}

.rx-slider__mark {
  position: absolute;
  width: v-bind(markSizeCSS);
  height: v-bind(markSizeCSS);
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.1);
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