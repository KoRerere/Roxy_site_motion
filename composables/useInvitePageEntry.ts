import type { LanguageCode } from '@/constants/langs'
import { lang } from '@/store'

/**
 * 推广落地页 canonical 特殊规则（国际站 / 国内站策略不同）：
 * - .com：/invite/:code 统一 canonical 到首页，避免无限变体被当重复页
 * - .cn：/invite/:code 统一 canonical 到 /invite/ 目录页，去掉渠道码
 */
export function useInviteCanonicalHead() {
  const { public: { isChinaSite, roxyInternationalHomeUrl, roxyChinaHomeUrl, roxyHomeUrl } } = useRuntimeConfig()

  const inviteCanonical = computed(() => {
    if (isChinaSite) {
      // 国内站：带码 URL 归并到推广目录页，如 /invite/0320AK9A -> /invite/
      const base = String(roxyChinaHomeUrl || roxyHomeUrl || 'https://roxybrowser.cn').replace(/\/$/, '')
      return `${base}/invite/`
    }
    // 国际站：带码 URL 归并到首页
    const base = String(roxyInternationalHomeUrl || roxyHomeUrl || 'https://roxybrowser.com').replace(/\/$/, '')
    return `${base}/`
  })

  useHead({
    link: [
      {
        id: 'i18n-can',
        rel: 'canonical',
        href: inviteCanonical,
      },
    ],
  })
}

/**
 * 推广落地页入口逻辑：/invite 与 /invite/:code 共用（上报、SEO、invite-code-sync）
 */
export function useInvitePageEntry() {
  const { extractCode } = useChannelReport()
  const route = useRoute()
  // 在 setup 内绑定 $t，避免 useSeoMeta 回调在 setup 外调用全局 $t 触发 composable 报错
  const { $t, locale } = useRxI18n()

  // Invite API 走全局 axios 拦截器，拦截器读 store.lang（默认 en）。
  // 中国站首屏默认 zh 不会触发 i18n:beforeLocaleSwitch，需在此与 locale 对齐。
  function syncInviteApiLanguage() {
    lang.value = locale.value as LanguageCode
  }
  syncInviteApiLanguage()
  watch(locale, syncInviteApiLanguage)

  // title 只放主标题，自定义后缀走页面级 titleTemplate（全角 ｜，避免半角 | 被全局规则截断）。
  // 页面 titleTemplate 会覆盖 nuxt-seo-utils 全局的「%s | RoxyBrowser」。
  useHead({
    title: () => $t('invite.seoTitle')
  })
  useSeoMeta({
    description: () => $t('invite.seoDescription'),
  })

  useInviteCanonicalHead()

  onBeforeMount(() => {
    if (!import.meta.client)
      return

    extractCode()

    const redirect = new URLSearchParams(window.location.hash.slice(1)).get('redirect')
    const codeFromParams = route.params.code
    const codeFromQuery = route.query.code
    const code = (Array.isArray(codeFromParams) ? codeFromParams[0] : codeFromParams)
      || (Array.isArray(codeFromQuery) ? codeFromQuery[0] : codeFromQuery)
      || ''

    if (!redirect && code)
      sessionStorage.setItem('invite-code-sync', String(code))
    if (redirect)
      navigateTo(redirect, { replace: true })
  })
}
