<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import PartnerCard from './PartnerCard.vue'

interface PartnerListItem {
  id: string | number
  name: string
  title: string
  summary: string
  logo?: string
}

const { $t, locale } = useRxI18n()
const { public: { roxyHomeUrl } } = useRuntimeConfig()
const breakpoints = useRxBreakpoints()
const isMobile = breakpoints.smallerOrEqual('md')
// PC 端显示全部，移动端分批加载
const pageSize = 6
const displayedCount = ref(pageSize)
const isLoading = ref(false)
const loadMoreTrigger = ref<HTMLElement>()

/** 按语言缓存合作伙伴列表，同语言下复用 payload，避免重复请求 */
const { data: allPartnersData, pending } = await useAsyncData(
  () => `company-partner-list-${locale.value}`,
  async () => {
    const response: any = await $fetch(`${roxyHomeUrl}/app_statistics/get_company_partner_list`, {
      method: 'GET',
      params: { language: locale.value },
    })
    return (response.data ?? []) as PartnerListItem[]
  },
  { watch: [locale] },
)

const allPartners = computed(() => allPartnersData.value ?? [])

/** 根据端型与列表长度同步展示条数，需在接口数据返回后调用 */
function syncDisplayedCount() {
  displayedCount.value = isMobile.value
    ? Math.min(pageSize, allPartners.value.length)
    : allPartners.value.length
}

watch([allPartnersData, isMobile], () => {
  syncDisplayedCount()
}, { immediate: true })

// 显示的数据
const displayedPartners = computed(() => {
  return allPartners.value.slice(0, displayedCount.value)
})

// 是否还有更多数据
const hasMore = computed(() => {
  return displayedCount.value < allPartners.value.length
})

// 加载更多
function loadMore() {
  if (isLoading.value || !hasMore.value)
    return
  isLoading.value = true
  setTimeout(() => {
    displayedCount.value = Math.min(displayedCount.value + pageSize, allPartners.value.length)
    isLoading.value = false
  }, 300)
}

// 移动端滚动加载 - 使用 watch 监听元素变化
watch(loadMoreTrigger, (element) => {
  if (element && isMobile.value) {
    nextTick(() => {
      useIntersectionObserver(
        loadMoreTrigger,
        ([{ isIntersecting }]) => {
          if (isIntersecting && hasMore.value && !isLoading.value) {
            loadMore()
          }
        },
        {
          rootMargin: '200px',
          threshold: 0.1,
        },
      )
    })
  }
}, { immediate: true })

// 格式化数据用于卡片显示
const formattedPartners = computed(() => {
  return displayedPartners.value.map((partner: PartnerListItem) => ({
    name: partner.name,
    title: partner.name,
    description: partner.summary ?? '', // 列表页使用简短描述
    logo: partner.logo,
    link: `/partners/${partner.id}`,
  }))
})
</script>

<template>
  <div>
    <div v-if="pending" class="text-sub-title text-secondary py-10 text-center">
      {{ $t('加载中...') }}
    </div>
    <div v-else class="gap-4 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
      <PartnerCard
        v-for="partner in formattedPartners"
        :key="partner.link"
        v-bind="partner"
      />
    </div>

    <!-- 移动端加载更多触发器 -->
    <div
      v-if="isMobile"
      ref="loadMoreTrigger"
      class="flex items-center justify-center"
    >
      <div v-if="isLoading" class="text-sub-title text-secondary">
        {{ $t('加载中...') }}
      </div>
    </div>
  </div>
</template>
