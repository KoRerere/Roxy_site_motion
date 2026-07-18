<script setup>
import KernelSync from '@/components/page-home/kernel-sync.vue'

definePageMeta({
  layout: false,
})

useHead({
  title: 'RoxyBrowser - 实时内核同步',
})
</script>

<template>
  <KernelSync />
</template>
