import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

export async function notifyIndexNow(): Promise<void> {
  const json = readFileSync(path.resolve(process.cwd(), './indexnow.json'), 'utf-8')
  const key = json && JSON.parse(json).key
  console.log('indexnow: ', key)
  const hasKeyFile = key && existsSync(path.resolve(process.cwd(), `./public/${key}.txt`))

  if (!hasKeyFile)
    return

  try {
    const response = await fetch(`https://api.indexnow.org/indexnow?key=${key}&url=https://roxybrowser.com&keyLocation=https://roxybrowser.com/${key}.txt`)
    if (response.ok && response.status === 200)
      console.log('\x1B[32m%s\x1B[0m', '已通知 indexnow')
    else
      console.log('\x1B[33m%s\x1B[0m', `通知indexnow失败, ${response}`)
  }
  catch (error) {
    console.log('\x1B[33m%s\x1B[0m', `通知indexnow失败: ${error}`)
  }
}
