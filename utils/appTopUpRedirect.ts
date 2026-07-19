/** App Web 浏览器列表页；充值季活动期间进入该页会自动弹出活动弹窗 */
export const APP_BROWSER_LIST_PATH = '/browser/list'

export const OFFICIAL_SITE_REDIRECT_QUERY = 'official-site-redirect'

export function resolveAppLocale(locale: string) {
  return ({ zh: 'zh-CN', en: 'en', ru: 'ru' } as const)[locale as 'zh' | 'en' | 'ru'] || 'en'
}

export function buildAppBrowserListUrl(roxyBrowserUrl: string, locale: string) {
  const url = new URL(roxyBrowserUrl)
  url.pathname = APP_BROWSER_LIST_PATH
  url.searchParams.set('language', resolveAppLocale(locale))
  return url.toString()
}
