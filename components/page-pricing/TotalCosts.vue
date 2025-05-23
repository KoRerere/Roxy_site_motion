<template>
  <div class="text-4 sm:text-14px font-500 text-[#FAFAFA] xl:text-inherit flex gap-10px items-center font-[Archivo] relative left-1 sm:left-0">
    {{ $t('套餐总价') }}
    <span 
      @click="openHandler" 
      @mouseenter="openHandler" 
      @mouseleave="closeHandler"
    >
      <RxIcon name="base/rx_ic_info" />
    </span>
  </div>
  <div class="flex gap-10px items-center mt-0 sm:mt-2">
    <div class="text-8 sm:text-28px xl:text-4 font-600 text-[#11A3FD]">
      <span class="text-4 relative left-1 bottom-2px sm:left-0 sm:bottom-0">$</span>
      {{ currency(currPrice).format().replace('$', '') }}
    </div>
    <div class="flex flex-col gap-2px">
      <span 
        v-if="save != 0"
        class="text-3 font-500 text-[#FC9D12] py-2px px-1 bg-[rgba(252_157_18/0.10)] rounded-1"
      >
        {{ `${ $t('节省') } ${ currency(save).format() }` }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
import currency from 'currency.js';

const props = defineProps({
  currPrice: {
    type: Number,
    default: 0,
  },
  save: {
    type: Number,
    default: 0,
  }
});

const emit = defineEmits(['show', 'hide'])

const openHandler = (e) => {
  emit('show', e)
}

const closeHandler = () => {
  // emit('hide')
}
</script>