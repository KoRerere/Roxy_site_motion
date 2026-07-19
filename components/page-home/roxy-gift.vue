<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

const emit = defineEmits<{
  openGiftDialog: []
}>()
const { locale } = useRxI18n()
</script>

<template>
  <div class="bg-[#F3F9FC] overflow-hidden">
    <Container>
      <div class="flex flex-col items-center justify-between xl:(flex-row gap-36)">
        <div class="flex flex-col max-xl:(pt-10 items-center)">
          <p class="text-6 leading-normal font-[Archivo] font-700 text-left sm:text-9 sm:leading-11.5">
            {{ $t('新用户礼包，下载就送') }}
          </p>
          <div class="text-3.5 leading-[1.5] mt-2 sm:(text-4.5 leading-7) max-sm:px-5 max-xl:text-center">
            {{ $t('下载桌面客户端以解锁您的专属新用户福利：静态住宅 IP、动态住宅 IP (流量包)、终身折扣 任选其一！ ') }}
          </div>

          <button class="text-4 text-white font-500 mt-3 px-4 py-2 rounded-2 border-none bg-[#11A3FD] inline-flex gap-1.5 w-fit cursor-pointer items-center" @click="emit('openGiftDialog')">
            {{ $t('下载领取礼包') }}
            <RxIcon name="base/rx_ic_chevron_right" class="text-white" size="24" />
          </button>
        </div>

        <div class="relative">
          <div class="w-634px aspect-[317/140] max-md:(w-374px)">
            <RxResponsiveImage
              :name="locale === 'zh' ? 'activity/new-user-card-zh' : 'activity/new-user-card-en'"
              class="aspect-[317/140] relative z-2"
              loading="eager"
              :alt="$t('代理 IP')"
            />
          </div>

          <div class="rounded-full bg-[#17A5FD] h-123px w-272px absolute z-1 blur-80px md:(h-246px w-545px) -bottom-5/6 -left-20" />
          <div class="rounded-full bg-[#EAA0F7] h-123px w-272px absolute z-1 blur-80px md:(h-246px w-545px) -bottom-5/6 -right-20" />
        </div>
      </div>
    </Container>
  </div>
</template>
