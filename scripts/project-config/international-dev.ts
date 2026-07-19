import type { ProjectConfig } from './types'

export default {
  id: 'roxy_home_dev',
  name: 'roxy_home_dev',
  displayName: '国际站测试',
  siteUrl: 'https://gatetest.roxybrowser.co',
  env: 'test',
  isProd: false,
  buildScript: 'build:dev',
  envFile: '.env.development',
  remotePath: '/var/www',
  // 方案 B：gatetest PC 端 persist（与 roxy_home_m_dev_nuxt 双路径 fallback）
  nuxtPersistPath: '/var/www/roxy_home_dev_nuxt',
  // gatetest Nginx PC 端 upstream 为 3000
  ecosystem: {
    env: {
      PORT: 3000,
    },
  },
  jmsLabel: '8.218.38.36',
  jmsAssetIdEnv: 'JMS_ASSET_ID_8_218_38_36',
} satisfies ProjectConfig
