import type { UseSeoMetaInput } from '@unhead/vue'
import { useRxI18n } from '~/composables/useRxI18n'

export function useRoxySeoMeta(options?: UseSeoMetaInput) {
  const { $t } = useRxI18n()
  const { public: { ENV, isChinaSite, roxyHomeUrl } } = useRuntimeConfig()
  const route = useRoute()
  const baseUrl = (roxyHomeUrl as string) || ''
  // const baseUrl = ENV === 'development' ? 'https://gatetest.roxybrowser.co' : (isChinaSite ? 'https://roxybrowser.cn' : 'https://roxybrowser.com')
  const titleTemplate = computed(() => isChinaSite ? route.path === '/' ? '%s' : '%s | Roxy浏览器' : undefined)

  useSeoMeta({
    titleTemplate,
    title: isChinaSite ? 'Roxy指纹浏览器：专注海外社媒与跨境电商多开的防关联超级浏览器' : () => $t('Roxybrowser指纹浏览器-防关联浏览器-超级浏览器'),
    keywords: isChinaSite && route.path === '/' ? 'RoxyBrowser,RoxyBrowser指纹浏览器,Roxy指纹浏览器,指纹浏览器,防关联浏览器,海外社媒多开,跨境电商浏览器,防关联指纹浏览器,超级浏览器,防检测指纹浏览器,反指纹浏览器,多开账号浏览器' : '',
    description: isChinaSite ? '正在寻找解决海外社媒矩阵与跨境电商多账号防封的方案？RoxyBrowser指纹浏览器是行业内首家融合AI Agent智能体与最新内核的防检测指纹超级浏览器，底层超210+参数定制的指纹伪装技术，完美解决全平台多开账号的防关联难题，助您安全、高效地批量管理账号。立即下载体验！' : () => $t('Roxybrowser指纹浏览器是跨境电商领域专业的电商浏览器，完美替代vps、超级浏览器，虚拟机等，一键实现多账号多开，完美实现多账号安全隔离，支持跨境电商和社媒多账号安全运营。'),
    ogSiteName: isChinaSite ? 'Roxy浏览器' : () => $t('Roxy指纹浏览器'),
    ogImageAlt: isChinaSite ? 'Roxy浏览器' : () => $t('Roxy指纹浏览器'),
    ogType: 'website',
    ogImage: `${baseUrl}/open-graph-images/common.png`,
    ogImageSecureUrl: `${baseUrl}/open-graph-images/common.png`,
    ogImageWidth: '1024',
    ogImageHeight: '560',
    ogImageType: 'image/png',
    ...(options || {}),
  })
}
