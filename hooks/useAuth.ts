import type { OpenOptions } from '~/components/the-header/config'
import { initLocalCookie, setRoxyToken } from '@/utils/auth'
import { useOpenRoxyBrowser } from '~/components/the-header/config'
import * as authStore from '~/store/auth'
import { captureAnonymousDistinctIdBeforeLogin, getAnonymousDistinctIdTrackProps } from '~/utils/mixpanel-distinct'

let clearSideEffect = () => { }

let infoFetchted = false

/** 拉取用户信息并写入 auth store（Invite 登录等客户端跳转前需主动调用） */
export async function fetchAndApplyUserInfo() {
  if (import.meta.server)
    return undefined

  infoFetchted = true
  const { $API, $mixpanel } = useNuxtApp()
  const res = await $API.base.userGetUserInfoList()
  if (res.code !== 200 && res.code !== 0)
    return undefined

  authStore.loggedIn.value = true
  authStore.userInfo.value.avatar = res.data.avatar
  authStore.userInfo.value.name = res.data.userName
  authStore.userInfo.value.email = res.data.email
  authStore.userInfo.value.id = res.data.id

  captureAnonymousDistinctIdBeforeLogin($mixpanel)
  $mixpanel.identify(String(authStore.userInfo.value.id))
  $mixpanel.people.set({
    screen_resolution: `${screen.width}x${screen.height}`,
    $name: authStore.userInfo.value.name,
    $email: authStore.userInfo.value.email,
    $language: navigator.language === 'zh-CN' ? navigator.language : navigator.language.split('-')[0],
  })

  return res.data
}

export function useAuth() {
  const { $API, $mixpanel, $httpClient } = useNuxtApp()
  const { base } = $API

  clearSideEffect()
  const logoutApi = async () => {
    infoFetchted = false

    $httpClient.request({
      method: 'GET',
      path: '/user_logout',
    }).finally(() => {
      authStore.loggedIn.value = false
      authStore.userInfo.value = {
        avatar: '',
        name: '',
        email: '',
        id: 0,
      }
      localStorage.removeItem('token')
      // remove cookie
      const domain = import.meta.dev ? '.roxybrowser.cn' : '.roxybrowser.cn'
      document.cookie = `${ROXY_TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`
    })
  }

  const { openRoxyBrowser } = useOpenRoxyBrowser()
  let timer: NodeJS.Timeout | null = null
  const loginApi = async (target = '_blank', options?: OpenOptions) => {
    window.console.log('watchRoxyToken token')

    openRoxyBrowser(target, options)
    clearSideEffect = watchRoxyToken((token) => {
      if (token) {
        window.console.log('check token', token)
        localStorage.setItem('token', token)
        getUserInfo()
        clearSideEffect()
      }
    })

    timer = setTimeout(() => {
      clearSideEffect()
    }, 1000 * 60 * 5000)
  }

  async function getUserInfo() {
    if (!import.meta.client)
      return
    const hasToken = localStorage.getItem('token')
    if (!hasToken)
      return

    const data = await fetchAndApplyUserInfo()
    if (!data) {
      await logoutApi()
      return
    }
    return data
  }

  const cacheGetUserInfo = () => {
    if (import.meta.client && !infoFetchted) {
      getUserInfo()
    }
  }

  function mixpanelTrack(event_name: string, data?: Record<string, any>) {
    $mixpanel.track(event_name, {
      event_name,
      time: Date.now(),
      screen_resolution: `${screen.width}x${screen.height}`,
      $user_id: authStore.userInfo.value.id,
      ...getAnonymousDistinctIdTrackProps($mixpanel),
      ...data,
    })
  }

  initLocalCookie()

  onMounted(() => {
    if (import.meta.client) {
      cacheGetUserInfo()
      window.sc = (v) => {
        setRoxyToken(v)
      }
    }
  })

  onUnmounted(() => {
    clearSideEffect()
    timer && clearTimeout(timer as NodeJS.Timeout)
  })

  return {
    base,
    logout: logoutApi,
    login: loginApi,
    getUserInfo,
    cacheGetUserInfo,
    mixpanelTrack,
  }
}
