export const inviteUtmDefaults = {
  utm_source: 'default',
  utm_medium: 'direct',
  utm_campaign: 'normal',
  utm_content: 'none',
  utm_term: 'none',
} as const

export type InviteUtmKey = keyof typeof inviteUtmDefaults

export interface InviteChannelParams {
  code: string
  bd_code: string
  utm: Record<InviteUtmKey, string>
}

function normalizeRouteParam(value: unknown) {
  if (Array.isArray(value))
    return value[0] == null ? '' : String(value[0])
  return value == null ? '' : String(value)
}

export function getInviteCodeFromRoute(route: ReturnType<typeof useRoute>, searchParams: URLSearchParams) {
  return normalizeRouteParam(route.params.code)
    || normalizeRouteParam(route.params.val)
    || (route.path.startsWith('/auth') ? '' : searchParams.get('code'))
    || getPersistedInviteCode()
    || ''
}

export function getPersistedInviteCode() {
  if (typeof localStorage === 'undefined')
    return ''
  return localStorage.getItem('code') || ''
}

export function getInviteChannelParams(route: ReturnType<typeof useRoute>, url = new URL(window.location.href)) {
  appendDefaultInviteUtmToSearchParams(url.searchParams)

  const utm = Object.keys(inviteUtmDefaults).reduce((result, key) => {
    const utmKey = key as InviteUtmKey
    result[utmKey] = url.searchParams.get(utmKey) || inviteUtmDefaults[utmKey]
    return result
  }, {} as Record<InviteUtmKey, string>)

  return {
    code: getInviteCodeFromRoute(route, url.searchParams),
    bd_code: url.searchParams.get('bd_code') || '',
    utm,
  } satisfies InviteChannelParams
}

export function appendDefaultInviteUtm(query: Record<string, unknown>) {
  const nextQuery = { ...query }

  Object.entries(inviteUtmDefaults).forEach(([key, value]) => {
    if (nextQuery[key] == null || nextQuery[key] === '')
      nextQuery[key] = value
  })

  return nextQuery
}

export function appendDefaultInviteUtmToSearchParams(searchParams: URLSearchParams) {
  Object.entries(inviteUtmDefaults).forEach(([key, value]) => {
    if (!searchParams.get(key))
      searchParams.set(key, value)
  })

  return searchParams
}

export function appendInviteChannelParams(searchParams: URLSearchParams, channelParams: InviteChannelParams) {
  if (channelParams.code)
    searchParams.set('code', channelParams.code)
  if (channelParams.bd_code)
    searchParams.set('bd_code', channelParams.bd_code)
  Object.entries(channelParams.utm).forEach(([key, value]) => {
    searchParams.set(key, value)
  })

  return searchParams
}
