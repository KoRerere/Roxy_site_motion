import { toast } from 'vue-sonner'
import { ContentType } from '@roxy/backend-api'

type InviteOAuthProvider = 'google' | 'github' | 'facebook' | 'vk'
const INVITE_OAUTH_CALLBACK_CHANNEL = 'invite-oauth-callback'

interface OAuthMessage {
  type?: string
  code: string
  source: InviteOAuthProvider
  search: string
}

const VK_CODE_VERIFIER_KEY = 'invite_vk_oauth_code_verifier'

function uint8ToBase64Url(bytes: Uint8Array) {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function createRandomId() {
  if (typeof crypto.randomUUID === 'function')
    return crypto.randomUUID()

  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return uint8ToBase64Url(bytes)
}

function encodeState(meta: Record<string, unknown>) {
  const json = JSON.stringify({
    csrf: createRandomId(),
    meta,
    ts: Date.now(),
  })
  return uint8ToBase64Url(new TextEncoder().encode(json))
}

function createOAuthWindow(title: string) {
  const width = 800
  const height = 600
  const left = (screen.width - width) / 2
  const top = (screen.height - height) / 2
  return window.open('', title, `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`)
}

function openOAuthWindow(popup: Window | null, url: string, title: string) {
  if (!popup || popup.closed) {
    toast.error('Please allow pop-ups and try again.')
    return
  }

  popup.location.href = url
  popup.focus()
}

function generateCodeVerifier(length = 43) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-'
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(item => chars[item % chars.length])
    .join('')
}

async function generateCodeChallenge(codeVerifier: string) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier))
  return uint8ToBase64Url(new Uint8Array(hashBuffer))
}

export function useInviteOAuthLogin() {
  const { $API, $httpClient } = useNuxtApp()
  const { public: { ENV, roxyHomeUrl } } = useRuntimeConfig()
  const { finishLogin } = useInviteFinishLogin()
  const loadingProvider = ref<InviteOAuthProvider>()

  const oauthHost = computed(() => (roxyHomeUrl as string).includes('.cn') ? 'cn' : 'com')
  const isDev = computed(() => ENV === 'development')
  const authBaseUrl = computed(() => (roxyHomeUrl as string).replace(/\/$/, ''))
  const authOrigin = computed(() => new URL(authBaseUrl.value).origin)

  async function checkContinueLogin(loginToken: string) {
    const res = await $API.base.checkOtherDeviceLoginList({
      login_token: loginToken,
    } as any)
    if (res.code !== 0) {
      toast.error(res.msg || $t('invite.loginFailed'))
      return false
    }
    if (!res.data?.has_other_login)
      return true
    return window.confirm('Your account is already logged in on another device. Continue logging in?')
  }

  async function loginWithOAuthCode(message: OAuthMessage) {
    if (!message.code || !message.source)
      return

    loadingProvider.value = message.source
    try {
      const canContinue = await checkContinueLogin(message.code)
      if (!canContinue)
        return

      const commonParams = { oauthHost: oauthHost.value }
      if (message.source === 'google') {
        await finishLogin(await $API.base.loginGoogleV2Create({ googleToken: message.code, ...commonParams } as any))
      }
      else if (message.source === 'github') {
        await finishLogin(await $API.base.loginGithubCreate({ githubToken: message.code, ...commonParams } as any))
      }
      else if (message.source === 'facebook') {
        await finishLogin(await $httpClient.request({
          path: '/login_facebook',
          method: 'POST',
          body: { facebookToken: message.code, ...commonParams },
          type: ContentType.Json,
          format: 'json',
        }))
      }
      else {
        const searchParams = new URLSearchParams(message.search)
        await finishLogin(await $httpClient.request({
          path: '/login_vk',
          method: 'POST',
          body: {
            vkToken: message.code,
            code_verifier: localStorage.getItem(VK_CODE_VERIFIER_KEY) || '',
            device_id: searchParams.get('device_id') || '',
            state: searchParams.get('state') || '',
            ...commonParams,
          },
          type: ContentType.Json,
          format: 'json',
        }))
      }
    }
    catch {
      toast.error($t('invite.loginFailed'))
    }
    finally {
      loadingProvider.value = undefined
    }
  }

  async function openOAuthLogin(provider: InviteOAuthProvider) {
    if (!import.meta.client)
      return

    const titleMap = {
      google: 'Google Auth',
      github: 'Github Auth',
      facebook: 'Facebook Auth',
      vk: 'Vk Auth',
    } as const
    const popup = createOAuthWindow(titleMap[provider])

    try {
      const state = encodeState({
        from: 'invite',
        isElectron: false,
        returnOrigin: window.location.origin,
      })

      const redirectUri = provider === 'vk'
        ? `${authBaseUrl.value}/auth/app_vk`
        : `${authBaseUrl.value}/auth?source=${provider}`

      if (provider === 'google') {
        const params = new URLSearchParams({
          client_id: '122184636659-onkerhuo2qe3vjjllg0gnqgp8pcujtci.apps.googleusercontent.com',
          redirect_uri: redirectUri,
          scope: 'https://www.googleapis.com/auth/userinfo.email',
          response_type: 'code',
          state,
        })
        openOAuthWindow(popup, `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`, titleMap[provider])
        return
      }

      if (provider === 'github') {
        const isCn = oauthHost.value === 'cn'
        const clientId = isCn ? 'Ov23liuYcjr4arWQTaJW' : (isDev.value ? 'Ov23lidZHwoteYPc2Bbv' : 'Ov23li2tP2jopYhz3S0A')
        const params = new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          scope: 'user:email',
          state,
        })
        openOAuthWindow(popup, `https://github.com/login/oauth/authorize?${params.toString()}`, titleMap[provider])
        return
      }

      if (provider === 'facebook') {
        const params = new URLSearchParams({
          client_id: '775285631405762',
          redirect_uri: redirectUri,
          scope: 'email,public_profile',
          state,
        })
        openOAuthWindow(popup, `https://www.facebook.com/v22.0/dialog/oauth?${params.toString()}`, titleMap[provider])
        return
      }

      const codeVerifier = generateCodeVerifier()
      const codeChallenge = await generateCodeChallenge(codeVerifier)
      localStorage.setItem(VK_CODE_VERIFIER_KEY, codeVerifier)
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: '54588305',
        scope: 'email',
        redirect_uri: redirectUri,
        state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      })
      openOAuthWindow(popup, `https://id.vk.com/authorize?${params.toString()}`, titleMap[provider])
    }
    catch {
      popup?.close()
      toast.error($t('invite.loginFailed'))
    }
  }

  function setupOAuthCallbackListener() {
    if (!import.meta.client)
      return

    const channel = typeof BroadcastChannel === 'function'
      ? new BroadcastChannel(INVITE_OAUTH_CALLBACK_CHANNEL)
      : undefined

    const handleCallback = (payload: unknown) => {
      if (!payload || typeof payload !== 'object')
        return

      const message = payload as OAuthMessage
      if (message.type && message.type !== INVITE_OAUTH_CALLBACK_CHANNEL)
        return
      loginWithOAuthCode(message)
    }

    const handleWindowMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin && event.origin !== authOrigin.value)
        return
      handleCallback(event.data)
    }

    window.addEventListener('message', handleWindowMessage)
    if (channel)
      channel.onmessage = event => handleCallback(event.data)

    onBeforeUnmount(() => {
      window.removeEventListener('message', handleWindowMessage)
      channel?.close()
    })
  }

  return {
    loadingProvider,
    openOAuthLogin,
    setupOAuthCallbackListener,
  }
}
