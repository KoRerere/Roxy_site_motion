<script setup lang="ts">
import Snow from '@/components/page-pricing/christmas/snow.vue'
import { RxIcon } from '../rx-icon'

defineProps<{
  height: number
  handleClose: () => void
}>()

const { locale } = useRxI18n()
const { width } = useRxWindowSize()
const { redirectMobileDownloadToLogin } = useMobileDownloadRedirect()

const visible = ref(false)

// 本地存储的 key
const MODAL_TRIGGERED_KEY = 'christmas-modal-triggered'
// 从 localStorage 读取是否已触发过
const hasTriggeredModal = ref(false)

const imageUrls = computed(() => ({
  cover: `activity/christmas-${locale.value}`,
}))

if (import.meta.client) {
  // 初始化时从 localStorage 读取状态
  const storedValue = localStorage.getItem(MODAL_TRIGGERED_KEY)
  if (storedValue === 'true') {
    hasTriggeredModal.value = true
  }

  // 滚动到页面一半时触发模态框
  const handleScroll = () => {
    if (hasTriggeredModal.value)
      return

    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    // 计算滚动进度：当前滚动位置 + 视口高度 >= 文档总高度的一半
    const scrolledHalf = scrollTop + windowHeight >= documentHeight / 2

    if (scrolledHalf) {
      openModal()
      hasTriggeredModal.value = true
      // 保存到 localStorage
      localStorage.setItem(MODAL_TRIGGERED_KEY, 'true')
      // 触发后移除监听器以提升性能
      window.removeEventListener('scroll', handleScroll)
    }
  }

  // 添加滚动监听
  onMounted(() => {
    // 只有在未触发过的情况下才添加监听器
    setTimeout(() => {
      if (!hasTriggeredModal.value) {
        window.addEventListener('scroll', handleScroll, { passive: true })
      }
    }, 1000)
  })

  // 组件卸载时清理监听器
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
}

function openModal() {
  visible.value = true
}

function handleDownloadClick(event: MouseEvent) {
  if (redirectMobileDownloadToLogin(event)) {
    return
  }

  visible.value = false
}
</script>

<template>
  <div
    class="relative overflow-hidden -mx-3 xl:mx-0 -z-1 lg:-mx-10 md:-mx-5 bg-[linear-gradient(90deg,rgba(195,10,0,0)_0%,#c30a00_50%,rgba(195,10,0,0)_100%),#862222]"
  >
    <div
      class="text-white px-7 flex items-center justify-center relative z-1"
      :class="[
        width > 1140 ? 'gap-7 py-2.5' : 'flex-col gap-1.5 py-3',
      ]"
      :style="{
        height: `${height}px`,
      }"
    >
      <!-- PC 端 -->
      <div v-if="width > 1140" class="text-5 text-[#FAFAFA] leading-20px font-[Inter] font-700 flex gap-2 items-center">
        <RxIcon name="color/rx-rl-tree" size="28" />
        <RxI18nT
          :keypath="$t('窗口订阅立享 8 折优惠 {p1} 再享 8 折优惠 {p2}', { p1: '{p1}', p2: '{p2}' })"
        >
          <template #p1>
            <span class="text-4 font-400">{{ $t('新用户额外').replace(', ', ' ') }}</span>
          </template>
          <template #p2>
            <span class="text-4 font-400 zh-CN:hidden">{{ $t('p2') }}</span>
          </template>
        </RxI18nT>
        <span class="text-4 font-400">(2025.12.23 - 2026.01.06)</span>
      </div>
      <!-- 移动端 -->
      <div v-else class="text-4.5 font-700 flex flex-col gap-1.5 items-center en-US:text-4 ru-RU:text-3.5">
        <template v-if="locale === 'zh'">
          <div class="flex gap-1 items-center">
            <RxIcon name="color/rx-rl-tree" size="20" />
            <div>窗口订阅立享 8 折优惠</div>
            <RxIcon name="color/rx-rl-gift2" size="20" />
          </div>
          <div class="flex gap-1 items-center">
            <span class="font-400">新用户额外</span>
            <span>再享 8 折优惠</span>
          </div>
          <span class="text-3 leading-16px font-400">(2025.12.23 - 2026.01.06)</span>
        </template>
        <template v-if="locale === 'en'">
          <div class="flex gap-1 items-center">
            <RxIcon name="color/rx-rl-tree" size="20" />
            <div>
              20% OFF
              <span class="font-400">on Profile Subscriptions</span>
            </div>
            <RxIcon name="color/rx-rl-gift2" size="20" />
          </div>
          <div class="flex gap-1 items-center">
            <span class="font-400">+ Extra</span>
            <span>20% OFF</span>
            <span class="font-400">for New Customers</span>
          </div>
          <span class="text-3 leading-16px font-400">Limited Time Offer(2025.12.23 - 2026.01.06)</span>
        </template>
        <template v-if="locale === 'ru'">
          <div class="flex gap-1 items-center">
            <RxIcon name="color/rx-rl-tree" size="20" />
            <div>Скидка 20%</div>
            <RxIcon name="color/rx-rl-gift2" size="20" />
          </div>
          <div class="flex gap-1 items-center">
            <span class="font-400">на все планы</span>
            <span>+ 20% для</span>
            <span class="font-400">новых пользователей</span>
          </div>
          <span class="text-3 leading-16px font-400">(2025.12.23 - 2026.01.06)</span>
        </template>
      </div>

      <div class="text-white px-3 py-1.5 rounded-1.5 bg-black/20 flex gap-1 cursor-pointer items-center backdrop-blur-16" @click="openModal">
        <RxIcon name="base/rx_ic_eye" size="16" />
        <span class="text-3.5">
          {{ $t("查看详情") }}
        </span>
      </div>

      <!-- <div class="flex gap-1.5 cursor-pointer items-center right-5 top-3.5 absolute lg:(top-1/2 -translate-y-1/2)" @click="handleClose">
        <RxIcon name="base/rx_ic_delete" size="16" color="#FFF" />
        <span class="text-3.5">
          {{ $t('关闭') }}
        </span>
      </div> -->
    </div>
    <div class="bg-[url(/activity/snowflake.svg)] h-full w-full left-0 top-0 absolute z-0" />

    <RxDialog v-model:visible="visible" modal :pt="{ root: '!bg-transparent !border-none !shadow-none', mask: '!backdrop-blur-sm' }">
      <template #container>
        <div class="flex flex-col gap-1.5">
          <button class="px-2 py-1.5 rounded bg-white flex gap-1.5 cursor-pointer items-center self-end" @click="visible = false">
            <RxIcon color="#000000" name="base/rx_ic_delete" />
            <span class="text-3.5 text-black leading-normal whitespace-nowrap">{{ $t('关闭') }}</span>
          </button>

          <div
            class="relative overflow-hidden rounded-20px bg-[radial-gradient(103.18%_69.92%_at_50%_100%,#d00b00_0%,rgba(208,11,0,0)_100%),#aa2424]"
          >
            <Snow :snowflake-count="100" />
            <rx-responsive-image class="w-full block md:w-140" :name="imageUrls.cover" />
            <div class="text-3 text-white font-500 right-6 top-6 absolute">
              2025.12.23 - 2026.01.06
            </div>
            <div class="flex gap-2.5 items-center bottom-6 left-6 absolute z-1">
              <NuxtLinkLocale to="/download" class="text-white px-4 py-2.5 rounded-2 bg-[#F39A3D] flex gap-2 cursor-pointer items-center justify-center hover:bg-[#F18C22]" @click.capture="handleDownloadClick">
                <span class="text-3.5 leading-normal whitespace-nowrap">{{ $t('免费使用') }}</span>
                <RxIcon name="base/rx_ic_download" />
              </NuxtLinkLocale>

              <NuxtLinkLocale to="/pricing" class="text-white px-4 py-2.5 rounded-2 bg-black/20 flex gap-2 cursor-pointer items-center justify-center hover:bg-black/30" @click="visible = false">
                <span class="text-3.5 leading-normal whitespace-nowrap">{{ $t('查看价格') }}</span>
                <RxIcon name="base/cursor-right" />
              </NuxtLinkLocale>
            </div>
          </div>
        </div>
      </template>
    </RxDialog>
  </div>
</template>
