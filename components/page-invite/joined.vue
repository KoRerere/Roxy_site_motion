<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
const localePath = useLocalePath()
const { $t } = useRxI18n()
const { public: { LAUNCH_PROTOCOL } } = useRuntimeConfig()

function launchApp() {
  if (import.meta.client) {
    location.href = `${LAUNCH_PROTOCOL}//inviteUser2project${location.search}`
  }
}

onMounted(launchApp)
</script>

<template>
  <div class="join-success">
    <div class="success-title">{{ $t('加入空间成功！') }}</div>
    <div class="success-desc">{{ $t('打开客户端以继续') }}</div>
    <div class="open-app">{{ $t('打开 Roxybrowser') }}...</div>
    <div class="open-app-desc">{{ $t('请点击以下按钮打开 RoxyBrowser 客户端，如果您还未下载可以点击下载按钮进行操作。') }}</div>

    <RxButton @click="launchApp" class="w-full">
      {{ $t('打开 RoxyBrowser 客户端') }}
    </RxButton>
    
    <div class="or" :data-content="$t('或')"></div>

    <RxButton @click="launchApp" outlined class="download-btn w-full mt-[16px]">
      <NuxtLink 
        class="flex gap-2 items-center justify-center w-full decoration-none download-link" 
        :to="localePath('/download')"
      >
        <RxIcon name="base/rx_ic_download" class="download-icon"></RxIcon>
        <span>{{ $t('下载 roxy 客户端') }}</span>
      </NuxtLink>
    </RxButton>
    
  </div>
</template>

<style lang="scss">
.join-success {
  width: 320px;
  padding: 24px 32px;
}

.success-title {
  color: var(--Colors-Text-text-primary, #171C1F);
  font-family: Archivo;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.success-desc {
  color: var(--Colors-Text-text-tertiary, #7C8387);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.open-app {
  color: var(--Colors-Text-text-primary, #171C1F);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: var(--Line-Height-text-xs, 16px); /* 100% */
  margin-top: 32px;
}

.open-app-desc {
  color: var(--Colors-Text-text-tertiary, #7C8387);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: var(--Line-Height-text-lg, 20px); /* 166.667% */
  margin: 16px 0;
}
</style>

<style lang="scss" scoped>
.illustrate {
  color: var(--Colors-Text-text-tertiary, #7C8387);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: var(--Line-Height-text-lg, 20px);
}

.or {
  position: relative;
  margin: 8px 0;
  height: 1px;
  width: 100%;
  background: var(--Colors-Border-border-container, #C7CDD1);

  &::before {
    content: attr(data-content);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 16px;
    color: #000;
    text-align: center;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: var(--Line-Height-text-xs, 16px);
    background-color: #fff;
  }

}

.download-btn {
  border: 1px solid var(--Component-Colors-Buttons-Secondary-border, #C7CDD1);
  box-shadow: 0px 4px 4px -1px rgba(0, 0, 0, 0.02), 0px 1px 1px 0px rgba(0, 0, 0, 0.06);
}

.download-link {
  color: var(--Component-Colors-Buttons-Secondary-text, #171C1F);
}

.download-icon {
  vertical-align: middle;
  font-size: 16px;
  line-height: 1;
}
</style>