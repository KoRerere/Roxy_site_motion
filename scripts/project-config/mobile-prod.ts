import type { ProjectConfig } from './types'

export default {
  id: 'roxy_home_mobile',
  name: 'roxy_home_mobile',
  displayName: '移动端生产',
  siteUrl: 'https://roxybrowser.com',
  env: 'prod',
  isProd: true,
  buildScript: 'build',
  remotePath: '/var/www',
  // 方案 B：正式 Nginx Bootstrap 后再发版
  nuxtPersistPath: '/var/www/roxy_home_mobile_nuxt',
  ecosystem: {
    env: {
      PORT: 3006,
    },
  },
  jmsLabel: '8.217.98.238',
  jmsAssetIdEnv: 'JMS_ASSET_ID_8_217_98_238',
} satisfies ProjectConfig
