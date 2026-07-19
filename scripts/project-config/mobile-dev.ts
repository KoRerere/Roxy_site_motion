import type { ProjectConfig } from './types'

export default {
  id: 'roxy_home_m_dev',
  name: 'roxy_home_m_dev',
  displayName: '移动端测试',
  siteUrl: 'https://gatetest.roxybrowser.co',
  env: 'test',
  isProd: false,
  buildScript: 'build:dev',
  remotePath: '/var/www',
  // 方案 B：gatetest 移动端 persist
  nuxtPersistPath: '/var/www/roxy_home_m_dev_nuxt',
  ecosystem: {
    env: {
      PORT: 3006,
    },
  },
  jmsLabel: '8.218.38.36',
  jmsAssetIdEnv: 'JMS_ASSET_ID_8_218_38_36',
} satisfies ProjectConfig
