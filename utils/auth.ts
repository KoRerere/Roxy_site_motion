import { BaseApi } from '~/packages/backend-api/src'
import { loggedIn } from '~/store/auth'
import { getRoxyCookie, setRoxyCookie } from './basic'

export const ROXY_TOKEN_COOKIE = 'roxy_token'
export const ROXY_INVITE_CODE_COOKIE = 'official-site-invite-code'
const isChinaSite = process.env.SITE_VARIANT === 'china'

export function getRoxyCookieParentDomain(hostname?: string): string | undefined {
  const host = hostname ?? (typeof window !== 'undefined' ? window.location.hostname : '')
  if (!host || host === 'localhost' || /^\d{1,3}(\.\d{1,3}){3}$/.test(host))
    return undefined
  if (host === 'roxybrowser.com' || host.endsWith('.roxybrowser.com'))
    return '.roxybrowser.com'
  if (host === 'roxybrowser.co' || host.endsWith('.roxybrowser.co'))
    return '.roxybrowser.co'
  if (host === 'roxybrowser.cn' || host.endsWith('.roxybrowser.cn'))
    return '.roxybrowser.cn'

  return isChinaSite ? '.roxybrowser.cn' : '.roxybrowser.com'
}

export function getRoxyToken(): string | null | undefined {
  if (typeof document === 'undefined')
    return null
  return getRoxyCookie(ROXY_TOKEN_COOKIE)
}

export function getRoxyInviteCode(): string {
  if (typeof document === 'undefined')
    return ''
  return localStorage.getItem('code') || getRoxyCookie(ROXY_INVITE_CODE_COOKIE) || ''
}

export function setRoxyInviteCode(value: string, hours = 24 * 365 * 10) {
  if (typeof document === 'undefined')
    return
  localStorage.setItem('code', value)
  setRoxyCookie(ROXY_INVITE_CODE_COOKIE, value, hours, getRoxyCookieParentDomain())
}

/**
 * 前端写入 token（跨子域需 domain 与主域一致）。
 * 生产环境登录态通常由服务端 Set-Cookie 带 Domain=.roxybrowser.com；此函数供同步或纯前端场景。
 */
export function setRoxyToken(value: string, maxAgeSeconds = 60 * 60 * 24 * 7) {
  if (typeof document === 'undefined')
    return
  // document.cookie = buildRoxyTokenCookieParts(value, maxAgeSeconds)
  const domain = getRoxyCookieParentDomain()
  console.log('setRoxyToken with domain', domain)
  setRoxyCookie(ROXY_TOKEN_COOKIE, value, maxAgeSeconds, domain)
}

export function clearRoxyToken() {
  if (typeof document === 'undefined')
    return
  const parts = [`${ROXY_TOKEN_COOKIE}=`, 'path=/', 'max-age=0']
  const domain = getRoxyCookieParentDomain()
  if (domain)
    parts.push(`domain=${domain}`)
  if (typeof window !== 'undefined' && window.location.protocol === 'https:')
    parts.push('Secure')
  document.cookie = parts.join('; ')
}

export type RoxyTokenWatcher = (token: string | null) => void

export function watchRoxyToken(
  onChange: RoxyTokenWatcher,
  options?: { intervalMs?: number },
): () => void {
  if (typeof document === 'undefined')
    return () => { }

  let last = getRoxyToken()
  const intervalMs = options?.intervalMs ?? 1000
  let id
  window.console.log('watchRoxyToken', last)
  const tick = () => {
    window.console.log('tick', last)

    const next = getRoxyToken()
    if (next !== last) {
      last = next
      onChange(next)
    }
  }

  id = window.setInterval(tick, intervalMs)
  const onFocus = () => tick()
  const onVis = () => {
    if (document.visibilityState === 'visible')
      tick()
  }
  window.addEventListener('focus', onFocus)
  document.addEventListener('visibilitychange', onVis)

  return () => {
    window.clearInterval(id)
    window.removeEventListener('focus', onFocus)
    document.removeEventListener('visibilitychange', onVis)
  }
}
export function initLocalCookie() {
  if (!import.meta.client || !document)
    return
  window.console.log('initLocalCookie')
  const cookie = getRoxyCookie(ROXY_TOKEN_COOKIE)
  if (cookie) {
    localStorage.setItem('token', cookie)
  }
}
export function login() {
  loggedIn.value = true
}

export function logout() {
  loggedIn.value = false
}
