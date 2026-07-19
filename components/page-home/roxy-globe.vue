<script setup lang="ts">
import type { GlobeArc } from 'roxy-cobewebgl'
import RoxyCobewebgl from 'roxy-cobewebgl/vue'
import { computed } from 'vue'
import { getCityConnections } from './components/city'

const arcs = computed<GlobeArc[]>(() =>
  getCityConnections().map(d => ({
    order: d.order,
    startLat: d.startLat,
    startLng: d.startLng,
    endLat: d.endLat,
    endLng: d.endLng,
    color: d.color,
  })),
)

function hexToRgb01(hex: string): [number, number, number] {
  let h = hex.replace(/^#/, '')
  if (h.length === 3)
    h = h.split('').map(c => c + c).join('')
  const n = Number.parseInt(h, 16)
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

const { width } = useWindowSize()
const cobeConfig = reactive({
  globeRadius: 0.3,
  dots: 24000,
  class: '',
})

watch(width, () => {
  if (width.value < 480) {
    cobeConfig.globeRadius = 0.6
    cobeConfig.dots = 10000
    cobeConfig.class = 'size-900px -right-400px -top-0'
  }
  else if (width.value < 768) {
    cobeConfig.globeRadius = 0.6
    cobeConfig.dots = 12000
    cobeConfig.class = 'size-900px -right-400px -top-0'
  }
  else if (width.value < 1024) {
    cobeConfig.globeRadius = 0.6
    cobeConfig.dots = 14000
    cobeConfig.class = 'size-1000px -right-1/2 -top-1/6'
  }
  else if (width.value < 1280) {
    cobeConfig.globeRadius = 0.8
    cobeConfig.dots = 16000
    cobeConfig.class = 'size-1000px -right-1/2 -top-0'
  }
  else if (width.value < 1536) {
    cobeConfig.globeRadius = 0.7
    cobeConfig.dots = 20000
    cobeConfig.class = 'size-1480px -right-3/7 -top-1/2'
  }
  else {
    cobeConfig.globeRadius = 0.7
    cobeConfig.dots = 24000
    cobeConfig.class = 'size-1480px -right-1/3 -top-1/2'
  }
}, {
  immediate: true,
})
</script>

<template>
  <div class="absolute z-0" :class="[cobeConfig.class]">
    <RoxyCobewebgl
      :globe-radius="cobeConfig.globeRadius"
      :dots="cobeConfig.dots"
      :dot-size="0.005"
    
      :base-color="hexToRgb01('#141838')"
      :dot-color="hexToRgb01('#D9D9D9')"
      :glow-color="hexToRgb01('#000000')"
      :glow-on="0"
      :auto-rotate="false"
      :rotation-speed="0.001"
      @error="(e: Error) => console.error('[RoxyClobe]', e)"
    />
  </div>
</template>
