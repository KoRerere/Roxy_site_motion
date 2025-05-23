<template>
  <div>
    <TheHeader />
    <slot></slot>
    <TheFooter />
    <BackTop />
  </div>
  <!-- <Toast position="top-center" /> -->
</template>

<script setup lang="ts">
import { useCustomHead } from './hooks/useCustomHead'
import { useRoxySeoMeta } from './hooks/useRoxySeoMeta'
import Toast from 'primevue/toast'
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

</script>
