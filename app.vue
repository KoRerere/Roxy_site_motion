<script>
if (import.meta.client) {
  const { pathname, search } = new URL(location.href)
  window.$landingPage = `${pathname}${search}`
  window.$source = document.referrer
  sessionStorage.setItem("landingPage", `${pathname}${search}`)
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