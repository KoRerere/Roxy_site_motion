<template>
  <div class="flex justify-center mt-10">
    <pricingButtonGroup v-model="ratioValue" />
  </div>

  <div class="text-white/90 text-6 font-600 mt-10 font-[Archivo]">
    {{ $t('价格计算器') }}
  </div>
  <div class="flex justify-center mt-6 gap-5">
    <div 
      class="flex-1 flex flex-col gap-6 p-10 xl:p-6 border-1 border-solid border-white/30 rounded-3 bg-[#222350] backdrop-blur-30px"
    >
      <div class="gap-4 hidden md:flex">
        <div 
          v-for="item in packages" 
          :key="item.id"
          :class="cn(
            'flex-1 flex flex-col gap-6px justify-between p-2 xl:px-4 xl:py-3 rounded-2 bg-white/20 border-1 border-solid border-white/60 cursor-pointer',
            {
              '!border-none bg-black/20 cursor-not-allowed': item.id === 'free',
              'border-2 border-white/70 bg-[#11A3FD]': activePackage.id === item.id
            }
          )"
          @click="item.id === 'free' ? null : activePackage = item"
        >
          <div class="text-5 font-600">{{ item.name }}</div>
          <div class="text-14px font-400 text-white/40">≥ ${{ item.price }}/{{ $t('窗口') }}</div>
        </div>
      </div>

      <div class="flex gap-8 flex-wrap xl:flex-nowrap">
        <div class="flex-1 flex-col gap-10px hidden md:flex">
          <div class="text-14px font-500">{{ $t('滑动以选择窗口数量')  }}</div>
          <RxSlider 
            v-model="profile" 
            :scale="0.03"
            :min="10"
            :max="100000" 
            :marks="profileMarks" 
            :step="{ ...profileSteps }" 
            :mark-formatter="markFormatter" 
          />
        </div>

        <div class="flex-col gap-10px hidden xl:flex">
          <InputNumber />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-28px sm:gap-6 xl:hidden w-full">
          <div class="col-span-1 flex items-center flex-col gap-3">
            <InputNumber />
          </div>
          <div class="col-span-1 flex items-center flex-col gap-3">
            <UnitPrice />
          </div>
          <div class="col-span-1 md:col-span-2 lg:col-span-1 flex items-center flex-col gap-3">
            <TotalCosts 
              :save="save" 
              :currPrice="currPrice" 
              @show="openHandler" 
              @hide="closeHandler" 
            />
          </div>
        </div>
      </div>
    </div>

    <div 
      class="w-304px p-6 border-1 border-solid border-white/30 rounded-3 bg-[#222350] backdrop-blur-30px hidden xl:block"
    >
      <UnitPrice />
      <div class="my-5 border-1 border-dashed border-white/30"></div>
      <TotalCosts 
        :save="save" 
        :currPrice="currPrice" 
        @show="openHandler" 
        @hide="closeHandler" 
      />
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

<script setup lang="tsx">
import pricingButtonGroup from './pricing-button-group.vue'
import PricingInputNumber from './pricing-input-number.vue'
import { usePricing } from './configs'
import TotalCosts from './TotalCosts.vue'
import Illustrate from './illustrate.vue'

import { 
  profileMarks, 
  profileSteps, 
  markFormatter
} from './configs'

const {
  profile,
  currPrice,
  save,
  ratioValue,
  packages,
  activePackage,
  originPrice
} = usePricing()

const { $t } = useRxI18n()

const op = useTemplateRef('op')

const openHandler = (e) => {
  console.log('openHandler', e)
  op.value?.show(e);
}

const closeHandler = () => {
  op.value?.hide();
}

const InputNumber = () => <>
  <div class="text-4 sm:text-14px font-500 text-white/48 xl:text-inherit">
    {$t('所需要的窗口数量')}
  </div>
  <div>
    <PricingInputNumber 
      modelValue={profile.value} 
      onUpdate:modelValue={(val) => profile.value = val}
      step={{...profileSteps}}
      min={10}
      max={100000}
    />
  </div>
</>

const UnitPrice = () => <>
  <div class="text-[#FAFAFA] xl:text-inherit text-4 sm:text-14px font-[Archivo]">
    {$t('窗口单价')}
  </div>
  <div class="flex flex-row xl:flex-col gap-2 xl:gap-0">
    <div class="flex gap-10px mt-0 sm:mt-6px items-baseline leading-none">
      <span class="font-600 text-[#FC9D12] text-12 sm:text-9">
        <span class="text-5 sm:text-6 relative -left-1 bottom-2px sm:left-0 sm:bottom-0">$</span>
        <span class="relative bottom-[-2px] inline-block h-12 sm:h-auto">{activePackage.value.price}</span>
      </span>
      <span class="text-14px font-400 text-white/40 hidden xl:block">/{ $t('窗口') }</span>
    </div>
    <div class="flex flex-col justify-center">
      <div class={'text-5 sm:text-4 text-white/90 xl:hidden'}>/{ $t('窗口') }</div>
      <div class="text-4 sm:text-3 font-500 text-white/48">
        {activePackage.value.min + 1}-{activePackage.value.max} { $t('窗口') }
      </div>
    </div>
  </div>
</>

// const TotalCosts = () => <>
//   <div class="text-14px font-500 text-[#FAFAFA] xl:text-inherit flex gap-10px items-center font-[Archivo]">
//     {$t('套餐总价')}
//     <span ref={infoIcon} onClick={openHandler} onMouseenter={openHandler} onMouseleave={closeHandler}>
//       <RxIcon name="base/rx_ic_info" />
//     </span>
//   </div>
//   <div class="flex gap-10px items-center mt-2">
//     <div class="text-28px xl:text-4 font-600 text-[#11A3FD]">
//       <span class="text-4">$</span>
//       { currency(currPrice.value).format().replace('$', '') }
//     </div>
//     <div class="flex flex-col gap-2px">
//       {
//         save.value != 0 ? <span 
//           class="text-3 font-500 text-[#FC9D12] py-2px px-1 bg-[rgba(252_157_18/0.10)] rounded-1"
//         >
//           { `${ $t('节省') } ${ currency(save.value).format() }` }
//         </span> : null
//       }
//     </div>
//   </div>
// </>

</script>

<style scoped>

</style>
