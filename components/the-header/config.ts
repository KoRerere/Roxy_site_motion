import { computed } from 'vue'
import { buildAppBrowserListUrl, OFFICIAL_SITE_REDIRECT_QUERY } from '@/utils/appTopUpRedirect'
import { appendMpDistinctIdLoginQuery } from '~/utils/mixpanel-distinct'

import CrossBorderMarketingPanel from './cross-border-marketing-panel.vue'
import FunctionsPanel from './functions-panel.vue'
import ResourcesPanel from './resources-panel.vue'
import UseCasesPanel from './use-cases-panel.vue'

const isChinaSite = process.env.SITE_VARIANT === 'china'

export function useMenuConfigs() {
  const { $t, locale, isRu, isZh } = useRxI18n()
  const { public: { roxyHomeUrl, roxyChinaHomeUrl } } = useRuntimeConfig()

  function getFaqLink() {
    if (isChinaSite) {
      return `${roxyHomeUrl}/docs`
    }
    return locale.value === 'en' ? `${roxyHomeUrl}/docs` : `${roxyHomeUrl}/docs/${locale.value}`
  }
  function getApiDocsLink() {
    if (isChinaSite) {
      return `${roxyHomeUrl}/docs/api-documentation/api-reference.html`
    }
    return locale.value === 'en' ? `${roxyHomeUrl}/docs/api-documentation/api-reference.html` : `${roxyHomeUrl}/docs/${locale.value}/api-documentation/api-reference.html`
  }

  const mageMenus = computed(() => [
    // {
    //   title: $t('解决方案'),
    //   value: 'solutions',
    //   component: SolutionsPanel,
    // },
    {
      title: $t('应用场景'),
      value: 'use-cases',
      component: UseCasesPanel,
    },
    {
      title: $t('产品功能'),
      value: 'functions',
      component: FunctionsPanel,
    },
    {
      title: $t('资源'),
      value: 'resources',
      component: ResourcesPanel,
    },
    {
      title: $t('跨境营销'),
      value: 'cross-border-marketing',
      component: CrossBorderMarketingPanel,
    },
  ])

  const menus = computed(() => {
    const __menus = [
      {
        title: $t('价格方案'),
        link: '/pricing',
      },
      {
        title: $t('下载'),
        link: '/download',
      },
    ]

    return __menus
  })

  const mobileMenus = computed(() => ([
    {
      title: $t('应用场景'),
      value: 'use-cases',
      // hidden: isRu.value,
      children: [
        {
          icon: 'menu/social-networks',
          title: $t('社媒运营'),
          value: 'social-media-marketing',
        },
        {
          icon: 'menu/e-commerce',
          title: $t('跨境电商'),
          value: 'ecommerce-marketing',
        },
        {
          icon: 'menu/traffic-trade',
          title: $t('SEO 优化'),
          value: 'seo-content-marketing',
        },
        {
          icon: 'menu/ad-strategy',
          title: $t('广告投放'),
          value: 'paid-search-advertising',
        },
        {
          icon: 'menu/affiliate-market',
          title: $t('联盟营销'),
          value: 'affiliate-marketing',
        },
        {
          icon: 'menu/web-scraping',
          title: $t('数据爬取'),
          value: 'web-scraping',
        },
        {
          icon: 'menu/crypto-gains',
          title: $t('加密货币'),
          value: 'cryptocurrency-trading',
          hidden: isChinaSite,
        },
      ],
    },
    {
      title: $t('产品功能'),
      value: 'features',
      // hidden: isRu.value,
      children: [
        {
          icon: 'menu/nav-multiple-accounts',
          title: $t('多账号管理{nav}', { nav: '' }),
          link: '/functions/manage-multiple-accounts',
        },
        {
          icon: 'menu/nav-RoxyIP',
          title: $t('RoxyIP'),
          link: '/functions/roxy-ip',
        },
        {
          icon: 'menu/nav-change-ip',
          title: $t('更改 IP 地址'),
          link: '/functions/change-ip-address',
        },
        {
          icon: 'menu/nav-private-browsing',
          title: $t('保护线上隐私'),
          link: '/functions/private-browsing',
        },
      ],
    },
    {
      title: $t('资源'),
      value: 'resources',
      children: [
        {
          icon: 'contact-us/nav-whoer',
          title: $t('Whoer.net'),
          link: '/whoer',
        },
        {
          icon: 'menu/blog',
          title: $t('博客'),
          link: '/blog',
        },
        {
          icon: 'menu/faq',
          title: $t('常见问题'),
          link: '/faqs',
          // hidden: isRu.value,
        },
        {
          icon: 'menu/user-guide',
          title: $t('使用指南'),
          link: getFaqLink(),
          // hidden: isRu.value,
          aAttr: {
            target: '_blank',
          },
        },
        {
          icon: 'menu/about-us',
          title: $t('关于我们'),
          link: '/about-us',
          // hidden: isRu.value,
        },
        {
          icon: 'menu/changelog',
          title: $t('更新日志'),
          link: '/changelog',
        },
        {
          icon: 'menu/partner',
          title: $t('合作伙伴'),
          desc: $t('与 RoxyBrowser 合作，共同开启更多元、更长远的商业可能'),
          link: '/partners',
        },
        {
          icon: 'menu/api-flow',
          title: $t('API 调用'),
          link: getApiDocsLink(),
          aAttr: {
            target: '_blank',
          },
        },
      ],
    },
    {
      title: $t('跨境营销'),
      value: 'cross-border-marketing',
      children: [
        {
          icon: 'menu/core-service',
          title: $t('核心服务'),
          desc: $t('基于全球 20,000+素人矩阵，量身定制增长方案'),
          link: `${roxyHomeUrl}/roxy-geo/#services`,
        },
        {
          icon: 'menu/use-cases',
          title: $t('客户案例'),
          desc: $t('Roxy跨境出海打造现象级爆款，助力品牌快速增长'),
          link: `${roxyHomeUrl}/roxy-geo/#cases`,
        },
        {
          icon: 'menu/delivery-process',
          title: $t('交付流程'),
          desc: $t('标准化6步履约流程，全面掌握业务交付各个环节'),
          link: `${roxyHomeUrl}/roxy-geo/#process`,
        },
        {
          icon: 'menu/pricing',
          title: $t('价格方案'),
          desc: $t('选择适合你的业务套餐，或定制专属视频服务方案'),
          link: `${roxyHomeUrl}/roxy-geo/#pricing`,
        },
      ],
    },
    {
      title: $t('价格方案'),
      value: 'pricing',
    },
    {
      title: $t('下载'),
      value: 'download',
    },
  ]))

  return {
    mageMenus,
    menus,
    mobileMenus,
  }
}

export interface OpenOptions {
  params?: Record<string, string>
}

interface GenRoxyBrowserUrlOptions {
  params?: Record<string, string>
  /** href 绑定时为 false，避免 SSR/CSR 因 localStorage 不一致触发水合警告 */
  includeInviteCode?: boolean
}

export function useOpenRoxyBrowser() {
  const { locale } = useRxI18n()
  const { public: { roxyBrowserUrl } } = useRuntimeConfig()
  const { $mixpanel } = useNuxtApp()

  function genRoxyBrowserUrl(options: GenRoxyBrowserUrlOptions = {}) {
    const { params, includeInviteCode = true } = options
    const base = new URL(roxyBrowserUrl)
    const lang = { zh: 'zh-CN', en: 'en', ru: 'ru' }[locale.value] || 'en'
    let inviteCode = ''
    // 仅点击跳转时读取 invite 码；href 渲染不读 localStorage，保证 SSR 与客户端一致
    if (includeInviteCode && import.meta.client) {
      inviteCode = localStorage.getItem('code') || ''
    }

    base.pathname = '/login'
    base.searchParams.set('official-site-lang', lang)
    base.searchParams.set('official-site-invite-code', inviteCode)
    base.searchParams.set('jump-referer', 'roxy-home')
    // 登录成功后进入浏览器列表页，充值季活动期间 App 会自动弹出活动弹窗
    base.searchParams.set(
      OFFICIAL_SITE_REDIRECT_QUERY,
      buildAppBrowserListUrl(String(roxyBrowserUrl), locale.value),
    )
    appendMpDistinctIdLoginQuery(base, $mixpanel)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        base.searchParams.set(key, value)
      })
    }
    return base.toString()
  }

  /** SSR/CSR 一致的 href，不含 inviteCode */
  const roxyBrowserSeoUrl = computed(() => genRoxyBrowserUrl({ includeInviteCode: false }))

  /** 点击时用当前 inviteCode 打开新标签 */
  function openRoxyBrowser(target = '_blank', options?: OpenOptions) {
    if (!import.meta.client)
      return
    const url = genRoxyBrowserUrl({ params: options?.params, includeInviteCode: true })
    if (target !== '_blank') {
      window.location.href = url
    }
    else {
      window.open(url, target)
    }
  }

  return {
    roxyBrowserSeoUrl,
    openRoxyBrowser,
  }
}
