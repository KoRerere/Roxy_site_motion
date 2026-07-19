<script setup lang="ts">
import { useRealtime } from '~/composables/useRealtime'

const realtime = useRealtime()
const data = computed(() => [
  {
    label: $t('用户数量'),
    value: realtime.userCount,
  },
  {
    label: $t('实时保护窗口总数'),
    value: realtime.winCount,
  },
  {
    label: $t('已处理 API 请求数量'),
    value: realtime.apiCount,
  },
])
</script>

<template>
  <div class="linear-gradient text-white relative overflow-hidden">
    <Container class="relative z-10">
      <div class="py-10 flex flex-col gap-10 lg:px-20 lg:gap-6">
        <div class="gap-5 grid grid-cols-1 lg:gap-20 xl:gap-140px lg:grid-cols-3 lg:justify-center">
          <div v-for="item in data" :key="item.label" class="flex flex-col gap-0.5 lg:text-center">
            <div class="text-10 leading-52px font-700">
              {{ `${item.value?.toLocaleString()}` }}
            </div>
            <div class="text-5 leading-28px font-400">
              {{ item.label }}
            </div>
          </div>
        </div>
        <p class="whitespace-pre-line lg:text-center">
          {{ $t('RoxyBrowser 专注于构建 安全、稳定、高效的全球化浏览环境，累计服务全球 300 万+ 用户。\n广泛应用于跨境电商、广告投放、社媒运营以及全球化团队协作等多个高风险、高需求业务场景。') }}
        </p>
      </div>
    </Container>
  </div>
</template>

<style scoped>
.linear-gradient {
  background: url('@/assets/images/functions/autosize-banner-bg.svg') no-repeat center center / cover;
}
</style>
