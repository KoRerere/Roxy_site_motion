<script setup>
import { motion } from 'motion-v'

const variants1 = {
  initial: { x: '100vw' },
  visible: index => ({
    x: '-240px',
    transition: {
      duration: 4,
      ease: [0.65, 0.05, 0.36, 1],
      delay: index * 1,
      repeat: Infinity,
      repeatDelay: 1,
    },
  }),
}
const variants2 = {
  initial: { x: '100vw' },
  visible: index => ({
    x: '-240px',
    transition: {
      duration: 4,
      ease: [0.65, 0.05, 0.36, 1],
      delay: (index + 0.6) * 2,
      repeat: Infinity,
      repeatDelay: 2.3,
    },
  }),
}
const variants3 = {
  initial: { x: '100vw' },
  visible: index => ({
    x: '-240px',
    transition: {
      duration: 4,
      ease: [0.65, 0.05, 0.36, 1],
      delay: (index + 0.7) * 1.3,
      repeat: Infinity,
      repeatDelay: 1.3,
    },
  }),
}
const variants4 = {
  initial: { x: '100vw' },
  visible: index => ({
    x: '-240px',
    transition: {
      duration: 4,
      ease: [0.65, 0.05, 0.36, 1],
      delay: (index + 0.9) * 2.1,
      repeat: Infinity,
      repeatDelay: 2.7,
    },
  }),
}
const variants5 = {
  initial: { x: '100vw' },
  visible: index => ({
    x: '-240px',
    transition: {
      duration: 4,
      ease: [0.65, 0.05, 0.36, 1],
      delay: (index + 0.7) * 1.9,
      repeat: Infinity,
      repeatDelay: 2.2,
    },
  }),
}
const variants6 = {
  initial: { x: '100vw' },
  visible: index => ({
    x: '-240px',
    transition: {
      duration: 4,
      ease: [0.65, 0.05, 0.36, 1],
      delay: (index + 1.1) * 1.6,
      repeat: Infinity,
      repeatDelay: 1.7,
    },
  }),
}

// const rightRef = useTemplateRef('rightRef')
// const leftRef = useTemplateRef('leftRef')

// onMounted(() => {
//   const timer = setTimeout(() => {
//     rightRef.value?.style.visibility = 'visible'
//     leftRef.value?.style.visibility = 'visible'
//   }, 1500)

//   return () => {
//     clearTimeout(timer)
//   }
// })
</script>

<template>
  <div
    ref="rightRef"
    class="electric-bg electric-bg-right"
  >
    <div class="electric-line" style="transform: rotate(-1deg)">
      <ul>
        <motion.div
          v-for="index in 3"
          :key="index"
          :custom="index - 1"
          class="electric-line-item"
          :initial="{ x: '100vw' }"
          animate="visible"
          :variants="variants1"
        />
      </ul>
    </div>
    <div class="electric-line">
      <ul>
        <motion.div
          v-for="index in 3"
          :key="index"
          :custom="index - 1"
          class="electric-line-item"
          :initial="{ x: '100vw' }"
          animate="visible"
          :variants="variants2"
        />
      </ul>
    </div>
    <div class="electric-line" style="transform: rotate(2deg)">
      <ul>
        <motion.div
          v-for="index in 3"
          :key="index"
          :custom="index - 1"
          class="electric-line-item"
          :initial="{ x: '100vw' }"
          animate="visible"
          :variants="variants3"
        />
      </ul>
    </div>
    <div class="electric-line" style="transform: rotate(4deg)">
      <ul>
        <motion.div
          v-for="index in 3"
          :key="index"
          :custom="index - 1"
          class="electric-line-item"
          :initial="{ x: '100vw' }"
          animate="visible"
          :variants="variants4"
        />
      </ul>
    </div>
    <div class="electric-line" style="transform: rotate(6deg)">
      <ul>
        <motion.div
          v-for="index in 3"
          :key="index"
          :custom="index - 1"
          class="electric-line-item"
          :initial="{ x: '100vw' }"
          animate="visible"
          :variants="variants5"
        />
      </ul>
    </div>
    <div class="electric-line" style="transform: rotate(8deg)">
      <ul>
        <motion.div
          v-for="index in 3"
          :key="index"
          :custom="index - 1"
          class="electric-line-item"
          :initial="{ x: '100vw' }"
          animate="visible"
          :variants="variants6"
        />
      </ul>
    </div>
  </div>
  <div
    ref="leftRef"
    class="electric-bg electric-bg-left"
  >
    <div class="electric-line" style="transform: rotate(2deg)">
      <ul>
        <motion.div
          v-for="index in 3"
          :key="index"
          :custom="index - 1"
          class="electric-line-item"
          :initial="{ x: '100vw' }"
          animate="visible"
          :variants="variants1"
        />
      </ul>
    </div>
    <div class="electric-line">
      <ul>
        <motion.div
          v-for="index in 3"
          :key="index"
          :custom="index - 1"
          class="electric-line-item"
          :initial="{ x: '100vw' }"
          animate="visible"
          :variants="variants2"
        />
      </ul>
    </div>
    <div class="electric-line" style="transform: rotate(-2deg)">
      <ul>
        <motion.div
          v-for="index in 3"
          :key="index"
          :custom="index - 1"
          class="electric-line-item"
          :initial="{ x: '100vw' }"
          animate="visible"
          :variants="variants3"
        />
      </ul>
    </div>
    <div class="electric-line" style="transform: rotate(-4deg)">
      <ul>
        <motion.div
          v-for="index in 3"
          :key="index"
          :custom="index - 1"
          class="electric-line-item"
          :initial="{ x: '100vw' }"
          animate="visible"
          :variants="variants4"
        />
      </ul>
    </div>
    <div class="electric-line" style="transform: rotate(-6deg)">
      <ul>
        <motion.div
          v-for="index in 3"
          :key="index"
          :custom="index - 1"
          class="electric-line-item"
          :initial="{ x: '100vw' }"
          animate="visible"
          :variants="variants5"
        />
      </ul>
    </div>
    <div class="electric-line" style="transform: rotate(-8deg)">
      <ul>
        <motion.div
          v-for="index in 3"
          :key="index"
          :custom="index - 1"
          class="electric-line-item"
          :initial="{ x: '100vw' }"
          animate="visible"
          :variants="variants6"
        />
      </ul>
    </div>
  </div>
</template>
