<template>
  <Home />
</template>

<script setup lang="ts">
import Home from '@/components/page-home/index.vue'

const {
  checkReferrer,
  checkLinkCode
} = useChannelReport()

onBeforeMount(() => {
  checkReferrer()
  checkLinkCode()
})
</script>