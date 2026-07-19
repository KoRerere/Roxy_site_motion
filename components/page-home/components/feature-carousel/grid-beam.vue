<template>
  <div class="grid-beam relative h-full w-full">
    <Beam />
    <slot />
  </div>
</template>

<script setup lang="ts">
import Beam from './beam.vue'
</script>
