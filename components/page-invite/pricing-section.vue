<script setup lang="tsx">
import currency from 'currency.js'
import { discountCalculate, tierCalculate } from '@/components/page-pricing/configs'
import { createPricingContext } from '@/components/page-pricing/pricing-context'
import PricingTable from '@/components/page-pricing/normal/pricing-table.vue'
import PageInvitePricingBenefitCard from './pricing-benefit-card.vue'

const { public: { roxyHomeUrl } } = useRuntimeConfig()

const { isZh } = useRxI18n()

/** 定价区标题：中文用系统栈，西文用 Archivo */
const pricingTitleLatin = computed(() => !isZh.value)

const profile = ref(10)
const time = ref(30)
const timeOptions = [
  { label: $t('30 天'), value: 30, discount: 0 },
  { label: $t('90 天'), value: 90, discount: 15, discountIcon: '/pricing/90day.svg' },
  { label: $t('180 天'), value: 180, discount: 25, discountIcon: '/pricing/180day.svg' },
  { label: $t('360 天'), value: 360, discount: 40, discountIcon: '/pricing/360day.svg' },
]

// 受邀折扣：静态展示阶段固定为 0，后续接 get_promotion_link_discount
const inviteDiscount = ref(0)

const discountDetails = computed(() => [
  { label: $t('新客户'), value: 20 },
  { label: $t('受邀用户'), value: inviteDiscount.value, hide: inviteDiscount.value === 0 },
  { label: $t('续订优惠'), value: 7.5, hide: true },
  {
    label: $t('订阅折扣'),
    value: timeOptions.find(item => item.value === time.value)!.discount,
    hide: timeOptions.find(item => item.value === time.value)!.discount === 0,
  },
])

const totalDiscount = computed(() => {
  return currency(1 - discountDetails.value.filter(item => !item.hide).reduce((acc, item) => acc * (1 - item.value / 100), 1))
    .multiply(100)
    .value
})

const originalPrice = computed(() => tierCalculate(profile.value).value)
const discountedPrice = computed(() => {
  return originalPrice.value * discountCalculate([...discountDetails.value.filter(item => !item.hide).map(item => item.value)])
})
const savePrice = computed(() => currency(originalPrice.value).subtract(discountedPrice.value).value)

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
</script>

<template>
  <!-- PC 端整块高度 1362px -->
  <section id="invite-pricing" class="bg-white scroll-mt-20 lg:(box-border min-h-[1362px] flex flex-col)">
    <Container class="flex flex-col pt-10 px-4 lg:(pt-20 px-60px) xl:(w-[1280px] mx-auto px-0)">
      <!-- 移动端：24px/28px、字重 600；PC：48px/60px、字重 700；中文不指定 font-family -->
      <h2
        class="invite-pricing-section__title w-full self-stretch text-center text-primary text-[24px] leading-[28px] font-600 lg:(text-[48px] leading-[60px] font-700)"
        :class="{ 'invite-pricing-section__title--latin': pricingTitleLatin }"
      >
        {{ $t('升级你的体验') }}
      </h2>

      <!-- 移动端：标题↔选择器 20px；PC：24px -->
      <div class="mt-[20px] w-full overflow-visible lg:(mt-[24px] flex justify-center)">
        <PageInvitePricingTimeSelector v-model="time" />
      </div>

      <!-- 移动端：选择器↔权益卡 20px、权益卡↔表格 20px；PC：上 24px / 下 32px -->
      <div class="mt-[20px] mb-[20px] lg:(mt-[24px] mb-[32px])">
        <PageInvitePricingBenefitCard />
      </div>

      <div class="invite-pricing-table">
        <PricingTable v-model="profile" mobile-panel-class="!mt-0" />
      </div>
    </Container>
  </section>
</template>

<style scoped>
/* 定价区标题：仅西文（英/俄）指定 Archivo */
.invite-pricing-section__title--latin {
  font-family: Archivo, sans-serif;
}

/* 移动端 Basic/Pro 下拉（sm:hidden 区块）：仅 invite 定价表内覆盖样式 */
@media (max-width: 639.98px) {
  .invite-pricing-table :deep(.rx-select) {
    border-radius: var(--Common-TextInput-radius-radius-lg, 8px);
    border: 1px solid var(--colors-border-border-action, #C7D1D6);
    background: var(--colors-background-bg-action, #FFF);
    box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05);
  }
}

/* Invite PC 底部价格栏：借鉴 pricing 页吸底思路，仅在 invite 容器内覆盖，不改共享 pricing-table */
@media (min-width: 1024px) {
  /* sticky 容器不占高度 + 吸底锚点偏移（en 站 34px 思路），避免挤压表头 */
  .invite-pricing-table :deep(div.sticky:has(> .top-42px)) {
    height: 0;
    overflow: visible;
    top: calc(100vh - 68px - 34px);
  }

  /* 内层价格栏下移 32px，与表格底留间距 */
  .invite-pricing-table :deep(.top-42px) {
    top: 32px;
  }

  /* 白底价格栏：去掉 rounded-b-3，左右缩进 1px 避免遮挡表格外侧 border */
  .invite-pricing-table :deep(.top-42px > div) {
    box-sizing: border-box;
    width: calc(100% - 2px);
    margin-left: 1px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>

