import { SUPPORTED_LANGUAGES } from '@/constants/langs'

/** 与 the-header 一致：判断当前是否为首页或 invite 落地首页（按 path，不依赖 route.name） */
export function useIsHomeRoute() {
  const route = useRoute()
  const localePath = useLocalePath()

  return computed(() => {
    const normalizedPath = route.path.replace(/\/$/, '') || '/'
    const normalizedLocaleHomePath = localePath('/').replace(/\/$/, '') || '/'
    const localeHomePaths = SUPPORTED_LANGUAGES.map(lang => `/${lang.code}`)
    const inviteHomePaths = ['/invite', ...SUPPORTED_LANGUAGES.map(lang => `/${lang.code}/invite`)]

    return normalizedPath === '/'
      || normalizedPath === normalizedLocaleHomePath
      || localeHomePaths.includes(normalizedPath)
      || inviteHomePaths.some(path => normalizedPath === path || normalizedPath.startsWith(`${path}/`))
  })
}
