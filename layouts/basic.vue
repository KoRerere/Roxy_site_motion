<script setup>
import Toast from 'primevue/toast'

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
  <slot></slot>
  <Toast position="top-center" />
</template>
