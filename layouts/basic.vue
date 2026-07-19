<script setup>
import { Toaster } from 'vue-sonner'
// import 'vue-sonner/style.css'

const { extractCode } = useChannelReport()
const { locale } = useRxI18n()

if (import.meta.client) {
  extractCode()
}

onBeforeMount(() => {
  document.querySelector(':root').style.setProperty('--family', getFontFamily(locale.value))
})
</script>

<template>
  <slot />
  <Toaster position="top-center" :duration="2000" rich-colors />
</template>
