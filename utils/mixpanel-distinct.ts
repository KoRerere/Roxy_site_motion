import type { Mixpanel } from 'mixpanel-browser'
import { getRoxyCookieParentDomain, getRoxyInviteCode } from '~/utils/auth'
import { getRoxyCookie, setRoxyCookie } from '~/utils/basic'

type MixpanelDistinctReader = Pick<Mixpanel, 'get_distinct_id' | 'get_property'>

export const DISTINCT_ID_COOKIE = 'distinct_id'

export const MP_DISTINCT_ID_LOGIN_QUERY = 'mp-distinct-id'

/** Mixpanel track 上报时的匿名 distinct_id 字段名 */
export const ANONYMOUS_DISTINCT_ID_TRACK_KEY = 'anonymous_distinct_id'

const ANONYMOUS_DISTINCT_ID_PREFIX = '$device:'

function isAnonymousDistinctId(id: string) {
  return id.startsWith(ANONYMOUS_DISTINCT_ID_PREFIX)
}

function toAnonymousDistinctId(raw: string) {
  const trimmed = raw.trim()
  if (!trimmed)
    return ''
  if (isAnonymousDistinctId(trimmed))
    return trimmed
  return `${ANONYMOUS_DISTINCT_ID_PREFIX}${trimmed.replace(/^\$device:/, '')}`
}

function resolveAnonymousDistinctIdFromMixpanel(mixpanel?: MixpanelDistinctReader) {
  const current = mixpanel?.get_distinct_id?.() || ''
  if (isAnonymousDistinctId(current))
    return current

  const deviceId = mixpanel?.get_property?.('$device_id')
  if (typeof deviceId === 'string' && deviceId.trim())
    return toAnonymousDistinctId(deviceId)

  return ''
}

export function getPersistedAnonymousDistinctId() {
  if (typeof window === 'undefined')
    return ''
  return getRoxyCookie(DISTINCT_ID_COOKIE) || ''
}

export function persistAnonymousDistinctId(id: string) {
  if (!id || !isAnonymousDistinctId(id) || typeof window === 'undefined')
    return
  setRoxyCookie(DISTINCT_ID_COOKIE, id, 24 * 365 * 10, getRoxyCookieParentDomain())
}

export function ensureAnonymousDistinctIdCaptured(mixpanel?: MixpanelDistinctReader) {
  if (typeof window === 'undefined')
    return ''
  const persisted = getPersistedAnonymousDistinctId()
  if (persisted)
    return persisted

  const resolved = resolveAnonymousDistinctIdFromMixpanel(mixpanel)
  if (resolved) {
    persistAnonymousDistinctId(resolved)
    return resolved
  }
  return ''
}

export function captureAnonymousDistinctIdBeforeLogin(mixpanel?: MixpanelDistinctReader) {
  return ensureAnonymousDistinctIdCaptured(mixpanel)
}

/** 仅 Mixpanel track 上报时附带 */
export function getAnonymousDistinctIdTrackProps(
  mixpanel?: MixpanelDistinctReader,
): Record<string, string> {
  if (typeof window === 'undefined')
    return {}
  const id = getPersistedAnonymousDistinctId() || ensureAnonymousDistinctIdCaptured(mixpanel)
  return id ? { [ANONYMOUS_DISTINCT_ID_TRACK_KEY]: id } : {}
}

export function getMixpanelDistinctId(mixpanel?: MixpanelDistinctReader): string {
  if (typeof window === 'undefined')
    return ''
  return getPersistedAnonymousDistinctId() || ensureAnonymousDistinctIdCaptured(mixpanel)
}

/** 跳转登录站携带的 mp-distinct-id，必须为 cookie 中的 distinct_id */
export function getMpDistinctIdForLogin(mixpanel?: MixpanelDistinctReader): string {
  if (typeof window === 'undefined')
    return ''
  ensureAnonymousDistinctIdCaptured(mixpanel)
  return getPersistedAnonymousDistinctId()
}

export function appendMpDistinctIdLoginQuery(url: URL, mixpanel?: MixpanelDistinctReader) {
  if (!getRoxyInviteCode())
    return
  const distinctId = getMpDistinctIdForLogin(mixpanel)
  if (distinctId)
    url.searchParams.set(MP_DISTINCT_ID_LOGIN_QUERY, distinctId)
}
