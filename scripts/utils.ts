import fs from 'fs';
import path from 'path';

export function parseEnvFile(filePath: string) {
  const envContent = fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8');
  
  const envVariables: Recordable = {};
    console.log(envContent.toString())
  envContent.split('\n').forEach(line => {
    // 去除空行和注释
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value !== undefined) {
        envVariables[key.trim()] = value.trim();
      }
    }
  });
  
  return envVariables;
}

export const getEcosystemConfigs = (envFile: string) => {
  return {
    apps: [
      {
        name: 'roxy_home',
        script: './server/index.mjs',
        watch: ['./server', './public'],
        ignore_watch: ['./dist.zip', 'node_modules', 'logs'],
        error_file: './logs/error.log',         // 错误日志
        out_file: './logs/out.log',             // 标准输出日志
        log_file: './logs/log.log',             // 日志文件
        max_size: '10M',                        // 单个日志文件最大大小
        keep_files: 5,                          // 保留的日志文件数量
        log_date_format: 'YYYY-MM-DD HH:mm:ss', // 日志时间格式
      }
    ]
  }
}