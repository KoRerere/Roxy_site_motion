import type { ProjectConfig } from './types'

export default {
  id: 'roxy_home_china',
  name: 'roxy_home_china',
  // 线上 Nginx/PM2 使用 roxy_home；deploy 包名仍为 roxy_home_china
  remoteLinkName: 'roxy_home',
  pm2Name: 'roxy_home',
  releaseName: 'roxy_home',
  siteUrl: 'https://roxybrowser.cn',
  displayName: '国内站生产',
  env: 'prod',
  isProd: true,
  buildScript: 'build:china',
  envFile: '.env.production',
  remotePath: '/var/www',
  // 方案 B：正式 Nginx Bootstrap 后再发版；路径按软链名 roxy_home
  nuxtPersistPath: '/var/www/roxy_home_nuxt',
  // 正式机 Nitro 监听 3000（ss -tlnp 实测），deploy 后 curl 验收
  ecosystem: {
    env: {
      PORT: 3000,
    },
  },
  jmsLabel: '42.121.165.6',
  jmsAssetIdEnv: 'JMS_ASSET_ID_42_121_165_6',
  successMessage: '国内站部署完成！',
} satisfies ProjectConfig
