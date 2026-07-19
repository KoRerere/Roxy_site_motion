// 简单 UA 规则判断是否为爬虫/自动化工具（包含 Lighthouse、Headless、各大搜索引擎等）
export function isBotUserAgent(userAgentRaw: string | undefined | null): boolean {
  const ua = (userAgentRaw || '').toLowerCase()
  if (!ua)
    return false

  // 常见搜索引擎/抓取工具/性能工具/自动化指纹
  const keywords: string[] = [
    'googlebot',
    'bingbot',
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'sogou',
    'exabot',
    'facebot',
    'facebookexternalhit',
    'twitterbot',
    'slurp',
    'semrush',
    'ahrefs',
    'mj12bot',
    'crawler',
    'spider',
    'crawl',

    // 性能/测试工具
    'lighthouse',
    'chrome-lighthouse',
    'pagespeed',
    'psi',
    'gtmetrix',
    'webpagetest',
    'speedcurve',
    'pingdom',

    // 头less/自动化
    'headless',
    'headlesschrome',
    'phantomjs',
    'puppeteer',
    'selenium',

    // 脚本/命令行客户端
    'curl',
    'wget',
    'httpclient',
    'python-requests',
    'aiohttp',
    'okhttp',
    'go-http-client',
    'java/',
    'node-fetch',
    'axios',
  ]

  return keywords.some(k => ua.includes(k))
}

export function isLikelyRealUser(userAgentRaw: string | undefined | null): boolean {
  return !isBotUserAgent(userAgentRaw)
}
