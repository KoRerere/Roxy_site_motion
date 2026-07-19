<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

const emit = defineEmits<{
  openGiftDialog: []
}>()

const { locale } = useRxI18n()
</script>

<template>
  <div class="w-full">
    <!-- 背景渐变取自 new-user-card-en 在首页深蓝底上的合成色：#263465 → #4E5880 -->
    <div
      class="campaign-banner px-3 pb-0 pt-6 rounded-3 relative overflow-hidden md:px-12 xl:px-15 xl:py-0 md:pt-10"
    >
      <div class="flex flex-col gap-0 w-full items-center relative xl:flex-row xl:gap-15 xl:items-start xl:justify-between">
        <div class="flex flex-col gap-5 max-w-full items-center xl:pt-15 xl:max-w-560px xl:items-start">
          <div class="text-center flex flex-col gap-2 w-full items-center xl:text-left xl:items-start">
            <h2 class="text-6 text-white leading-normal font-[Archivo] font-700 md:text-9 md:leading-11.5">
              {{ $t('新用户礼包，下载就送') }}
            </h2>
            <p class="text-3.5 text-white leading-5 font-400 break-words md:text-4.5 md:leading-7">
              {{ $t('下载桌面客户端以解锁您的专属新用户福利：静态住宅 IP、动态住宅 IP (流量包)、终身折扣 任选其一！') }}
            </p>
          </div>
          <button
            class="text-4 text-white leading-6 font-500 px-4 py-2 rounded-2 border-none bg-[#11A3FD] inline-flex gap-1.5 w-fit cursor-pointer items-center"
            @click="emit('openGiftDialog')"
          >
            {{ $t('下载领取礼包') }}
            <RxIcon name="base/rx_ic_chevron_right" size="20" class="text-white" />
          </button>
        </div>

        <!-- lg 下图卡区域居中，最大 634px，与 roxy-gift 一致 -->
        <div class="relative">
          <div class="w-634px aspect-[317/140] max-md:w-308px">
            <RxResponsiveImage
              :name="locale === 'zh' ? 'activity/new-user-card-zh' : 'activity/new-user-card-en'"
              class="w-634px aspect-[317/140] max-md:w-308px"
              loading="lazy"
              :alt="$t('代理 IP')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.campaign-banner {
  background: linear-gradient(239.7deg, rgba(24, 38, 86, 0.58) 18.08%, rgba(55, 66, 108, 0.54) 67.68%);
  border: none;
  box-shadow: none;
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  backdrop-filter: blur(18px) saturate(140%);
}

@media (min-width: 1280px) {
  .campaign-banner {
    background: linear-gradient(202deg, rgba(24, 38, 86, 0.58) 18.08%, rgba(55, 66, 108, 0.54) 67.68%);
  }
}
</style>
