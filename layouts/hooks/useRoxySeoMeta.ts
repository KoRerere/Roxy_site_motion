import type { UseSeoMetaInput } from '@unhead/vue'
import { useRxI18n } from '~/composables/useRxI18n'

export const useRoxySeoMeta = (options?: UseSeoMetaInput) => {
  const { $t } = useRxI18n()

  useSeoMeta({
    title: () => $t('Roxy指纹浏览器⚡️最佳工作流-防关联浏览器-多账号管理-跨境电商浏览器，免费试用'),
    description: () => $t('Roxy指纹浏览器⚡️基于 Chromium 内核的顶级防关联浏览器。帮助您大幅提升工作流效率，始终保持匿名并轻松绕过各类平台和网站的检测。专为多账号管理、社交媒体、联盟营销、跨境电商、加密货币、广告投放及数据抓取等领域设计。立即免费试用！'),
    keywords: () => $t('Roxy官网，Roxy指纹浏览器，指纹浏览器，RoxyBrowser，Roxy浏览器，防关联浏览器，跨境电商浏览器，超级浏览器，反检测浏览器'),
    ogTitle: () => $t('Roxy指纹浏览器⚡️最佳工作流-防关联浏览器-多账号管理-跨境电商浏览器，免费试用'),
    ogDescription: () => $t('Roxy指纹浏览器⚡️基于 Chromium 内核的顶级防关联浏览器。帮助您大幅提升工作流效率，始终保持匿名并轻松绕过各类平台和网站的检测。专为多账号管理、社交媒体、联盟营销、跨境电商、加密货币、广告投放及数据抓取等领域设计。立即免费试用！'),
    ogSiteName: () => $t('Roxy指纹浏览器'),
    ogImageAlt: () => $t('Roxy指纹浏览器'),
    ogType: 'website',
    ogImage: 'https://roxybrowser.com/open_graph/rx_open_graph_twitter.png',
    ogImageSecureUrl: 'https://roxybrowser.com/open_graph/rx_open_graph_twitter.png',
    ogImageWidth: '1024',
    ogImageHeight: '560',
    ogImageType: 'image/png',
    ...(options || {}),
  })
}
