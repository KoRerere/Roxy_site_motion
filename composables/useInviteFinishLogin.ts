import { toast } from 'vue-sonner'
import { buildAppBrowserListUrl, resolveAppLocale } from '@/utils/appTopUpRedirect'
import { setRoxyToken } from '@/utils/auth'
import { fetchAndApplyUserInfo } from '~/hooks/useAuth'

/** 与 roxy-browser apps/web main.ts 读取的 query 名一致 */
const LOCALE_HANDOFF_TOKEN_QUERY = 'locale-handoff-token'

/** 与 useMobileDownloadRedirect 保持一致：1123px 以下视为移动端 */
const INVITE_MOBILE_MEDIA = '(max-width: 1123px)'

function isInviteMobileDevice() {
  if (!import.meta.client)
    return false
  return window.matchMedia(INVITE_MOBILE_MEDIA).matches
}

export interface InviteLoginResponseData {
  code: number
  data?: {
    token?: string
    workspaceId?: number
  }
  msg?: string
}

function buildInviteAppRedirectUrl(token: string, roxyBrowserUrl: string, locale: string) {
  const url = new URL(buildAppBrowserListUrl(roxyBrowserUrl, locale))
  url.searchParams.set(LOCALE_HANDOFF_TOKEN_QUERY, token)
  url.searchParams.set('official-site-lang', resolveAppLocale(locale))
  url.searchParams.set('jump-referer', 'invite')
  return url.toString()
}

export function useInviteFinishLogin() {
  const { locale } = useRxI18n()
  const localePath = useLocalePath()
  const { public: { roxyBrowserUrl } } = useRuntimeConfig()

  async function finishLogin(res: InviteLoginResponseData) {
    if (res.code !== 0 && res.code !== 200) {
      toast.error(res.msg || $t('invite.loginFailed'))
      return false
    }

    const token = res.data?.token
    if (!token) {
      toast.error($t('invite.loginFailed'))
      return false
    }

    setRoxyToken(token)
    localStorage.setItem('token', token)

    const user = await fetchAndApplyUserInfo()
    if (!user) {
      toast.error($t('invite.loginFailed'))
      return false
    }

    toast.success($t('invite.loginSuccess'))

    // 移动端注册/登录后回官网首页；PC 端跳转 App Web（由 App 读取 locale-handoff-token）
    if (isInviteMobileDevice()) {
      await navigateTo(localePath('/'))
      return true
    }

    window.location.href = buildInviteAppRedirectUrl(token, String(roxyBrowserUrl), locale.value)
    return true
  }

  return {
    finishLogin,
  }
}
