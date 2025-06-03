<template>
  <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-100px mt-20 list-none text-white">
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

<script setup lang="ts">
import CountUp from './CountUp.vue'
import LatestVisit from './LatestVisit.vue'
import { backendMap } from '@/constants/langs'

const { public: { roxyHomeUrl, ENV } } = useRuntimeConfig()
const { $t, locale }  = useRxI18n()

const realtime = reactive(getLocalStorage('realtime', {
  apiCount: 0,
  winCount: 0,
  latestAccessFrom: '',
}))

const request = async () => {
  try {
    const result = await fetch(`${roxyHomeUrl}/app_statistics/get_official_website_other_data_config`, {
      headers: {
        language: backendMap[locale.value]
      }
    })
    if (result.ok) {
      const data = await result.json()
      if (data.code === 0 && data.data) {
        realtime.apiCount = data.data?.apiCount
        realtime.winCount = data.data?.winCount
        realtime.latestAccessFrom = data.data?.latestAccessFrom
        setLocalStorage('realtime', realtime)
      }
    }
  } catch(error) {

  }
}

watch(locale, () => {
  request()
})

onMounted(() => {
  request()
  const timer = setInterval(request, ENV === 'production' ? 60000 * 5 : 11000)

  onUnmounted(() => {
    clearInterval(timer)
  })
})

</script>

<style scoped>
.globe-text-label {
  @apply text-18px leading-150% lg:text-h6 font-700 text-nowrap;
}

.globe-text-value {
  @apply text-white text-8 !leading-150% lg:text-h2 font-700;
}
</style>
