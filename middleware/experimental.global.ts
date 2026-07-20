// 这些页面在生产环境不可访问，如果访问自动跳转至首页
const experimentalRoutes = ['/figma-icons', '/anbin']

const ruPaths = [
  '/ru/blog',
  '/ru/download',
  '/ru/pricing',
  '/ru/copyright/user',
  '/ru/copyright/privacy',
  '/ru/copyright/refund',
  '/ru/copyright/renewal',
  '/ru/copyright/cookie-policy',
  '/ru/changelog',
  '/ru/about-us',
  '/ru/partners',
  '/ru/use-cases',
  '/ru/functions',
]

const zuExperimentalPaths = [
  // '/zh/use-cases/cryptocurrency-trading',
]
const cnMissPaths = [
  '/use-cases/cryptocurrency-trading',
]

const isChinaSite = process.env.SITE_VARIANT === 'china'
const authMobileUserAgentReg = /Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Silk|Opera Mini/i

function getAuthUserAgent(): string {
  if (import.meta.server)
    return useRequestHeaders(['user-agent'])['user-agent'] || ''

  return typeof navigator !== 'undefined' ? navigator.userAgent : ''
}

function wrapWithTokenQuery(url: string): string {
  const token = useCookie('roxy_token').value

  if (token) {
    try {
      const urlObj = new URL(url)
      urlObj.searchParams.set('token', token)

      return urlObj.toString()
    }
    catch (error: any) {
      return url
    }
  }

  return url
}

/** Referer 是否来自配置的国内站点（与同环境的 roxyChinaHomeUrl 一致） */
function isReferrerFromConfiguredChinaSite(roxyChinaHomeUrl: string): boolean {
  let referer: string | undefined
  if (import.meta.server) {
    referer = useRequestHeaders().referer
  }
  else {
    referer = typeof document !== 'undefined' ? document.referrer : ''
  }

  if (!referer?.trim())
    return false
  try {
    const ref = new URL(referer.trim())
    const cn = new URL(roxyChinaHomeUrl)
    const normalizeHost = (h: string) => h.replace(/^www\./i, '')
    return normalizeHost(ref.hostname) === normalizeHost(cn.hostname)
  }
  catch {
    return false
  }
}

function stripZhLocalePath(path: string): string {
  if (path.startsWith('/zh')) {
    const tail = path.slice(3)
    return tail.length ? tail : '/'
  }
  return path
}

/** 外链直达 /en?token= 时 token 在 to.query；from 多为站外路由或空，仅有 from.query 会漏 */
function tokenFromRouteQueries(to: { query: Record<string, unknown> }, from: { query: Record<string, unknown> }): string | undefined {
  const pick = (query: Record<string, unknown>) => {
    const value = query.token
    if (value == null || value === '')
      return undefined
    if (Array.isArray(value))
      return value[0] != null && value[0] !== '' ? String(value[0]) : undefined
    return String(value)
  }
  return pick(to.query) ?? pick(from.query)
}

export default defineNuxtRouteMiddleware((to, from) => {
  const { public: { NODE_ENV, roxyChinaHomeUrl } } = useRuntimeConfig()
  const authIsMobile = useState<boolean>('auth-is-mobile', () => false)
  authIsMobile.value = authMobileUserAgentReg.test(getAuthUserAgent())

  if (experimentalRoutes.includes(to.path) && NODE_ENV === 'production') {
    return navigateTo('/')
  }

  if (!isChinaSite && isReferrerFromConfiguredChinaSite(roxyChinaHomeUrl)) {
    const i18nCookie = useCookie('i18n_redirected')
    if (i18nCookie.value === 'zh')
      i18nCookie.value = 'en'
  }

  if (!isChinaSite && to.path === '/en') {
    const cookie = useCookie('i18n_redirected')
    cookie.value = 'en'
    const queryToken = tokenFromRouteQueries(to, from)
    if (queryToken) {
      const token = useCookie('roxy_token')
      token.value = queryToken
    }
  }

  if (!isChinaSite && (to.path === '/zh' || to.path.startsWith('/zh/'))) {
    // const i18nRedirectCookie = useCookie('i18n_redirected')
    // const referrerFromChina = isReferrerFromConfiguredChinaSite(roxyChinaHomeUrl)
    /** 本地调试：若 cookie 仍为 zh，不 301 到国内站而是留在国际站并切到默认语言路径 */
    // const stayOnInternational = referrerFromChina
    //   || (import.meta.dev && i18nRedirectCookie.value === 'zh')

    // if (stayOnInternational) {
    //   i18nRedirectCookie.value = 'en'
    //   const enPath = stripZhLocalePath(to.path)
    //   const withQueryAndHash = `${enPath}${to.fullPath.slice(to.path.length)}`

    //   return navigateTo(withQueryAndHash)
    // }

    const targetPath = to.path === '/zh' ? '' : to.path.slice(3)
    const fullRedirectUrl = wrapWithTokenQuery(`${roxyChinaHomeUrl}${targetPath}${to.fullPath.slice(to.path.length)}`)

    return navigateTo(fullRedirectUrl, { redirectCode: 301, external: true })
  }

  // 国内站 no_prefix：/zh 前缀为历史/错误 URL，301 到无前缀 canonical 路径
  if (isChinaSite && (to.path === '/zh' || to.path.startsWith('/zh/'))) {
    const targetPath = stripZhLocalePath(to.path)
    const withQueryAndHash = `${targetPath}${to.fullPath.slice(to.path.length)}`

    return navigateTo(withQueryAndHash, { redirectCode: 301 })
  }

  // 从国际站访问国内站缺失页面，重定向到首页
  if (isChinaSite && cnMissPaths.some(cnPath => to.path.startsWith(cnPath))) {
    return navigateTo('/', { redirectCode: 301 })
  }

  // if (isChinaSite && ['/en', '/ru'].includes(to.path)) {
  //   return navigateTo(`https://roxybrowser.com${to.path === '/en' ? '' : to.path}`, { redirectCode: 301, external: true })
  // }

  // if (!isChinaSite && to.path.startsWith('/ru/') && to.path.length > 4 && !ruPaths.some(ruPath => to.path.startsWith(ruPath))) {
  //   return navigateTo('/ru')
  // }

  if (!isChinaSite && zuExperimentalPaths.some(zuPath => to.path.startsWith(zuPath))) {
    return navigateTo('/zh')
  }
})
