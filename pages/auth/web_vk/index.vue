<script setup lang="ts">
const {
  public: { LAUNCH_PROTOCOL, appWebUrl }
} = useRuntimeConfig()

definePageMeta({
  layout: 'basic'
})

const authIsMobile = useState<boolean>('auth-is-mobile', () => false)
const userAgent = import.meta.server ? useRequestHeader('user-agent') || '' : navigator.userAgent
const isMobile = authIsMobile.value || /Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Silk|Opera Mini/i.test(userAgent)

function launchApp () {
  if (import.meta.client) {
    console.log('[auth/web_vk] launchApp triggered')
    const params = `${
      location.search.endsWith('&') ? location.search : `${location.search}&`
    }source=vk`
    if (window.opener) {
      location.href = `${appWebUrl}/oauth2callback.html${params}`
    } else {
      location.href = `${LAUNCH_PROTOCOL}//oauth2callback${params}`
    }
  }
}

launchApp()
</script>

<template>
  <main class="oauth-success-page max-sm:flex max-sm:justify-center">
    <div class="oauth-success-bg" aria-hidden="true"> </div>

    <section
      class="mx-auto flex w-full max-w-830px flex-col items-center text-center"
      aria-labelledby="oauth-success-title"
    >
      <div class="top-title">
        <div class="icon-w-h">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2 24C2 11.8497 11.8497 2 24 2C36.1502 2 46 11.8497 46 24C46 36.1502 36.1502 46 24 46C11.8497 46 2 36.1502 2 24ZM34.4142 19.4142C35.1953 18.6332 35.1953 17.3668 34.4142 16.5858C33.6332 15.8047 32.3668 15.8047 31.5858 16.5858L21 27.1716L16.4142 22.5858C15.6332 21.8047 14.3668 21.8047 13.5858 22.5858C12.8047 23.3668 12.8047 24.6332 13.5858 25.4142L19.5858 31.4142C20.3668 32.1953 21.6332 32.1953 22.4142 31.4142L34.4142 19.4142Z"
              fill="#1DC94D"
            />
          </svg>
        </div>

        <h1 id="oauth-success-title" class="text-font shou-font">
          {{ $t('授权成功') }}
        </h1>
      </div>

      <p class="tiao-font text-font">
        {{ $t('正在跳转至 RoxyBrowser') }}
      </p>

      <a v-if="!isMobile" role="button" class="text-font login-btn" @click="launchApp">
        <div class="oauth-success-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M22 20C22.5523 20 23 20.4477 23 21C23 21.5523 22.5523 22 22 22H2C1.44772 22 1 21.5523 1 21C1 20.4477 1.44772 20 2 20H22Z"
              fill="white"
            />
            <path
              d="M14.293 7.29297C14.6835 6.90244 15.3165 6.90244 15.707 7.29297C16.0976 7.68349 16.0976 8.31651 15.707 8.70703L11.707 12.707C11.3165 13.0976 10.6835 13.0976 10.293 12.707L8.29297 10.707C7.90244 10.3165 7.90244 9.68349 8.29297 9.29297C8.68349 8.90244 9.31651 8.90244 9.70703 9.29297L11 10.5859L14.293 7.29297Z"
              fill="white"
            />
            <path
              d="M20 5C20 4.44772 19.5523 4 19 4H5C4.44772 4 4 4.44772 4 5V15C4 15.5523 4.44772 16 5 16H19C19.5523 16 20 15.5523 20 15V5ZM22 15C22 16.6569 20.6569 18 19 18H5C3.34315 18 2 16.6569 2 15V5C2 3.34315 3.34315 2 5 2H19C20.6569 2 22 3.34315 22 5V15Z"
              fill="white"
            />
          </svg>
          <span class="text-font open-font">{{ $t('打开RoxyBrowser') }}</span>
        </div>
      </a>

    </section>
  </main>
</template>

<style scoped>
@import '../oauth-success.css';
</style>
