<script setup lang="ts">
useBackTop(useTemplateRef('mainRef'));

useHead({
  meta: [
    {
      name: 'title',
      content: $t('The Safest Way to Change IP Address Without VPN Risks')
    },
    {
      name: 'description',
      content: $t('Change IP address in 1 click with RoxyBrowser. Reliable IPs + fingerprint spoofing prevent bans. Simple setup, high security. Switch IPs invisibly.')
    }
  ]
})
</script>

<template>
  <BgEffect />
  <main ref="mainRef">
    <functions-hero-banner />
  </main>
</template>