#!/usr/bin/env node

import type { SensitiveWordWhiteListRule } from '../index'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import JSON5 from 'json5'
import {
  checkJsonFilesForSensitiveWords,
  formatSensitiveCheckReport,
} from '../index'

interface CliOptions {
  config: string
  output?: string
}

interface SensitiveCheckConfigItem {
  file: string
  whiteListKeys: string[]
}

interface SensitiveCheckConfig {
  files: string[]
  whiteListRules: SensitiveWordWhiteListRule[]
}

const COLORS = {
  reset: '\x1B[0m',
  red: '\x1B[31m',
  green: '\x1B[32m',
  cyan: '\x1B[36m',
} as const

function colorize(text: string, color: keyof typeof COLORS): string {
  return `${COLORS[color]}${text}${COLORS.reset}`
}

function printInfo(message: string): void {
  process.stdout.write(`${colorize(message, 'cyan')}\n`)
}

function printSuccess(message: string): void {
  process.stdout.write(`${colorize(message, 'green')}\n`)
}

function printError(message: string): void {
  console.error(colorize(message, 'red'))
}

function getUsageText(): string {
  return [
    '用法:',
    '  roxy-cn-sensitive-check --config=./cn-sensitive.json5',
    '  roxy-cn-sensitive-check --config=./cn-sensitive.json5 --output=./sensitive-report.txt',
    '',
    '配置文件示例(JSON5):',
    '  {',
    '    output: "./sensitive-report.txt",',
    '    input: [',
    '      {',
    '        file: "./i18n/locales/zh.json",',
    '        whiteListKeys: ["home.hero.title"]',
    '      }',
    '    ]',
    '  }',
  ].join('\n')
}

function parseCliArgs(argv: string[]): CliOptions {
  let config: string | undefined
  let output: string | undefined

  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      process.stdout.write(`${getUsageText()}\n`)
      process.exit(0)
    }

    if (arg.startsWith('--output=')) {
      output = arg.slice('--output='.length).trim()
      continue
    }
    if (arg.startsWith('--config=')) {
      config = arg.slice('--config='.length).trim()
      continue
    }

    if (!arg.startsWith('--') && !config) {
      config = arg.trim()
      continue
    }

    if (arg.startsWith('--')) {
      throw new Error(`不支持的参数: ${arg}`)
    }
  }

  if (!config) {
    throw new Error(
      [
        '缺少必需参数 --config。',
        getUsageText(),
      ].join('\n'),
    )
  }

  return {
    config: path.resolve(process.cwd(), config),
    output: output ? path.resolve(process.cwd(), output) : undefined,
  }
}

function ensureConfigItems(config: unknown): SensitiveCheckConfigItem[] {
  let input: unknown[] = []
  if (Array.isArray(config)) {
    input = config
  }
  else if (config && typeof config === 'object') {
    const record = config as Record<string, unknown>
    const rawInput = record.input
    if (Array.isArray(rawInput))
      input = rawInput
  }

  if (input.length === 0) {
    throw new Error('配置文件不能为空：请至少提供一个检测文件配置')
  }

  return input.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`配置项 #${index + 1} 格式错误：必须是对象`)
    }

    const record = item as Record<string, unknown>
    const file = typeof record.file === 'string' ? record.file.trim() : ''
    if (!file) {
      throw new Error(`配置项 #${index + 1} 缺少 file 字段`)
    }

    const rawWhiteList = record.whiteListKeys
    if (rawWhiteList !== undefined && !Array.isArray(rawWhiteList)) {
      throw new Error(`配置项 #${index + 1} 的 whiteListKeys 必须是字符串数组`)
    }

    const whiteListKeys = Array.isArray(rawWhiteList)
      ? rawWhiteList
          .filter((value): value is string => typeof value === 'string')
          .map(value => value.trim())
          .filter(Boolean)
      : []

    if (Array.isArray(rawWhiteList) && whiteListKeys.length !== rawWhiteList.length) {
      throw new Error(`配置项 #${index + 1} 的 whiteListKeys 只能包含字符串`)
    }

    return {
      file,
      whiteListKeys,
    }
  })
}

async function loadConfig(configPath: string): Promise<SensitiveCheckConfig> {
  let raw = ''
  try {
    raw = await readFile(configPath, 'utf-8')
  }
  catch {
    throw new Error(`无法读取配置文件: ${configPath}`)
  }

  let parsed: unknown
  try {
    parsed = JSON5.parse(raw) as unknown
  }
  catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`配置文件解析失败(${configPath}): ${message}`)
  }

  const items = ensureConfigItems(parsed)
  const whiteListRules: SensitiveWordWhiteListRule[] = items.map(item => ({
    file: item.file,
    whiteListKeys: item.whiteListKeys,
  }))

  return {
    files: items.map(item => path.resolve(process.cwd(), item.file)),
    whiteListRules,
  }
}

async function run() {
  try {
    const options = parseCliArgs(process.argv.slice(2))
    printInfo(`开始检查敏感词检查，配置文件: ${options.config}`)

    const config = await loadConfig(options.config)
    printInfo(`待检测文件数: ${config.files.length}`)

    const report = await checkJsonFilesForSensitiveWords(config.files, undefined, config.whiteListRules)
    const text = formatSensitiveCheckReport(report, { configPath: options.config })
    const output = options.output || path.resolve(process.cwd(), 'sensitive-report.txt')

    if (report.summary.length === 0) {
      printSuccess('结果：未命中敏感词')
    }
    else {
      await writeFile(output, text, 'utf-8')
      printSuccess(`检查完成，报告已写入: ${output}`)

      printError(`结果：命中 ${report.summary.length} 个敏感词，请检查上方报告，修改文案或者添加到白名单中`)
      process.exit(1)
    }
  }
  catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    printError(message)
    process.exitCode = 1
  }
}

run()
