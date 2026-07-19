<script setup lang="ts">
import { LiveChatWidget } from '@livechat/widget-vue'
import { useDownload } from '~/composables/useDownload'
import { useRxI18n } from '~/composables/useRxI18n'

const route = useRoute()
const { locale } = useRxI18n()
// LiveChat widget 配置
const group = computed(() => locale.value === 'zh' ? '6' : '5')
const randomId = Math.round(Math.random() * 100000000)
const sessionVariables = computed(() => ({
  username: '[Roxy]-游客',
  Account_ID: randomId.toString(),
}))

if (import.meta.client) {
  const navEntries = performance.getEntriesByType('navigation')
  const navType = navEntries[0]?.type || performance.navigation.type

  if (navType === 'navigate') {
    // 普通导航：回到顶部
    window.scrollTo(0, 0)
  }
  // 如果是 reload，就不干预，浏览器会自动恢复滚动位置

  const { pathname, search } = new URL(location.href)
  window.$landingPage = `${pathname}${search}`
  window.$source = document.referrer
  localStorage.setItem('landingPage', `${pathname}${search}`)
  localStorage.setItem('source', document.referrer)
}

const { initializeDownload, triggerAutoDownload } = useDownload()
const { redirectMobileDownloadToLogin } = useMobileDownloadRedirect()

async function handleClick(eventParams?: Record<string, string>) {
  if (redirectMobileDownloadToLogin()) {
    return
  }

  await initializeDownload()
  triggerAutoDownload()
  if (import.meta.client) {
    // 上报google下载事件
    window.gtag?.('event', 'actual_download', {
      ...eventParams,
      route: route.path,
    })
  }
}

globalThis.$downloadApp = handleClick

const {
  checkReferrer,
  checkLinkCode,
} = useChannelReport()

const { setupGoogleOneTap } = useGoogleOneTap()

if (import.meta.client) {
  setupGoogleOneTap()
}

onBeforeMount(() => {
  checkReferrer()
  checkLinkCode()
})

console.log('__VERSION__', import.meta.env?.VITE_VERSION)
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <LiveChatWidget
        license="18087441"
        :group="group"
        customer-name="[Roxy]-游客"
        :session-variables="sessionVariables"
        visibility="hidden"
      />
    </ClientOnly>
  </div>
</template>
