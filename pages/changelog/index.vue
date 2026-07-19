<script setup lang="ts">
useSeoMeta({
  title: $t('RoxyBrowser 更新日志 - 查看功能升级和最新改进'),
  description: $t('及时查看 RoxyBrowser 指纹浏览器的每次更新内容，包括新功能发布、性能优化和漏洞修复。掌握最新改进，让你的浏览体验始终领先。'),
})

const { initZoom } = useMediumZoom('.zoom-images img[data-zoomable]')

function formatDate(date: string) {
  const d = new Date(date)
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`
}

const { public: { roxyHomeUrl } } = useRuntimeConfig()
const PAGE_SIZE = 15
const pageIndex = ref(1)

const { data: appversions } = await useAsyncData('get_version_list', async (_nuxtApp) => {
  const response: any = await $fetch(`${roxyHomeUrl}/app_statistics/get_version_list`, {
    method: 'GET',
    params: {
      page_index: 1,
      page_size: PAGE_SIZE,
      os: 'Windows',
      osBit: 64,
    },
  })
  return {
    rows: response.data.rows.filter(shouldShowVersionItem),
    total: response.data.total,
  }
})

// 渲染用数据列表与总数，SSR 首屏渲染后再在客户端追加
const items = ref<any[]>(appversions.value?.rows ?? [])
const total = ref<number>(appversions.value?.total ?? (appversions.value?.rows?.length ?? 0))
watch(appversions, (val) => {
  if (val) {
    items.value = val.rows ?? []
    total.value = Number(val.total ?? (val.rows?.length ?? 0))
  }
}, { immediate: false })

const isLoadingMore = ref(false)
const hasMore = ref(items.value.length < total.value)

async function loadMore() {
  if (isLoadingMore.value || !hasMore.value)
    return
  isLoadingMore.value = true
  try {
    pageIndex.value += 1
    const response: any = await $fetch(`${roxyHomeUrl}/app_statistics/get_version_list`, {
      method: 'GET',
      params: {
        page_index: pageIndex.value,
        page_size: PAGE_SIZE,
        os: 'Windows',
        osBit: 64,
      },
    })
    const rows: any[] = (response?.data?.rows ?? []).filter(shouldShowVersionItem)
    const totalFromResp = Number(response?.data?.total ?? total.value)
    if (rows.length > 0)
      items.value = items.value.concat(rows)
    total.value = totalFromResp
    hasMore.value = items.value.length < total.value
    nextTick(() => initZoom())
  }
  catch {
    // 失败时保持可再次重试
  }
  finally {
    isLoadingMore.value = false
  }
}

if (import.meta.client) {
  setTimeout(() => {
    const hash = window.location.hash
    if (hash) {
      const el = document.getElementById(hash.substring(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, 200)
}

/** 统一 versionType 判断，避免接口大小写不一致 */
function resolveVersionType(versionType: unknown) {
  const type = String(versionType ?? '').toLowerCase().replace(/_/g, '')
  if (type === 'app')
    return 'app'
  if (type === 'firefoxcore' || type === 'firefox')
    return 'firefoxCore'
  return 'core'
}

/** 接口无内容时返回 {}，有内容时包含 zh-CN / en / ru 等语言 key */
function hasNewFeatureTips(newFeatureTips: unknown) {
  if (!newFeatureTips || typeof newFeatureTips !== 'object')
    return false
  return Object.keys(newFeatureTips).length > 0
}

/** 是否为 Firefox 内核类型（仅此类走 newFeatureTips 过滤） */
function isFirefoxCoreVersion(versionType: unknown) {
  const type = String(versionType ?? '').toLowerCase().replace(/_/g, '')
  return type === 'firefoxcore' || type === 'firefox'
}

/** 仅过滤 Firefox 内核：无 newFeatureTips 时不展示；app / core 等其他类型不受影响 */
function shouldShowVersionItem(item: { versionType?: unknown, newFeatureTips?: unknown }) {
  if (!isFirefoxCoreVersion(item.versionType))
    return true
  return hasNewFeatureTips(item.newFeatureTips)
}
</script>

<template>
  <div class="bg-[#F9FAFB] relative overflow-hidden">
    <div class="w-[150%] left-1/2 top-0 absolute z-9 md:w-full -translate-x-1/2 lg:-top-100px md:-top-20 xl:-top-200px">
      <img src="/about-us/bg.svg" class="w-full select-none" draggable="false">
    </div>

    <Container class="pt-142px relative z-10">
      <div class="flex flex-col lg:px-24">
        <div class="flex flex-col gap-3 lg:pl-140px lg:pl-216px">
          <h1 class="text-28px font-700 md:text-h2">
            {{ $t('更新日志') }}
          </h1>
          <p class="text-4 text-primary leading-24px font-400 md:text-5 md:leading-32px">
            {{ $t('记录 RoxyBrowser 每个版本的重要更新与优化内容。从新功能上线到系统稳定性提升，我们不断完善产品，为多账户管理与隐私保护提供更可靠的支持。') }}
          </p>
        </div>

        <div class="pt-10 flex flex-col gap-5 lg:pt-72px">
          <div v-for="(item, index) in items" :id="item.id" :key="item.id" class="flex scroll-mt-20">
            <p class="upgrade-date mt-2 shrink-0 w-140px hidden lg:w-216px md:block">
              {{ formatDate(item.releaseTime) }}
            </p>
            <div class="flex gap-10 min-w-0 w-full md:flex-1 md:w-auto">
              <div class="flex-col gap-5 hidden items-center justify-center md:flex">
                <div
                  class="mt-2 p-5px rounded-full flex items-center justify-center" :class="[
                    index === 0 ? 'bg-[rgba(17,163,253,0.20)]' : 'bg-[#F1F3F5]',
                  ]"
                >
                  <div class="rounded-full size-10px" :class="[index === 0 ? 'bg-[#11A3FD]' : 'bg-[#AAAFB3]']" />
                </div>
                <div class="bg-[#E4ECF1] flex-1 w-1px" />
              </div>
              <div class="pb-15 flex flex-1 flex-col gap-5 min-w-0">
                <div>
                  <div class="flex gap-3 items-center">
                    <p class="upgrade-date block md:hidden">
                      {{ formatDate(item.releaseTime) }}
                    </p>
                    <div
                      class="text-14px text-white leading-18px font-[JetBrains_Mono] font-500 px-3 py-1 rounded-full version-badge"
                      :class="{
                        'version-badge--app': resolveVersionType(item.versionType) === 'app',
                        'version-badge--core': resolveVersionType(item.versionType) === 'core',
                        'version-badge--firefox': resolveVersionType(item.versionType) === 'firefoxCore',
                      }"
                    >
                      {{
                        resolveVersionType(item.versionType) === 'app'
                          ? item.version
                          : resolveVersionType(item.versionType) === 'firefoxCore'
                            ? `Firefox ${item.coreVersion}`
                            : `chromium ${item.coreVersion}`
                      }}
                    </div>
                    <p class="update-title hidden md:block">
                      {{ resolveVersionType(item.versionType) === 'app' ? $t('应用更新') : $t('内核更新') }}
                    </p>
                  </div>
                  <p class="update-title mt-3 md:hidden">
                    {{ resolveVersionType(item.versionType) === 'app' ? $t('应用更新') : $t('内核更新') }}
                  </p>
                </div>
                <div class="bg-[#E4ECF1] h-1px md:hidden" />
                <PageChangelogContent :item="item" />
              </div>
            </div>
          </div>
        </div>

        <div class="mb-15 mt-5 flex justify-center">
          <div
            class="text-body text-[#34393D] leading-28px font-500 border-1 border-[#C7D1D6] rounded-2 border-solid flex h-52px w-full items-center justify-center md:w-416px"
            :class="[
              !hasMore ? 'opacity-40 cursor-not-allowed pointer-events-none' : (isLoadingMore ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'),
            ]"
            :aria-disabled="!hasMore || isLoadingMore"
            @click="loadMore"
          >
            {{ isLoadingMore ? $t('加载中...') : $t('查看更多') }}
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>

<style scoped lang="scss">
.htmlContent {
  img {
    width: 292px;
  }
}

.upgrade-date {
  @apply text-[#111213] text-14px font-500 leading-20px;
}

.update-title {
  @apply md:text-h5 text-h6 text-[#111213] multilingual-text font-600;
}

.version-badge--app {
  background-color: #00b845;
}

.version-badge--core {
  background-color: #11a3fd;
}

.version-badge--firefox {
  background-color: #ff9a11;
}
</style>
