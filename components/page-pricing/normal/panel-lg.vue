<script setup lang="ts">
import currency from 'currency.js'
import { RxIcon } from '@/components/rx-icon'
import { profileSteps, tierList } from '../configs'
import { usePricingContext } from '../pricing-context'
import PricingInputNumber2 from './pricing-input-number2.vue'
import Illustrate from '../illustrate.vue'

const { profile, discountedPrice, savePrice, discountDetails, totalDiscount } = usePricingContext()

const packData = computed(() => {
  if (profile.value === 0) {
    return {
      min: 0,
      max: 5,
      price: 0.80,
    }
  }
  const tier = tierList.find(item => item.minWindows < profile.value && item.maxWindows >= profile.value)!
  return {
    min: tier.minWindows,
    max: tier.maxWindows,
    price: tier.windowPrice,
  }
})

const modelValue = defineModel<number>('modelValue', { required: true })
</script>

<template>
  <div class="px-5 pt-0 rounded-3 grid grid-cols-2 shadow-[0_0_8px_0_rgba(36,48,56,0.15)] sm:px-6 sm:pt-6" v-bind="$attrs">
    <div class="border-b-1 border-l-0 border-r-0 border-t-0 border-[#E4E8EB] border-solid flex flex-col gap-2 col-span-2 h-125px items-center justify-center sm:col-span-1 sm:justify-start">
      <span class="text-14px text-primary leading-18px font-700">{{ $t('所需要的窗口数量') }}</span>
      <PricingInputNumber2 v-model="modelValue" :min="10" :max="100000" :step="{ ...profileSteps }" />
    </div>

    <div class="border-b-1 border-l-0 border-r-0 border-t-0 border-[#E4E8EB] border-solid flex flex-col gap-2 col-span-2 h-125px items-center justify-center sm:border-l-1 sm:col-span-1">
      <div class="text-sub-title text-primary leading-24px font-[Archivo] font-500 text-center">
        {{ $t('{profile}+5 窗口', { profile: modelValue }) }}
      </div>
      <div class="flex gap-2 items-center justify-center">
        <span class="text-[#FC9D12] font-600">
          <span class="text-4">$</span>
          <span class="text-11">{{ currency(packData.price).format().replace('$', '') }}</span>
        </span>

        <span class="font-500 flex flex-col gap-1">
          <span class="text-4 text-primary">/{{ startWithUpper($t("窗口")) }}</span>
          <span class="text-3 text-[#A3A9AD]">
            <rx-i18n-t :keypath="$t('{min}-{max} 数量区间', { min: packData.min, max: packData.max })" />
          </span>
        </span>
      </div>
    </div>

    <div class="flex col-span-2 h-125px items-center justify-center">
      <div class="flex flex-col gap-2.5 items-center md:flex-row">
        <div class="flex gap-2.5 items-center justify-center">
          <RxTooltip
            trigger="hover"
            placement="top"
            tooltip-content-class="!bg-white"
            :offset="10"
          >
            <template #content>
              <div class="flex flex-col gap-2.5 w-240px ru-RU:w-300px p-3">
                <div
                  v-for="(item, index) in discountDetails.filter(item => !item.hide)"
                  :key="index"
                  class="leading-24px font-500 flex items-center justify-between"
                >
                  <template v-if="!item.component">
                    <span class="text-4 text-primary" :class="item.labelClass">{{ item.label }}</span>
                    <span class="text-4.5 text-[#FD9F12]" :class="item.valueClass">-{{ item.value }}%</span>
                  </template>
                  <component :is="item.component" v-else v-bind="item" />
                </div>
              </div>
            </template>
            <div class="text-4.5 text-primary leading-26px font-[Archivo] font-600 inline-flex gap-1 cursor-pointer items-center">
              {{ $t('详细折扣信息') }}
              <div class="flex transition-transform duration-150 items-center justify-center hover:rotate-180">
                <RxIcon name="base/rx_ic_chevron_down" />
              </div>
            </div>
          </RxTooltip>
          <div class="text-4 text-white leading-24px font-[Inter] font-700 px-3 rounded-full bg-[#F53838]">
            {{ $t('{discount}% 折扣', { discount: `-${totalDiscount}` }) }}
          </div>
        </div>
        <div class="flex gap-2.5 items-center justify-center">
          <span class="text-[#12A3FC] font-700">
            <span class="text-6 mr-1">$</span>
            <span class="text-9">{{ currency(discountedPrice).format().replace('$', '') }}</span>
          </span>
          <span class="flex flex-col gap-1">
            <span class="font-sub-title multilingual-text">
              /{{ $t('月') }}
              <RxTooltip
                trigger="hover"
                placement="top"
                tooltip-content-class="!bg-transparent"
                :offset="10"
              >
                <template #content>
                  <div class="p-0">
                    <Illustrate class="w-[392px]" />
                  </div>
                </template>
                <span class="cursor-pointer">
                  <RxIcon name="base/rx_ic_info" />
                </span>
              </RxTooltip>
            </span>
            <span v-if="savePrice > 0" class="text-3 text-[#FC9D12] px-1 py-2px rounded-1 bg-[#FFEEDC]">
              {{ $t('节省') }} {{ currency(savePrice).format() }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
