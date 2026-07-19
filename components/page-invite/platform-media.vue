<script setup lang="ts">
import { motion } from 'motion-v'
import { platformList1, platformList2 } from '@/components/page-home/components/config'

const props = withDefaults(defineProps<{
  /** 区块在视口内时为 true，控制轮播定时器启停 */
  active?: boolean
}>(), {
  active: true,
})

/** 两组 Logo 交替轮换，逻辑对齐首页 Media.vue */
const state = ref(platformList1.map(() => true))
const state2 = ref(platformList2.map(() => false))

function mapToRange(value: number, minRange: number, maxRange: number) {
  return minRange + (maxRange - minRange) * value
}

const minDuration = 0.35
const maxDuration = 0.9
const numPoints = platformList1.length
const tValues = Array
  .from({ length: numPoints }, (_, i) => i / (numPoints - 1))
  .map(v => mapToRange(v, minDuration, maxDuration))

function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
}

let record = true
function start() {
  if (record) {
    record = false
    state.value = state.value.map(v => !v)
    setTimeout(() => {
      state2.value = state2.value.map(v => !v)
    }, 200)
  }
  else {
    record = true
    state2.value = state2.value.map(v => !v)
    setTimeout(() => {
      state.value = state.value.map(v => !v)
    }, 200)
  }
}

let rotateTimer: ReturnType<typeof setInterval> | undefined

function startRotateTimer() {
  if (rotateTimer)
    return
  rotateTimer = setInterval(() => {
    start()
  }, 2000)
}

function stopRotateTimer() {
  if (!rotateTimer)
    return
  clearInterval(rotateTimer)
  rotateTimer = undefined
}

watch(() => props.active, (active) => {
  if (active)
    startRotateTimer()
  else
    stopRotateTimer()
}, { immediate: true })

onBeforeUnmount(() => {
  stopRotateTimer()
})
</script>

<template>
  <!-- 布局对齐首页 Media.vue：justify-between + Logo 宽度随容器伸缩 -->
  <div class="invite-platform-media relative h-full w-full">
    <ul class="m-0 flex h-full w-full list-none items-center justify-between gap-[clamp(8px,2vw,24px)] p-0">
      <li v-for="(item, index) in platformList1" :key="item" class="invite-platform-media-item">
        <motion.div
          :animate="{
            scaleX: state[index] ? 1 : 0,
            scaleY: state[index] ? 1 : 0,
            opacity: state[index] ? 1 : 0,
          }"
          :initial="{
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
          }"
          :transition="{
            duration: cubicBezier(tValues[index], 0, 0.85, 0.15, 1) + 0.1,
            ease: [0.85, 0, 0.15, 1],
          }"
        >
          <img
            loading="lazy"
            :src="item"
            alt=""
            draggable="false"
            class="invite-platform-media-logo select-none"
          >
        </motion.div>
      </li>
    </ul>

    <ul class="m-0 absolute left-0 top-0 flex h-full w-full list-none items-center justify-between gap-[clamp(8px,2vw,24px)] p-0">
      <li v-for="(item, index) in platformList2" :key="item" class="invite-platform-media-item">
        <motion.div
          :animate="{
            scaleX: state2[index] ? 1 : 0,
            scaleY: state2[index] ? 1 : 0,
            opacity: state2[index] ? 1 : 0,
          }"
          :initial="{
            scaleX: 0,
            scaleY: 0,
            opacity: 0,
          }"
          :transition="{
            duration: cubicBezier(tValues[index], 0, 0.85, 0.15, 1),
            ease: [0.85, 0, 0.15, 1],
          }"
        >
          <img
            loading="lazy"
            :src="item"
            alt=""
            draggable="false"
            class="invite-platform-media-logo select-none"
          >
        </motion.div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.invite-platform-media-item {
  display: flex;
  min-width: 0;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
}

/* 与首页 Media 一致：宽度随列伸缩，高度上限 72px */
.invite-platform-media-logo {
  width: 100%;
  height: auto;
  max-height: 72px;
  object-fit: contain;
}
</style>
