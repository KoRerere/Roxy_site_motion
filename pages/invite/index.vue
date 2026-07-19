<script setup lang="ts">
/** 直接访问 /invite（无邀请码） */
const { public: { isChinaSite } } = useRuntimeConfig()

// 国内站低价值页：不参与百度索引
if (isChinaSite) { useSeoMeta({ robots: 'noindex, nofollow' }) }

useInvitePageEntry()
</script>

<template>
  <PageInvite />
</template>
