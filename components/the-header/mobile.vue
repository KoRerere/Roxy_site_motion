<script setup>
import { NuxtLinkLocale } from '#components'
import { AnimatePresence, motion } from 'motion-v'
import { RxIcon } from '@/components/rx-icon'
import { useAuth } from '~/hooks/useAuth'
import { loggedIn } from '~/store/auth'
import { useMenuConfigs, useOpenRoxyBrowser } from './config'

const modelValue = defineModel({ default: false })
const props = defineProps({
  theme: {
    type: String,
    default: 'light',
  },
})
const { mobileMenus } = useMenuConfigs()
const { roxyBrowserSeoUrl, openRoxyBrowser } = useOpenRoxyBrowser()
const { locale } = useRxI18n()
const switchLanguage = useSwitchLanguage()
const { public: { roxyBrowserUrl } } = useRuntimeConfig()
const { redirectMobileDownloadToLogin } = useMobileDownloadRedirect()

function handleClick(child, event) {
  if (child?.link === '/download' && redirectMobileDownloadToLogin(event)) {
    return
  }

  if (child?.click) {
    child.click()
  }
  modelValue.value = false
}

function handleMenuClick(menu, event) {
  if (menu.children) {
    togglePanel(menu.value)
    return
  }

  modelValue.value = false
}

function gotoPath(menu, child) {
  return `/${menu.value}/${child.value}`
}

const route = useRoute()

watch(() => route.path, () => {
  modelValue.value = false
})

const currPath = computed(() => route.path)

const isLightDropdown = computed(() => props.theme === 'light')
const menuTheme = computed(() => {
  if (isLightDropdown.value) {
    return {
      panel: 'bg-white text-[#111213]',
      text: 'text-[#111213]',
      mutedText: 'text-[#575D60]',
      sectionBorder: 'border-[#E7E8EB]',
      activeItem: 'bg-[#F0F1F2]',
      ghostButton: 'border-[#E7E8EB] bg-[#F5F6F7] text-[#111213]',
      languageActive: 'bg-[#F0F1F2]',
      iconColor: '#111213',
    }
  }

  return {
    panel: 'bg-transparent text-[#FAF4F4]',
    text: 'text-[#FAF4F4]',
    mutedText: 'text-[#FAF4F4]',
    sectionBorder: 'border-white/30',
    activeItem: 'bg-white/20',
    ghostButton: 'border-white/30 bg-white/12 text-white',
    languageActive: 'bg-white/20',
    iconColor: '#FFF',
  }
})

const openPanels = ref([])

function togglePanel(value) {
  const idx = openPanels.value.indexOf(value)
  if (idx >= 0) {
    openPanels.value.splice(idx, 1)
  }
  else {
    openPanels.value.push(value)
  }
}

const languages = [
  {
    title: $t('简体中文'),
    value: 'zh',
    icon: 'country/rx_flag_cn',
    click: () => {
      switchLanguage('zh')
    },
  },
  {
    title: 'English',
    value: 'en',
    icon: 'country/rx_flag_us',
    click: () => {
      switchLanguage('en')
    },
  },
]

const { login, logout } = useAuth()

function handleLogin() {
  login()
}
function handleGotoSite() {
  window.open(roxyBrowserUrl, '_blank')
}
</script>

<template>
  <div>
    <AnimatePresence>
      <motion.div
        v-if="modelValue"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.3 }"
        :class="menuTheme.panel"
        class="rx-accordion flex flex-col max-h-[calc(100dvh-124px)] w-full relative overflow-y-auto rounded-b-3"
      >
        <div :class="cn({ 'px-3': modelValue })" class="font-[Archivo] max-h-560px overflow-y-auto ru-RU:font-inherit">
          <div>
            <div
              v-for="menu in mobileMenus.filter(item => !item.hidden)" :key="menu.value"
              class="border-b border-solid last:border-b-0"
              :class="menuTheme.sectionBorder"
            >
              <component
                :is="!menu.children ? NuxtLinkLocale : 'div'"
                :to="!menu.children ? menu.value : undefined"
                :target="menu.target"
                :class="cn(
                  'flex items-center justify-between px-2 py-4 text-15px font-500 leading-18px cursor-pointer rounded-2',
                  menuTheme.text,
                )"
                @click.capture="handleMenuClick(menu, $event)"
              >
                {{ menu.title }}
                <svg
                  v-if="menu.children"
                  class="shrink-0 size-4 transition-transform duration-200"
                  :class="[menuTheme.text, { 'rotate-180': openPanels.includes(menu.value) }]"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </component>
              <div
                v-if="menu.children && menu.type !== 'radio'"
                class="transition-[grid-template-rows] grid duration-200"
                :class="openPanels.includes(menu.value) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
              >
                <div class="overflow-hidden">
                  <div
                    :class="cn('pb-2 gap-6px', {
                      'grid grid-cols-2': menu.value !== 'language',
                    })"
                  >
                    <div
                      v-for="child in menu.children.filter(item => !item.hidden)" :key="child.value"
                      :class="cn('flex items-center cursor-pointer text-15px gap-2 p-2', {
                        [`rounded-2 ${menuTheme.activeItem}`]: child.value === locale,
                      })"
                    >
                      <RxIcon :name="child.icon || `menu/${child.value}`" size="24" :color="menuTheme.iconColor" />
                      <span v-if="child.click" class="w-full block" @click.capture="handleClick(child, $event)">{{ child.title }}</span>
                      <NuxtLinkLocale v-else :to="child.link || gotoPath(menu, child)" class="w-full block" :target="child.target" @click.capture="handleClick(child, $event)">
                        {{ child.title }}
                      </NuxtLinkLocale>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-3 flex flex-col gap-2.5 w-full justify-between">
          <div class="flex items-center justify-between">
            <div class="text-4 leading-4.5 font-[Archivo] py-3 pl-6px" :class="menuTheme.text">
              {{ $t('语言') }}
            </div>
            <div class="flex gap-2">
              <div
                v-for="lang in languages" :key="lang.value"
                class="px-3 py-1.5 rounded-1.5 flex gap-1.5" :class="{ [menuTheme.languageActive]: locale === lang.value }"
                @click="lang.click"
              >
                <RxIcon :name="lang.icon || `menu/${lang.value}`" size="16" />
                <span class="text-3.5 leading-4.5 font-[Inter]" :class="menuTheme.mutedText">{{ lang.value.toUpperCase() }}</span>
              </div>
            </div>
          </div>
          <div v-if="loggedIn" class="hidden gap-2 w-full justify-between">
            <button class="text-[14px] leading-[18px] font-[Inter] font-500 px-4 py-[11px] text-center border-1 rounded-2 border-solid flex-1 cursor-pointer" :class="menuTheme.ghostButton" @click="logout">
              {{ $t('退出') }}
            </button>
            <button
              class="text-[14px] text-white leading-[18px] font-[Inter] font-500 px-4 py-[11px] text-center rounded-2 bg-[#12A3FC] flex-1 cursor-pointer"
              @click.prevent="handleGotoSite"
            >
              {{ $t('RoxyBrowser') }}
            </button>
          </div>
          <div v-else class="hidden gap-2 w-full justify-between">
            <a
              class="text-3.5 leading-18px font-[Inter] font-500 px-4 py-2.5 text-center rounded-2 flex-1 cursor-pointer box-border border-1 border-solid"
              :class="menuTheme.ghostButton"
              :href="roxyBrowserSeoUrl"
              target="_blank"
              rel="noopener noreferrer"
              @click.prevent="handleLogin"
            >
              {{ $t('登录') }}
            </a>
            <a
              class="text-3.5 text-white leading-18px font-[Inter] font-500 px-4 py-2.5 text-center rounded-2 bg-[#12A3FC] flex-1 cursor-pointer"
              :href="roxyBrowserSeoUrl"
              target="_blank"
              rel="noopener noreferrer"
              @click.prevent="handleLogin"
            >
              {{ $t('注册') }}
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
</template>
