<template>
  <div class="mt-82px text-h6 font-500 font-[Archivo] mb-8 sm:mb-0 text-center sm:text-left">
    {{ $t('套餐对比') }}
  </div>

  <div class="gap-8 sm:gap-5 items-end flex-wrap grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
    <div 
      v-for="item in packages.filter(v => v.id !== 'free')" 
      :key="item.id"
      :class="cn('w-full relative', { 
        'pt-2 px-1 pb-1 mt-28px': item.id === recommendPackage 
      })"
    >
      <div  
        class="absolute top-[-28px] right-0 w-full h-[calc(100%+28px)] bg-[linear-gradient(99deg,_#238AFF_15.85%,_#F9B3B5_107.9%)] z-0 text-14px font-600 text-white rounded-4"
        v-if="item.id === recommendPackage"
      >
        <span class="relative top-3 left-5">
          {{ 'Most Popular' }}
        </span>
      </div>
      <div 
        :class="cn(
          'relative z-1 bg-[#222350] rounded-3 backdrop-blur-30px border-1 border-solid border-white/30 p-6',
          {
            'border-none': item.id === recommendPackage,
          }
        )"
      >
        <div class="flex justify-between items-end">
          <span class="text-5 font-500 font-[Archivo] text-white/90">{{ item.name }}</span>
          <span class="text-3 font-500 text-white/40">
            ({{ item.min + 1 }}-{{ item.max }} {{ $t('窗口')}})
          </span>
        </div>

        <div class="mt-15px">
          <span class="text-white/60 font-400">≥</span>
          <span class="text-6 font-600 text-[#FC9D12] mx-2">${{ item.price }}</span>
          <span class="text-3 font-400 text-white/60">/{{ $t('窗口') }}</span>
        </div>

        <div class="flex flex-col gap-3 mt-64px">
          <div v-for="child in item.children" :key="child" class="flex items-center gap-2">
            <img src="/pricing/site_ic_check-fill.svg" />
            <span class="text-3 font-400 text-body-second text-white/90">{{ child }}</span>
          </div>
        </div>

        <NuxtLinkLocale
          to="/download"
          :class="cn(
            'inline-block text-center mt-8 bg-white/20 text-14px p-10px rounded-1 border-1 border-solid border-white/40 w-full text-white cursor-pointer',
            {
              'bg-[#11A3FD] border-none': item.id === recommendPackage,
            }
          )"
        >
          {{ item.buttonText }}
        </NuxtLinkLocale>
      </div>
    </div>
  </div>

  <div class="mt-6 flex gap-5">
    <div class="py-8 px-5 border-white/30 border-1 border-solid rounded-3 flex flex-col gap-3 w-full sm:w-1/2 bg-[#222350] sm:bg-transparent">
      <div>
        <span class="text-5 font-500">{{ $t('免费') }}</span>
        <span class="text-3 font-400 text-white/60 ml-3">(5 {{ $t('窗口') }})</span>
      </div>

      <div class="flex gap-3 flex-wrap mt-64px sm:mt-0">
        <div class="flex items-center gap-2">
          <img src="/pricing/site_ic_check-fill.svg" />
          <span class="text-14px">{{ 'Cras leo diam, vulputate sit.' }}</span>
        </div>

        <div class="flex items-center gap-2">
          <img src="/pricing/close.svg" />
          <span class="text-14px">{{ 'Nam pretium/eleifend mauris/Nam pretium' }}</span>
        </div>
      </div>
    </div>

    <div class="py-8 px-5 border-white/30 border-1 border-solid rounded-3 bg-[#222350] w-1/2 justify-between items-center hidden sm:flex">
      <div class="flex flex-col gap-3">
        <div class="text-sub-title font-400 text-white/90">
          {{ 'Questions about the price? Feel free to contact us!' }}
        </div>
        <div class="text-14px font-500 text-white/40">
          {{ 'We work 24/7 and value your feedbacks' }}
        </div>
      </div>

      <LiveChat>
        <div class="rounded-full bg-[#12A3FC] border-1 border-solid border-white size-12 flex items-center justify-center mr-5">
          <img src="/rx_ic_live_chat.svg" alt="live-chat" class="w-full h-full object-cover" />
        </div>
      </LiveChat>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getPackagePrice
} from './configs'

// 套餐
const packages = computed(() => getPackagePrice())

const recommendPackage = 'business';
</script>