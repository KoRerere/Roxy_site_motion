<script setup lang="ts">
import { useRealtime } from '~/composables/useRealtime'
import CountUp from './CountUp.vue'
import LatestVisit from './LatestVisit.vue'

const realtime = useRealtime()
</script>

<template>
  <ul class="text-white mt-20 list-none gap-10 grid grid-cols-1 lg:gap-100px lg:grid-cols-3 md:grid-cols-2">
    <li class="flex flex-col gap-0 lg:gap-3">
      <p class="globe-text-label">
        {{ $t('已处理 API 请求数量') }}
      </p>
      <CountUp :count="realtime.apiCount" class="globe-text-value" />
    </li>
    <li class="flex flex-col gap-0 lg:gap-3">
      <p class="globe-text-label">
        {{ $t('实时保护窗口总数') }}
      </p>
      <CountUp :count="realtime.winCount" class="globe-text-value" />
    </li>
    <li class="flex flex-col gap-0 lg:gap-3">
      <p class="globe-text-label">
        {{ $t('最近访问源自') }}
      </p>
      <LatestVisit :value="realtime.latestAccessFrom" class="globe-text-value" />
    </li>
  </ul>
</template>

<style scoped>
.globe-text-label {
  @apply text-18px max-lg:leading-150% lg:text-h6 font-700 text-nowrap;
}

.globe-text-value {
  @apply text-white text-8 !max-lg:leading-150% lg:text-h2 font-700;
}
</style>
