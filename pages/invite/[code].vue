<script setup lang="ts">
/** 带邀请码路径 /invite/:code */
const { public: { isChinaSite } } = useRuntimeConfig()

if (isChinaSite) { useSeoMeta({ robots: 'noindex, nofollow' }) }

useInvitePageEntry()
</script>

<template>
  <PageInvite />
</template>
