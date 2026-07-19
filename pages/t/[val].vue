<script setup lang="ts">
const route = useRoute()
const { public: { isChinaSite } } = useRuntimeConfig()

// 国内站短链跳转页：不参与索引
if (isChinaSite) { useSeoMeta({ robots: 'noindex, nofollow' }) }

onBeforeMount(() => {
  const code = Array.isArray(route.params.val) ? route.params.val[0] : route.params.val

  navigateTo(`/invite/${encodeURIComponent(String(code || ''))}`, {
    replace: true,
  })
})
</script>

<template>
  <div />
</template>
