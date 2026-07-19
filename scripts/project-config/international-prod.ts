import type { ProjectConfig } from './types'
import { notifyIndexNow } from '../notify-indexnow'

export default {
  id: 'roxy_home_international',
  name: 'roxy_home',
  displayName: '国际站生产',
  siteUrl: 'https://roxybrowser.com',
  env: 'prod',
  isProd: true,
  buildScript: 'build',
  envFile: '.env.production',
  remotePath: '/root',
  // 方案 B：persist 在 /root；上 Nginx 前须确认 worker 能读 /root（非 root _worker 可能 403，可改 /var/www）
  nuxtPersistPath: '/root/roxy_home_nuxt',
  ecosystem: {
    env: {
      PORT: 3000,
    },
  },
  jmsLabel: '8.217.98.238',
  jmsAssetIdEnv: 'JMS_ASSET_ID_8_217_98_238',
  afterDeploy: async () => {
    await new Promise(resolve => setTimeout(resolve, 5000))
    await notifyIndexNow()
  },
} satisfies ProjectConfig
