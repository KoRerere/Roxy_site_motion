<template>
  <h3 class="text-center font-700 text-6 leading-normal sm:text-h3 text-primary pt-10 sm:pt-12 md:pt-16 lg:pt-18 xl:pt-20">{{ $t('接受多种付款方式') }}</h3>

  <div class="flex justify-center mt-8 md:mt-58px mb-18 md:mb-20">
    <div class="inline-flex flex-wrap justify-center gap-x-10px gap-y-5 md:gap-8">
      <div 
        v-for="item in playMode" 
        class="h-10 md:h-[66px] flex items-center justify-center bg-white rounded-10px lg:rounded-3"
        :style="{ width: item.w + 'px' }"
      >
        <img :src="`/pricing/rx_ic_${item.icon}.svg`" :alt="item.alt" :style="{ width: item.size + 'px' }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const breakpoints = useRxBreakpoints();
const mdWidth = breakpoints.smallerOrEqual('md')

const playMode = computed(() => {
  const isSmall = mdWidth.value;
  const list = [
    {
      icon: 'visa',
      w: isSmall ? 120 : 160,
      size: isSmall ? 70 : 80,
      alt: 'VISA'
    },
    {
      icon: 'mastercard',
      w: isSmall ? 120 : 160,
      size: isSmall ? 40 : 50,
      alt: 'Mastercard'
    },
    {
      icon: 'unionpay',
      w: isSmall ? 120 : 160,
      size: isSmall ? 35 : 45,
      alt: 'UnionPay'
    },
    {
      icon: 'usdt',
      w: isSmall ? 120 : 160,
      size: isSmall ? 65 : 75,
      alt: 'USDT'
    },
    {
      icon: 'alipay',
      w: isSmall ? 140 : 180,
      size: isSmall ? 70 : 80,
      alt: 'Alipay'
    },
    {
      icon: 'wechat',
      w: isSmall ? 140 : 180,
      size: isSmall ? 100 : 110,
      alt: 'Weichat'
    }
  ]
  return list;
})
</script>

<style scoped>

</style>
