import { useScripts } from './useScripts'

export function useCustomHead() {
  const localeHead = useLocaleHead()
  const scripts = useScripts()
  const route = useRoute()
  const config = useRuntimeConfig()
  const { locale } = useRxI18n()
  const isChinaSite = config.public.isChinaSite

  useHead(() => {
    const isBlogSlug = typeof route.name === 'string' && route.name.startsWith('blog-slug')

    /**
     * Contact Us（pages/contact-us/index.vue）：
     * - 中文 hreflang 指向 roxybrowser.cn，而非 i18n 默认的 .com/zh 或 zh-Hans
     * - hreflang 需固定 en / zh / ru / x-default 四套跨域 URL
     * 因此在 layout 层跳过 useLocaleHead 的 link/meta，以及国内站通用的 alternate 追加，
     * 避免与页面内 useHead 注入的标签重复或冲突。详见 contact-us/index.vue 内 SEO 注释。
     */
    const isContactUs = route.path === '/contact-us' || route.path.endsWith('/contact-us')

    const baseLink = isBlogSlug || isContactUs ? [] : localeHead.value.link
    let link: any[] = [
      { rel: 'stylesheet', href: '/fonts/fonts-common.css' },
      ...(locale.value === 'ru' ? [{ rel: 'stylesheet', href: '/fonts/fonts-montserrat.css' }] : []),
      ...(Array.isArray(baseLink) ? baseLink : []),
    ]
    const baseUrl = (config.public.roxyHomeUrl as string) || ''
    // 默认语言为 en 且支持 /en/ 前缀时，在 /en/* 页面上将 hreflang="en" 与 x-default 都改为指向当前页（自引用），避免 SEMrush 报错
    if (!isBlogSlug && Array.isArray(link) && link.length > 0 && route.path.startsWith('/en/') && baseUrl) {
      const currentHref = baseUrl + route.path
      link = link.map((item: { rel?: string, hreflang?: string, href?: string, id?: string }) => {
        if (item.hreflang === 'en' || item.hreflang === 'x-default')
          return { ...item, href: currentHref }
        return item
      })
    }

    // 国内站通用 hreflang；Contact Us 已在页面内单独配置，见上方 isContactUs 说明
    if (config.public.isChinaSite && !isContactUs) {
      link.push({ rel: 'alternate', hreflang: 'en', href: `https://roxybrowser.com${route.path}` })
      link.push({ rel: 'alternate', hreflang: 'zh-Hans', href: baseUrl + route.path })
      // 国内站主版本在 .cn，x-default 与 zh-Hans 一致，避免百度/Google 主版本信号冲突
      link.push({ rel: 'alternate', hreflang: 'x-default', href: baseUrl + route.path })
    }

    // Contact Us 的 og:locale 等亦由页面 canonical/hreflang 策略覆盖，不沿用 i18n meta
    const meta = isBlogSlug || isContactUs ? [] : (localeHead.value.meta || [])

    return {
      titleTemplate: isChinaSite ? route.path === '/' ? '-%s' : '%s - Roxy指纹浏览器' : undefined,
      link,
      meta: [
        ...meta,
        {
          name: 'yandex-verification',
          content: '42927fe84029d48e',
        },
        {
          name: 'baidu-site-verification',
          content: 'codeva-8lK2E8pjw9',
        },
        {
          name: 'format-detection',
          content: 'telephone=no, email=no, address=no',
        },
      ],
      script: [
        ...toRaw(scripts),
      ],
    }
  })
}
