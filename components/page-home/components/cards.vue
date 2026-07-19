<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="text-white font-500 py-1 pl-3 pr-4 rounded-full flex flex-wrap gap-[4px_20px] items-center justify-center lg:(bg-[linear-gradient(90deg,#3B84FA_0.33%,#7B75F0_45.03%,#FF846B_88.33%)] flex-nowrap gap-6)">
      <div
        v-for="item in [
          { icon: 'base/rx_ic_discount', label: $t('首次购买享 8 折优惠') },
          { icon: 'base/rx_ic_internet', label: $t('免费代理 IP') },
          { icon: 'base/rx_ic_no_credit', label: $t('无支付手续费') },
        ]" :key="item.label"
        class="leading-24px flex gap-2 whitespace-nowrap items-center"
      >
        <RxIcon :name="item.icon" size="16" />
        {{ item.label }}
      </div>
    </div>
  </div>
</template>
