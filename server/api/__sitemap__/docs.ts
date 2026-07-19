import { defineSitemapEventHandler } from '#imports'
import { setResponseHeader } from 'h3'
import {
  fetchDocsSitemapUrls,
  getSiteOrigin,
  mapDocsUrlsToSitemapEntries,
} from '@/utils/docsSitemap'

const isDev = process.env.ENV === 'development'
const isChinaSite = process.env.SITE_VARIANT === 'china'

// 构建/预渲染阶段拉取远端 docs sitemap，合并进对应语言的 sitemap xml
export default defineSitemapEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')

  const origin = getSiteOrigin(isDev, isChinaSite)

  try {
    const urls = await fetchDocsSitemapUrls(origin)
    const entries = mapDocsUrlsToSitemapEntries(urls, isChinaSite)
    console.log(
      `[sitemap/docs] merged ${entries.length} docs urls from ${origin}/docs/sitemap.xml`
      + ` (${isChinaSite ? 'zh-CN' : 'en-US, ru-RU'})`,
    )
    return entries
  }
  catch (error) {
    console.error(`[sitemap/docs] failed to fetch ${origin}/docs/sitemap.xml:`, error)
    return []
  }
})
