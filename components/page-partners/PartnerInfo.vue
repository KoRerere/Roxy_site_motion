<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

interface PartnerInfoProps {
  name: string
  logo?: string
  useCase: string
  supportedRegions: string
}

defineProps<PartnerInfoProps>()
</script>

<template>
  <div class="bg-white flex flex-col gap-5 overflow-hidden lg:gap-10">
    <!-- Logo section -->
    <img :src="logo" :alt="name" class="border border-black/6 rounded-2 border-solid bg-[#FAFDFE] flex w-auto items-center justify-center relative overflow-hidden sm:h-148px sm:w-fit">

    <!-- Content section -->
    <div class="flex flex-col gap-5 lg:gap-10">
      <div class="flex flex-col gap-2">
        <p class="text-body text-[#11A3FD] font-600">
          {{ $t('适用场景：') }}
        </p>
        <p class="text-sub-title text-primary leading-24px whitespace-pre-line">
          {{ useCase }}
        </p>
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-body text-[#11A3FD] font-600">
          {{ $t('支持地区：') }}
        </p>
        <p class="text-sub-title text-primary leading-24px">
          {{ supportedRegions }}
        </p>
      </div>
    </div>
  </div>
</template>
