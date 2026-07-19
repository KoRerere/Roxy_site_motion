<script setup lang="ts">
import SearchContent from '@/components/page-faqs/search-content.vue'

useSeoMeta({
  title: $t('常见问题'),
  description: $t('有疑问？请访问 RoxyBrowser 常见问题解答页面，立即得到有关 RoxyBrowser 基本信息的答案。'),
})
</script>

<template>
  <div>
    <SearchContent />
  </div>
</template>
