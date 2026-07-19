<script setup lang="ts">
const isChinaSite = process.env.SITE_VARIANT === 'china'
const breakpoints = useRxBreakpoints()
const mdWidth = breakpoints.smallerOrEqual('md')

const playMode = computed(() => {
  const isSmall = mdWidth.value
  const list = [
    {
      icon: 'visa',
      w: isSmall ? 120 : 160,
      size: isSmall ? 70 : 80,
      alt: 'VISA',
    },
    {
      icon: 'mastercard',
      w: isSmall ? 120 : 160,
      size: isSmall ? 40 : 50,
      alt: 'Mastercard',
    },
    {
      icon: 'unionpay',
      w: isSmall ? 120 : 160,
      size: isSmall ? 35 : 45,
      alt: 'UnionPay',
    },
    {
      icon: 'usdt',
      w: isSmall ? 120 : 160,
      size: isSmall ? 65 : 75,
      alt: 'USDT',
      hidden: isChinaSite,
    },
    {
      icon: 'alipay',
      w: isSmall ? 140 : 180,
      size: isSmall ? 70 : 80,
      alt: 'Alipay',
    },
    {
      icon: 'wechat',
      w: isSmall ? 140 : 180,
      size: isSmall ? 100 : 110,
      alt: 'Weichat',
    },
  ]
  return list.filter(item => !item.hidden)
})
</script>

<template>
  <h3 class="text-6 text-primary font-700 pt-10 text-center sm:text-h3 max-sm:leading-normal lg:pt-18 md:pt-16 sm:pt-12 xl:pt-20">
    {{ $t('接受多种付款方式') }}
  </h3>

  <div class="mb-18 mt-8 flex justify-center md:mb-20 md:mt-58px">
    <div class="inline-flex flex-wrap gap-x-10px gap-y-5 justify-center md:gap-8">
      <div
        v-for="item in playMode"
        :key="item.icon"
        class="rounded-2.5 bg-white flex h-10 items-center justify-center lg:rounded-3 md:h-[66px]"
        :style="{ width: `${item.w}px` }"
      >
        <img :src="`/pricing/rx_ic_${item.icon}.svg`" :alt="item.alt" :style="{ width: `${item.size}px` }" draggable="false" class="select-none">
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
