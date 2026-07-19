import type { Ref } from 'vue'
import { DEFAULT_LANGUAGE } from '@/constants'


function pathWithoutZhPrefixForCn(path: string, isChinaSite: boolean): string {
  if (!isChinaSite)
    return path
  const stripped = path.replace(/^\/zh(?=\/|$)/, '')
  return stripped === '' ? '/' : stripped
}

/** 当前博客 slug 在 sitemap 中实际存在的路径（仅用于博客详情页 head） */
function getAllowedPathsForBlogSlug(slug: string, postsUrls: string[], localeCodes: string[], isChinaSite: boolean): Set<string> {
  const allowed = new Set<string>()
  if (isChinaSite) {
    const path = `/blog/${slug}`
    if (postsUrls.some(url => pathWithoutZhPrefixForCn(url, isChinaSite) === path || url === path))
      allowed.add(path)
    return allowed
  }
  for (const code of localeCodes) {
    const path = code === DEFAULT_LANGUAGE ? `/blog/${slug}` : `/${code}/blog/${slug}`
    if (postsUrls.some(url => url === path))
      allowed.add(path)
  }
  return allowed
}

/** 从博客路径解析出语言代码 */
function pathToLocale(path: string, isChinaSite: boolean): string {
  if (path.startsWith('/zh/'))
    return 'zh'
  if (path.startsWith('/ru/'))
    return 'ru'
  if (isChinaSite && path.startsWith('/blog/'))
    return 'zh'
  return 'en'
}

const OG_LOCALE_TO_CODE: Record<string, string> = {
  en_US: 'en',
  zh_CN: 'zh',
  ru_RU: 'ru',
}

/**
 * 博客详情页专用：根据 sitemap 中实际存在的语言版本，返回需注入的 link（hreflang/canonical）和 meta（og:locale 等）
 * 在 pages/blog/[slug].vue 中调用，避免对不存在的多语言版本输出 alternate。
 * 显式包含自引用 hreflang 与 hreflang="x-default" 以满足 SEO 要求。
 */
export function useBlogSeoHead(slug: Ref<string> | string) {
  const localeHead = useLocaleHead()
  const route = useRoute()
  const { $postsUrls } = useNuxtApp()
  const config = useRuntimeConfig()
  const isChinaSite = config.public.isChinaSite === true
  const localeCodes = (config.public.i18n?.locales as { code: string }[] || []).map(l => l.code)

  const slugRef = typeof slug === 'string' ? ref(slug) : slug

  const link = computed(() => {
    const s = slugRef.value
    if (!s)
      return []
    const baseUrl = (config.public.roxyHomeUrl as string) || ''
    const defaultBaseUrl = 'https://roxybrowser.com'
    if (!baseUrl)
      return []

    const allowedPaths = getAllowedPathsForBlogSlug(s, $postsUrls || [], localeCodes, isChinaSite)

    /** 构建带自引用 + x-default 的 hreflang 集合 */
    const buildHreflangLinks = (paths: Set<string>) => {
      const rawDefault = paths.has(`/blog/${s}`) ? `/blog/${s}` : Array.from(paths)[0] || route.path
      const defaultPath = pathWithoutZhPrefixForCn(rawDefault, isChinaSite)
      const links: { rel: string, hreflang?: string, href: string }[] = []
      let hasEnPath = false
      for (const path of paths) {
        const hrefPath = pathWithoutZhPrefixForCn(path, isChinaSite)
        hasEnPath = hasEnPath || path.startsWith('/en/')
        links.push({ rel: 'alternate', hreflang: pathToLocale(path, isChinaSite), href: baseUrl + hrefPath })
      }

      if (isChinaSite && !hasEnPath) {
        links.push({ rel: 'alternate', hreflang: 'en', href: defaultBaseUrl + defaultPath })
      }

      // 国内站主版本在 .cn；国际站 x-default 仍指向 .com
      const xDefaultBaseUrl = isChinaSite ? baseUrl : defaultBaseUrl
      links.push({ rel: 'alternate', hreflang: 'x-default', href: xDefaultBaseUrl + defaultPath })

      return links
    }
    if (allowedPaths.size === 0) {
      const currentPath = route.path
      const canonical = localeHead.value.link.find(
        l => l.rel === 'canonical' || (l as { id?: string }).id === 'i18n-can',
      )
      const hreflangLinks = buildHreflangLinks(new Set([currentPath]))
      const result = canonical ? [canonical, ...hreflangLinks] : hreflangLinks
      return result
    }

    const canonical = localeHead.value.link.find(
      l => l.rel === 'canonical' || (l as { id?: string }).id === 'i18n-can',
    )
    const hreflangLinks = buildHreflangLinks(allowedPaths)
    return canonical ? [canonical, ...hreflangLinks] : hreflangLinks
  })

  const meta = computed(() => {
    const s = slugRef.value
    if (!s)
      return []
    const allowedPaths = getAllowedPathsForBlogSlug(s, $postsUrls || [], localeCodes, isChinaSite)
    const allowedLocales = new Set<string>()
    if (allowedPaths.size > 0) {
      if (allowedPaths.has(`/blog/${s}`))
        allowedLocales.add(isChinaSite ? 'zh' : 'en')
      if (allowedPaths.has(`/zh/blog/${s}`))
        allowedLocales.add('zh')
      if (allowedPaths.has(`/ru/blog/${s}`))
        allowedLocales.add('ru')
    }
    return (localeHead.value.meta || []).filter((item: { property?: string, name?: string, content?: string }) => {
      const prop = item.property || item.name
      if (prop === 'og:locale:alternate') {
        const code = item.content && OG_LOCALE_TO_CODE[item.content]
        return code != null && allowedLocales.has(code)
      }
      return true
    })
  })

  return { link, meta }
}
