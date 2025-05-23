<template>
  <picture>
    <source 
      v-for="image in images" 
      :srcset="image.src" 
      :media="image.breakpoint ? `(min-width: ${breakpoints[image.breakpoint]})` : undefined"
    >
    <img draggable="false" v-bind="$attrs">
  </picture>
</template>

<script setup lang="ts">

const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// sm: '640px',
// md: '768px',
// lg: '1024px',
// xl: '1280px',
// '2xl': '1536px',

export type Image = {
  src: string,
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const props = defineProps({
  images: {
    type: Array as PropType<Image[]>,
    required: true
  }
})
</script>


