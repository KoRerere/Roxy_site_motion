declare module '#app' {
  interface NuxtApp {
    $postsUrls: string[]
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('postsUrls', [])

  if (import.meta.server)
    return

  $fetch('/api/__sitemap__/blog')
    .then((sitemapData: any) => {
      nuxtApp.provide('postsUrls', sitemapData.map((item: any) => item.loc))
    })
    .catch((error) => {
      console.error('Failed to fetch sitemap data:', error)
    })
})
