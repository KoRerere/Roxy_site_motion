// Create a token without the client
import jwt from 'jsonwebtoken';
import axios from 'axios';

const config = useRuntimeConfig()

// Admin API key goes here
const key = config.ghostKey as string;
// const key = '67e50e55fb582b0001fae020:ed4ac49d5b650ce64000de93345573e3540a06543a125c4bcf0a1695c4af28f8'

// Split the key into ID and SECRET
const [id, secret] = key.split(':');

// Create the token (including decoding secret)
const instance = axios.create({
  baseURL: `${config.ghostUrl}/ghost/api/admin`
})

instance.interceptors.request.use(config => {
  const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
    keyid: id,
    algorithm: 'HS256',
    expiresIn: '5m',
    audience: `/admin/`
  });

  config.headers.Authorization = `Ghost ${token}`

  // console.log({ query: config.params, url: config.url })
  
  return config
})

instance.interceptors.response.use(response => {
  return response
}, error => {
  console.error(error)
  return Promise.reject(error)
})

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
