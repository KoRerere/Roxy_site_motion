<script setup lang="ts">
import { platformList } from './components/config'
import Marquee from './components/Marquee.vue'
import Media from './components/Media.vue'

const breakpoints = useRxBreakpoints()
const lgWidth = breakpoints.smallerOrEqual('lg')
</script>

<template>
  <div class="h-15">
    <Media v-if="!lgWidth" />
    <Marquee v-else class="[--duration:20s]">
      <ul class="list-none flex gap-5 items-center">
        <li v-for="item in platformList" :key="item">
          <img loading="lazy" :src="item" alt="" draggable="false" class="select-none">
        </li>
      </ul>
    </Marquee>
  </div>
</template>
