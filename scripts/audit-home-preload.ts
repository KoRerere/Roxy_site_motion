/**
 * 阶段 0：首页 modulepreload 来源审计（只读，不改 UI）
 *
 * 用法：
 *   pnpm build:china && pnpm preview:china
 *   pnpm audit:home-preload
 *
 * 可选：
 *   HOME_PRELOAD_URL=http://localhost:3001
 *   HOME_PRELOAD_HTML=./tmp/home.html   # 离线分析已保存的 HTML
 */
import fs from 'node:fs'
import process from 'node:process'
import { isChinaPreloadBatch1Excluded, isChinaPreloadBatch2Excluded, isChinaPreloadExcluded } from '../utils/china-preload-blacklist'

const baseUrl = process.env.HOME_PRELOAD_URL || 'http://localhost:3001'
const htmlFile = process.env.HOME_PRELOAD_HTML

interface PreloadItem {
  index: number
  href: string
  file: string
  category: string
  note: string
}

/** 按 chunk 文件名归类（用于评估阶段 1 黑名单） */
function categorize(file: string): { category: string, note: string } {
  const f = file.toLowerCase()

  if (/^entry-/.test(f))
    return { category: 'critical-entry', note: '应用 entry，通常应保留 preload' }

  if (/^(index|default|client|vue|nuxt|router)-/.test(f) || f.includes('nuxt-'))
    return { category: 'critical-runtime', note: '框架/runtime，通常应保留' }

  if (f.includes('live-chat') || f.includes('livechat') || f.includes('@livechat'))
    return { category: 'livechat', note: 'LiveChat 相关，阶段 1 候选排除' }

  if (f.includes('cobe') || f.includes('three-globe') || f.includes('threeglobe') || f.includes('three'))
    return { category: 'webgl-3d', note: '3D/WebGL（globe/cobe），阶段 1 候选排除' }

  if (f.includes('fingerprint') || f.includes('tech-item') || f.includes('tech-visual'))
    return { category: 'tech-section', note: 'Tech 区重组件，阶段 1 候选排除' }

  if (f.includes('certification'))
    return { category: 'certification', note: '认证区，阶段 1 候选排除' }

  if (f.includes('community') || f.includes('marquee'))
    return { category: 'community', note: '社区评价 Marquee，阶段 1 候选排除' }

  if (f.includes('interaction') || f.includes('api-flow'))
    return { category: 'interaction', note: 'Interaction 面板，阶段 1 候选排除' }

  if (f.includes('using') || f.includes('roxy-ip') || f.includes('roxyip'))
    return { category: 'using-roxyip', note: 'Using/RoxyIP 区，阶段 1 候选排除' }

  if (f.includes('aurora') || f.includes('risingstar') || f.includes('electricbg') || f.includes('electric-bg'))
    return { category: 'hero-decoration', note: '首屏装饰（多 ClientOnly/RxLazy），阶段 1 候选排除' }

  if (f.includes('realtime') || f.includes('roxy-globe'))
    return { category: 'hero-realtime', note: '实时数据/地球，阶段 1 候选排除' }

  if (f.includes('brand') || f.includes('logobrand'))
    return { category: 'hero-brand', note: '品牌滚动条，阶段 1 候选排除' }

  if (f.includes('youtube'))
    return { category: 'youtube', note: 'Youtube 区块，阶段 1 候选排除' }

  if (f.includes('blog') || f.includes('ghost') || f.includes('slug'))
    return { category: 'blog', note: '博客相关 chunk 不应在首页 preload，阶段 1 强候选排除' }

  if (f.includes('changelog') || f.includes('pricing') || f.includes('download') || f.includes('contact'))
    return { category: 'other-pages', note: '其他页面 chunk 泄漏到首页，阶段 1 强候选排除' }

  if (f.includes('animatepresence') || f.includes('use-scroll') || f.includes('use-motion') || f.includes('is-svg-element'))
    return { category: 'motion-v', note: 'motion-v 动效库，阶段 1 候选排除' }

  if (f.includes('faq'))
    return { category: 'home-faq', note: '首页 FAQ（SSR 可见），preload 可排除、hydration 仍会加载' }

  if (f.includes('by-home') || f.includes('by-panel') || f.includes('cta'))
    return { category: 'home-cta', note: '首页 CTA 按钮 chunk' }

  if (f.includes('container') || f.includes('rx-dialog') || f.includes('usecustomhead')
    || f.includes('usescripts') || f.includes('useroxyseo') || f.includes('config-')
    || f.includes('useauth') || f.includes('usetopup') || f.includes('useswitchlanguage')
    || f.includes('userxbreakpoints') || f.includes('userxwindowsize') || f.includes('hook-'))
    return { category: 'layout-header', note: 'Layout/Header 公共 chunk' }

  if (f.includes('rx-i18n') || f.includes('rx-spinner') || f.includes('usebacktop')
    || f.includes('usetelegram') || f.includes('interval-'))
    return { category: 'shared-composable', note: '公共 composable/组件' }

  if (f.includes('roxy-agent') || f.includes('poster-'))
    return { category: 'hero-agent', note: 'Agent/海报资源 chunk，国内站可评估排除 en poster' }

  if (/^en-/.test(f) || /^ru-/.test(f))
    return { category: 'i18n-locale', note: '非当前语言包，国内站阶段 1 强候选排除' }

  if (/^zh-/.test(f))
    return { category: 'i18n-locale-zh', note: '中文语言包，视策略保留或延迟' }

  if (f.includes('private-browsing') || f.includes('page-functions') || f.includes('page-whoer'))
    return { category: 'feature-pages', note: '功能页 chunk 泄漏，阶段 1 候选排除' }

  if (f.includes('zh-') || f.includes('en-') || f.includes('ru-') || f.includes('locales'))
    return { category: 'i18n-locale', note: '语言包 chunk，视是否首屏需要决定' }

  if (f.includes('layout') || f.includes('the-header') || f.includes('the-footer') || f.includes('default'))
    return { category: 'layout-shell', note: '布局壳层，一般保留' }

  if (f.includes('index-') || f.includes('pages-index') || f === 'index.js')
    return { category: 'home-page', note: '首页 page chunk，通常保留' }

  return { category: 'uncategorized', note: '需人工确认' }
}

function extractPreloads(html: string): PreloadItem[] {
  const re = /<link[^>]+rel=["']modulepreload["'][^>]*>/gi
  const hrefRe = /href=["']([^"']+)["']/i
  const items: PreloadItem[] = []
  let match: RegExpExecArray | null
  let index = 0

  while ((match = re.exec(html)) !== null) {
    index++
    const tag = match[0]
    const hrefMatch = tag.match(hrefRe)
    const href = hrefMatch?.[1] ?? '(unknown)'
    const file = href.split('/').pop()?.split('?')[0] ?? href
    const { category, note } = categorize(file)
    items.push({ index, href, file, category, note })
  }

  return items
}

function groupByCategory(items: PreloadItem[]) {
  const map = new Map<string, PreloadItem[]>()
  for (const item of items) {
    const list = map.get(item.category) ?? []
    list.push(item)
    map.set(item.category, list)
  }
  return [...map.entries()].sort((a, b) => b[1].length - a[1].length)
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'accept': 'text/html' },
  })
  if (!res.ok)
    throw new Error(`HTTP ${res.status} ${url}`)
  return res.text()
}

function printReport(items: PreloadItem[], source: string) {
  console.log('\n========================================')
  console.log('  首页 modulepreload 来源审计（阶段 0）')
  console.log('========================================')
  console.log(`数据源: ${source}`)
  console.log(`合计: ${items.length} 条\n`)

  console.log('--- 按类别汇总 ---')
  for (const [category, list] of groupByCategory(items)) {
    console.log(`  [${category}] ${list.length} 条`)
  }

  const keepCategories = new Set([
    'critical-entry',
    'critical-runtime',
    'layout-shell',
    'home-page',
    'layout-header',
    'home-cta',
    'home-faq',
    'i18n-locale-zh',
  ])
  const phase1Candidates = items.filter(i => !keepCategories.has(i.category))
  console.log(`\n阶段 1 候选排除（非 critical/layout/home）: ${phase1Candidates.length} 条`)
  console.log(`若全部排除后预估剩余: ${items.length - phase1Candidates.length} 条\n`)

  console.log('--- 完整清单（序号 | 类别 | 文件名 | 说明）---')
  for (const item of items) {
    console.log(`${String(item.index).padStart(3)} | ${item.category.padEnd(18)} | ${item.file}`)
    console.log(`      ${item.note}`)
    console.log(`      ${item.href}`)
  }

  console.log('\n--- 阶段 1 建议优先排除的类别 ---')
  const suggest = groupByCategory(phase1Candidates)
    .filter(([cat]) => !['uncategorized', 'i18n-locale'].includes(cat))
  for (const [category, list] of suggest) {
    console.log(`  ${category}: ${list.length} 条 → ${list.map(i => i.file).join(', ')}`)
  }

  if (items.some(i => i.category === 'uncategorized')) {
    console.log('\n⚠ 存在 uncategorized 项，实施阶段 1 前请人工确认。')
  }

  console.log('\n========================================\n')
}

async function main() {
  let html: string
  let source: string

  if (htmlFile) {
    if (!fs.existsSync(htmlFile)) {
      console.error(`文件不存在: ${htmlFile}`)
      process.exit(1)
    }
    html = fs.readFileSync(htmlFile, 'utf8')
    source = htmlFile
  }
  else {
    try {
      html = await fetchHtml(baseUrl)
      source = baseUrl
    }
    catch (e) {
      console.error(`无法获取首页 HTML: ${baseUrl}`)
      console.error('请先执行: pnpm build:china && pnpm preview:china')
      console.error('或保存 HTML 后: HOME_PRELOAD_HTML=./tmp/home.html pnpm audit:home-preload')
      console.error(e)
      process.exit(1)
    }
  }

  const items = extractPreloads(html)
  if (!items.length) {
    console.error('未找到 modulepreload 链接，请确认构建为国内站首页。')
    process.exit(1)
  }

  printReport(items, source)

  const batch1Excluded = items.filter(i => isChinaPreloadBatch1Excluded(i.file))
  const batch2Excluded = items.filter(i => isChinaPreloadBatch2Excluded(i.file))
  const allExcluded = items.filter(i => isChinaPreloadExcluded(i.file))

  console.log('--- 第一批 blacklist 模拟 ---')
  console.log(`  将排除: ${batch1Excluded.length} 条`)
  console.log(`  排除后预估剩余: ${items.length - batch1Excluded.length} 条`)
  if (batch1Excluded.length) {
    console.log(`  排除项: ${batch1Excluded.map(i => i.file).join(', ')}`)
  }

  console.log('\n--- 第二批 blacklist 模拟（不含 home-cta）---')
  console.log(`  将排除: ${batch2Excluded.length} 条`)
  console.log(`  排除后预估剩余: ${items.length - batch2Excluded.length} 条`)
  if (batch2Excluded.length) {
    console.log(`  排除项: ${batch2Excluded.map(i => i.file).join(', ')}`)
  }

  console.log('\n--- 第一+二批合并模拟 ---')
  console.log(`  将排除: ${allExcluded.length} 条`)
  console.log(`  排除后预估剩余: ${items.length - allExcluded.length} 条`)
  console.log('')
}

main()
