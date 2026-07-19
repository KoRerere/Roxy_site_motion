import fs, { existsSync } from 'node:fs'
import path from 'node:path'

/** 解析 .env 文件为键值对（值中可含 =） */
export function parseEnvFile(filePath: string) {
  const envContent = fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8')
  const envVariables: Recordable = {}

  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#'))
      return

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex <= 0)
      return

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim()
    if (key)
      envVariables[key] = value
  })

  return envVariables
}

/** 生成 PM2 ecosystem 配置，config.name 等字段会覆盖默认值 */
export function getEcosystemConfigs(config: Recordable) {
  return {
    apps: [
      {
        // PM2 应用名由 config.name 传入（deploy-util buildEcosystemPayload 保证必有）
        script: './server/index.mjs',
        // cwd 由 deploy-util 写入软链绝对路径，reload 后仍指向同一入口、解析到新 release
        error_file: './logs/error.log',
        out_file: './logs/out.log',
        log_file: './logs/log.log',
        max_size: '10M',
        keep_files: 5,
        log_date_format: 'YYYY-MM-DD HH:mm:ss',
        node_args: '--max-old-space-size=4096',
        max_memory_restart: '500M',
        ...config,
      },
    ],
  }
}
