import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { constructURL, download } from 'google-fonts-helper'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Build Google Fonts CSS2 URL.
 * - Uses google-fonts-helper constructURL for families part
 * - Appends display/subset query params if provided
 */
function buildCss2Url(cfg: Record<string, any>): string {
  if (cfg.url && typeof cfg.url === 'string')
    return cfg.url

  const url = constructURL({
    families: cfg.families ?? {},
  })
  if (!url || typeof url !== 'string')
    throw new Error('Invalid font families config')

  const u = new URL(url)
  if (cfg.display)
    u.searchParams.set('display', cfg.display)

  if (Array.isArray(cfg.subsets) && cfg.subsets.length) {
    u.searchParams.set('subset', cfg.subsets.join(','))
  }

  return u.toString()
}

/**
 * 将配置标准化为 groups 数组，兼容旧格式（单组）和新格式（多组）
 */
function normalizeGroups(cfg: Record<string, any>): Array<Record<string, any>> {
  if (Array.isArray(cfg.groups) && cfg.groups.length > 0) {
    return cfg.groups
  }
  // 兼容旧格式：顶层 families + stylePath
  if (cfg.families && Object.keys(cfg.families).length > 0) {
    return [{
      id: 'default',
      stylePath: cfg.stylePath ?? 'fonts.css',
      display: cfg.display,
      subsets: cfg.subsets,
      families: cfg.families,
    }]
  }
  return []
}

async function downloadFontGroup(
  group: Record<string, any>,
  globalOpts: Record<string, any>,
) {
  const outputDir = path.resolve(process.cwd(), globalOpts.outputDir ?? 'public/fonts')
  const stylePath = group.stylePath ?? `fonts-${group.id ?? 'default'}.css`

  const url = buildCss2Url(group)
  console.log(`[${group.id ?? 'default'}] CSS2 URL:`)
  console.log(' ', url)
  console.log('')

  const downloader = download(url, {
    base64: Boolean(globalOpts.base64),
    overwriting: Boolean(globalOpts.overwriting),
    outputDir,
    stylePath,
    fontsDir: outputDir,
    fontsPath: '/fonts',
  })

  downloader.hook('download:start', () => {
    console.log(`[${group.id ?? 'default'}] Downloading fonts...`)
  })

  downloader.hook('download-font:done', (font: { outputText?: string }) => {
    console.log(`  ✓ ${font.outputText ?? ''}`)
  })

  downloader.hook('download:complete', () => {
    console.log(`[${group.id ?? 'default'}] Done.`)
  })

  await downloader.execute()
}

async function main() {
  const configPath
    = process.argv.find((a: string) => a.startsWith('--config='))?.split('=')[1]
      ?? 'fonts.download.json'

  const absConfigPath = path.isAbsolute(configPath)
    ? configPath
    : path.resolve(process.cwd(), configPath)

  const raw = await fs.readFile(absConfigPath, 'utf8')
  const cfg = JSON.parse(raw)

  const outputDir = path.resolve(process.cwd(), cfg.outputDir ?? 'public/fonts')
  await fs.mkdir(outputDir, { recursive: true })

  const groups = normalizeGroups(cfg)
  if (groups.length === 0) {
    console.error('No font groups configured. Add "groups" array or top-level "families" in config.')
    process.exit(1)
  }

  const globalOpts = {
    outputDir: cfg.outputDir ?? 'public/fonts',
    overwriting: cfg.overwriting ?? true,
    base64: cfg.base64 ?? false,
  }

  for (const group of groups) {
    await downloadFontGroup(
      { ...globalOpts, ...group, id: group.id ?? 'default' },
      globalOpts,
    )
  }

  console.log('')
  console.log('[google-fonts-helper] All groups completed.')
  console.log('Output:', outputDir)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
