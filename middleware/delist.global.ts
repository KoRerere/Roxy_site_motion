import { deprioritizedPosts } from '@/data/deprioritizedPosts'

export default defineNuxtRouteMiddleware((to, from) => {
  const slug = to.params.slug
  if (slug && deprioritizedPosts.includes(slug as string)) {
    return createError({ statusCode: 410, statusMessage: 'Content Deleted' })
  }
})
