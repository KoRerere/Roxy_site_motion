<script lang="ts" setup>
withDefaults(defineProps<{
  size?: string
  strokeWidth?: number
}>(), {
  size: '50px',
  strokeWidth: 4,
})
</script>

<template>
  <svg
    class="shrink-0 [animation-duration:0.8s] animate-spin"
    :style="{ width: size, height: size }"
    viewBox="0 0 50 50"
  >
    <circle
      class="[stroke-dasharray:90_150] [stroke-linecap:round] fill-none stroke-[#11a3fd]"
      cx="25"
      cy="25"
      r="20"
      :stroke-width="strokeWidth"
    />
  </svg>
</template>
