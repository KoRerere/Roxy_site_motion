<script setup lang="ts">
import { toast } from 'vue-sonner'
import { RxIcon } from '@/components/rx-icon'
import RxDialog from '@/components/rx-dialog.vue'
import { copyText } from '@/utils/basic'

const { $t } = useRxI18n()
const { public: { roxyHomeUrl } } = useRuntimeConfig()
const topUpAppDialogVisible = useState('top-up-app-dialog-visible', () => false)

function closeDialog() {
  topUpAppDialogVisible.value = false
}

/** 复制官网链接，逻辑与首页新用户礼包弹窗一致 */
function copyOfficialSiteUrl() {
  const officialSiteUrl = roxyHomeUrl || window.location.origin
  copyText(officialSiteUrl)
  toast.success($t('复制成功'))
  closeDialog()
}
</script>

<template>
  <ClientOnly>
    <RxDialog
      v-model:visible="topUpAppDialogVisible"
      :pt="{ mask: 'top-up-app-dialog-mask' }"
    >
      <template #container>
        <div class="mx-5 px-5 py-3 border border-[#AFB7BB] rounded-3 border-solid bg-white max-w-525px w-[calc(100vw-40px)] shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
          <div class="flex gap-4 items-start justify-between">
            <div class="text-[18px] text-[#111213] leading-normal font-['Microsoft_YaHei_UI'] font-600">
              {{ $t('Roxy 充值季') }}
            </div>
            <button
              type="button"
              class="border-none bg-transparent flex shrink-0 size-8 cursor-pointer items-center justify-center"
              @click="closeDialog"
            >
              <RxIcon name="base/rx_ic_delete" size="24" color="#575D60" />
            </button>
          </div>
          <div class="text-[14px] text-black leading-5 font-['Microsoft_YaHei_UI'] font-400 mt-3">
            {{ $t('请下载或打开桌面端 APP，立即充值单笔最高可送 55%') }}
          </div>
          <button
            type="button"
            class="text-[14px] text-white leading-5 font-500 mt-6 px-4 py-2.5 border-1 border-[#0282D4] rounded-2 border-solid bg-[#11A3FD] flex gap-2 min-w-88px w-full cursor-pointer shadow-[0_4px_4px_-1px_rgba(0,0,0,0.02),0_1px_1px_0_rgba(0,0,0,0.06)] items-center justify-center"
            @click="copyOfficialSiteUrl"
          >
            {{ $t('复制官网链接') }}
          </button>
          <button
            type="button"
            class="text-[14px] text-[#111213] leading-6 font-400 mt-3 border-none bg-transparent h-10 w-full cursor-pointer"
            @click="closeDialog"
          >
            {{ $t('我知道了') }}
          </button>
        </div>
      </template>
    </RxDialog>
  </ClientOnly>
</template>

<style scoped>
:global(.top-up-app-dialog-mask.rx-dialog-mask--modal) {
  background: rgba(0, 0, 0, 0.5);
}
</style>
