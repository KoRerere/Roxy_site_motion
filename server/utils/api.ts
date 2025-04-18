// Create a token without the client
import jwt from 'jsonwebtoken';
import axios from 'axios';

// Admin API key goes here
const key = process.env.NUXT_GHOST_API_KEY as string;
// const key = '67e50e55fb582b0001fae020:ed4ac49d5b650ce64000de93345573e3540a06543a125c4bcf0a1695c4af28f8'

// Split the key into ID and SECRET
const [id, secret] = key.split(':');

// Create the token (including decoding secret)
const instance = axios.create({
  baseURL: `${process.env.NUXT_BLOG_SERVER_URL}/ghost/api/admin`
})

instance.interceptors.request.use(config => {
  const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
    keyid: id,
    algorithm: 'HS256',
    expiresIn: '5m',
    audience: `/admin/`
  });

  config.headers.Authorization = `Ghost ${token}`

  // console.log({ query: config.params, url: config.url, headers: config.headers })
  
  return config
})

instance.interceptors.response.use(response => {
  // console.log(response.data)
  return response
}, error => {
  console.error(error)
  return Promise.reject(error)
})

// Make an authenticated request to create a post
// const url = `${process.env.BLOG_SERVER_URL}/ghost/api/admin`;
// const headers = { Authorization: `Ghost ${token}` };

export const langTags = ['en', 'zh', 'ru']

export const ghostApi = {
  posts: {
    browse: async (payload: any) => {
      const result = await instance.get(`/posts`, { 
        params: payload
      })
      return result.data
    },
    read: async (slug: string) => {
      const result = await instance.get(`/posts/slug/${slug}`)
      return result.data
    }
  },
  tags: {
    browse: async (payload: any) => {
      const result = await instance.get(`/tags`, { 
        params: payload, 
      })
      return result.data
    }
  }
}
