/**
 * Ghost Admin API 独立调试脚本（逻辑与 server/utils/api.ts 一致）
 *
 * 使用方式：
 *   export GHOST_URL="https://gatetest.roxybrowser.co/__ghost__"
 *   export GHOST_KEY="id:secret"   # Ghost Admin API Key (Settings → Integrations)
 *   pnpx tsx scripts/ghost-api-debug.ts
 *
 * 或在项目根目录建 .env.debug（不要提交），内容：
 *   GHOST_URL=https://gatetest.roxybrowser.co/__ghost__
 *   GHOST_KEY=your_key_here
 * 然后：pnpx dotenv -e .env.debug -- pnpx tsx scripts/ghost-api-debug.ts
 */

import axios from 'axios'
import jwt from 'jsonwebtoken'

const ghostUrl = 'https://roxybrowser.com/__ghost__'
const key = '689d6676100c5d000140d569:3d193547261de4192f55ff1884dac8e08cddb39775dbd5665ec7475c6bdc45af'

if (!ghostUrl || !key) {
  console.error('请设置环境变量 GHOST_URL 和 GHOST_KEY')
  console.error('示例: export GHOST_URL="https://xxx/__ghost__" GHOST_KEY="id:secret"')
  process.exit(1)
}

const [id, secret] = key.split(':')
if (!id || !secret) {
  console.error('GHOST_KEY 格式应为 "id:secret"')
  process.exit(1)
}

const instance = axios.create({
  baseURL: `${ghostUrl}/ghost/api/admin`,
})

instance.interceptors.request.use((config) => {
  const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
    keyid: id,
    algorithm: 'HS256',
    expiresIn: '5m',
    audience: `/admin/`,
  })
  config.headers.Authorization = `Ghost ${token}`
  return config
})

instance.interceptors.response.use(
  response => response,
  (error) => {
    console.error(error?.response?.data ?? error.message)
    return Promise.reject(error)
  },
)

export const langTags = ['en', 'zh', 'ru']

export const ghostApi = {
  posts: {
    browse: async (payload: Record<string, unknown>) => {
      const result = await instance.get('/posts', { params: payload })
      return result.data
    },
    read: async (slug: string, params?: Record<string, unknown>) => {
      const result = await instance.get(`/posts/slug/${slug}`, { params })
      return result.data
    },
  },
  tags: {
    browse: async (payload: Record<string, unknown>) => {
      const result = await instance.get('/tags', { params: payload })
      return result.data
    },
  },
}

// ——— 下面可随意改，用于调试点东西 ———
async function main() {
  console.log('Ghost API 调试脚本\nbaseURL:', instance.defaults.baseURL)

  const results = await ghostApi.posts.read('best-unblocked-browser-for-any-site')

  console.log(results)

  // console.log('\n最近 5 篇已发布文章:')
  // console.log(JSON.stringify(posts, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
