
export default defineNuxtPlugin((nuxtApp) => {
  // 自动携带cookie
  const api = $fetch.create({
    // 不可在此处统一加语言，因为在服务端渲染时期，lang.value 值无法被真正的确定
    // headers: {
    //   language: lang.value
    // },
    // async onResponse({ response }) {
    //   console.log('response', response)
    //   if (response.status === 301 || response.status === 302) {
    //     const location = response.headers.get('location')
    //     console.log('location 1', response.headers.get('Location'))
    //     console.log('location 2', location)
    //     if (!location) return null

    //     if (import.meta.server) {
    //       console.log('server navigateTo', location)
    //       // await navigateTo(location)
    //       // await nuxtApp.runWithContext(() => navigateTo(location))
    //     } else if (import.meta.client) {
    //       console.log('client navigateTo', location)
    //       // window.location.href = location
    //       router.push(location)
    //     }
    //   }
    // }
  })

  const ghost = {
    posts: {
      browse: async (params?: any, headers?: any) => {
        return await api("/api/posts", {
          method: "GET",
          params,
          headers,
        });
      },
      read: async (slug: string, headers?: any) => {
        return await api(`/api/posts/slug/${slug}`, { method: "GET", headers });
      },
    },
    tags: {
      browse: async (params?: any, headers?: any) => {
        return await api("/api/tags", { method: "GET", params, headers });
      },
    },
    search: async (params?: any, headers?: any) => {
      return await api("/api/search", { method: "GET", params, headers });
    },
  };

  return {
    provide: {
      ghost: ghost
    }
  }
})
