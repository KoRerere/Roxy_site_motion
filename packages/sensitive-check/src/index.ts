import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { builtinSensitiveWords } from './word-lists'

export interface FileSensitiveCheckResult {
  file: string
  matchedItems: SensitiveWordMatchedItem[]
  matchedWords: string[]
}

export interface SensitiveCheckReport {
  files: FileSensitiveCheckResult[]
  summary: string[]
}

export interface SensitiveWordMatchedItem {
  key: string
  value: string
  word: string
}

export interface SensitiveWordWhiteListRule {
  file: string
  whiteListKeys: string[]
}

export interface FormatSensitiveCheckReportOptions {
  configPath?: string
}

/**
 * 词汇误报豁免：
 * 例如「台独」会在「一台独立」中产生跨词误命中，这里按后缀做最小豁免。
 */
const WORD_SUFFIX_EXCLUSIONS: Record<string, string[]> = {
  台独: ['立'],
}

interface CollectedStringValue {
  value: string
  keyPath: string
}

function collectStringValues(input: unknown, collector: CollectedStringValue[], currentPath = ''): void {
  if (typeof input === 'string') {
    collector.push({
      value: input,
      keyPath: currentPath,
    })
    return
  }

  if (Array.isArray(input)) {
    input.forEach((item, index) => {
      const nextPath = currentPath ? `${currentPath}[${index}]` : `[${index}]`
      collectStringValues(item, collector, nextPath)
    })
    return
  }

  if (input && typeof input === 'object') {
    Object.entries(input).forEach(([key, value]) => {
      const nextPath = currentPath ? `${currentPath}.${key}` : key
      collectStringValues(value, collector, nextPath)
    })
  }
}

function normalizeRelativePath(filePath: string): string {
  return path.normalize(filePath).replace(/\\/g, '/')
}

function normalizeWhiteListKeys(keys: string[]): Set<string> {
  return new Set(
    keys
      .map(key => key.trim())
      .filter(Boolean),
  )
}

function shouldSkipByWhiteList(keyPath: string, whiteListKeys: Set<string>): boolean {
  if (whiteListKeys.size === 0)
    return false

  if (whiteListKeys.has(keyPath))
    return true

  const segments = keyPath.split('.')
  const leafKey = segments.at(-1) ?? ''
  return Boolean(leafKey && whiteListKeys.has(leafKey))
}

export function matchSensitiveWords(text: string, words: string[] = builtinSensitiveWords): string[] {
  if (!text) {
    return []
  }

  const matched = new Set<string>()
  for (const word of words) {
    if (!word)
      continue

    let startIndex = text.indexOf(word)
    while (startIndex !== -1) {
      const suffix = text[startIndex + word.length] ?? ''
      const excludedSuffixes = WORD_SUFFIX_EXCLUSIONS[word] ?? []
      const shouldSkip = excludedSuffixes.includes(suffix)

      if (!shouldSkip) {
        matched.add(word)
        break
      }

      startIndex = text.indexOf(word, startIndex + 1)
    }
  }
  return [...matched]
}

export async function checkJsonFilesForSensitiveWords(
  filePaths: string[],
  words: string[] = builtinSensitiveWords,
  whiteListRules: SensitiveWordWhiteListRule[] = [],
): Promise<SensitiveCheckReport> {
  const normalizedWords = [...new Set(words.filter(Boolean))]
  const whiteListMap = new Map<string, Set<string>>(
    whiteListRules
      .filter(rule => rule.file.trim())
      .map(rule => [normalizeRelativePath(path.resolve(process.cwd(), rule.file)), normalizeWhiteListKeys(rule.whiteListKeys)]),
  )
  const fileResults: FileSensitiveCheckResult[] = []
  const summarySet = new Set<string>()

  for (const filePath of filePaths) {
    const ext = path.extname(filePath).toLowerCase()
    if (ext !== '.json') {
      throw new Error(`仅支持 JSON 文件: ${filePath}`)
    }

    const raw = await readFile(filePath, 'utf-8')
    const json = JSON.parse(raw) as unknown
    const values: CollectedStringValue[] = []
    collectStringValues(json, values)
    const whiteListKeys = whiteListMap.get(normalizeRelativePath(filePath)) ?? new Set<string>()

    const fileMatchedSet = new Set<string>()
    const matchedItems: SensitiveWordMatchedItem[] = []
    for (const item of values) {
      if (shouldSkipByWhiteList(item.keyPath, whiteListKeys))
        continue

      const matched = matchSensitiveWords(item.value, normalizedWords)
      matched.forEach((word) => {
        fileMatchedSet.add(word)
        matchedItems.push({
          word,
          key: item.keyPath,
          value: item.value,
        })
      })
    }

    const matchedWords = [...fileMatchedSet].sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
    matchedWords.forEach(word => summarySet.add(word))

    fileResults.push({
      file: filePath,
      matchedItems,
      matchedWords,
    })
  }

  return {
    files: fileResults,
    summary: [...summarySet].sort((a, b) => a.localeCompare(b, 'zh-Hans-CN')),
  }
}

export function formatSensitiveCheckReport(
  report: SensitiveCheckReport,
  options?: FormatSensitiveCheckReportOptions,
): string {
  const lines: string[] = []

  lines.push('=== 敏感词检查结果 ===')
  lines.push('')

  if (options?.configPath) {
    lines.push('配置文件路径（编辑白名单请打开此文件）：')
    lines.push(options.configPath)
    lines.push('白名单位置：该 JSON5 根对象的 `input` 数组中，找到 `file` 与下方「被检文件」路径对应的一项，将命中条目的 `key` 字符串追加到该项的 `whiteListKeys` 数组。')
    lines.push('')
  }

  lines.push('修改说明：修改优化以下涉及敏感词的文案,仅修改value即可,如果是合理的,将该文案key添加到白名单中.')
  lines.push('')

  for (const fileResult of report.files) {
    lines.push(`被检文件: ${fileResult.file}`)
    if (fileResult.matchedItems.length === 0) {
      lines.push('命中明细: （未命中）')
    }
    else {
      lines.push('命中明细（每行一个 item）:')
      fileResult.matchedItems.forEach((matchedItem) => {
        lines.push(JSON.stringify(matchedItem))
      })
      lines.push('')
      lines.push('敏感词去重:')
      fileResult.matchedWords.forEach(word => lines.push(`- ${word}`))
    }
    lines.push('')
  }

  lines.push('=== 敏感词汇总（一行一个） ===')
  if (report.summary.length === 0) {
    lines.push('（未命中）')
  }
  else {
    report.summary.forEach(word => lines.push(word))
  }

  return `${lines.join('\n')}\n`
}
