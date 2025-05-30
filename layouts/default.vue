<template>
  <div>
    <TheHeader />
    <slot></slot>
    <TheFooter />
    <BackTop />
    <CookieBanner />
  </div>
</template>

<script setup lang="ts">
import { useCustomHead } from './hooks/useCustomHead'
import { useRoxySeoMeta } from './hooks/useRoxySeoMeta'
import TheFooter from '@/components/the-footer.vue'
import BackTop from '@/components/back-top.vue'

useCustomHead()
useRoxySeoMeta()

const { locale } = useRxI18n()

const { extractCode } = useChannelReport()
if (import.meta.client) {
  extractCode()
}

if (import.meta.client) {
  window.scrollTo(0, 0)
}

onBeforeMount(() => {
  document.querySelector(':root').style.setProperty('--family', getFontFamily(locale.value))
})

const hostname = ['www.roxybrowser.com', 'roxybrowser.com', 'gatetest.roxybrowser.co', '47.242.33.58', 'localhost', '127.0.0.1'];

if (import.meta.client) {
  const isInHost = hostname.includes(window.location.hostname)
  if (!isInHost) {
    window.location.href = 'https://roxybrowser.com'
  }
}

</script>
