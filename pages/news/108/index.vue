<script setup lang="ts">
const { public: { isChinaSite } } = useRuntimeConfig()

// 仅 roxybrowser.cn 可访问，国际站直接 404
if (!isChinaSite) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}
</script>

<template>
  <PageRoxybrowserBaike />
</template>
