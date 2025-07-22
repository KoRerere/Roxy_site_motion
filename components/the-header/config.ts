import { computed } from 'vue';
import SolutionsPanel from './solutions-panel.vue';
import FeaturesPanel from './features-panel.vue';

export const useMenuConfigs = () => {
  const { $t } = useRxI18n()
  const switchLanguage = useSwitchLanguage()
  
  const mageMenus = computed(() => [
    {
      title: $t('解决方案'),
      value: 'solutions',
      component: SolutionsPanel,
    },
    {
      title: $t('产品功能'),
      value: 'features',
      component: FeaturesPanel,
    }
  ])
  
  const menus = computed(() => [
    {
      title: $t('博客'),
      link: '/blog'
    },
    {
      title: $t('价格方案'),
      link: '/pricing'
    },
    {
      title: $t('下载'),
      link: '/download'
    }
  ])
  
  const mobileMenus = [
    {
      title: $t('解决方案'),
      value: 'solutions',
      children: [
        {
          title: $t('隐私防护'),
          value: 'privacy-defense',
        },
        {
          title: $t('社交网络'),
          value: 'social-networks',
        },
        {
          title: $t('联盟营销'),
          value: 'affiliate-market',
        },
        {
          title: $t('数据采集'),
          value: 'web-scraping',
        },
        {
          title: $t('电子商务'),
          value: 'e-commerce',
        },
        {
          title: $t('加密收益'),
          value: 'crypto-gains',
        },
        {
          title: $t('流量获利'),
          value: 'traffic-trade',
        },
        {
          title: $t('广告策略'),
          value: 'ad-strategy',
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
          title: $t('English'),
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

