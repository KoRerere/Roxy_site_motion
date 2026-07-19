import type { LocationQueryRaw, RouteLocationNormalizedLoaded } from 'vue-router'
import { getRoxyCookieParentDomain, getRoxyInviteCode, getRoxyToken, setRoxyToken } from '~/utils/auth'
import { getRoxyCookie, setRoxyCookie } from '~/utils/basic'

export const INVITE_CODE_SYNC_QUERY = 'useCode'

export function normalizeRouteQueryValue(value: unknown): string {
  if (Array.isArray(value))
    return value[0] == null ? '' : String(value[0])
  return value == null ? '' : String(value)
}

export interface RouteSyncQueryItem {
  queryKey: string
  getPersistedValue?: () => string
  resolveValue?: (route: RouteLocationNormalizedLoaded) => string
  consumeFromQuery?: (route: RouteLocationNormalizedLoaded) => boolean
}

export const ROUTE_SYNC_QUERY_ITEMS: RouteSyncQueryItem[] = [
  {
    queryKey: 'token',
    getPersistedValue() {
      if (typeof window === 'undefined')
        return ''
      return getRoxyToken() || localStorage.getItem('token') || ''
    },
    consumeFromQuery(route) {
      const raw = route.query.token
      if (raw === undefined || raw === null || raw === '')
        return false

      const token = Array.isArray(raw) ? raw[0] : raw
      if (!token)
        return false

      setRoxyToken(token)
      localStorage.setItem('token', token)

      return true
    },
  },
  {
    queryKey: 'distinct_id',
    getPersistedValue() {
      if (typeof window === 'undefined')
        return ''
      return getRoxyCookie('distinct_id') || ''
    },
    consumeFromQuery(route) {
      const raw = route.query.distinct_id
      if (raw === undefined || raw === null || raw === '')
        return false

      const distinctId = Array.isArray(raw) ? raw[0] : raw
      if (!distinctId)
        return false

      setRoxyCookie('distinct_id', distinctId, 24 * 365 * 10, getRoxyCookieParentDomain())

      return true
    },
  },
]

/** 邀请码：仅语言切换携带，sync 插件有独立 consume 逻辑 */
export const INVITE_CODE_LANGUAGE_SWITCH_ITEM: RouteSyncQueryItem = {
  queryKey: INVITE_CODE_SYNC_QUERY,
  resolveValue(route) {
    const codeFromPath = normalizeRouteQueryValue(route.params.code)
      || normalizeRouteQueryValue(route.params.val)
    if (codeFromPath)
      return codeFromPath

    if (!route.path.startsWith('/auth')) {
      const codeFromQuery = normalizeRouteQueryValue(route.query.code)
      if (codeFromQuery)
        return codeFromQuery
    }

    if (typeof window === 'undefined')
      return ''

    return getRoxyInviteCode() || sessionStorage.getItem('invite-code-sync') || ''
  },
}

function resolveSyncQueryItemValue(
  route: RouteLocationNormalizedLoaded,
  item: RouteSyncQueryItem,
): string {
  const fromQuery = normalizeRouteQueryValue(route.query[item.queryKey])
  if (fromQuery)
    return fromQuery

  const fromRoute = item.resolveValue?.(route)
  if (fromRoute)
    return fromRoute

  return item.getPersistedValue?.() || ''
}

/** 切换语言时需携带的 query（URL 优先，否则读持久化存储） */
export function buildLanguageSwitchQuery(
  route: RouteLocationNormalizedLoaded,
  extraItems: RouteSyncQueryItem[] = [INVITE_CODE_LANGUAGE_SWITCH_ITEM],
): Record<string, string> {
  const items = [...ROUTE_SYNC_QUERY_ITEMS, ...extraItems]
  const query: Record<string, string> = {}

  for (const item of items) {
    const value = resolveSyncQueryItemValue(route, item)
    if (value)
      query[item.queryKey] = value
  }

  return query
}


export function appendQueryToUrl(url: string, query: Record<string, string>): string {
  if (!Object.keys(query).length)
    return url

  try {
    const urlObj = new URL(url)
    for (const [key, value] of Object.entries(query))
      urlObj.searchParams.set(key, value)
    return urlObj.toString()
  }
  catch {
    return url
  }
}

/** 合并语言切换 query 与当前 route.query（保留其它业务 query） */
export function mergeLanguageSwitchRouteQuery(
  route: RouteLocationNormalizedLoaded,
  formatQuery?: (query: Record<string, any>) => Record<string, any>,
): LocationQueryRaw {
  const baseQuery = formatQuery ? formatQuery(route.query) : { ...route.query }
  const preserveQuery = buildLanguageSwitchQuery(route)

  return {
    ...(baseQuery as LocationQueryRaw),
    ...preserveQuery,
  }
}
