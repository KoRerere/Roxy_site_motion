<template>
  <div class="grid grid-cols-2 px-5 pt-0 sm:px-6 sm:pt-6 shadow-[0_0_8px_0_rgba(36,48,56,0.15)] rounded-3" v-bind="$attrs">
    <div class="col-span-2 sm:col-span-1 flex flex-col items-center justify-center sm:justify-start gap-2 border-solid border-[#E4E8EB] border-b-1 border-l-0 border-r-0 border-t-0 h-105px">
      <span class="text-14px font-700 text-primary leading-18px">{{ $t('所需要的窗口数量') }}</span>
      <PricingInputNumber2 v-model="modelValue" :min="10" :max="100000" :step='{ ...profileSteps }' />
    </div>
  
    <div class="col-span-2 sm:col-span-1 flex gap-2 items-center justify-center border-solid border-[#E4E8EB] border-b-1 border-l-0 sm:border-l-1 border-r-0 border-t-0 h-105px">
      <span class="text-[#FC9D12] font-600">
        <span class="text-4">$</span>
        <span class="text-11">{{ currency(price).format().replace('$', '') }}</span>
      </span>

      <span class="flex flex-col gap-1 font-500">
        <span class="text-4 text-primary">/{{ startWithUpper($t("窗口")) }}</span>
        <span class="text-3 text-[#A3A9AD]">
          <rx-i18n-t :keypath="$t('{min}-{max} 数量区间', { min: min, max: max })" />
        </span>
      </span>
    </div>

    <div class="col-span-2 flex justify-center items-center h-105px">
      <div class="flex items-center gap-10px">
        <span class="text-[#12A3FC] font-700">
          <span class="text-6 mr-1">$</span>
          <span class="text-9">{{ currency(monthPrice).format().replace('$', '') }}</span>
        </span>
        <span class="flex flex-col gap-1">
          <span class="font-sub-title font-[Archivo]">
            /{{ $t('月') }}
            <span @click="openHandler" @mouseenter="openHandler">
              <RxIcon name="base/rx_ic_info" />
            </span>
          </span>
          <span class="text-[#FC9D12] text-3 py-2px px-1 bg-[#FFEEDC] rounded-1">{{ $t('节省') }} {{ currency(monthSave).format() }}</span>
        </span>
      </div>
    </div>
  </div>

  <Popover 
    ref="op" 
    :pt="{ 
      root: { 
        class: '!border-0 !bg-transparent before:!hidden after:!hidden' 
      }, 
      content: { 
        class: '!p-0' 
      } 
    }"
  >
    <Illustrate class="w-[392px]" />
  </Popover>
</template>

<script setup lang="ts">
import currency from 'currency.js';
import PricingInputNumber2 from './pricing-input-number2.vue';
import { profileSteps } from './configs';
import Illustrate from '~/components/page-pricing/illustrate.vue'
import { RxIcon } from '@/components/rx-icon'

const props = defineProps({
  monthPrice: {
    type: Number,
    default: 0
  },
  monthSave: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  }
})

const op = useTemplateRef('op')

const openHandler = (e: MouseEvent) => {
  op.value?.show(e);
}

const modelValue = defineModel<number>('modelValue', { required: true })

</script>

<style scoped>

</style>