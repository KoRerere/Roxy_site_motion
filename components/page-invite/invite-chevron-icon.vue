<script setup lang="ts">
defineOptions({ name: 'InviteChevronIcon' })

/** invite 专用右箭头：内联 SVG，SSR/CSR 一致，避免 RxIcon ClientOnly 水合警告 */
withDefaults(defineProps<{
  size?: number | string
  color?: string
  class?: string
}>(), {
  size: 16,
  color: 'currentColor',
})
</script>

<template>
  <svg
    :class="['inline-block shrink-0', $props.class]"
    :width="size"
    :height="size"
    viewBox="0 0 16 16"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M5.52729 3.52859C5.78764 3.26824 6.20975 3.26824 6.4701 3.52859L10.4701 7.52859C10.7305 7.78894 10.7305 8.21105 10.4701 8.4714L6.4701 12.4714C6.20975 12.7317 5.78764 12.7317 5.52729 12.4714C5.26694 12.2111 5.26694 11.7889 5.52729 11.5286L9.05589 8L5.52729 4.4714C5.26694 4.21105 5.26694 3.78894 5.52729 3.52859Z" />
  </svg>
</template>
