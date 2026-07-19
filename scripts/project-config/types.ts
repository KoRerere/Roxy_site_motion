export type ProjectEnv = 'test' | 'prod'

export interface DeployOptions {
  /** 部署包 / zip / BUILD_INFO 标识（如 roxy_home_china） */
  name: string
  /**
   * 远程软链与 PM2 cwd 目录名（如国内正式线上为 roxy_home，与 name 可不同）。
   * 默认等于 name。
   */
  remoteLinkName?: string
  /** PM2 进程名；默认等于 remoteLinkName */
  pm2Name?: string
  /** __deploy_* / __rollback 目录前缀；默认等于 remoteLinkName */
  releaseName?: string
  displayName: string
  isProd: boolean
  /** 传入 getEcosystemConfigs 的合并项（如 script 覆盖、env 等） */
  ecosystem?: Recordable
  /** 解析该文件并与 ecosystem.env 合并后写入 PM2 env */
  envFile?: string
  /** JumpServer 资产标识（日志用，通常为 IP） */
  jmsLabel: string
  /** 环境变量名，值为 JumpServer 资产 UUID */
  jmsAssetIdEnv: string
  /** 远程根目录；release 解压为 ${remotePath}/${releaseName}__deploy_* */
  remotePath?: string
  /**
   * 方案 B：/_nuxt 持久化根目录（资源在 ${nuxtPersistPath}/_nuxt/，清单在 ${nuxtPersistPath}/manifests/）。
   * Nginx 应设 root 为此路径（非 _nuxt 子目录）。未配置则跳过 rsync。
   */
  nuxtPersistPath?: string
  /** 远程 zip 文件名，默认 `${name}.zip` */
  remoteZipFilename?: string
  /** 解压成功后终端提示文案 */
  successMessage?: string
  /** 部署流程结束后执行（例如 IndexNow 通知） */
  afterDeploy?: () => void | Promise<void>
}

export interface ProjectConfig extends DeployOptions {
  id: string
  env: ProjectEnv
  buildScript: string
  siteUrl?: string
}
