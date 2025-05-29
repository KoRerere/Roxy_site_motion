<template>
  <div class="download-page relative">
    <img src="/bg-effect.svg" alt="" class="w-full absolute top-0 left-0 z-0 max-h-650px" />
    
    <ClientOnly>
      <EffectBg />
    </ClientOnly>

    <Container class="relative z-10">
      <div class="mx-auto flex justify-center pt-132px lg:pt-400px text-14px font-400 leading-normal">
        <div class="flex gap-10px px-4 py-2 rounded-full items-center bg-[#FFF]">
          <RxIcon name="base/rx_ic_dark" />
          <div class="text-black">
            <rx-i18n-t 
              :keypath="$t('RoxyBrowser 支持 {mode}', { mode: '{mode}' })" 
            >
              <template #mode>
                <strong>{{ $t('深色模式') }}</strong>
              </template>
            </rx-i18n-t>
          </div>
        </div>
      </div>

      <h1 class="text-center text-9 leading-normal md:text-h3 font-700 text-primary dark:text-[#FAFAFA] font-[Archivo] pt-8">
        {{ $t('感谢您下载 RoxyBrowser') }}
      </h1>

      <p class="text-[#575D60] text-center font-400 leading-normal text-sub-title whitespace-pre-line pt-6 .dark:text-white/60">
        {{ $t('RoxyBrowser 兼容各种操作系统，包括 Windows、Mac 平台。') }}
      </p>

      <div class="flex gap-4 sm:gap-5 flex-col items-center lg:flex-row justify-center pt-12">
        <div 
          v-for="item in downloadVersion" 
          class="px-6 sm:px-8 py-8 flex flex-col items-center sm:items-start sm:flex-row gap-11 download-card"
        >
          <div>
            <img :src="item.icon" draggable="false" class="select-none" />
          </div>

          <div class="flex flex-col gap-3">
            <div class="text-14px font-500 text-primary dark:text-[#FAFAFA] flex flex-col gap-6px">
              <div>{{ item.latestVersion }}</div>
              <div>{{ item.releaseDate }}</div>
            </div>

            <div class="flex gap-3">
              <template v-for="btn in item.download">
                <DownloadBtn 
                  v-if="btn.effect" 
                  :to="btn.link" 
                  target="_blank" 
                  class="download-btn"
                  :icon-size="16"
                >
                  {{ btn.text }}
                </DownloadBtn>
                <div 
                  v-else
                  :class="cn('download-btn', btn.class)"
                >
                  <a :href="btn.link" target="_blank" class="text-14px flex items-center justify-center gap-2">
                    <RxIcon name="base/rx_ic_download" />
                    {{ btn.text }}
                  </a>
                </div>
              </template>
              
            </div>

            <p class="whitespace-pre-line text-3 text-[#898989] leading-normal .dark:text-[#B6B6B6]">
              {{ item.p }}
            </p>
          </div>
        </div>
      </div>

      <p class="text-center text-[#9A9A9A] font-400 leading-normal pt-6 flex gap-15px items-center justify-center pb-100px">
        <!-- <RxIcon name="base/rx_ic_linux" />
        {{ $t('Linux 版本正在开发中') }} -->
      </p>
    </Container>
  </div>
</template>

<script setup>
import { RxIcon } from '@/components/rx-icon'
import EffectBg from './EffectBg.vue'
const downloadStyle = useCssModule('download')
const { public: { appDownloadUrl } } = useRuntimeConfig()
const { $t }  = useRxI18n()

const roxy_partner = ref('')
const code = ref('')

const date = '2025/05/28'
const version = '3.4.8'

const downloadVersion = computed(() => {
  return [
    {
      latestVersion: $t('最新版本：{version}', { version: version }),
      releaseDate: $t('发布日期：{date}', { date: date }),
      download: [
        {
          text: $t('64 bits'),
          link: `${appDownloadUrl}/app-download/Windows-64-latest?roxy-partner=${roxy_partner.value}&code=${code.value}&version=3.2.2`,
          class: downloadStyle['window-64'],
          effect: true
        },
        {
          text: $t('32 bits'),
          link: `${appDownloadUrl}/app-download/Windows-32-latest?roxy-partner=${roxy_partner.value}&code=${code.value}&version=3.2.2`,
          class: downloadStyle['outlined']
        }
      ],
      p: $t('最低版本要求：\nWindows 10 或更高版本。'),
      icon: '/download/os_windows.svg'
    },
    {
      latestVersion: $t('最新版本：{version}', { version: version }),
      releaseDate: $t('发布日期：{date}', { date: date }),
      download: [
        {
          text: 'Apple Silicon',
          link: `${appDownloadUrl}/app-download/macOS-apple-latest?roxy-partner=${roxy_partner.value}&code=${code.value}&version=3.2.2`,
          class: downloadStyle['apple-silicon'],
        },
        {
          text: 'Intel',
          link: `${appDownloadUrl}/app-download/macOS-intel-latest?roxy-partner=${roxy_partner.value}&code=${code.value}&version=3.2.2`,
          class: downloadStyle['outlined']
        }
      ],
      p: $t('最低版本要求：\nmacOS 10.12 或更高版本。'),
      icon: '/download/os_macOS.svg'
    }
  ]
})

if (import.meta.client) {
  setTimeout(() => {
    roxy_partner.value = sessionStorage.getItem('roxy_partner') || ''
    code.value = sessionStorage.getItem('code') || ''
  }, 1000)
}

</script>

<style scoped>
.download-page {
  background: linear-gradient(180deg, #F4F5F5 0%, #FFF 100%);
}

[data-theme="dark"] .download-page {
  background: linear-gradient(180deg, #010F26 43.36%, #4D4447 204.98%);
  color: #FFF;
}

.download-card {
  border-radius: 12px;
  border: 1px solid #ECECEC;
  background: #FFF;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.05);
}

[data-theme="dark"] .download-card {
  border-radius: 12px;
  border: 1px solid #595959;
  background: rgba(255, 255, 255, 0.10);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.05);
}

.download-btn {
  @apply flex text-14px text-center text-white font-3 font-500 rounded-2 w-142px h-10 border-none cursor-pointer !p-0 justify-center items-center;
}
</style>

<style module="download">
.apple-silicon {
  background: linear-gradient(97deg, #202022 2.28%, #46484D 108.05%);
}

[data-theme="dark"] .apple-silicon {
  background: #FFF;
  color: #000;
}

.outlined {
  border: 1px solid #B5B5B5 !important;
  background: #FFF;
  color: #2D2D2D !important;
}

[data-theme="dark"] .outlined {
  background: #545a68;
  color: #FFF !important;
  border: none !important;
}

.window-64 {
  background: linear-gradient(99deg, #238AFF 15.85%, #F9B3B5 107.9%);
}
</style>