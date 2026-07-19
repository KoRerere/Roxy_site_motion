import { error } from 'console'
import { defineEventHandler } from 'h3'
import { DEFAULT_LANGUAGE } from '~/constants'
import { formatPost } from '~/server/api/posts/index'
import { ghostApi, GHOST_EXCLUDE_FAQ_FILTER } from '~/server/utils/api'

async function resolveAuthorBySlug(slug: string) {
  let authorPayload: any
  try {
    authorPayload = await ghostApi.authors.read(slug)
  }
  catch {
    authorPayload = null
  }

  const fromRead = authorPayload?.authors
  if (Array.isArray(fromRead) && fromRead[0])
    return fromRead[0]

  // Ghost 版本或配置差异下 slug 直读可能失败，改用 browse + filter
  try {
    const browsed = await ghostApi.authors.browse({
      limit: 1,
      filter: `slug:${slug}`,
    })
    const list = browsed?.authors
    if (Array.isArray(list) && list[0])
      return list[0]
  }
  catch (err) {
    console.error('[authors/slug] browse fallback failed', err instanceof Error ? err.message : err)
  }

  return null
}

/**
 * 部分 Ghost/密钥配置下 Admin /authors 不可用，但 posts.browse + authors.slug 与文章详情一致且可用。
 * 取该作者任意一篇已发布文章内嵌的 author 作为资料来源。
 */
async function resolveAuthorFromPosts(slug: string) {
  try {
    const result = await ghostApi.posts.browse({
      limit: 1,
      page: 1,
      order: 'published_at desc',
      filter: `authors.slug:${slug}+status:[published,sent]`,
      include: 'authors',
    })
    const post = result?.posts?.[0]
    const authors = post?.authors
    if (!Array.isArray(authors) || authors.length === 0)
      return null
    return authors.find((a: any) => a?.slug === slug) ?? authors[0]
  }
  catch (err) {
    console.error('[authors/slug] resolve from posts failed', err instanceof Error ? err.message : err)
    return null
  }
}

export default defineEventHandler(async (event) => {
  const params = event.context.params
  const query = getQuery(event)
  const headers = event.node.req.headers
  const language = (headers.language as string) || DEFAULT_LANGUAGE
  const raw = params?.slug
  const segment = raw == null ? '' : Array.isArray(raw) ? raw[0] : String(raw)
  let slug = segment
  try {
    slug = decodeURIComponent(segment)
  }
  catch {
    slug = segment
  }

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required',
    })
  }

  let author = await resolveAuthorBySlug(slug)
  if (!author)
    author = await resolveAuthorFromPosts(slug)
  if (!author)
    throw createError({ statusCode: 404, statusMessage: 'Author not found' })

  const page = Number(query.page) || 1
  const limit = Math.min(Number(query.limit) || 24, 100)
  const filter = `authors.slug:${slug}+tag:${language}+status:[published,sent]${GHOST_EXCLUDE_FAQ_FILTER}`
  const fields = 'id,slug,title,updated_at,excerpt,visibility,feature_image,status,reading_time,custom_excerpt,updated_at,published_at,html,lexical'
  const include = 'tags,authors'
  const order = 'published_at desc'

  const postsResult = await ghostApi.posts.browse({
    page,
    limit,
    order,
    filter,
    fields,
    include,
  })

  return {
    author,
    posts: formatPost(postsResult.posts || [], language),
    meta: postsResult.meta,
  }
})
