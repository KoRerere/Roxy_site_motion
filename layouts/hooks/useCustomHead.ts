import { useScripts } from './useScripts'

export const useCustomHead = () => {
  const localeHead = useLocaleHead()
  const scripts = useScripts()

  useHead(() => ({
    // htmlAttrs: {
    //   lang: localeHead.value.htmlAttrs?.lang,
    //   dir: localeHead.value.htmlAttrs?.dir
    // },
    link: [...(localeHead.value.link || [])],
    meta: [
      ...(localeHead.value.meta || []),
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      }
    ],
    // 开发环境使用 ahrefs 统计
    script: toRaw(scripts),
  }))
}
