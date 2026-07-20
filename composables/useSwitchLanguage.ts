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
  const { public: { isChinaSite, roxyInternationalHomeUrl } } = useRuntimeConfig()
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
      location.href = wrapWithSyncQuery(`${baseUrl}/${code}${targetPath === '/' ? '' : targetPath}`)

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
