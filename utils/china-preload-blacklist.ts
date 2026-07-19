/**
 * 国内站首页 modulepreload 黑名单（pattern 匹配 basename，不含 hash）
 * 与 scripts/audit-home-preload.ts 共用，避免规则漂移。
 * 仅影响 preload hint，不改动组件树与 UI。
 */

/** 第一批：非首屏 / 非中文 / 泄漏 / 第三方重资源 */
export const CHINA_PRELOAD_BATCH1_PATTERNS: readonly RegExp[] = [
  /^en-/i,
  /^ru-/i,
  /^poster-en-/i,
  /^download-icon-/i,
  /^live-chat-/i,
  /^cobe-/i,
  /^ElectricBg-/i,
  /^Marquee-/i,
  /^certification-new-/i,
  /^useRealtime-/i,
]

/**
 * 第二批：动效 / 非关键 composable / 已有 image preload 的 agent 资源 / FAQ
 * 不含 home-cta（首屏下载按钮，需谨慎单独评估）
 */
export const CHINA_PRELOAD_BATCH2_PATTERNS: readonly RegExp[] = [
  // motion-v
  /^AnimatePresence\.vue-/i,
  /^use-motion/i,
  /^is-svg-element-/i,
  /^use-motion-value-event-/i,
  /^use-scroll-/i,
  // shared-composable
  /^rx-i18n-t-/i,
  /^useTelegram-/i,
  /^interval-/i,
  /^useBackTop-/i,
  /^rx-spinner-/i,
  // hero-agent（图片已有 rel=preload，JS chunk 仅导出 URL）
  /^poster-zh-/i,
  /^roxy-agent-bg-/i,
  // home-faq（SSR 已输出 HTML，hydration 再拉 chunk）
  /^faq-/i,
]

export const CHINA_PRELOAD_ALL_PATTERNS: readonly RegExp[] = [
  ...CHINA_PRELOAD_BATCH1_PATTERNS,
  ...CHINA_PRELOAD_BATCH2_PATTERNS,
]

export function getChunkBasename(depPath: string): string {
  const normalized = depPath.replace(/\\/g, '/')
  const file = normalized.split('/').pop() ?? normalized
  return file.split('?')[0] ?? file
}

function matchesPatterns(depPath: string, patterns: readonly RegExp[]): boolean {
  const base = getChunkBasename(depPath)
  return patterns.some(pattern => pattern.test(base))
}

export function isChinaPreloadBatch1Excluded(depPath: string): boolean {
  return matchesPatterns(depPath, CHINA_PRELOAD_BATCH1_PATTERNS)
}

export function isChinaPreloadBatch2Excluded(depPath: string): boolean {
  return matchesPatterns(depPath, CHINA_PRELOAD_BATCH2_PATTERNS)
}

/** 第一批 + 第二批合并判断 */
export function isChinaPreloadExcluded(depPath: string): boolean {
  return matchesPatterns(depPath, CHINA_PRELOAD_ALL_PATTERNS)
}

export function filterChinaPreloadBatch1Deps(deps: readonly string[]): string[] {
  return deps.filter(dep => !isChinaPreloadBatch1Excluded(dep))
}

/** 构建层：过滤全部批次 */
export function filterChinaPreloadDeps(deps: readonly string[]): string[] {
  return deps.filter(dep => !isChinaPreloadExcluded(dep))
}

/** 从 SSR head 片段中移除全部批次 modulepreload（首页兜底） */
export function stripChinaPreloadFromHeadHtml(head: string): string {
  return head.replace(/<link\b[^>]*\brel=["']modulepreload["'][^>]*>/gi, (tag) => {
    const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1]
    if (!href)
      return tag
    return isChinaPreloadExcluded(href) ? '' : tag
  })
}

/** @deprecated 使用 stripChinaPreloadFromHeadHtml */
export function stripChinaPreloadBatch1FromHeadHtml(head: string): string {
  return stripChinaPreloadFromHeadHtml(head)
}
