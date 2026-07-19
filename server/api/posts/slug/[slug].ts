import { defineEventHandler } from 'h3'
import { DEFAULT_LANGUAGE } from '~/constants'
import { parseGhostArticleLexical } from '~/server/utils/blog-article'
import { ghostApi } from '~/server/utils/api'
import { buildFaqPageLdJson, parseGhostFaqLexical } from '~/utils/ghost-lexical-faq'
import { formatPost } from '../index'

const BLOG_FAQ_ANCHOR = 'faq'

const FAQ_SECTION_TITLES: Record<string, string> = {
  en: 'FAQs',
  zh: '常见问题',
  ru: 'Часто задаваемые вопросы',
}

function buildBlogPostUrl(routeSlug: string, language: string) {
  const config = useRuntimeConfig()
  const baseUrl = (config.public.roxyHomeUrl as string) || 'https://roxybrowser.com'
  const path = language === DEFAULT_LANGUAGE ? `/blog/${routeSlug}` : `/${language}/blog/${routeSlug}`
  return `${baseUrl}${path}`
}

function buildFaqSlug(routeSlug: string, language: string) {
  return language === DEFAULT_LANGUAGE
    ? `${routeSlug}-faq`
    : `${language}-${routeSlug}-faq`
}

async function readPostBySlug(slug: string, query: Record<string, unknown>) {
  const result = await ghostApi.posts.read(slug, query)
  if (!Array.isArray(result.posts) || result.posts.length === 0)
    return null
  return result.posts[0]
}

export default defineEventHandler(async (event) => {
  const params = event.context.params
  const query = getQuery(event)
  const headers = event.node.req.headers
  const language = (headers.language as string) || (query.language as string) || DEFAULT_LANGUAGE
  let slug = params?.slug

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusText: 'Slug is required',
    })
  }

  const routeSlug = slug
  if (language !== DEFAULT_LANGUAGE) {
    slug = `${language}-${slug}`
  }

  const faqSlug = buildFaqSlug(routeSlug, language)

  let mainPost: Awaited<ReturnType<typeof readPostBySlug>>
  let faqPost: Awaited<ReturnType<typeof readPostBySlug>>
  try {
    [mainPost, faqPost] = await Promise.all([
      readPostBySlug(slug, query),
      readPostBySlug(faqSlug, query).catch(() => null),
    ])
  }
  catch (err) {
    console.error('[blog api] ghost posts.read threw', err)
    throw err
  }

  if (!mainPost) {
    throw createError({
      statusCode: 404,
      statusText: 'Post not found',
    })
  }

  const [formattedMain] = formatPost([mainPost], language)
  const { article, directory } = parseGhostArticleLexical(formattedMain.lexical)

  let faq: { title: string, items: ReturnType<typeof parseGhostFaqLexical> } | null = null
  if (faqPost) {
    const [formattedFaq] = formatPost([faqPost], language)
    const faqItems = parseGhostFaqLexical(formattedFaq?.lexical)
    if (faqItems.length > 0) {
      faq = {
        title: formattedFaq.title || '',
        items: faqItems,
      }
    }
  }

  const pageUrl = buildBlogPostUrl(routeSlug, language)
  const faqLdJson = faq
    ? buildFaqPageLdJson(faq.items, `${pageUrl}#${BLOG_FAQ_ANCHOR}`)
    : null

  const finalDirectory = [...directory]
  if (faq) {
    finalDirectory.push({
      title: FAQ_SECTION_TITLES[language] || FAQ_SECTION_TITLES.en,
      anchor: BLOG_FAQ_ANCHOR,
      level: 2,
    })
  }

  const { lexical: _lexical, ...postMeta } = formattedMain

  const faqLdJsonScript = faqLdJson ? JSON.stringify(faqLdJson) : null

  return {
    ...postMeta,
    article,
    directory: finalDirectory,
    faq,
    faqLdJson,
    faqLdJsonScript,
    pageUrl,
  }
})
