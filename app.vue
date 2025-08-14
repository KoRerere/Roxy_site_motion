<script>
if (import.meta.client) {
  window.$landingPage = location.href
  window.$source = document.referrer
  sessionStorage.setItem("landingPage", location.href)
  sessionStorage.setItem("source", document.referrer)
}
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>