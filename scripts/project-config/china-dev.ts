import type { ProjectConfig } from './types'

export default {
  id: 'roxy_home_china_dev',
  name: 'roxy_home_cn_dev',
  siteUrl: 'https://test.roxybrowser.cn',
  displayName: '国内站测试',
  env: 'test',
  isProd: false,
  buildScript: 'build:china-dev',
  remotePath: '/var/www',
  // 方案 B：Nginx 已指向 test.roxybrowser.cn persist 目录
  nuxtPersistPath: '/var/www/roxy_home_cn_dev_nuxt',
  ecosystem: {
    env: {
      PORT: 3001,
    },
  },
  jmsLabel: '8.218.38.36',
  jmsAssetIdEnv: 'JMS_ASSET_ID_8_218_38_36',
  successMessage: '国内站测试部署完成！',
} satisfies ProjectConfig
