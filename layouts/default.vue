<script setup lang="ts">
import BackTop from '@/components/back-top.vue'
import ActivityTopUpAppDialog from '@/components/activity/top-up-app-dialog.vue'
import { Toaster } from 'vue-sonner'
// import 'vue-sonner/style.css'
import TheFooter from '@/components/the-footer/index.vue'
import { useIP123 } from '@/composables/useIP123'
import { useCustomHead } from './hooks/useCustomHead'
import { useRoxySeoMeta } from './hooks/useRoxySeoMeta'

const { public: { isChinaSite } } = useRuntimeConfig()
useCustomHead()
useRoxySeoMeta()
// useIP123()

const { locale } = useRxI18n()

const { extractCode } = useChannelReport()
if (import.meta.client) {
  extractCode()
}

onBeforeMount(() => {
  document.querySelector(':root').style.setProperty('--family', getFontFamily(locale.value))
})
</script>

<template>
  <div>
    <TheHeader />
    <slot />
    <ActivityTopUpAppDialog />
    <TheFooter />
    <BackTop />
    <CookieConsent v-if="!isChinaSite" />
    <Toaster position="top-center" :duration="2000" rich-colors />
  </div>
</template>
