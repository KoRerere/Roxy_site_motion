<script setup>
import { motion } from 'motion-v'
import { platformList, platformList1, platformList2 } from './config'

const state = ref(platformList1.map(v => true))

const state2 = ref(platformList2.map(v => false))

const oneList = ref(platformList1)

function mapToRange(value, minRange, maxRange) {
  return minRange + (maxRange - minRange) * value
}

const minDuration = 0.35
const maxDuration = 0.9

const numPoints = platformList.length // 数据点数量
const tValues = Array
  .from({ length: numPoints }, (_, i) => i / (numPoints - 1))
  .map(v => mapToRange(v, minDuration, maxDuration))

const twoList = ref(platformList2)

function cubicBezier(t, p0, p1, p2, p3) {
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

onMounted(() => {
  const timer = setInterval(() => {
    start()
  }, 2000)

  onUnmounted(() => {
    clearInterval(timer)
  })
})
</script>

<template>
  <Container>
    <div class="translate-z-0 relative">
      <ul class="list-none flex justify-between">
        <li v-for="(item, index) in oneList">
          <motion.div
            :animate="{
              scaleX: state[index] ? 1 : 0,
              scaleY: state[index] ? 1 : 0,
              opacity: state[index] ? 1 : 0,
            }"
            :initial="{
              scaleX: 0,
              scaleY: 0,
              opacity: 0,
            }"
            :transition="{
              duration: cubicBezier(tValues[index], 0, 0.85, 0.15, 1) + 0.1,
              ease: [0.85, 0, 0.15, 1],
            }"
          >
            <img loading="lazy" :src="item" alt="" class="w-full select-none object-cover" draggable="false">
          </motion.div>
        </li>
      </ul>

      <ul class="list-none flex w-full left-0 top-0 justify-between absolute">
        <li v-for="(item, index) in twoList">
          <motion.div
            :animate="{
              scaleX: state2[index] ? 1 : 0,
              scaleY: state2[index] ? 1 : 0,
              opacity: state2[index] ? 1 : 0,
            }"
            :transition="{
              duration: cubicBezier(tValues[index], 0, 0.85, 0.15, 1),
              ease: [0.85, 0, 0.15, 1],
            }"
            :initial="{
              scaleX: 0,
              scaleY: 0,
              opacity: 0,
            }"
          >
            <img :src="item" alt="" class="img w-full select-none object-cover" draggable="false">
          </motion.div>
        </li>
      </ul>
    </div>
  </Container>
</template>
