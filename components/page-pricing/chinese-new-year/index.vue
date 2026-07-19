<script setup lang="tsx">
import currency from 'currency.js'
import Cards from '@/components/page-home/components/cards.vue'
import RisingStar from '~/components/page-home/components/RisingStar.vue'
import { discountCalculate, tierCalculate } from '../configs'
import Faq from '../faq.vue'
import PlayMode from '../play-mode.vue'
import { createPricingContext } from '../pricing-context'
import PricingButtonGroupMobile from './pricing-button-group-mobile.vue'
import PricingButtonGroup from './pricing-button-group.vue'
import PricingTable from './pricing-table.vue'

const { public: { roxyHomeUrl } } = useRuntimeConfig()

const profile = ref(10)
const time = ref(360)
const timeOptions = [
  {
    label: $t('30 天'),
    value: 30,
    discount: 0,
  },
  {
    label: $t('90 天'),
    value: 90,
    discount: 15,
    discountIcon: '/pricing/90day.svg',
  },
  {
    label: $t('180 天'),
    value: 180,
    discount: 25,
    discountIcon: '/pricing/180day.svg',
  },
  {
    label: $t('360 天'),
    value: 360,
    discount: 40,
    discountIcon: '/pricing/360day.svg',
  },
]

// 是否显示受邀折扣
const inviteDiscount = ref(0)

const discountDetails = computed(() => [
  {
    label: $t('新客户'),
    value: 20,
  },
  {
    label: $t('受邀用户'),
    value: inviteDiscount.value,
    hide: inviteDiscount.value === 0,
  },
  {
    label: $t('续订优惠'),
    value: 7.5,
    hide: true,
  },
  {
    label: $t('订阅折扣'),
    value: timeOptions.find(item => item.value === time.value)!.discount,
    hide: timeOptions.find(item => item.value === time.value)!.discount === 0,
  },
  // {
  //   label: $t('双旦活动大促'),
  //   labelClass: 'text-[#0C9B68] font-700 font-[Archivo] text-4.5',
  //   value: 20,
  //   valueClass: 'text-[#F53838] font-600 text-4.5',
  //   component: (props: any) => {
  //     return (
  //       <div class="flex flex-1 items-center justify-between">
  //         <div class="flex gap-1 items-center">
  //           <RxIcon name="color/rx-rl-flower" size="24" />
  //           <span class={['', props.labelClass]}>{props.label}</span>
  //         </div>
  //         <span class={['', props.valueClass]}>
  //           -
  //           {props.value}
  //           %
  //         </span>
  //       </div>
  //     )
  //   },
  // },
])

const totalDiscount = computed(() => {
  return currency(1 - discountDetails.value.filter(item => !item.hide).reduce((acc, item) => acc * (1 - item.value / 100), 1))
    .multiply(100)
    .value
})

const originalPrice = computed(() => {
  return tierCalculate(profile.value).value
})

const discountedPrice = computed(() => {
  return originalPrice.value * discountCalculate([...discountDetails.value.filter(item => !item.hide).map(item => item.value)])
})

const savePrice = computed(() => {
  return currency(originalPrice.value).subtract(discountedPrice.value).value
})

createPricingContext({
  profile,
  time,
  timeOptions,
  discountedPrice,
  originalPrice,
  savePrice,
  discountDetails,
  totalDiscount,
})

onMounted(() => {
  const code = localStorage.getItem('code')
  if (code) {
    fetch(`${roxyHomeUrl}/app_statistics/get_promotion_link_discount?code=${code}`)
      .then(res => res.json())
      .then((res) => {
        if (res.code === 0 && res.data) {
          inviteDiscount.value = res.data.userDiscount
        }
      })
  }
})

// const Aurora = computed(() => {
//   return defineAsyncComponent(() => import('@/components/page-home/components/Aurora.vue'))
// })

onErrorCaptured((e) => {
  console.log('onErrorCaptured', e)
  return false
})
</script>

<template>
  <main>
    <!-- 头部 -->
    <div
      class="text-white relative overflow-hidden"
      :style="{ background: 'radial-gradient(101.35% 75.07% at 50% 100%, rgba(246, 104, 55, 0.90) 0%, rgba(246, 104, 55, 0.00) 100%), #B61E0F' }"
    >
      <!-- 灯笼 -->
      <div class="hidden xl:block">
        <img src="/activity/chinese-new-year/icon_new_year_lantern.svg" alt="chinese-new-year" class="left-35 top-0 absolute object-cover">
        <img src="/activity/chinese-new-year/icon_new_year_lantern.svg" alt="chinese-new-year" class="right-35 top-0 absolute object-cover">
      </div>
      <ClientOnly>
        <!-- <Aurora class="h-full w-full left-0 top-0 absolute !lg:h-240px" :speed="0.5" /> -->
        <RisingStar class="!h-full" />
      </ClientOnly>

      <Container class="flex flex-col gap-5 relative z-10 overflow-hidden md:gap-4">
        <h1 class="text-9 font-700 pt-120px text-center sm:text-h2 max-sm:leading-snug sm:pt-[132px]">
          <RxI18nT :keypath="$t('窗口 {p1} 或送 {p2}', { p1: '{p1}', p2: '{p2}' })">
            <template #p1>
              <span class="text-[#FFB24D] whitespace-nowrap">{{ $t('买一送一') }}</span>
            </template>
            <template #p2>
              <span class="text-[#FFB24D] whitespace-nowrap">{{ $t('成员额度') }}</span>
            </template>
          </RxI18nT>
        </h1>
        <Cards />
      </Container>

      <!-- 移动端 -->
      <div class="mt-10 pb-6 flex justify-center md:hidden">
        <PricingButtonGroupMobile v-model="time" />
      </div>

      <!-- PC端 -->
      <div class="mt-15 hidden md:block">
        <PricingButtonGroup v-model="time" />
      </div>
    </div>

    <!-- 套餐列表 & 价格计算器 -->
    <Container>
      <PricingTable v-model="profile" class="mt-10 lg:mb-20 lg:mt-9 lg:pb-28" />

      <div class="pb-20 pt-102px block lg:hidden">
        <CtaDownloadBtnByPanel />
      </div>
    </Container>

    <div
      style="background: radial-gradient(100% 100% at 50% 0%, #E8EFF2 0%, #FFF 100%);"
    >
      <Container>
        <PlayMode />
      </Container>
      <Faq />
      <Container>
        <CtaDownloadBtnByPanel2 />
      </Container>
    </div>
  </main>
</template>

<style scoped>
.christmas-linear-gradient {
  background: radial-gradient(93.98% 63.68% at 50% 100%, #c30a00 0%, rgba(195, 10, 0, 0) 100%), #aa2424;
}
</style>
