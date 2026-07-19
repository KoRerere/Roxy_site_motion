import * as authStore from '~/store/auth'
import { captureAnonymousDistinctIdBeforeLogin } from '~/utils/mixpanel-distinct'

const isChinaSite = process.env.SITE_VARIANT === 'china'

function getDomain(NODE_ENV: string) {
  if (isChinaSite) {
    return '.roxybrowser.cn'
  }

  return NODE_ENV === 'development' ? '.roxybrowser.co' : '.roxybrowser.com'
}

let gsiScriptPromise: Promise<void> | null = null

function loadGsiScript(): Promise<void> {
  if (import.meta.server)
    return Promise.resolve()

  if (window.google?.accounts?.id)
    return Promise.resolve()

  if (gsiScriptPromise)
    return gsiScriptPromise

  gsiScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'))
    document.head.appendChild(script)
  })

  return gsiScriptPromise
}

export function useGoogleOneTap() {
  const nuxtApp = useNuxtApp()
  const { public: { NODE_ENV, googleOneTapClientId, roxyBrowserUrl } } = useRuntimeConfig()

  let lastClientId: string | null = null

  async function handleCredentialResponse(response: { credential: string }) {
    const { $API, $mixpanel } = nuxtApp
    const res = await $API.base.loginGoogleV2Create({ googleToken: response.credential, mode: 'one-tap' })
    if (res.code !== 0) {
      console.warn('[Google One Tap] login_google_v2 failed', res.msg)
      return
    }
    const token = res.data.token

    localStorage.setItem('token', token)

    const domain = isChinaSite ? '.roxybrowser.cn' : NODE_ENV === 'development' ? '.roxybrowser.co' : '.roxybrowser.com'
    document.cookie = `roxy_token=${token}; domain=${domain}; path=/`

    window.open(roxyBrowserUrl, '_blank')

    const userRes = await $API.base.userGetUserInfoList({ headers: { token } })
    if (userRes.code !== 200 && userRes.code !== 0) {
      console.warn('[Google One Tap] user_get_user_info failed', userRes.msg)
      return
    }

    authStore.loggedIn.value = true
    authStore.userInfo.value.avatar = userRes.data.avatar
    authStore.userInfo.value.name = userRes.data.userName
    authStore.userInfo.value.email = userRes.data.email
    authStore.userInfo.value.id = userRes.data.id

    captureAnonymousDistinctIdBeforeLogin($mixpanel)
    $mixpanel.identify(String(authStore.userInfo.value.id))
    $mixpanel.people.set({
      screen_resolution: `${screen.width}x${screen.height}`,
      $name: authStore.userInfo.value.name,
      $email: authStore.userInfo.value.email,
      $language: navigator.language === 'zh-CN' ? navigator.language : navigator.language.split('-')[0],
    })
  }

  function cancelPrompt() {
    window.google?.accounts?.id?.cancel()
    lastClientId = null
  }

  async function tryPrompt() {
    if (import.meta.server)
      return

    const clientId = googleOneTapClientId
    if (!clientId)
      return

    if (authStore.loggedIn.value)
      return

    if (localStorage.getItem('token'))
      return

    try {
      await loadGsiScript()
    }
    catch (e) {
      console.warn('[Google One Tap]', e)
      return
    }

    if (authStore.loggedIn.value)
      return

    if (localStorage.getItem('token'))
      return

    const id = window.google?.accounts?.id
    if (!id)
      return

    if (lastClientId === clientId)
      id.cancel()

    lastClientId = clientId

    // One Tap（google.accounts.id）只支持 IdConfiguration：回调里是 JWT（credential），
    // 不支持 OAuth 的 scope / response_type: 'code'；要授权码请用 google.accounts.oauth2.initCodeClient。
    id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    })

    id.prompt()
  }

  function setupGoogleOneTap() {
    if (import.meta.server)
      return

    tryPrompt()
  }

  return { setupGoogleOneTap }
}
