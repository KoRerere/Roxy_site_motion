import { computed } from 'vue';
import SolutionsPanel from './solutions-panel.vue';
import FeaturesPanel from './features-panel.vue';
import UseCasesPanel from './use-cases-panel.vue';

export const useMenuConfigs = () => {
  const { $t } = useRxI18n()
  const switchLanguage = useSwitchLanguage()
  const { public: { ENV } } = useRuntimeConfig()
  const isDev = ENV === 'development'
  
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
      value: 'features',
      component: FeaturesPanel,
    }
  ])
  
  const menus = computed(() => {
    const __menus = [
      {
        title: $t('价格方案'),
        link: '/pricing'
      },
      {
        title: $t('下载'),
        link: '/download'
      }
    ]

    if (isDev) {
      __menus.unshift({
        title: $t('博客'),
        link: '/blog'
      })
    }

    return __menus
  })
  
  const mobileMenus = [
    {
      title: $t('应用场景'),
      value: 'use-cases',
      children: [
        {
          icon: "menu/traffic-trade",
          title: $t('SEO优化'),
          value: 'seo-content-marketing',
        },
        {
          icon: "menu/ad-strategy",
          title: $t('广告投放'),
          value: 'paid-search-advertising',
        },
        {
          icon: "menu/social-networks",
          title: $t('社媒运营'),
          value: 'social-media-marketing',
        },
        {
          icon: "menu/e-commerce",
          title: $t('电商运营'),
          value: 'ecommerce-marketing',
        },
        {
          icon: "menu/affiliate-market",
          title: $t('联盟营销'),
          value: 'affiliate-marketing',
        },
        {
          icon: 'menu/web-spcraping',
          title: $t('数据爬取'),
          value: 'web-scraping',
        },
        {
          icon: "menu/crypto-gains",
          title: $t('加密货币'),
          value: 'cryptocurrency-trading',
        }
      ]
    },
    {
      title: $t('产品功能'),
      value: 'features',
      children: [
        {
          title: $t('窗口模板'),
          value: 'profile-template',
        },
        {
          title: $t('团队空间'),
          value: 'team-space',
        },
        {
          title: $t('代理面板'),
          value: 'proxy-panel',
        },
        {
          title: $t('账号中心'),
          value: 'account-hub',
        },
        {
          title: $t('窗口同步'),
          value: 'window-sync',
        },
        {
          title: $t('API 流程'),
          value: 'api-flow',
        },
        
      ]
    },
    {
      title: $t('博客'),
      value: 'blog',
    },
    {
      title: $t('价格方案'),
      value: 'pricing',
    },
    {
      title: $t('下载'),
      value: 'download',
    },
    {
      title: $t('语言'),
      value: 'language',
      children: [
        {
          title: 'English',
          value: 'en',
          click: () => {
            switchLanguage('en')
          }
        },
        {
          title: $t('简体中文'),
          value: 'zh',
          click: () => {
            switchLanguage('zh')
          }
        }
      ]
    },
  ]

  return {
    mageMenus,
    menus,
    mobileMenus
  }
}

