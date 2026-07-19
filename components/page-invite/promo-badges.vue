<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
import promoDiscountIcon from '@/assets/svgs/intive/promo-discount.svg?url'
import promoInternetIcon from '@/assets/svgs/intive/promo-internet.svg?url'
import promoNoCreditIcon from '@/assets/svgs/intive/promo-no-credit.svg?url'

/** 前三项：折扣 / 代理 IP / 无手续费（中/英/俄共用，PC/移动均为 3 项） */
const coreBadges = computed(() => [
  { icon: 'base/rx_ic_discount' as const, mobileIcon: promoDiscountIcon, label: $t('invite.promoBadgeDiscount') },
  { icon: 'base/rx_ic_internet' as const, mobileIcon: promoInternetIcon, label: $t('invite.promoBadgeProxy') },
  { icon: 'base/rx_ic_no_credit' as const, mobileIcon: promoNoCreditIcon, label: $t('invite.promoBadgeNoPayment') },
])

/** 移动端设计稿：3 项灰色徽章 */
const mobileBadges = coreBadges
</script>

<template>
  <!-- 移动端：上排 2 项 gap 20px / 下排 1 项独占居中 / 行间距 4px -->
  <div class="flex w-full max-w-[358px] justify-center lg:hidden">
    <div class="flex flex-col items-center gap-[4px] py-[4px] pr-[16px] pl-[12px]">
      <div class="flex items-center gap-[20px]">
        <div
          v-for="item in mobileBadges.slice(0, 2)"
          :key="item.label"
          class="flex items-center gap-[8px] text-center text-secondary font-[Inter] text-[14px] leading-[24px] font-500"
        >
          <img
            :src="item.mobileIcon"
            alt=""
            aria-hidden="true"
            draggable="false"
            class="size-[14px] shrink-0 select-none"
          >
          {{ item.label }}
        </div>
      </div>
      <div
        v-if="mobileBadges[2]"
        class="flex items-center gap-[8px] text-center text-secondary font-[Inter] text-[14px] leading-[24px] font-500"
      >
        <img
          :src="mobileBadges[2].mobileIcon"
          alt=""
          aria-hidden="true"
          draggable="false"
          class="size-[14px] shrink-0 select-none"
        >
        {{ mobileBadges[2].label }}
      </div>
    </div>
  </div>

  <!-- PC 端：渐变胶囊（对齐首页 cards 与设计稿） -->
  <div class="hidden justify-center lg:flex">
    <div
      class="inline-flex flex-nowrap items-center justify-center gap-6 rounded-full py-1 pl-3 pr-4 text-white font-500 bg-[linear-gradient(90deg,#3B84FA_0.33%,#7B75F0_45.03%,#FF846B_88.33%)]"
    >
      <div
        v-for="item in coreBadges"
        :key="item.label"
        class="flex items-center gap-2 whitespace-nowrap text-3.5 leading-24px"
      >
        <RxIcon :name="item.icon" size="16" color="#fff" />
        {{ item.label }}
      </div>
    </div>
  </div>
</template>
