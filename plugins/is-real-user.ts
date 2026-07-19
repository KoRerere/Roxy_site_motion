import { isLikelyRealUser } from '@/utils/isBot'

declare module '#app' {
  interface NuxtApp {
    $isRealUser: boolean
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  let isRealUser = true

  if (import.meta.server) {
    const event = useRequestEvent()
    const ua = event?.node?.req?.headers?.['user-agent'] as string | undefined
    isRealUser = isLikelyRealUser(ua)
  } else {
    const ua = navigator.userAgent
    isRealUser = isLikelyRealUser(ua)
  }

  nuxtApp.provide('isRealUser', isRealUser)
})


