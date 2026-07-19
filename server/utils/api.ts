import axios from 'axios'
// Create a token without the client
import jwt from 'jsonwebtoken'

const config = useRuntimeConfig()

// Admin API key goes here
const key = config.ghostKey as string
// const key = '67e50e55fb582b0001fae020:ed4ac49d5b650ce64000de93345573e3540a06543a125c4bcf0a1695c4af28f8'

// Split the key into ID and SECRET
const [id, secret] = key.split(':')

// Create the token (including decoding secret)
const instance = axios.create({
  baseURL: `${config.ghostUrl}/ghost/api/admin`,
})

instance.interceptors.request.use((config) => {
  const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
    keyid: id,
    algorithm: 'HS256',
    expiresIn: '5m',
    audience: `/admin/`,
  })

  config.headers.Authorization = `Ghost ${token}`

  // console.log({ query: config.params, url: config.url })

  return config
})

instance.interceptors.response.use((response) => {
  return response
}, (error) => {
  const url = error.config?.baseURL && error.config?.url
    ? `${error.config.baseURL}${error.config.url}`
    : error.config?.url
  console.error('[ghost] request failed', {
    url,
    status: error.response?.status,
    data: error.response?.data,
  })
  return Promise.reject(error)
})

export const langTags = ['en', 'zh', 'ru']

/** Ghost 内部 tag #faq 在 NQL 中的 slug */
export const GHOST_FAQ_INTERNAL_TAG = 'hash-faq'
export const GHOST_EXCLUDE_FAQ_FILTER = `+tag:-${GHOST_FAQ_INTERNAL_TAG}`

export const ghostApi = {
  posts: {
    browse: async (payload: any) => {
      const result = await instance.get(`/posts`, {
        params: payload,
      })
      return result.data
    },
    read: async (slug: string, params?: any) => {
      const result = await instance.get(`/posts/slug/${slug}`, { params })
      return result.data
    },
  },
  tags: {
    browse: async (payload: any) => {
      const result = await instance.get(`/tags`, {
        params: payload,
      })
      return result.data
    },
  },
  authors: {
    browse: async (payload?: any) => {
      const result = await instance.get(`/authors`, {
        params: payload,
      })
      return result.data
    },
    read: async (slug: string, params?: any) => {
      // 与 posts.read 一致：不在路径上二次编码，避免与 Ghost 期望的 slug 不一致
      const result = await instance.get(`/authors/slug/${slug}`, {
        params,
      })
      return result.data
    },
  },
}
