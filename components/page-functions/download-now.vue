<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
import { useDownload } from '~/composables/useDownload'
import DownloadIcon from '../cta-download-btn/download-icon.vue'

defineProps<{
  title: string
}>()

const { initializeDownload, triggerAutoDownload, downloadText } = useDownload()
const { redirectMobileDownloadToLogin } = useMobileDownloadRedirect()

async function handleClick(event?: MouseEvent) {
  if (redirectMobileDownloadToLogin(event)) {
    return
  }

  await initializeDownload()
  triggerAutoDownload()
}
</script>

<template>
  <div class="download-now">
    <h2 class="title multilingual-text">
      {{ title }}
    </h2>
    <!-- <button class="download-btn cursor-pointer" @click="handleClick">
      <DownloadIcon size="24" />
      {{ downloadText }}
    </button> -->
    <NuxtLinkLocale class="download-btn cursor-pointer" to="/download" @click.capture="redirectMobileDownloadToLogin">
      <RxIcon class="inline-flex max-[1123px]:hidden" name="base/rx_ic_download" size="24" />
      {{ $t('免费使用') }}
      <RxIcon class="hidden max-[1123px]:inline-flex" name="base/rx_ic_chevron_right" size="24" />
    </NuxtLinkLocale>
  </div>
</template>

<style lang="scss" scoped>
.download-now {
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 40px 60px;
  background: url('@/assets/images/functions/download-now-bg.svg') no-repeat center center;
  border-radius: 8px;
  @media (max-width: 768px) {
    padding: 24px;
    gap: 20px;
  }
}

.title {
  color: #fff;
  text-align: center;
  font-size: var(--Heading-H4, 36px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H4, 48px); /* 133.333% */
  @media (max-width: 1024px) {
    font-size: 24px;
    line-height: 28px;
  }
}

html[lang='ru-RU'] {
  .title {
    font-size: 32px;
    line-height: 28px;
  }
}

.download-btn {
  display: inline-flex;
  padding: 12px 24px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--colors-text-text-link, #11a3fd);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 125% */
}

</style>
