import { ghostApi, langTags } from '../utils/api'

interface TagItem {
  accent_color: null
  canonical_url: null
  codeinjection_foot: null
  codeinjection_head: null
  count: { posts: number }
  created_at: string
  description: string
  feature_image: null
  id: string
  meta_description: null
  meta_title: null
  name: string
  og_description: null
  og_image: null
  og_title: null
  slug: string
  twitter_description: null
  twitter_image: null
  twitter_title: null
  updated_at: string
  url: string
  visibility: 'public'
}

export default defineEventHandler(async (event) => {
  const headers = event.node.req.headers
  const language = headers.language
  const result = await ghostApi.tags.browse({
    page: 1,
    limit: 200,
    filter: 'visibility:public',
  })
  return (result.tags as TagItem[])
    .filter(item => !langTags.includes(item.name))
    .filter(item => item.description?.includes(`{${language}}`))
    .map((item) => {
      if (item.slug.startsWith(`${language}-`)) {
        item.slug = item.slug.replace(`${language}-`, '')
      }
      return item
    })
})
