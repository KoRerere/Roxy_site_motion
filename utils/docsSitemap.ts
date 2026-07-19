import type { SitemapUrl } from '@nuxtjs/sitemap/dist/runtime/types'
import { parseSitemapXml } from '@nuxtjs/sitemap/utils'

/** docs sitemap 中页面所属的 hreflang（与 i18n language 及 sitemap 文件名一致） */
export type DocsHreflang = 'en-US' | 'ru-RU' | 'zh-CN'

/** 根据 ENV、SITE_VARIANT 解析当前站点根域名（与 nuxt i18n baseUrl 一致） */
export function getSiteOrigin(isDev: boolean, isChinaSite: boolean): string {
  if (isChinaSite) {
    return isDev ? 'https://test.roxybrowser.cn' : 'https://roxybrowser.cn'
  }
  return isDev ? 'https://gatetest.roxybrowser.co' : 'https://roxybrowser.com'
}

/** 国际站 docs 仅 en/ru；中文站 docs 仅 zh */
export function getTargetDocsHreflangs(isChinaSite: boolean): DocsHreflang[] {
  return isChinaSite ? ['zh-CN'] : ['en-US', 'ru-RU']
}

/**
 * 从 docs sitemap 单条 URL 推断其语言。
 * 国际站：/docs/ru/ → ru-RU，其余 /docs/ 路径 → en-US；
 * 中文站：路径含 /docs/zh/ 或 alternates 含 zh-CN 且指向当前 loc → zh-CN。
 */
export function resolveDocsHreflang(
  loc: string,
  alternatives?: Array<{ hreflang: string, href: string | URL }>,
): DocsHreflang | null {
  let pathname: string
  try {
    pathname = new URL(loc).pathname
  }
  catch {
    return null
  }

  if (/\/docs\/ru(\/|$)/.test(pathname)) {
    return 'ru-RU'
  }
  if (/\/docs\/zh(\/|$)/.test(pathname)) {
    return 'zh-CN'
  }

  const normalizeHref = (href: string | URL) => {
    const s = String(href)
    return s.endsWith('/') && s.length > 1 ? s.slice(0, -1) : s
  }
  const normalizedLoc = normalizeHref(loc)

  const selfAlt = alternatives?.find(
    alt => normalizeHref(alt.href) === normalizedLoc,
  )
  if (selfAlt?.hreflang === 'ru-RU') {
    return 'ru-RU'
  }
  if (selfAlt?.hreflang === 'zh-CN') {
    return 'zh-CN'
  }
  if (selfAlt?.hreflang === 'en-US') {
    return 'en-US'
  }

  if (pathname.startsWith('/docs')) {
    return 'en-US'
  }

  return null
}

/** 拉取同域名下的 /docs/sitemap.xml 并解析为 URL 列表 */
export async function fetchDocsSitemapUrls(origin: string): Promise<SitemapUrl[]> {
  const url = `${origin.replace(/\/$/, '')}/docs/sitemap.xml`
  const xml = await $fetch<string>(url, {
    responseType: 'text',
    retry: 2,
    timeout: 30_000,
  })
  const { urls, warnings } = await parseSitemapXml(xml)
  if (warnings.length > 0) {
    console.warn('[docsSitemap] parse warnings:', warnings.slice(0, 5))
  }
  return urls as SitemapUrl[]
}

/**
 * 将 docs sitemap 条目转为可合并进 Nuxt 多语言 sitemap 的格式。
 * 通过 `_sitemap` 指定写入 en-US.xml / ru-RU.xml / zh-CN.xml，不写入 zh-CN（国际站）。
 */
export function mapDocsUrlsToSitemapEntries(
  urls: SitemapUrl[],
  isChinaSite: boolean,
): SitemapUrl[] {
  const allowed = new Set(getTargetDocsHreflangs(isChinaSite))
  const entries: SitemapUrl[] = []

  for (const item of urls) {
    const hreflang = resolveDocsHreflang(item.loc, item.alternatives)
    if (!hreflang || !allowed.has(hreflang)) {
      continue
    }

    const alternatives = item.alternatives
      ?.filter(alt => allowed.has(alt.hreflang as DocsHreflang))
      .map(alt => ({
        hreflang: alt.hreflang,
        href: String(alt.href),
      }))

    entries.push({
      loc: item.loc,
      ...(item.lastmod ? { lastmod: item.lastmod } : {}),
      ...(item.changefreq ? { changefreq: item.changefreq } : {}),
      ...(item.priority !== undefined ? { priority: item.priority } : {}),
      ...(alternatives?.length ? { alternatives } : {}),
      _sitemap: hreflang,
    })
  }

  return entries
}
