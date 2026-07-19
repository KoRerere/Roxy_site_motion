<script setup>
import { ref } from 'vue'

const { locale } = useRxI18n()

const isAnimating = ref(false)

function animate() {
  isAnimating.value = false

  setTimeout(() => {
    isAnimating.value = true
  }, 10)
}

onMounted(() => {
  setTimeout(() => {
    animate()
  }, 200)
})
</script>

<template>
  <span class="relative">
    {{ $t('轻松释放') }}<svg
      class="ru-RU:-bottom-4.5 position-x-center absolute -bottom-2"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      height="17"
      viewBox="0 0 518 15"
      fill="none"
    >
      <path
        class="path" :class="{ animate: isAnimating }"
        d="M2 12.5C2 12.5 131.5 2.5 259 2.5C386.5 2.5 516 12.5 516 12.5"
        stroke="url(#paint0_linear_19351_59773)"
        :stroke-width="locale === 'ru' ? 4 : 6"
        stroke-linecap="round"
      />
      <defs>
        <linearGradient id="paint0_linear_19351_59773" x1="2" y1="2" x2="288.048" y2="30.9544" gradientUnits="userSpaceOnUse">
          <stop offset="0.3" stop-color="#EAA0F7" />
          <stop offset="0.9" stop-color="#3193FF" />
        </linearGradient>
      </defs>
    </svg>
  </span>
</template>

<style>
.path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  stroke: 2px;
}

.animate {
  animation: dash 1.3s cubic-bezier(0.37, 0, 0.63, 1) forwards;
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
