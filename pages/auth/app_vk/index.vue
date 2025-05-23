<script setup lang="ts">
const { public: { LAUNCH_PROTOCOL } } = useRuntimeConfig()

definePageMeta({
  layout: 'basic'
}) 

const launchApp = () => {
  const params = (location.search.endsWith('&') ? location.search : `${location.search}&`) + 'source=vk'
  console.log(`${LAUNCH_PROTOCOL}//oauth2callback${params}`)
  location.href = `${LAUNCH_PROTOCOL}//oauth2callback${params}`
}

if (import.meta.client) {
  launchApp()
}
</script>


<template>
  <client-only>
    <div>
      Authorization successful! The client application will be launched shortly... If it doesn't launch, please click 
      <a style="color: #0053FF;cursor: pointer;" @click="launchApp">here</a>
    </div>
  </client-only>
</template>

<style scoped></style>