import type { PluginOption } from 'vite'
import type { ISO639Type } from '@roxy/puppeteer-google-translate'
import { GoogleTranslator } from '@roxy/puppeteer-google-translate'
import bodyParser from 'body-parser'
import { exec } from 'node:child_process'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import serveStatic from 'serve-static'
import { genLangFiles, scanFilesAndReplaceKey } from './utils/extract-i18n-keys'
import { runGitCommands } from './utils/run-git-commands'

interface OptionsType {
  /** 语言文件目录 */
  targetDir: string
  /** 语言文件名 */
  langFileNames: string[]
  /** 源语言 */
  sourceLang: string
  /** 是否立即生成语言文件 */
  immediate?: boolean
}

interface TranslateRequestBody {
  text: string
  from?: string
  to: ISO639Type
}

interface SaveTranslateRequestBody {
  fileName: string
  key: string
  value: string
}

const baseUrl = '/__language-localization__'

let googleTranslator: GoogleTranslator

export default (options: OptionsType): PluginOption => {
  const { targetDir, langFileNames, sourceLang = 'zh-CN', immediate = false } = options

  immediate && genLangFiles(langFileNames, targetDir, sourceLang)

  return {
    name: 'roxy:language-localization',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(bodyParser.urlencoded({ extended: false }))
      // 使用 body-parser 中间件解析 JSON 数据
      server.middlewares.use(bodyParser.json())

      server.middlewares.use(`${baseUrl}/api`, async (req, res, next) => {
        const url = req.url

        // 获取源语言
        if (url === '/getSourceLang') {
          res.end(sourceLang)
        }
        // 获取语言列表
        else if (url === '/getLangs') {
          const files = await readdir(targetDir, { withFileTypes: true })
          const promiseArr = files.map(async (file) => {
            if (file.isFile() && file.name.endsWith('.json')) {
              const data = await readFile(join(targetDir, file.name), 'utf-8')
              return { fileName: file.name.replace('.json', ''), body: JSON.parse(data) }
            }
          })
          const result = await Promise.all(promiseArr)
          // console.log('result', result)
          res.end(JSON.stringify(result))
        }
        // 翻译文本
        else if (url === '/translate') {
          const { text, from = 'auto', to } = getRequestBody<TranslateRequestBody>(req)
          googleTranslator ||= new GoogleTranslator()

          // googleTranslator.translateText('A bird in hand is worth two in the bush.', 'auto', 'zh-CN')
          try {
            const result = await googleTranslator.translateText(text, from, to)
            res.end(result)
          }
          catch (error) {
            res.end(getErrorMessage(error))
          }
        }
        else if (url === '/saveTranslate') {
          const { fileName, key, value } = getRequestBody<SaveTranslateRequestBody>(req)
          const filePath = join(targetDir, `${fileName}.json`)
          try {
            const data = await readFile(filePath, 'utf-8')
            const jsonData = JSON.parse(data)
            jsonData[key] = value
            // 如果更新的是源语言文件，需要更新其他文件中的对应键
            if (fileName === sourceLang) {
              jsonData[value] = value
              delete jsonData[key]
              // 更新使用到该键的文件
              await scanFilesAndReplaceKey(key, value)
              // 更新其他语言文件
              const files = await readdir(targetDir, { withFileTypes: true })
              const promiseArr = files.map(async (file) => {
                if (file.isFile() && file.name.endsWith('.json')) {
                  const data = await readFile(join(targetDir, file.name), 'utf-8')
                  const json = JSON.parse(data)
                  json[value] = json[key]
                  delete json[key]
                  await writeFile(join(targetDir, file.name), JSON.stringify(json, replacer, 2))
                }
              })
              await Promise.all(promiseArr)
            }
            await writeFile(filePath, JSON.stringify(jsonData, replacer, 2))
            res.end('ok')
          }
          catch (error) {
            res.end(getErrorMessage(error))
          }
        }
        else if (url === '/commit') {
          console.log('commit', process.cwd())
          try {
            const result = await runGitCommands()
            res.end(JSON.stringify({
              code: 0,
              message: result,
            }))
          }
          catch (error) {
            res.end(JSON.stringify({
              code: 1,
              message: getErrorMessage(error),
            }))
          }
        }
        else if (url === '/pull-code') {
          console.log('pull code', process.cwd())
          exec('git pull origin main', (error, stdout, _stderr) => {
            if (error) {
              res.end(JSON.stringify({
                code: 1,
                message: error.message,
              }))
            }
            else {
              res.end(JSON.stringify({
                code: 0,
                message: stdout,
              }))
            }
          })
        }
        else {
          next()
        }
      })
      // 使用 serve-static 中间件提供静态资源服务
      server.middlewares.use(baseUrl, serveStatic(join(import.meta.dirname, '../page'), { index: ['index.html'] }))
    },
  }
}

function getRequestBody<T>(req: object): T {
  return (req as { body: T }).body
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function replacer(_key: string, value: unknown): unknown {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const record = value as Record<string, unknown>
    // 对对象的键进行排序
    return Object.keys(record).sort().reduce<Record<string, unknown>>((sorted, k) => {
      sorted[k] = record[k]
      return sorted
    }, {})
  }
  return value
}
