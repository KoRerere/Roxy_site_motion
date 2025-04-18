<script setup lang="ts">
const route = useRoute()

definePageMeta({
  layout: 'basic'
}) 

function launchApp() {
  if (import.meta.client) {
    location.href = `${import.meta.env.VITE_APP_LAUNCH_PROTOCOL}//oauth2callback${location.search}`
  }
}

if (import.meta.client) {
  const source = route.query.source as string
  // 如果是web过来的，就把code给web网站
  if (source.startsWith('web-') && window.opener) {
    window.opener.postMessage({ type: source.split('-')[1], queryStr: location.search }, location.origin)
  } else {
    // 如果是APP过来的，就把code给APP
    launchApp()
  }
}

</script>


<template>
  <client-only>
    <div>
      Authorization successful! The client application will be launched shortly... If it doesn't launch, please click <a style="color: #0053FF;cursor: pointer;" @click="launchApp">here</a>
    </div>
  </client-only>
</template>

<style scoped></style>