import type { LanguageCode } from '@/constants'
import {
  appendQueryToUrl,
  buildLanguageSwitchQuery,
  mergeLanguageSwitchRouteQuery,
} from '~/utils/route-sync-query'

// 切换语言
export function useSwitchLanguage() {
  const switchLocalePath = useSwitchLocalePath()
  const router = useRouter()
  const route = useRoute()
  const { public: { isChinaSite, roxyChinaHomeUrl, roxyInternationalHomeUrl } } = useRuntimeConfig()
  // const { $eventBus } = useNuxtApp()
  // const { locale } = useRxI18n()

  const switchLanguage = (code: LanguageCode, formatQuery?: (query: Record<string, any>) => Record<string, any>) => {
    const fontFamily = getFontFamily(code)
    document.documentElement.style.setProperty('--family', fontFamily)

    /** 跨站跳转：将 ROUTE_SYNC_QUERY_ITEMS 中已同步的参数附到目标 URL */
    function wrapWithSyncQuery(url: string): string {
      return appendQueryToUrl(url, buildLanguageSwitchQuery(route))
    }

    if (isChinaSite && code !== 'zh') {
      const baseUrl = roxyInternationalHomeUrl
      const targetPath = route.path
      // 国际站去除了多语言检测、用户语言自动切换，无code路径必定是en语言
      if (code === 'en') {
        location.href = wrapWithSyncQuery(`${baseUrl}${targetPath}`)
        return
      }

      location.href = wrapWithSyncQuery(`${baseUrl}/${code}${targetPath === '/' ? '' : targetPath}`)

      return
    }

    if (!isChinaSite && code === 'zh') {
      const baseUrl = roxyChinaHomeUrl
      const path = ['/en', '/ru'].includes(route.path) ? '' : route.path
      location.href = wrapWithSyncQuery(baseUrl + path)

      return
    }
    // $eventBus.emit('switchLanguage', { new: code, old: locale.value })
    router.push({
      path: switchLocalePath(code),
      query: mergeLanguageSwitchRouteQuery(route, formatQuery),
    })
  }

  return switchLanguage
}
