<script setup lang="ts">
import type { RxBreadcrumbProps } from '@/components/rx-breadcrumb'
import type { Partner } from '~/data/partners'
import { Fancybox } from '@fancyapps/ui/dist/fancybox/'
import PagePartnersPartnerInfo from '@/components/page-partners/PartnerInfo.vue'
import RxBreadcrumb from '@/components/rx-breadcrumb/index.vue'
import { RxIcon } from '@/components/rx-icon'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

const route = useRoute()
const { $t, locale } = useRxI18n()
const { public: { roxyHomeUrl } } = useRuntimeConfig()

interface PartnerDetailResponse {
  code?: number
  data?: Record<string, any>
  msg?: string
}

const partnerId = computed(() => route.params.slug as string)

/** 将接口返回映射为页面使用的 Partner 结构 */
function mapPartnerDetail(raw: Record<string, any>): Partner {
  return {
    name: raw.name ?? '',
    title: raw.title ?? raw.name ?? '',
    summary: raw.summary ?? '',
    description: raw.description ?? raw.summary ?? '',
    website: raw.website ?? '',
    logo: raw.logo,
    useCase: raw.useCase ?? raw.use_case ?? '',
    supportedRegions: raw.supportedRegions ?? raw.supported_regions ?? '',
    screenshots: raw.screenshots ?? [],
    isFollow: raw.isFollow,
    slug: String(raw.id ?? raw.slug ?? partnerId.value),
  }
}

/** 查询合作伙伴详情：入参 language + id（与列表页跳转参数一致） */
async function getPartner(id: string) {
  const response = await $fetch<PartnerDetailResponse>(`${roxyHomeUrl}/app_statistics/get_company_partner_detail`, {
    method: 'GET',
    params: {
      language: locale.value,
      id,
    },
  })

  if (response.code !== undefined && response.code !== 0)
    return null

  if (!response.data)
    return null

  return mapPartnerDetail(response.data)
}

const { data: partnerRaw } = await useAsyncData(
  () => `company-partner-detail-${locale.value}-${partnerId.value}`,
  () => getPartner(partnerId.value),
  { watch: [locale, partnerId] },
)

if (!partnerRaw.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Partner not found',
  })
}

// 根据路由 id 获取合作伙伴信息
const partnerData = computed(() => {
  const partner = partnerRaw.value
  if (!partner) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Partner not found',
    })
  }
  return partner
})

// 面包屑
const breadcrumbs = computed<RxBreadcrumbProps['items']>(() => [
  {
    title: $t('首页'),
    path: '/',
  },
  {
    type: 'separator',
  },
  {
    title: $t('RoxyBrowser 合作伙伴'),
    path: '/partners',
  },
  {
    type: 'separator',
  },
  {
    title: partnerData.value.name,
    path: route.path,
  },
])

useSeoMeta({
  title: computed(() => `${partnerData.value.name} - ${$t('RoxyBrowser 合作伙伴')}`),
  description: computed(() => partnerData.value.description ?? partnerData.value.summary),
})

onMounted(() => {
  Fancybox.bind(document.body, '[data-fancybox]', {
    Carousel: {
      Toolbar: {
        display: {
          left: [],
          right: ['close'],
        },
      },
    },
  })

  onUnmounted(() => {
    Fancybox.unbind(document.body)
    Fancybox.close()
  })
})
</script>

<template>
  <div class="bg-white relative overflow-hidden">
    <!-- Background image -->
    <div class="bottom-[-10.94%] left-0 right-0 top-0 absolute z-0 overflow-hidden">
      <img src="/partners/partner-bg-1.jpg" alt="" class="h-80 min-w-full block object-cover">
    </div>

    <!-- Main content -->
    <div class="pt-100px relative z-10 lg:pt-130px">
      <Container>
        <!-- Breadcrumb -->
        <div class="mb-8">
          <RxBreadcrumb :items="breadcrumbs" />
        </div>

        <!-- Title and buttons -->
        <div class="mb-20 flex flex-col gap-16 items-start lg:flex-row">
          <div class="flex-1 order-1 lg:order-1">
            <h1 class="text-h5 text-primary font-[Archivo] font-700 mb-3 lg:text-h3">
              {{ partnerData.title }}
            </h1>
            <p class="text-sub-title text-primary mb-8 whitespace-pre-line lg:text-body">
              {{ partnerData.description ?? partnerData.summary }}
            </p>
            <div class="flex flex-wrap gap-3 items-center">
              <a :href="partnerData.website" target="_blank" v-bind="partnerData.isFollow ? { } : { rel: 'nofollow noopener' }" class="text-16px text-white font-500 px-16px py-2.5 rounded-2 bg-[#11A3FD] flex gap-1.5 cursor-pointer transition-opacity items-center hover:opacity-90">
                {{ $t('了解更多') }}
                <RxIcon name="base/rx_ic_chevron_right" size="20" />
              </a>
              <LiveChat>
                <button class="text-16px font-500 px-16px py-2.5 border border-black/6 rounded-2 flex gap-1.5 cursor-pointer transition-colors items-center hover:bg-gray-50">
                  <RxIcon name="base/rx_ic_headphone_2" size="20" />
                  {{ $t('联系我们') }}
                </button>
              </LiveChat>
            </div>

            <div class="mt-10 gap-4 grid lg:grid-cols-2">
              <template v-for="imgUrl in partnerData.screenshots" :key="imgUrl">
                <img :src="imgUrl" :alt="imgUrl" class="border border-black/6 rounded-2 border-solid cursor-zoom-in" data-fancybox="gallery">
              </template>
            </div>

            <Fancybox />
          </div>

          <!-- Partner Info Card -->
          <div class="shrink-0 w-full order-2 lg:w-308px lg:order-2">
            <PagePartnersPartnerInfo v-bind="partnerData" />
          </div>
        </div>
      </Container>
    </div>
  </div>
</template>

<style>
.f-zoomable {
  padding-top: 92px;
}

.f-panzoom__content {
  border-radius: 8px;
}

.fancybox__container {
  --f-arrow-pos: 64px;
}

.fancybox__thumbs {
  visibility: hidden;
}
</style>
