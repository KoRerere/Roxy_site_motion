<script setup lang="ts">
const { public: { LAUNCH_PROTOCOL } } = useRuntimeConfig()
const { $t } = useRxI18n()

definePageMeta({
  layout: 'basic'
})

function launchApp() {
  if (import.meta.client) {
    location.href = `${LAUNCH_PROTOCOL}//`
  }
}
</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden bg-[#F5FBFF]">
    <div class="flex items-center px-8 pt-4">
      <NuxtLinkLocale to="/" class="flex items-center gap-[10px] z-10">
        <img class="logo" src="/logo.svg" alt="Roxybrowser" />
        <h1 class="header">RoxyBrowser</h1>
      </NuxtLinkLocale>
    </div>
    <div class="w-120 flex flex-col items-start gap-8 py-12 px-8 content">
      <img class="block w-9 h-9" src="/rx_ic_check_fill.svg" alt="Roxybrowser" />
      <div class="flex flex-col gap-3">
        <div class="title">{{ $t('您已支付成功') }}</div>
        <div class="desc">{{ $t('感谢您的支持，您的支付已经成功，请点击以下的按钮返回 RoxyBrowser 客户端。') }}</div>
      </div>
      <Button class="btn" fluid variant="outlined" severity="secondary" @click="launchApp">
        <template #default>
          <div class="text">{{ $t('返回 RoxyBrowser') }}</div>
        </template>
      </Button>
    </div>
  </div>
</template>

<style scoped>
.logo {
  width: 32px;
  height: 32px;
}

.header {
  font-family: Archivo, var(--family, var(--zhFamily));
  color: var(--colors-text-text-primary);
  font-size: 14px;
  font-weight: 700;
  line-height: normal;
}

.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 6px;
  border: 1px solid #E2E9EE;
  background: #FFF;
  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.07), 0 2px 5px 0 rgba(0, 0, 0, 0.07), 0 1px 1px 0 rgba(0, 0, 0, 0.07);
}

.title {
  color: #111213;
  font-family: "Microsoft YaHei UI";
  font-size: 20px;
  font-weight: 700;
  line-height: 20px;
}

.desc {
  color: #7D8387;
  font-family: "Microsoft YaHei UI";
  font-size: 14px;
  line-height: 21px;
}

.btn {
  display: flex;
  min-width: 88px;
  padding: 10px var(--spacing-2xl, 16px);
  justify-content: center;
  align-items: center;
  gap: var(--spacing-lg, 8px);
  align-self: stretch;
  border-radius: var(--radius-lg, 8px);
  border: 1px solid var(--colors-border-border-action, #C7D1D6);
  background: var(--colors-background-bg-action, #FFF);

  /* shadow-sm */
  box-shadow: 0 4px 4px -1px rgba(0, 0, 0, 0.02), 0 1px 1px 0 rgba(0, 0, 0, 0.06);


}

.text {
  color: #111213;
  font-family: "Microsoft YaHei UI";
  font-size: 14px;
  line-height: 20px;
}
</style>