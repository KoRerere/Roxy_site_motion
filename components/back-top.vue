<script setup lang="ts">
import { NuxtLink } from '#components'
import { useMotionValueEvent, useScroll } from 'motion-v'
import LiveChat from '@/components/live-chat.vue'
import { RxIcon } from '@/components/rx-icon'

const topIconClasses = ref('bg-white/20 text-white')

function backTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const qrcodeInfo = ref<{
  qrcodeUrl: string
  status: 1 | 2
  type: 'wechat' | 'Telegram' | 'qq'
}[]>([])

const { telegramLink } = useTelegram()
const { $eventBus } = useNuxtApp()
const { locale, $t } = useRxI18n()

const isShow = ref(true)
const visible = reactive({
  wechat: false,
})

const { public: { isChinaSite } } = useRuntimeConfig()

const mediaList = computed(() => [
  {
    component: 'div',
    componentProps: {
      onClick: () => {
        visible.wechat = true
      },
    },
    icon: 'color/rx-ic-wechat',
    alt: 'Wechat',
    ariaLabel: $t('加入微信用户社区'),
    hide: locale.value !== 'zh' || qrcodeInfo.value.find(item => item.type === 'wechat')?.status !== 1,
  },
  {
    component: NuxtLink,
    componentProps: {
      to: telegramLink.value,
      target: '_blank',
    },
    icon: 'color/rx-ic-tg',
    alt: 'Telegram',
    ariaLabel: $t('打开 Telegram'),
    hide: isChinaSite,
  },
  {
    component: LiveChat,
    componentProps: {
      showBeforeReady: true,
    },
    icon: 'color/rx-ic-livechat',
    alt: 'Live-chat',
    ariaLabel: $t('在线客服'),
  },
])

onMounted(() => {
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    isShow.value = latest > window.innerHeight
  })

  $eventBus.on('backTopReached', (bool: boolean) => {
    topIconClasses.value = bool ? 'bg-black/20' : 'bg-white/20'
  })

  onUnmounted(() => {
    $eventBus.off('backTopReached')
  })
})

const { public: { roxyHomeUrl } } = useRuntimeConfig()

onMounted(() => {
  fetch(`${roxyHomeUrl}/app_statistics/get_qrcode_info`)
    .then(res => res.json())
    .then((res) => {
      if (res.code === 0) {
        qrcodeInfo.value = res.data
      }
    })
})
</script>

<template>
  <div class="flex flex-col gap-3 bottom-5 right-5 fixed z-10 md:bottom-10 md:right-10">
    <div v-show="isShow">
      <button
        :class="cn(
          'size-12 rounded-full flex items-center justify-center border-none cursor-pointer text-white',
          topIconClasses,
        )"
        :aria-label="$t('返回顶部')"
        @click="backTop"
      >
        <RxIcon name="base/rx_ic_back_top" size="18" />
      </button>
    </div>
    <component
      :is="item.component"
      v-for="item in mediaList.filter(item => !item.hide)"
      v-bind="item.componentProps"
      :key="item.alt"
    >
      <button
        :aria-label="item.ariaLabel"
        class="rounded-full border-none flex size-12 cursor-pointer shadow-[0_0_5px_3px_rgba(0_0_0/0.05)] items-center justify-center"
      >
        <RxIcon :name="item.icon" size="46" />
      </button>
    </component>

    <RxDialog
      v-model:visible="visible.wechat"
      modal
      :pt="{
        root: '!border-none !shadow-none',
        mask: '!backdrop-blur-sm',
        pcCloseButton: { autofocus: false },
      }"
    >
      <template #container>
        <div class="pa-6 pt-4 flex flex-col gap-6 w-96 items-center justify-center">
          <div class="flex h-9 w-full items-center justify-between">
            <span class="header">加入微信用户社区</span>
            <RxIcon class="cursor-pointer" color="#575D60" size="20" name="base/rx_ic_delete" @click="visible.wechat = false" />
          </div>
          <div class="rounded-xl flex flex-col w-full items-center">
            <div class="pa-3 border-1 border-[#AFB7BB] rounded-2 border-solid bg-white">
              <img class="mx-auto w-46 block object-cover" :src="qrcodeInfo.find(item => item.type === 'wechat')?.qrcodeUrl">
            </div>
          </div>

          <div class="title text-center">
            Roxy浏览器 专属技术支持
          </div>
          <div class="gift px-4 py-2 rounded-2">
            <div class="relative">
              <!-- <RxIcon class="left-0 top-0 absolute" name="other/gift" /> -->
              <span>🎁 只需添加 RoxyBrowser 专属技术支持微信，即可延长 5 天当前套餐。</span>
            </div>
            <br>
            <div>同时邀请您加入官方交流群组。</div>
          </div>
        </div>
      </template>
    </RxDialog>
  </div>
</template>

<style lang="scss" scoped>
  .header {
  color: var(--colors-text-text-primary);
  font-family: 'Microsoft YaHei UI';
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
}

.title {
  color: var(--colors-text-text-primary);
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
}

.gift {
  color: var(--colors-text-text-primary, #111213);
  font-size: 12px;
  line-height: 18px;
  background: var(--colors-background-bg-block, #f1f5f8);
}
</style>
