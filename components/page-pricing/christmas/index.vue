<script setup lang="tsx">
import currency from 'currency.js'
import { RxIcon } from '@/components/rx-icon'
import { discountCalculate, tierCalculate } from '../configs'
import Faq from '../faq.vue'
import PlayMode from '../play-mode.vue'
import { createPricingContext } from '../pricing-context'
import PricingButtonGroupMobile from './pricing-button-group-mobile.vue'
import PricingButtonGroup from './pricing-button-group.vue'
import PricingTable from './pricing-table.vue'
import Snow from './snow.vue'

const { public: { roxyHomeUrl } } = useRuntimeConfig()

const { locale } = useRxI18n()

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
  {
    label: $t('双旦活动大促'),
    labelClass: 'text-[#0C9B68] font-700 font-[Archivo] text-4.5',
    value: 20,
    valueClass: 'text-[#F53838] font-600 text-4.5',
    component: (props: any) => {
      return (
        <div class="flex flex-1 items-center justify-between">
          <div class="flex gap-1 items-center">
            <RxIcon name="color/rx-rl-flower" size="24" />
            <span class={['', props.labelClass]}>{props.label}</span>
          </div>
          <span class={['', props.valueClass]}>
            -
            {props.value}
            %
          </span>
        </div>
      )
    },
  },
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

onErrorCaptured((e) => {
  console.log('onErrorCaptured', e)
  return false
})
</script>

<template>
  <main>
    <!-- 头部 -->
    <div class="christmas-linear-gradient text-[#FFF] relative overflow-hidden">
      <ClientOnly>
        <Snow />
      </ClientOnly>
      <img src="/pricing/christmas/tree1.svg" class="hidden bottom-0 left-90px absolute xl:block">
      <img src="/pricing/christmas/tree2.svg" class="hidden bottom-0 right-90px absolute xl:block">

      <Container class="pt-138px flex flex-col gap-2 relative z-10 overflow-hidden">
        <p class="text-white flex gap-2.5 items-center justify-center">
          <RxIcon name="color/rx-rl-star" size="24" />
          <span class="text-5 leading-20px font-[Archivo] font-700 lg:text-6">{{ $t('双旦活动大促') }}</span>
          <RxIcon name="color/rx-rl-star" size="24" />
        </p>
        <h1 class="text-7 leading-48px font-700 text-center sm:text-10 max-sm:leading-snug">
          <RxI18nT :keypath="$t('窗口订阅立享 8 折优惠 {p1} 再享 8 折优惠 {p2}', { p1: '{p1}', p2: '{p2}' })">
            <template #p1>
              <br class="en-US:hidden ru-RU:hidden zh-CN:lg:hidden">
              <span
                class="text-4 text-[#FFE7D9] leading-32px font-500 hidden lg:text-6 lg:inline"
                v-html="$t('新用户额外')"
              />
              <span
                class="text-4 text-[#FFE7D9] leading-32px font-500 lg:text-6 lg:hidden"
                v-html="locale === 'en' ? $t('新用户额外').replace(', ', '<br>') : $t('新用户额外')"
              />
              <br class="en-US:hidden zh-CN:hidden ru-RU:lg:hidden">
            </template>
            <template #p2>
              <span class="text-4 text-[#FFE7D9] leading-32px font-500 lg:text-6 zh-CN:hidden">{{ $t('p2') }}</span>
            </template>
          </RxI18nT>
        </h1>
        <p class="text-3.5 text-white leading-24px font-[Inter] font-700 text-center lg:text-4">
          <span class="ru-RU:max-lg:hidden">
            {{ $t('限时优惠（2025.12.23 – 2026.01.06）') }}
          </span>
          <span class="hidden ru-RU:max-lg:inline">
            2025.12.23 – 2026.01.06
          </span>
        </p>
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
      <div class="mt-10 hidden justify-between lg:flex">
        <h2>{{ $t('价格计算') }}</h2>
      </div>

      <PricingTable v-model="profile" class="mt-10 lg:mb-20 lg:mt-4 lg:pb-20" />

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
