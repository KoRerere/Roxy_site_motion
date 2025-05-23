import { type LanguageCode } from '@/constants'

// 切换语言
export function useSwitchLanguage() {
  const switchLocalePath = useSwitchLocalePath()
  const router = useRouter()
  const route = useRoute()
  const { $eventBus } = useNuxtApp()
  const { locale } = useRxI18n()

  const switchLanguage = (code: LanguageCode, formatQuery?: (query: Record<string, any>) => Record<string, any>) => {
    const fontFamily = getFontFamily(code)
    document.documentElement.style.setProperty('--family', fontFamily)
    $eventBus.emit('switchLanguage', { new: code, old: locale.value })
    router.push({
      path: switchLocalePath(code),
      query: formatQuery ? formatQuery(route.query) : route.query
    })
  }

  return switchLanguage
}