import * as authStore from '~/store/auth'
import { getAnonymousDistinctIdTrackProps } from '~/utils/mixpanel-distinct'

const FIRST_LANDING_REPORTED_KEY = 'first_landing_reported_codes'

function getReportedInviteCodes(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(FIRST_LANDING_REPORTED_KEY) || '[]') as string[])
  }
  catch {
    return new Set()
  }
}

function markInviteCodeReported(code: string) {
  const reported = getReportedInviteCodes()
  reported.add(code)
  localStorage.setItem(FIRST_LANDING_REPORTED_KEY, JSON.stringify([...reported]))
}

export function useChannelReport() {
  const { public: { ENV, isChinaSite, roxyHomeUrl } } = useRuntimeConfig()
  const route = useRoute()
  const { $mixpanel } = useNuxtApp()

  function buildReportUrl(path: string) {
    const url = new URL(`${roxyHomeUrl}/app_statistics/${path}`)
    appendInviteChannelParams(url.searchParams, getInviteChannelParams(route))
    return url
  }

  async function checkReferrer() {
    if (document.referrer.includes('roxybrowser'))
      return

    const { code } = getInviteChannelParams(route)
    const value = document.referrer || `unknown_referrer${code ? `_${code}` : ''}`
    if (value.trim()) {
      const url = buildReportUrl('save_channel_sources_people')
      url.searchParams.set('channelSource', value)
      if (import.meta.client) {
        url.searchParams.set('source_domain', new URL(roxyHomeUrl).hostname)
      }
      await fetch(url.toString())
    }
  }

  async function checkLinkCode() {
    const { code } = getInviteChannelParams(route)
    if (code) {
      await fetch(buildReportUrl('save_promotion_link_click_count').toString())
    }
  }

  /** 邀请码维度首次匿名上报 first_landing，每个邀请码仅上报一次 */
  function reportFirstLandingIfNeeded() {
    if (!import.meta.client)
      return

    const { code, bd_code, utm } = getInviteChannelParams(route)
    if (!code || getReportedInviteCodes().has(code))
      return

    $mixpanel.track('first_landing', {
      event_name: 'first_landing',
      time: Date.now(),
      screen_resolution: `${screen.width}x${screen.height}`,
      $user_id: authStore.userInfo.value.id,
      ...getAnonymousDistinctIdTrackProps($mixpanel),
      referrer_code: code,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_content: utm.utm_content,
      utm_term: utm.utm_term,
      bd_code,
    })
    markInviteCodeReported(code)
  }

  function extractCode() {
    const url = new URL(window.location.href)
    const roxy_partner = url.searchParams.get('roxy_partner')
    if (roxy_partner) {
      localStorage.setItem('roxy_partner', roxy_partner)
    }
    const { code, bd_code, utm } = getInviteChannelParams(route)
    console.log('Extracted invite code:', code)
    if (code) {
      localStorage.setItem('code', code)
      const inviteCodeCookieDomain = isChinaSite
        ? getRoxyCookieParentDomain(ENV === 'production' ? 'roxybrowser.cn' : 'roxybrowser.cn')
        : getRoxyCookieParentDomain(ENV === 'production' ? 'roxybrowser.com' : 'roxybrowser.co')
      console.log('inviteCodeCookieDomain:', inviteCodeCookieDomain)
      setRoxyCookie('official-site-invite-code', code, 24 * 365 * 10, inviteCodeCookieDomain) // 10年
    }
    if (bd_code)
      sessionStorage.setItem('bd_code', bd_code)
    Object.entries(utm).forEach(([key, value]) => {
      sessionStorage.setItem(key, value)
    })

    reportFirstLandingIfNeeded()
  }

  return {
    checkReferrer,
    checkLinkCode,
    extractCode,
    reportFirstLandingIfNeeded,
  }
}
