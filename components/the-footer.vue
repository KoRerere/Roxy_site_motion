<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

const { $t } = useRxI18n()

const route = useRoute()

const { isDark } = useTheme()

// const bgColor = ref('white')

// watch([() => route.path, isDark], () => {
//   if (route.path.startsWith('/download')) {
//     if (isDark.value) {
//       bgColor.value = '#1E1C31'
//     } else {
//       bgColor.value = 'white'
//     }
//   } else {
//     bgColor.value = 'white'
//   }
// }, { immediate: true })

const AuthenticationInformation = computed(() => [
  // {
  //   text: '192 Choi Hung Rd, Kowloon, Hong Kong SAR, 999077, CN',
  //   icon: 'base/rx_ic_site',
  // },
  // {
  //   text: 'Novatech HongKong Group Co. Limited',
  //   icon: 'base/rx_ic_company',
  // },
  {
    text: 'support@RoxyBrowser.com',
    icon: 'base/rx_ic_email',
  },
])

const footerList = computed(() => [
  {
    title: $t('产品').toLocaleUpperCase(),
    list: [
      {
        name: $t('价格方案'),
        link: '/pricing',
      },
      // {
      //   name: 'Windows',
      //   link: '/download'
      // },
      // {
      //   name: 'Mac',
      //   link: '/download'
      // }
      // {
      //   name: $t('Linux（即将推出）'),
      //   link: '/download',
      //   class: 'text-white/60'
      // }
    ],
  },
  {
    title: $t('应用场景').toLocaleUpperCase(),
    list: [
      {
        name: $t('SEO 优化'),
        link: '/use-cases/seo-content-marketing',
      },
      {
        name: $t('广告投放'),
        link: '/use-cases/paid-search-advertising',
      },
      {
        name: $t('社媒运营'),
        link: '/use-cases/social-media-marketing',
      },
      {
        name: $t('电商运营'),
        link: '/use-cases/ecommerce-marketing',
      },
      {
        name: $t('加密货币'),
        link: '/use-cases/cryptocurrency-trading',
      },
    ],
  },
  {
    title: $t('功能特性').toLocaleUpperCase(),
    list: [
      {
        name: $t('团队空间'),
        link: '/features/team-space',
      },
      {
        name: $t('代理面板'),
        link: '/features/proxy-panel',
      },
      {
        name: $t('账号中心'),
        link: '/features/account-hub',
      },
      {
        name: $t('窗口同步'),
        link: '/features/window-sync',
      },
      {
        name: $t('API 流程'),
        link: '/features/api-flow',
      },
    ],
  },
  {
    title: $t('官方账号').toLocaleUpperCase(),
    list: [
      {
        name: 'X',
        link: 'https://x.com/RoxyBrowser',
        icon: '/footer/x.svg',
        aAttr: {
          target: '_blank',
        },
      },
      {
        name: 'Youtube',
        link: 'https://www.youtube.com/@RoxyBrowser',
        icon: '/footer/youtube.svg',
        aAttr: {
          target: '_blank',
        },
      },
      {
        name: 'TikTok',
        link: 'https://tiktok.com/@roxybrowser',
        icon: '/footer/tiktok.svg',
        aAttr: {
          target: '_blank',
        },
      },
      {
        name: 'Facebook',
        link: 'https://www.facebook.com/roxybrowser/',
        icon: '/footer/facebook.svg',
        aAttr: {
          target: '_blank',
        },
      },
      {
        name: 'Instagram',
        link: 'https://instagram.com/RoxyBrowser',
        icon: '/footer/instagram.svg',
        aAttr: {
          target: '_blank',
        },
      },
    ],
  },
])

onMounted(() => {
  console.log('footer mounted')
})
</script>

<template>
  <div class="dark:bg-[#1E1C31] bg-white">
    <div class="bg-[#1E1C31] text-white flex items-center flex-col rounded-t-4">
      <Container class="max-xl:w-full">
        <footer
          :class="cn(
            'pt-6 md:pt-54px pb-8 md:pb-10',
            'flex flex-col lg:flex-row gap-70px md:gap-6 border-white/10 text-14px',
            'border-b-1 border-t-0 border-l-0 border-r-0 border-solid',
          )"
        >
          <div class="w-full md:w-280px xl:w-412px flex flex-col gap-2 xl:pr-90px">
            <div class="relative -left-5px flex items-center gap-2">
              <RxIcon name="base/rx_ic_logo" size="38" />
              <span class="text-18px font-700 font-[Archivo]">RoxyBrowser</span>
            </div>

            <div class="flex flex-col gap-5">
              <div v-for="item in AuthenticationInformation" :key="item.text" class="flex items-center gap-2">
                <RxIcon :name="(item.icon as any)" />
                {{ item.text }}
              </div>
            </div>
          </div>

          <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-9 md:gap-5">
            <div v-for="item in footerList" :key="item.title">
              <div class="mb-5 text-4 font-600">
                {{ item.title }}
              </div>
              <ul class="list-none flex flex-col gap-4">
                <li v-for="i in item.list" :key="i.name">
                  <NuxtLinkLocale :to="i.link" v-bind="i.aAttr || {}" :class="cn(i.icon ? 'flex items-center gap-2' : '', i.class, 'font-300')">
                    <img v-if="i.icon" :src="i.icon" :alt="i.name" draggable="false" class="select-none">
                    {{ i.name }}
                  </NuxtLinkLocale>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </Container>

      <div class="flex justify-center gap-8 text-14px font-400 py-8">
        <div class="text-white/50">
          © 2025 RoxyBrowser
        </div>
        <NuxtLinkLocale to="/copyright/user" class="cursor-pointer">
          {{ $t('使用条款') }}
        </NuxtLinkLocale>
        <NuxtLinkLocale to="/copyright/privacy" class="cursor-pointer">
          {{ $t('隐私政策') }}
        </NuxtLinkLocale>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gradient-bg {
  background-image:
    linear-gradient(180deg, #e9f2fe 0%, #f5f9ff 100%), linear-gradient(0deg, #d8ecfd 0%, #d8ecfd 100%),
    linear-gradient(90deg, #e6f2fd 0%, #e6f2fd 100%);
}
</style>
