<template>
  <div 
    class="electric-bg electric-bg-right mt-8 md:mt-110px gap-8 sm:gap-12 md:gap-64px"
    ref="rightRef"
  >
    <div class="electric-line" style="transform: rotate(-1deg)">
      <ul>
        <motion.div
          v-for="index in 3"
          :key="index"
          :custom="index - 1"
          class="electric-line-item"
          :initial="{ x: '100vw' }"
          :animate="'visible'"
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
          :animate="'visible'"
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
          :animate="'visible'"
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
          :animate="'visible'"
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
          :animate="'visible'"
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
          :animate="'visible'"
          :variants="variants6"
        />
      </ul>
    </div>
  </div>
  <div 
    class="electric-bg electric-bg-left mt-8 md:mt-110px gap-8 sm:gap-12 md:gap-64px"
    ref="leftRef"
  >
    <div class="electric-line" style="transform: rotate(2deg)">
      <ul>
        <motion.div
          v-for="index in 3"
          :key="index"
          :custom="index - 1"
          class="electric-line-item"
          :initial="{ x: '100vw' }"
          :animate="'visible'"
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
          :animate="'visible'"
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
          :animate="'visible'"
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
          :animate="'visible'"
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
          :animate="'visible'"
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
          :animate="'visible'"
          :variants="variants6"
        />
      </ul>
    </div>
  </div>
</template>

<script setup>
import { motion } from "motion-v";

const variants1 = {
  initial: { x: "100vw" },
  visible: (index) => ({
    x: "-240px",
    transition: {
      duration: 4,
      ease: [0.65, 0.05, 0.36, 1],
      delay: index * 1,
      repeat: Infinity,
      repeatDelay: 1,
    },
  }),
};
const variants2 = {
  initial: { x: "100vw" },
  visible: (index) => ({
    x: "-240px",
    transition: {
      duration: 4,
      ease: [0.65, 0.05, 0.36, 1],
      delay: (index + 0.6) * 2,
      repeat: Infinity,
      repeatDelay: 2.3,
    },
  }),
};
const variants3 = {
  initial: { x: "100vw" },
  visible: (index) => ({
    x: "-240px",
    transition: {
      duration: 4,
      ease: [0.65, 0.05, 0.36, 1],
      delay: (index + 0.7) * 1.3,
      repeat: Infinity,
      repeatDelay: 1.3,
    },
  }),
};
const variants4 = {
  initial: { x: "100vw" },
  visible: (index) => ({
    x: "-240px",
    transition: {
      duration: 4,
      ease: [0.65, 0.05, 0.36, 1],
      delay: (index + 0.9) * 2.1,
      repeat: Infinity,
      repeatDelay: 2.7,
    },
  }),
};
const variants5 = {
  initial: { x: "100vw" },
  visible: (index) => ({
    x: "-240px",
    transition: {
      duration: 4,
      ease: [0.65, 0.05, 0.36, 1],
      delay: (index + 0.7) * 1.9,
      repeat: Infinity,
      repeatDelay: 2.2,
    },
  }),
};
const variants6 = {
  initial: { x: "100vw" },
  visible: (index) => ({
    x: "-240px",
    transition: {
      duration: 4,
      ease: [0.65, 0.05, 0.36, 1],
      delay: (index + 1.1) * 1.6,
      repeat: Infinity,
      repeatDelay: 1.7,
    },
  }),
};

const rightRef = useTemplateRef('rightRef')
const leftRef = useTemplateRef('leftRef')

onMounted(() => {
  const timer = setTimeout(() => {
    rightRef.value.style.visibility = 'visible'
    leftRef.value.style.visibility = 'visible'
  }, 1500)

  return () => {
    clearTimeout(timer)
  }
})
</script>

<style lang="scss" scoped>
.electric-bg {
  position: absolute;
  top: 0;
  z-index: 0;
  display: flex;
  flex-direction: column;
  visibility: hidden;

  &.electric-bg-right {
    transform: translateX(calc(50vw));
    .electric-line {
      transform-origin: 0 0;
      background-image: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 15%,
        rgba(255, 255, 255, 0.1) 30%,
        rgba(255, 255, 255, 0) 50%
      );
    }
  }
  &.electric-bg-left {
    transform: translateX(calc(-75vw));
    .electric-line {
      transform-origin: 100% 0;
      background-image: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 30%,
        rgba(255, 255, 255, 0.1) 60%,
        rgba(255, 255, 255, 0) 75%
      );
    }
  }
  .electric-line {
    position: relative;
    width: 100vw;
    height: 1px;
    ul {
      list-style-type: none;
      .electric-line-item {
        position: absolute;
        top: -2px;
        width: 240px;
        height: 5px;
        background-image: linear-gradient(
          90deg,
          rgba(48, 134, 255, 0.1) 0%,
          rgba(48, 134, 255, 1) 10%,
          rgba(48, 134, 255, 0) 100%
        );
        &:after {
          content: "";
          position: absolute;
          top: -2px;
          left: 0;
          width: 100%;
          height: 5px;
          background-image: linear-gradient(
            90deg,
            rgba(48, 134, 255, 0.1) 0%,
            rgba(48, 134, 255, 1) 10%,
            rgba(48, 134, 255, 0) 100%
          );
          filter: blur(20px);
        }
      }
    }
  }
}
</style>
