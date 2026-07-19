/**
 * CSRF Token 管理工具
 * 提供 Token 的缓存、获取和刷新功能
 */

const BATCH_BASE_URL = 'https://batch.1key.me'

// CSRF Token 缓存（内存存储）
interface CsrfTokenCache {
  token: string
  expiresAt: number // 过期时间戳（毫秒）
}

let csrfTokenCache: CsrfTokenCache | null = null
const TOKEN_VALID_DURATION = 1 * 60 * 60 * 1000 // 1 小时（毫秒）

/**
 * 从远程获取 CSRF Token
 * @param userAgent 用户代理字符串
 * @returns CSRF Token
 */
async function fetchCsrfTokenFromRemote(userAgent: string): Promise<string> {
  const res = await fetch(`${BATCH_BASE_URL}/`, {
    method: 'GET',
    headers: {
      'User-Agent': userAgent,
    },
  })

  if (!res.ok) {
    throw createError({
      statusCode: res.status,
      message: 'request csrf token api failed',
    })
  }

  const html = await res.text()
  const match = html.match(/window\.CSRF_TOKEN\s*=\s*['"](.+?)['"]/)
  if (!match) {
    throw createError({
      statusCode: 500,
      message: 'failed to parse csrf token from page',
    })
  }

  return match[1]
}

/**
 * 获取 CSRF Token（带缓存）
 * @param userAgent 用户代理字符串
 * @param forceRefresh 是否强制刷新
 * @returns CSRF Token 和相关信息
 */
export async function getCsrfToken(
  userAgent: string = 'Mozilla/5.0',
  forceRefresh: boolean = false,
): Promise<{
  token: string
  fromCache: boolean
  remainingSeconds: number
  expiresAt: number
}> {
  const now = Date.now()

  // 如果强制刷新或缓存不存在或已过期，重新获取
  if (forceRefresh || !csrfTokenCache || now >= csrfTokenCache.expiresAt) {
    const token = await fetchCsrfTokenFromRemote(userAgent)
    const expiresAt = now + TOKEN_VALID_DURATION

    csrfTokenCache = {
      token,
      expiresAt,
    }

    const remainingSeconds = Math.ceil((expiresAt - now) / 1000)

    return {
      token,
      fromCache: false,
      remainingSeconds,
      expiresAt,
    }
  }

  // 从缓存返回
  const remainingSeconds = Math.ceil((csrfTokenCache.expiresAt - now) / 1000)

  return {
    token: csrfTokenCache.token,
    fromCache: true,
    remainingSeconds,
    expiresAt: csrfTokenCache.expiresAt,
  }
}

/**
 * 手动刷新 CSRF Token
 * @param userAgent 用户代理字符串
 * @returns 新的 CSRF Token 和相关信息
 */
export async function refreshCsrfToken(
  userAgent: string = 'Mozilla/5.0',
): Promise<{
  token: string
  remainingSeconds: number
  expiresAt: number
}> {
  const result = await getCsrfToken(userAgent, true)
  return {
    token: result.token,
    remainingSeconds: result.remainingSeconds,
    expiresAt: result.expiresAt,
  }
}

/**
 * 获取当前缓存的 CSRF Token（如果存在且未过期）
 * @returns CSRF Token 或 null
 */
export function getCachedCsrfToken(): string | null {
  if (!csrfTokenCache) {
    return null
  }

  const now = Date.now()
  if (now >= csrfTokenCache.expiresAt) {
    return null
  }

  return csrfTokenCache.token
}
