<script setup lang="ts">
import type { NuxtApp } from '#app'
import type { StyleValue } from 'vue'
import { NuxtLinkLocale } from '#components'
import customProtocolCheck from 'custom-protocol-check'

const { styleType = '1', btnText = 'Download Now', btnLink, launchUrl = '' } = defineProps<{
  styleType: string
  title: string
  desc: string
  btnText: string
  btnLink: string
  launchUrl?: string
  launchBtnText?: string
  // getNuxtApp: () => NuxtApp
}>()

// const nuxtApp = getNuxtApp()
const { public: { LAUNCH_PROTOCOL } } = useRuntimeConfig()
const localePath = useLocalePath()
const { redirectMobileDownloadToLogin } = useMobileDownloadRedirect()

const styleClass: Record<string, Record<string, StyleValue>> = {
  1: {
    bg: {
      background: 'linear-gradient(93deg, #D3EDFD 0.01%, #F1F9FD 66.77%, #D3EDFD 100.01%), linear-gradient(90deg, #12A3FC 0%, #45B7FD 100%)',
    },
    title: {
      color: '#11A3FD',
    },
    desc: {
      color: '#111213',
    },
    btn: {
      backgroundColor: '#11A3FD',
      color: 'white',
    },
  },
  2: {
    bg: {
      background: 'linear-gradient(90deg, #12A3FC 0%, #F1F9FD 100%)',
    },
    title: {
      color: 'white',
    },
    desc: {
      color: 'white',
    },
    btn: {
      backgroundColor: 'white',
      color: '#11A3FD',
    },
  },
  3: {
    bg: {
      background: 'linear-gradient(90deg, #12A3FC 0%, #F1F9FD 100%)',
    },
    title: {
      color: 'white',
    },
    desc: {
      color: 'white',
    },
    btn: {
      color: 'white',
      padding: '12px',
    },
    launchBtn: {
      backgroundColor: 'white',
      color: '#11A3FD',
    },
  },
}
const currentStyleClass = styleClass[styleType]

function handleDownload() {
  if (redirectMobileDownloadToLogin()) {
    return
  }

  // console.debug('click CTA download', nuxtApp)
  // if (nuxtApp) {
  //   const { $localePath, $router } = nuxtApp
  //   $router.push($localePath(btnLink))
  // }
  globalThis.$downloadApp()
}

function handleLaunchApp() {
  if (launchUrl) {
    const url = `${LAUNCH_PROTOCOL}//open-page?url=${launchUrl}`
    customProtocolCheck(url, handleDownload)
  }
}
</script>

<template>
  <div class="cta-wrapper mb-6 mt-12 py-7 pl-11 pr-50 rounded-3 flex flex-col gap-5 relative !max-md:hidden" :style="currentStyleClass.bg">
    <div class="flex flex-col gap-1">
      <p class="custom text-h5 text-[Archivo] font-bold" :style="currentStyleClass.title">
        {{ title }}
      </p>
      <p class="custom text-body font-normal" :style="currentStyleClass.desc">
        {{ desc }}
      </p>
    </div>
    <div class="flex flex-1 gap-3">
      <template v-if="launchBtnText">
        <a class="custom custom-a-cta px-6 py-3 rounded-2 flex-nowrap gap-1 cursor-pointer items-center !flex" :style="currentStyleClass.launchBtn" :href="localePath('/download')" @click.capture="redirectMobileDownloadToLogin">
          <p class="custom text-4 leading-20px font-500">
            {{ launchBtnText }}
          </p>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path d="M6.91009 5.18719C7.23553 4.86176 7.76304 4.86176 8.08848 5.18719L13.0885 10.1872C13.4139 10.5126 13.4139 11.0401 13.0885 11.3656L8.08848 16.3656C7.76304 16.691 7.23553 16.691 6.91009 16.3656C6.58466 16.0401 6.58466 15.5126 6.91009 15.1872L11.3209 10.7764L6.91009 6.36558C6.58466 6.04014 6.58466 5.51263 6.91009 5.18719Z" fill="currentColor" />
          </svg>
        </a>
      </template>
      <a
        class="custom custom-a-cta px-6 py-3 rounded-2 flex-nowrap gap-1 cursor-pointer whitespace-nowrap items-center !flex"
        :style="currentStyleClass.btn"
        :href="localePath('/download')"
        @click.capture="redirectMobileDownloadToLogin"
      >
        <p class="custom text-4 leading-20px font-500">
          {{ btnText }}
        </p>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
          <path d="M6.91009 5.18719C7.23553 4.86176 7.76304 4.86176 8.08848 5.18719L13.0885 10.1872C13.4139 10.5126 13.4139 11.0401 13.0885 11.3656L8.08848 16.3656C7.76304 16.691 7.23553 16.691 6.91009 16.3656C6.58466 16.0401 6.58466 15.5126 6.91009 15.1872L11.3209 10.7764L6.91009 6.36558C6.58466 6.04014 6.58466 5.51263 6.91009 5.18719Z" fill="currentColor" />
        </svg>
      </a>
    </div>
    <img src="/logo2.svg" class="custom h-195px w-160px right-10 absolute -top-10">
  </div>
</template>
