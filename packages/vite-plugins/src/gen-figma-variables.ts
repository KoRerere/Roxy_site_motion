import type { PluginOption, ResolvedConfig } from 'vite'
import { access, mkdir, writeFile } from 'node:fs/promises'
import bodyParser from 'body-parser'

interface OptionsType {
  targetDir: string
}

interface FigmaVariableFile {
  fileName: string
  body: Record<string, unknown>
}

export function genFigmaVariables(options: OptionsType): PluginOption {
  const { targetDir } = options
  return {
    name: 'roxy:gen-figma-variables',
    configureServer(server) {
      server.middlewares.use(bodyParser.urlencoded({ extended: false }))
      // 使用 body-parser 中间件解析 JSON 数据
      server.middlewares.use(bodyParser.json())

      // 设置 CORS 头
      server.middlewares.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        // 如果是预检请求，直接返回 200
        if (req.method === 'OPTIONS') {
          res.writeHead(200)
          res.end()
          return
        }
        next()
      })

      server.middlewares.use('/__gen-figma-variables', async (req, res, next) => {
        if (req.method?.toLowerCase() === 'post') {
          const requestBody = (req as typeof req & { body?: unknown }).body
          if (Array.isArray(requestBody)) {
            // 生成 CSS 变量文件
            await genVariables(requestBody as FigmaVariableFile[], targetDir)
          }
          res.end(JSON.stringify(requestBody))
        }
        else {
          next() // 非 POST 请求直接交给其他中间件处理
        }
      })
    },
  }
}

async function genVariables(files: FigmaVariableFile[], targetDir: string) {
  try {
    await access(targetDir)
  }
  catch (error) {
    await mkdir(targetDir, { recursive: true })
  }
  files = files.filter(n => Object.keys(n.body).length)
  const genPromises = files.map(async (item) => {
    // 将斜杆替换为双下划线
    item.fileName = item.fileName.replaceAll('/', '__').replaceAll('.', '_').replaceAll(' ', '')
    if (!item.fileName.startsWith('_')) {
      item.fileName = `_${item.fileName}`
    }
    const { fileName, body } = item
    if (!Object.keys(body).length) {
      return
    }
    await writeFile(`${targetDir}/${fileName}.json`, JSON.stringify(body, null, 2))
  })
  await Promise.all(genPromises)
  console.log('生成 CSS 变量文件成功')
  /** 入口文件内容 */
  const indexContent = `/** 此文件自动生成，请勿修改！ */\n
${files.map(({ fileName }) => `import ${fileName} from './${fileName}.json';`).join('\n')}

export default {
${files.map(file => `  ...${file.fileName},`).join('\n')}
}
  `
  await writeFile(`${targetDir}/index.ts`, indexContent)
}
