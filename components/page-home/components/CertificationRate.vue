<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: {
    type: Number,
    default: 100,
  },
  withDark: Boolean,
})

const circumference = 2 * Math.PI * 44
const offset = computed(() => circumference * (1 - props.score / 100))
</script>

<template>
  <div class="cert-rate inline-flex h-[100px] w-[100px] items-center justify-center relative" :class="{ 'with-dark': withDark }">
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 98 98" fill="none" class="absolute -rotate-90">
      <circle cx="49" cy="49" r="44" stroke="#E5E7EB" stroke-width="10" />
      <circle cx="49" cy="49" r="44" stroke="#1DC94D" stroke-width="10" :stroke-dasharray="circumference" :stroke-dashoffset="offset" />
    </svg>
    <div class="flex flex-col items-center inset-0 justify-center absolute">
      <span class="score-text font-bold" style="color: #1DC94D">{{ score }}</span>
      <span class="sub-text">/100</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.score-text {
  color: var(--colors-text-text-success, #1dc94d);
  text-align: center;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 32px; /* 133.333% */
}
.sub-text {
  color: var(--colors-text-text-secondary, #34393d);
  text-align: center;
  font-family: Inter;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 138.462% */
}
.cert-rate.with-dark {
  [data-theme='dark'] & {
    --colors-text-text-secondary: #cdcfd0;
  }
}
</style>
