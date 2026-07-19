<script setup lang="ts">
definePageMeta({
  layout: 'basic',
})

const { public: { LAUNCH_PROTOCOL } } = useRuntimeConfig()
const { redirectMobileDownloadToLogin } = useMobileDownloadRedirect()

function launchApp() {
  if (import.meta.client) {
    location.href = `${LAUNCH_PROTOCOL}//open-page?url=/`
  }
}

onMounted(() => {
  launchApp()
})
</script>

<template>
  <div class="container">
    <img class="logo" src="/logo.svg" alt="RoxyBrowser">

    <p class="tip w-200">
      Please click the following button to open the RoxyBrowser client, if you have not yet downloaded it, you can click the download button to do so.
    </p>

    <div class="flex gap-4 items-center">
      <NuxtLinkLocale to="/download" class="menu-item-link text-14px color-inherit ru-RU:text-4" @click.capture="redirectMobileDownloadToLogin">
        <button class="btn primary min-w-50">
          Downloads
        </button>
      </NuxtLinkLocale>

      <button class="btn secondary min-w-50" @click="launchApp">
        Open RoxyBrowser
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin: auto;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  padding-top: 100px;
  text-align: center;
}

.logo {
  width: 100px;
  height: auto;
  margin-bottom: 32px;
}

.tip {
  font-size: 18px;
  color: #333;
  margin-bottom: 40px;
}

.btn {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  border: none;
}

.btn.primary {
  background: #409eff;
  color: white;
}

.btn.secondary {
  background: #f0f0f0;
  color: #333;
}
</style>
