// server/api/posts.ts
import { defineEventHandler } from 'h3'
import { DEFAULT_BLOG_POST_LIMIT, DEFAULT_LANGUAGE } from '~/constants'
import { ghostApi, GHOST_EXCLUDE_FAQ_FILTER } from '~/server/utils/api'

const GHOST_ASSET_PREFIX = '/__ghost__/'
const BLOG_ASSET_PREFIX = '/static/'

function replaceGhostAssetPathsDeep(value: unknown): unknown {
  if (value === null || value === undefined)
    return value
  if (typeof value === 'string')
    return value.split(GHOST_ASSET_PREFIX).join(BLOG_ASSET_PREFIX)
  if (Array.isArray(value))
    return value.map(replaceGhostAssetPathsDeep)
  if (typeof value === 'object')
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, replaceGhostAssetPathsDeep(v)]))
  return value
}

export function formatPost(posts: any[], language: string) {
  const withBlogAssets = posts.map(post => replaceGhostAssetPathsDeep(post) as any)
  if (language === DEFAULT_LANGUAGE) {
    return withBlogAssets
  }
  return withBlogAssets.map((post) => {
    return {
      ...post,
      tags: post.tags?.map((item: any) => {
        item.slug = item.slug.replace(`${language}-`, '')
        return item
      }),
    }
  })
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const headers = event.node.req.headers
  const language = headers.language as string
  let filter = `tag:${language}+status:[published,sent]${GHOST_EXCLUDE_FAQ_FILTER}`
  if (query.tag) {
    let tag = query.tag
    if (language !== DEFAULT_LANGUAGE) {
      tag = `${language}-${query.tag}`
    }
    filter = `tag:${tag}+status:[published,sent]${GHOST_EXCLUDE_FAQ_FILTER}`
  }

  const fields = 'id,slug,title,updated_at,excerpt,visibility,feature_image,status,reading_time,custom_excerpt,updated_at,published_at,html,lexical'
  const include = 'tags,authors'
  const order = 'featured desc, published_at desc'

  // Ghost NQL 无全文/like，在已按语言与 tag 过滤的结果集上做内存匹配（分页拉取，每页最多 100 条）
  const searchRaw = query.search != null ? String(query.search).trim() : ''
  if (searchRaw) {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || DEFAULT_BLOG_POST_LIMIT
    const searchText = searchRaw.toLowerCase()

    const allPosts: any[] = []
    let apiPage = 1
    let totalPages = 1
    do {
      const batch = await ghostApi.posts.browse({
        page: apiPage,
        limit: 100,
        order,
        filter,
        fields,
        include,
      })
      allPosts.push(...(batch.posts || []))
      totalPages = batch.meta?.pagination?.pages ?? 1
      apiPage++
    } while (apiPage <= totalPages)

    const lexicalNeedle = (needle: string, lexical: unknown) => {
      if (lexical == null)
        return false
      const s = typeof lexical === 'string' ? lexical : JSON.stringify(lexical)
      return s.toLowerCase().includes(needle)
    }

    const searchPosts = allPosts.filter((post: any) => {
      const title = (post.title || '').toLowerCase()
      const excerpt = ((post.custom_excerpt || post.excerpt) || '').toLowerCase()
      const html = (post.html || '').toLowerCase()
      return title.includes(searchText)
        || excerpt.includes(searchText)
        || html.includes(searchText)
        || lexicalNeedle(searchText, post.lexical)
    })

    const total = searchPosts.length
    const pages = Math.max(1, Math.ceil(total / limit))
    const sliceStart = (page - 1) * limit
    const sliced = searchPosts.slice(sliceStart, sliceStart + limit)

    return {
      posts: formatPost(sliced, language),
      meta: {
        pagination: {
          page,
          limit,
          pages,
          total,
          next: page < pages ? page + 1 : null,
          prev: page > 1 ? page - 1 : null,
        },
      },
    }
  }

  const result = await ghostApi.posts.browse({
    page: query.page || 1,
    limit: query.limit || DEFAULT_BLOG_POST_LIMIT,
    order,
    filter,
    fields,
    include,
  })
  result.posts = formatPost(result.posts, language)
  // result.posts = [];
  return result
})
