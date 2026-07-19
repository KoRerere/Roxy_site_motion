<script lang="ts" setup>
import { cn } from '@/utils/basic'

withDefaults(
  defineProps<{
    class?: string
    reverse?: boolean
    pauseOnHover?: boolean
    vertical?: boolean
    repeat?: number
  }>(),
  {
    pauseOnHover: false,
    vertical: false,
    repeat: 4,
  },
)
</script>

<template>
  <div
    :class="
      cn(
        'group flex overflow-hidden p-2 [--duration:60s] [--gap:1rem] [gap:var(--gap)]',
        vertical ? 'flex-col' : 'flex-row',
        $props.class,
      )
    "
  >
    <div
      v-for="index in repeat"
      :key="index"
      :class="
        cn(
          'flex shrink-0 justify-around [gap:var(--gap)]',
          vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row',
          pauseOnHover ? 'group-hover:[animation-play-state:paused]' : '',
        )
      "
      :style="{
        animationDirection: reverse ? 'reverse' : 'normal',
      }"
    >
      <slot />
    </div>
  </div>
</template>
