<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

interface PartnerCardProps {
  name: string
  title: string
  description: string
  logo?: string
  logoImage?: string
  link?: string
}

defineProps<PartnerCardProps>()
</script>

<template>
  <NuxtLinkLocale
    :to="link || '#'"
    class="group border border-black/6 rounded-4 border-solid bg-white flex flex-col w-full cursor-pointer hover:(outline-[#11A3FD] outline border-[#11A3FD] shadow-[0_2px_30px_0_rgba(199,209,214,0.30)])"
  >
    <!-- Logo section -->
    <div class="m-3 mb-5 rounded-2 bg-[#FAFDFE] flex h-188px items-center justify-center relative overflow-hidden">
      <div class="flex flex-col gap-3 items-center relative z-10">
        <div class="flex h-188px items-center justify-center overflow-hidden">
          <img :src="logo" :alt="title" class="h-full w-full object-cover">
        </div>
      </div>
    </div>

    <!-- Content section -->
    <div class="px-6 pb-6 pt-0 flex flex-1 flex-col gap-5 justify-between lg:px-8">
      <div class="flex flex-col gap-3">
        <h4 class="text-5 text-primary leading-6 font-600 lg:text-h6">
          {{ title }}
        </h4>
        <p class="text-sub-title text-primary whitespace-pre-line ellipsis-3 lg:text-body">
          {{ description }}
        </p>
      </div>
      <div class="text-sub-title flex gap-1 transition-colors items-center group-hover:text-[#11A3FD]">
        {{ $t('查看详情') }}
        <RxIcon name="base/rx_ic_chevron_right" size="16" class="transition-colors group-hover:text-[#11A3FD]" />
      </div>
    </div>
  </NuxtLinkLocale>
</template>
