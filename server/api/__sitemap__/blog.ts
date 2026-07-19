import { defineSitemapEventHandler } from '#imports'
import { setResponseHeader } from 'h3'
import { DEFAULT_LANGUAGE } from '@/constants'
import { GHOST_FAQ_INTERNAL_TAG } from '~/server/utils/api'

const GHOST_POSTS_LIMIT = 100 // Ghost API 单次请求最大 limit
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 1 天
const CACHE_MAX_AGE = 24 * 60 * 60 // 1 天（秒）

let cache: { sitemap: any[], timestamp: number } | null = null

// https://github.com/nuxt-modules/sitemap/issues/329
export default defineSitemapEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}`)

  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return cache.sitemap
  }

  const config = useRuntimeConfig()
  const i18n = config.public.i18n
  const locales = (i18n?.locales ?? []).map((l: { code: string }) => l.code)
  const defaultLocale = (i18n as { defaultLocale?: string })?.defaultLocale ?? DEFAULT_LANGUAGE
  const isChinaSite = config.public.isChinaSite === true

  const allPosts: any[] = []
  let page = 1
  let total = 0

  do {
    const res = await ghostApi.posts.browse({
      page,
      limit: GHOST_POSTS_LIMIT,
      filter: 'status:published',
      fields: 'id,slug,updated_at',
      include: 'tags',
    })
    allPosts.push(...res.posts)
    total = (res.meta?.pagination?.total ?? 0) as number
    page++
  } while (allPosts.length < total)

  const sitemap = allPosts
    .filter((post: any) => !post.tags?.some((tag: any) => tag.slug === GHOST_FAQ_INTERNAL_TAG))
    .filter((post: any) => {
      // 国内站 no_prefix：只收录中文 tag 文章，避免 en/ru 及 /zh/blog/ 污染 zh-CN.xml
      if (isChinaSite)
        return post.tags?.some((tag: any) => tag.name === defaultLocale)
      return true
    })
    .map((post: any) => {
      if (isChinaSite) {
        const slug = post.slug.replace(`${defaultLocale}-`, '')
        return {
          loc: `/blog/${slug}`,
          lastmod: post.updated_at,
          changefreq: 'weekly',
          priority: 0.7,
        }
      }
      const locale = locales.find(locale => post.tags.some((tag: any) => tag.name === locale))
      return {
        loc: `${locale && locale !== DEFAULT_LANGUAGE ? `/${locale}` : ''}/blog/${post.slug.replace(`${locale}-`, '')}`,
        lastmod: post.updated_at,
        changefreq: 'weekly',
        priority: 0.7,
      }
    })

  cache = { sitemap, timestamp: Date.now() }
  return sitemap
})
