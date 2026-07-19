import { loggedIn } from '~/store/auth'
import { appendMpDistinctIdLoginQuery } from '~/utils/mixpanel-distinct'

const MOBILE_DOWNLOAD_MEDIA = '(max-width: 1123px)'

function isMobileLikeDevice() {
  if (!import.meta.client) {
    return false
  }

  return window.matchMedia(MOBILE_DOWNLOAD_MEDIA).matches
}

export function useMobileDownloadRedirect() {
  const { locale } = useRxI18n()
  const { public: { roxyBrowserUrl } } = useRuntimeConfig()
  const { $mixpanel } = useNuxtApp()

  function getLoginUrl() {
    const base = new URL(roxyBrowserUrl)
    const lang = { zh: 'zh-CN', en: 'en', ru: 'ru' }[locale.value] || 'en'
    const inviteCode = import.meta.client ? localStorage.getItem('code') || '' : ''

    base.pathname = '/login'
    base.searchParams.set('official-site-lang', lang)
    base.searchParams.set('official-site-invite-code', inviteCode)
    base.searchParams.set('jump-referer', 'roxy-home')
    appendMpDistinctIdLoginQuery(base, $mixpanel)

    return base.toString()
  }

  function redirectMobileDownloadToLogin(event?: Event) {
    if (!isMobileLikeDevice()) {
      return false
    }

    if (loggedIn.value) {
      return false
    }

    event?.preventDefault()
    event?.stopPropagation()
    window.location.href = getLoginUrl()
    return true
  }

  return {
    redirectMobileDownloadToLogin,
  }
}
