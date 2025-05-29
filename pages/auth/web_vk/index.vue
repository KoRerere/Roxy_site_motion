<script setup lang="ts">
const { public: { LAUNCH_PROTOCOL } } = useRuntimeConfig()

definePageMeta({
  layout: 'basic'
}) 

const launchApp = () => {
  const params = (location.search.endsWith('&') ? location.search : `${location.search}&`) + 'source=vk'
  location.href = `${LAUNCH_PROTOCOL}//oauth2callback${params}`
}

if (import.meta.client) {
  window.opener.postMessage({ type: 'vk', queryStr: location.search }, location.origin)
}

</script>


<template>
  <div>
    Authorization successful! The client application will be launched shortly... If it doesn't launch, please click <a style="color: #0053FF;cursor: pointer;" @click="launchApp">here</a>
  </div>
</template>

<style scoped></style>