import { getRequestURL } from 'h3'
import { stripChinaPreloadFromHeadHtml } from '../../utils/china-preload-blacklist'

/**
 * 国内首页 SSR：剥离 modulepreload 黑名单 batch1+batch2（不改 UI，仅减 head hint）
 * 须在 server/plugins 中注册，nuxt.config hooks 不会打进 Nitro 产物。
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    const config = useRuntimeConfig()
    if (!config.public.isChinaSite)
      return

    const pathname = getRequestURL(event).pathname
    if (pathname !== '/')
      return

    html.head = html.head.map((chunk) => {
      if (typeof chunk !== 'string')
        return chunk
      return stripChinaPreloadFromHeadHtml(chunk)
    })
  })
})
