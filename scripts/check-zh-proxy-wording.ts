import fs from 'node:fs'
import path from 'node:path'
/**
 * 中文文案校验：zh.json 中凡指「代理 IP」的「代理」必须写成「代理 IP」
 * 打包前执行，不通过则中止并输出需修改的 key 与完整文案；KEY_WHITELIST 中的 key 跳过校验
 */
import process from 'node:process'

const ZH_LOCALE_PATH = path.resolve(process.cwd(), 'i18n/locales/zh.json')

/**
 * Key 白名单：这里的 key 不参与「代理」→「代理 IP」校验，按需自行添加。
 * 例如认为某条文案里的「代理」无需改成「代理 IP」，把该条在 zh.json 里的 key 填到下面即可。
 */
const KEY_WHITELIST: string[] = [
  'RoxyBrowser 会为每个会话自动生成唯一的、与代理 IP 地址匹配的浏览器指纹，完美模拟真实用户。告别那些能被轻易识别的“代理模式”或 IP 和指纹不匹配问题。',
  '不同地区的社交内容展示不一样。RoxyBrowser 支持精准代理+设备指纹模拟，真实还原特定国家或地区的用户浏览体验，帮助你验证内容本地化是否到位，让 A/B 测试更贴近真实用户行为。',
  '灵活代理，精准定位',
  'invite.featureSocial3',
  'invite.featureEcommerce2',
  // 示例：'代理信息', '代理配置',
]

function isFollowedByIP(text: string, index: number): boolean {
  const after = text.slice(index + 2).replace(/^\s+/, '') // 去掉紧跟的空格/全角空格
  return after.startsWith('IP') || after.startsWith('ip')
}

const RED = '\u001B[31m'
const RESET = '\u001B[0m'

/** 仅将字符串中「未紧跟 IP」的「代理」用终端红色高亮，indices 为 findViolations 返回的违规起始下标 */
function highlightViolations(text: string, indices: number[]): string {
  const set = new Set(indices)
  let out = ''
  let i = 0
  while (i < text.length) {
    if (set.has(i) && text[i] === '代' && text[i + 1] === '理') {
      out += `${RED}代理${RESET}`
      i += 2
    }
    else {
      out += text[i]
      i += 1
    }
  }
  return out
}

function findViolations(text: string): number[] {
  const violations: number[] = []
  let i = 0
  while (i < text.length - 1) {
    if (text[i] === '代' && text[i + 1] === '理') {
      if (!isFollowedByIP(text, i))
        violations.push(i)
      i += 2
    }
    else {
      i += 1
    }
  }
  return violations
}

function main(): void {
  const content = fs.readFileSync(ZH_LOCALE_PATH, 'utf-8')
  const data = JSON.parse(content) as Record<string, string>

  const keyWhitelistSet = new Set(KEY_WHITELIST)
  const entries = Object.entries(data)
    .filter(([key, value]) => typeof value === 'string' && !keyWhitelistSet.has(key))
    .map(([key, value]) => ({ keyPath: key, value: value as string }))

  const results: { keyPath: string, value: string, violationIndices: number[] }[] = []

  for (const { keyPath, value } of entries) {
    const indices = findViolations(value)
    if (indices.length > 0)
      results.push({ keyPath, value, violationIndices: indices })
  }

  if (results.length === 0) {
    console.log('✓ zh.json 代理用词校验通过：未发现需改为「代理 IP」的「代理」。')
    process.exit(0)
    return
  }

  console.error('')
  console.error('✗ zh.json 代理用词校验未通过：以下文案中的「代理」应改为「代理 IP」（或加入 KEY_WHITELIST）。')
  console.error('')
  for (const { keyPath } of results) {
    const keyViolations = findViolations(keyPath)
    console.error(highlightViolations(keyPath, keyViolations))
    console.error('')
    console.error('')
    console.error('==================================================================================')
    console.error('')
    console.error('')
  }
  console.error(`共 ${results.length} 条需修改。`)
  console.error('')
  process.exit(1)
}

main()
