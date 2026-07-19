import type { Component } from 'vue'
import AiAutomationVisual from './slides/ai-automation-visual.vue'
import FingerprintVisual from './slides/fingerprint-visual.vue'
import IpIntegrationFooter from './slides/ip-integration-footer.vue'
import PerformanceVisual from './slides/performance-visual.vue'
import PricingVisual from './slides/pricing-visual.vue'
import PricingSlideTitle from './titles/pricing-slide-title.vue'

const IpIntegrationVisualAsync = defineAsyncComponent(() => import('./slides/cobe.vue'))
/** 轮播页视觉组件 id，与 Figma 五张画板一一对应 */
export type SlideVisualId
  = | 'fingerprint'
    | 'aiAutomation'
    | 'ipIntegration'
    | 'pricing'
    | 'performance'

export type CtaAction
  = | { type: 'register' }
    | { type: 'link', to: string }
    | { type: 'demo' }

export interface FeatureHighlight {
  text: string
  /** 使用 rx_ic_check_fill；否则为圆点样式（IP/性价比等页） */
  useCheckIcon?: boolean
}

export interface FeatureSlide {
  id: SlideVisualId
  badge: string
  badgeLinearGradient: string
  badgeIcon?: string
  badgeClass?: string
  /** 纯文案或自定义标题组件（如 pricing 页 i18n 渐变数字） */
  title: string | Component
  subtitlePrefix: string
  /** 高亮前的短文案（移动端可与 prefix 分两行展示，桌面端与 prefix 同一行） */
  subtitleBeforeHighlight?: string
  /** 渐变高亮后缀文案 */
  subtitleHighlight?: string
  subtitleHighlightGradient?: string
  subtitleHighlightClass?: string
  primaryCta: { text: string, action: CtaAction }
  secondaryCta?: { text: string, action: CtaAction }
  highlights: FeatureHighlight[]
  /** 卖点是否允许两行排列（指纹页） */
  highlightsMultiline?: boolean
  /** 移动端 CTA 换行后主次按钮等宽（inline-grid，以较宽按钮为准） */
  ctaEqualWidthMobile?: boolean
  extraFooter?: Component
}

export const slideVisualComponents: Record<SlideVisualId, Component> = {
  fingerprint: FingerprintVisual,
  aiAutomation: AiAutomationVisual,
  ipIntegration: IpIntegrationVisualAsync,
  pricing: PricingVisual,
  performance: PerformanceVisual,
}

/** 每页停留时长（秒），与进度条动画一致 */
export const SLIDE_DURATION_SEC = 8

export const FEATURE_CAROUSEL_PRELOAD = {
  aiMapDesktop: '/home/feature-carousel/carousel/ai-agent/map.svg',
  aiMapMobile: '/home/feature-carousel/carousel/ai-agent/map_mobile.svg',
} as const

/** 子视觉组件 inject：Demo 视频等场景暂停/恢复轮播自动播放 */
export const featureCarouselAutoplayKey = Symbol('feature-carousel-autoplay')

export interface FeatureCarouselAutoplayControl {
  pauseAutoplay: () => void
  resumeAutoplay: () => void
}

/** 轮播页数量，与 slides 条目一致 */
export const FEATURE_CAROUSEL_SLIDE_COUNT = 5

/** 默认 slide 顺序（洗牌前的基准） */
const DEFAULT_SLIDE_ORDER: SlideVisualId[] = [
  'fingerprint',
  'ipIntegration',
  'pricing',
  'performance',
  'aiAutomation',
]

function buildFeatureCarouselSlides(isMdWidth: boolean): FeatureSlide[] {
  return [
    {
      id: 'ipIntegration',
      // 浏览器+IP 一体防护｜防封率 99.99%
      badge: $t('浏览器 + IP 一体防护｜防封率 99.99%'),
      badgeLinearGradient: 'linear-gradient(94deg, #3990F8 -1.41%, #13DD8D 99.64%)',
      title: $t('开店养号网络不稳？\n跳风险提示？'),
      subtitlePrefix: $t('为跨境电商店铺/海外社媒矩阵定制专线 IP，'),
      subtitleHighlight: $t('拒绝风控！'),
      subtitleHighlightGradient: 'linear-gradient(94deg, #3990F8 -1.41%, #13DD8D 99.64%)',
      primaryCta: {
        text: $t('免费获取纯净 IP'),
        action: { type: 'register' },
      },
      secondaryCta: {
        text: $t('查看节点列表'),
        action: { type: 'link', to: '/functions/roxy-ip' },
      },
      highlights: [
        { text: $t('🏆 IP 质量行业第一') },
        { text: $t('Roxy 独家 IP 资源') },
        { text: $t('业务成功率99%') },
        // { text: $t('🏠 原生住宅 IP') },
      ],
      ctaEqualWidthMobile: true,
      extraFooter: IpIntegrationFooter,
    },
    {
      id: 'pricing',
      badge: $t('⚡ 超高性价比·行业领先'),
      badgeLinearGradient: 'linear-gradient(91deg, #F7604A -1.89%, #E789EE 100.24%)',
      // title: PricingSlideTitle,
      title: $t('多账号养号太贵？\n多店铺运营成本太高？'),
      subtitlePrefix: $t('跨境电商/社媒矩阵低成本起步，'),
      subtitleHighlight: $t('成本直降 2 倍+！'),
      subtitleHighlightGradient: 'linear-gradient(91deg, #F7604A -1.89%, #E789EE 100.24%)',
      primaryCta: {
        text: $t('🎁 免费领取 5 窗口'),
        action: { type: 'register' },
      },
      secondaryCta: {
        text: $t('完整对比'),
        action: { type: 'link', to: '/functions/manage-multiple-accounts' },
      },
      highlights: [
        { text: $t('免费 5 个窗口') },
        { text: $t('单窗口 $0.3 / 月起') },
        { text: $t('成员额度永久买断') },
      ],
    },
    {
      id: 'performance',
      badge: $t('店群/社媒矩阵首选 | 超高性能 + 团队协作'),
      badgeLinearGradient: 'linear-gradient(94deg, #FF8C1A -1.41%, #FFC700 99.64%)',
      title: $t('社媒账号多开卡顿？\n并发吃力？'),
      subtitlePrefix: $t('店群 / 社媒矩阵批量多开，'),
      subtitleHighlight: $t('2000+ 并发零卡顿！'),
      subtitleHighlightGradient: 'linear-gradient(94deg, #FF8C1A -1.41%, #FFC700 99.64%)',
      primaryCta: {
        text: $t('免费体验极速并发'),
        action: { type: 'register' },
      },
      secondaryCta: {
        text: $t('查看完整对比'),
        action: { type: 'link', to: '/pricing' },
      },
      highlights: [
        { text: $t('启动速度 < 0.8 秒') },
        { text: $t('单机并发 2000+ （支持高并发定制）') },
      ],
      ctaEqualWidthMobile: true,
    },
    {
      id: 'aiAutomation',
      badge: $t('全球首款 AI 指纹浏览器'),
      badgeLinearGradient: 'linear-gradient(134.92deg, #3FAAF6 0%, #F359DC 50%, #F28FB0 100%)',
      title: $t('账号运营太累？\n人工成本太高？'),
      subtitlePrefix: $t('跨境电商 / 社媒矩阵批量操作，重复工作'),
      subtitleHighlight: $t('全交给 AI'),
      subtitleHighlightGradient: 'linear-gradient(117deg, #3FAAF6 0%, #F359DC 50%, #F28FB0 100%)',
      primaryCta: {
        text: $t('免费使用 AI 自动化'),
        action: { type: 'register' },
      },
      secondaryCta: {
        text: $t('观看 Demo'),
        action: { type: 'demo' },
      },
      highlights: [
        { text: $t('效率提升 100 倍'), useCheckIcon: true },
        { text: $t('成本直降 98%'), useCheckIcon: true },
        { text: $t('无需写代码'), useCheckIcon: true },
      ],
      ctaEqualWidthMobile: true,
    },
    {
      id: 'fingerprint',
      badge: $t('电商/社媒/AI 账号防封率 99%'),
      badgeLinearGradient: 'linear-gradient(100deg, #00E59C 0%, #11A4FF 100%)',
      badgeIcon: '/home/feature-carousel/rx_ic_fingerprint.svg',
      title: $t('店铺怕关联？怕封号？\n怕环境不安全？'),
      subtitlePrefix: $t('跨境电商与社媒矩阵首选，'),
      subtitleHighlight: $t('大幅度降低多账号安全风险！'),
      subtitleHighlightGradient: 'linear-gradient(100deg, #00E59C 0%, #11A4FF 100%)',
      primaryCta: {
        text: $t('免费获取安全环境'),
        action: { type: 'register' },
      },
      secondaryCta: {
        text: $t('查看指纹参数'),
        action: { type: 'link', to: '/functions/manage-multiple-accounts' },
      },
      highlights: [
        { text: $t('底层内核改写'), useCheckIcon: true },
        { text: $t('软件 + 硬件全维度环境模拟'), useCheckIcon: true },
        { text: $t('检测平台 100% 通过'), useCheckIcon: true },
      ],
      highlightsMultiline: true,
    },
  ]
}

export function useFeatureCarouselSlides(): ComputedRef<FeatureSlide[]> {
  const mdWidth = useRxBreakpoints().smaller('md')
  const slideOrder = useState<SlideVisualId[]>(
    'feature-carousel-slide-order',
    () => [...DEFAULT_SLIDE_ORDER],
  )

  return computed(() => {
    const slidesById = new Map(
      buildFeatureCarouselSlides(mdWidth.value).map(slide => [slide.id, slide]),
    )
    return slideOrder.value.map(id => slidesById.get(id)!)
  })
}
