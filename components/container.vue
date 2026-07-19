<script setup lang="ts">
const props = defineProps({
  tag: {
    type: String,
    default: 'div',
  },
})
</script>

<template>
  <component :is="tag" class="rx-container" v-bind="$attrs">
    <slot />
  </component>
</template>
