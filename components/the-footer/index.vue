<script setup lang="ts">
import type { LanguageCode } from '~/constants'
import { RxIcon } from '@/components/rx-icon'
import { SUPPORTED_LANGUAGES } from '~/constants'
import FooterBottomCn from './footer-bottom-cn.vue'
import FooterCnSocial from './footer-cn-social.vue'

defineProps({
  hideLanguage: {
    type: Boolean,
    default: false,
  },
})
const isChinaSite = process.env.SITE_VARIANT === 'china'
console.log('isChinaSite', isChinaSite)
const { $t, locale } = useRxI18n()

const switchLanguage = useSwitchLanguage()
// const { public: { isChinaSite: isChina } } = useRuntimeConfig()
const { public: { roxyHomeUrl } } = useRuntimeConfig()

function getFaqLink() {
  if (isChinaSite) {
    return `${roxyHomeUrl}/docs/`
  }
  return locale.value === 'en' ? `${roxyHomeUrl}/docs/` : `${roxyHomeUrl}/docs/${locale.value}/`
}

const langItems = SUPPORTED_LANGUAGES.map(lang => ({
  label: lang.title,
  value: lang.code,
}))

const currentLang = ref(langItems.find(item => item.value === locale.value) || langItems[0])

const isRu = computed(() => locale.value === 'ru')
const isChina = computed(() => locale.value === 'zh')

watch(locale, (val) => {
  currentLang.value = langItems.find(item => item.value === val) || langItems[0]
})

const footerList = computed(() => [
  {
    title: $t('资源').toLocaleUpperCase(),
    list: [
      {
        name: $t('博客'),
        link: '/blog',
      },
      {
        name: $t('常见问题'),
        link: '/faqs',
        hidden: isRu.value,
      },
      {
        name: $t('使用指南'),
        link: getFaqLink(),
        // hidden: isRu.value,
        aAttr: {
          target: '_blank',
        },
      },
      {
        name: $t('价格方案'),
        link: '/pricing',
      },
      {
        name: $t('下载'),
        link: '/download',
      },
      {
        name: $t('关于我们'),
        link: '/about-us',
      },
      {
        name: $t('联系我们'),
        link: '/contact-us',
      },
      {
        name: $t('更新日志'),
        link: '/changelog',
      },
      {
        name: $t('合作伙伴'),
        link: '/partners',
      },
    ],
  },
  {
    title: $t('应用场景').toLocaleUpperCase(),
    // hidden: isRu.value,
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
        name: $t('联盟营销'),
        link: '/use-cases/affiliate-marketing',
      },
      {
        name: $t('数据爬取'),
        link: '/use-cases/web-scraping',
      },
      {
        name: $t('加密货币'),
        link: '/use-cases/cryptocurrency-trading',
        hidden: isChinaSite,
      },
    ],
  },
  {
    title: $t('产品功能').toLocaleUpperCase(),
    // hidden: isRu.value,
    list: [
      {
        name: $t('更改 IP 地址'),
        link: '/functions/change-ip-address',
      },
      {
        name: $t('保护线上隐私'),
        link: '/functions/private-browsing',
      },
      {
        name: $t('多账号管理{nav}'),
        link: '/functions/manage-multiple-accounts',
      },
      {
        name: 'Whoer',
        link: '/whoer',
        // hidden: locale.value !== 'en',
      },
      {
        name: $t('MCP 接入'),
        link: '/blog/roxybrowser-mcp-integration',
        hidden: locale.value === 'ru',
      },
      // {
      //   name: $t('SheerID 认证'),
      //   link: '/sheerid',
      // },
    ],
  },
])

const socialList = computed(() => [
  {
    name: 'X',
    link: 'https://x.com/RoxyBrowser',
    icon: '/footer/x.svg',
    aAttr: {
      target: '_blank',
    },
  },
  {
    name: 'TikTok',
    link: 'https://tiktok.com/@RoxyBrowser',
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
  {
    name: 'Youtube',
    link: 'https://www.youtube.com/@RoxyBrowser',
    icon: '/footer/youtube.svg',
    aAttr: {
      target: '_blank',
    },
  },
])

function handleLangChange(opt: { value: LanguageCode, label: string }) {
  switchLanguage(opt.value as LanguageCode)
}
</script>

<template>
  <div class="rx-footer bg-white dark:bg-[#1E1C31]">
    <div class="text-white rounded-t-4 bg-[#1E1C31] flex flex-col items-center">
      <Container class="max-xl:w-full">
        <footer
          :class="cn(
            'pt-6 md:pt-54px pb-8 md:pb-10 justify-between',
            'flex flex-col lg:flex-row gap-15 lg:gap-10 border-white/10 text-14px',
            'border-b-1 border-t-0 border-l-0 border-r-0 border-solid',
          )"
        >
          <div class="flex flex-col w-full justify-between xl:w-512px" :class="isChinaSite ? 'gap-15' : 'gap-2'">
            <div class="flex flex-col gap-5">
              <div v-if="!isChinaSite" class="flex gap-2 items-center relative -left-5px">
                <RxIcon name="base/rx_ic_logo" size="40" />
                <span class="text-24px font-700 multilingual-text">{{ $t('RoxyBrowser') }}</span>
              </div>
              <div v-else>
                <img src="/footer/logo.svg" alt="Roxy浏览器" height="40" draggable="false" class="ml-1px select-none">
              </div>
              <div class="text-4 font-400 opacity-60">
                {{ $t('RoxyBrowser 让你高效管理多个账号，无需担心账号关联或封禁，时刻保障你的隐私安全和工作效率！') }}
              </div>
            </div>

            <div v-if="!isChinaSite" class="mt-13 flex flex-col gap-5 lg:mt-auto ru-RU:mt-15">
              <RxInputSelect
                v-if="!hideLanguage"
                v-model="currentLang"
                :options="langItems"
                :pt="{
                  root: '!bg-white/10 !border-none !w-55',
                  label: '!text-white leading-5 !text-3.5 font-[Inter]',
                  overlay: '!bg-[#4B495A] !border-none',
                  option: '!text-white leading-5 !text-3.5 font-[Inter] hover:!bg-[#5d5b6b] [&.p-select-option-selected]:!bg-[#5d5b6b] [&.p-focus]:!bg-[#5d5b6b]',
                }"
                :filter="false"
                size="xxl"
                @value-change="handleLangChange"
              />
              <div class="flex flex-col gap-2 self-start">
                <a class="flex gap-2 items-center" href="mailto:support@RoxyBrowser.com">
                  <RxIcon name="base/rx_ic_email" />
                  support@roxybrowser.com
                </a>
                <a v-if="!isChina" class="flex gap-2 items-center" href="tel:+447745818521">
                  <RxIcon name="base/site_ic_headphone" />
                  +447745818521
                </a>
              </div>
            </div>
            <div class="flex flex-col gap-5" v-if="isChinaSite">
              <!-- 国内社媒 -->
              <FooterCnSocial v-if="isChinaSite" />
              <a
                class="opacity-100 flex gap-2 transition-opacity items-start"
                href="mailto:support@RoxyBrowser.com"
              >
                <RxIcon name="base/rx_ic_email" class="text-white mt-0.5 shrink-0" size="16" />
                <span class="text-14px leading-5 font-[Inter] font-normal break-words">
                  support@roxybrowser.com
                </span>
              </a>
            </div>
          </div>

          <div class="gap-x-5 gap-y-9 grid grid-cols-2 md:gap-5 md:grid-cols-[180px_180px_180px] xl:grid-cols-[200px_200px_200px]">
            <div v-for="item in footerList.filter(item => !item.hidden)" :key="item.title">
              <div class="text-4 font-600 mb-5">
                {{ item.title }}
              </div>
              <ul class="list-none flex flex-col gap-4">
                <li v-for="i in item.list.filter(item => !item.hidden)" :key="i.name">
                  <NuxtLinkLocale :to="i.link" v-bind="i.aAttr || {}" :class="cn(i.icon ? 'flex items-center gap-2' : '', i.class)">
                    <img v-if="i.icon" :src="i.icon" :alt="i.name" draggable="false" class="select-none">
                    {{ i.name }}
                  </NuxtLinkLocale>
                </li>
              </ul>
            </div>
          </div>
        </footer>

        <div class="text-14px font-400 py-6 pt-8 flex flex-col-reverse gap-8 items-start justify-between md:pt-8 min-[830px]:flex-row min-[830px]:items-center">
          <template v-if="!isChinaSite">
            <div class="text-white/50 flex flex-col gap-5 md:gap-1">
              <div v-if="!isChina" class="leading-6">
                <p>Copyright &copy; {{ new Date().getFullYear() }} LINKV TECH PTE. LTD. All rights reserved.</p>

                <address style="font-style: normal;">
                  {{ $t('地址：') }}20 Cecil Street, #14-00 & #15-00, PLUS Building, Singapore 049705
                </address>
              </div>
              <div v-else class="leading-6">
                <template v-if="isChinaSite">
                  <p>办公地址: 深圳市福田区沙头街道天安社区深南大道6033号金运世纪大厦19D</p>
                  <p>联系电话: 0755-26407635</p>
                  <br>
                </template>
                <p>&copy; {{ new Date().getFullYear() }} 矩阵智核科技（深圳）有限公司 版权所有</p>

                <a href="https://beian.miit.gov.cn/" target="_brank">粤ICP备2026032718号-1</a>
              </div>
              <div class="flex gap-8">
                <NuxtLinkLocale to="/copyright/user" class="text-white cursor-pointer hover:underline">
                  {{ $t('使用条款') }}
                </NuxtLinkLocale>
                <NuxtLinkLocale to="/copyright/privacy" class="text-white cursor-pointer hover:underline">
                  {{ $t('隐私政策') }}
                </NuxtLinkLocale>
                <NuxtLinkLocale to="/copyright/cookie-policy" class="text-white cursor-pointer hover:underline">
                  {{ $t('Cookie 政策') }}
                </NuxtLinkLocale>
              </div>
            </div>
            <div v-if="!isChinaSite" class="flex gap-5">
              <div v-for="item in socialList" :key="item.name">
                <NuxtLinkLocale :to="item.link" v-bind="item.aAttr || {}" class="cursor-pointer">
                  <img :src="item.icon" :alt="item.name" draggable="false" class="opacity-80 size-8 select-none transition-opacity duration-300 hover:opacity-100">
                </NuxtLinkLocale>
              </div>
            </div>
          </template>
          <template v-else>
            <FooterBottomCn />
          </template>
        </div>
      </Container>
    </div>
  </div>
</template>
