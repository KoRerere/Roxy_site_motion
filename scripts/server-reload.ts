import { Client } from 'ssh2'

/** 服务器配置 */
export interface ServerConfig {
  host: string
  port?: number
  username: string
  password: string
  pm2Name?: string
}

/** 服务器配置映射 */
export const SERVER_CONFIGS: Record<string, ServerConfig> = {
  /** 测试环境 */

  /** 开发部署环境（deploy-dev 部署目标） */
  test: {
    host: '113.10.160.72',
    username: 'root',
    password: '7PjbTOXM8HKRW9',
    pm2Name: 'roxy_home',
  },
  prod: {
    host: '8.217.98.238',
    port: 2211,
    username: 'root',
    password: '+Jb5M~XLbbmqj2uLTZcDx=r6XuC6ZDU5',
    pm2Name: 'roxy_home',
  },
}

/**
 * 通过 SSH 连接服务器并执行 pm2 restart
 */
export function restartServer(config: ServerConfig): Promise<void> {
  return new Promise((resolve, reject) => {
    const conn = new Client()
    const pm2Name = config.pm2Name ?? 'roxy_home'

    conn.on('ready', () => {
      const pm2Cmd = `export HOME=/root NVM_DIR=/root/.nvm; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; pm2 restart ${pm2Name}`
      conn.exec(pm2Cmd, (err, stream) => {
        if (err) {
          conn.end()
          reject(err)
          return
        }
        stream
          .on('close', (code) => {
            console.log(code === 0 ? '\x1B[32m%s\x1B[0m' : '\x1B[33m%s\x1B[0m', code === 0 ? '服务重启完成！' : `退出码: ${code}`)
            conn.end()
            resolve()
          })
          .on('data', data => process.stdout.write(data.toString()))
        stream.stderr.on('data', data => process.stderr.write(data.toString()))
      })
    })
      .on('error', reject)
      .connect({
        host: config.host,
        port: config.port ?? 22,
        username: config.username,
        password: config.password,
      })
  })
}

function main() {
  const args = process.argv.slice(2)
  const envArg = args.find(a => a.startsWith('--env='))
  const env = (envArg ? envArg.split('=')[1] : 'test') ?? 'test'

  const config = SERVER_CONFIGS[env]
  if (!config) {
    console.error(`\x1B[31m未知环境: ${env}，可选: ${Object.keys(SERVER_CONFIGS).join(', ')}\x1B[0m`)
    process.exit(1)
  }

  console.log(`\x1B[34m正在重启 ${env} 环境 (${config.host})...\x1B[0m`)
  restartServer(config).catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

// 直接运行此脚本时执行（pnpm server-reload 或 tsx server-reload.ts）
if (process.argv[1]?.includes('server-reload')) {
  main()
}
