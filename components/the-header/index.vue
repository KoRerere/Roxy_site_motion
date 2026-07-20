<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v'
import { useActivity } from '@/components/activity/hook'
import RxDownloadMenu from '@/components/rx-download-menu.vue'
import { RxIcon } from '@/components/rx-icon'
import { SUPPORTED_LANGUAGES } from '@/constants/langs'
import { useAuth } from '~/hooks/useAuth'
import { loggedIn } from '~/store/auth'
import { useMenuConfigs, useOpenRoxyBrowser } from './config'
import MobileMenu from './mobile.vue'
import UserInfoMobile from './user-info-mobile.vue'
import UserInfo from './user-info.vue'

const isChinaSite = process.env.SITE_VARIANT === 'china'
const { locale } = useRxI18n()
const route = useRoute()
const isHomeRoute = useIsHomeRoute()
const localePath = useLocalePath()
const switchLanguage = useSwitchLanguage()
const headerLanguages = SUPPORTED_LANGUAGES.filter(lang => lang.code === 'zh' || lang.code === 'en')
// const { isDark, toggle } = useTheme()
const textColor = ref('white')
const { $eventBus } = useNuxtApp()
const { mageMenus, menus } = useMenuConfigs()
const activity = useActivity()
const { roxyBrowserSeoUrl, openRoxyBrowser } = useOpenRoxyBrowser()

const currentLang = computed(() => {
  return (headerLanguages.find(lang => lang.code === locale.value)?.code || 'ZH').toUpperCase()
})

const langItems = computed(() => {
  return headerLanguages.map(lang => ({
    label: lang.title,
    command: () =>
      switchLanguage(lang.code, (query) => {
        delete query.page
        return query
      }),
  }))
})

const pageHomeHeroVisible = ref(false)
const mobileHeaderRef = ref<HTMLElement | null>(null)
const activeMageMenu = ref('')
const mageMenusContents = ref<Record<string, HTMLElement | null>>({})
const mageMenusWidths = ref<Record<string, { width: number, height: number }>>({})
const showMageMenu = ref(false)

function setMenuMeasureRef(key: string, el: Element | ComponentPublicInstance | null) {
  const element = el instanceof HTMLElement
    ? el
    : (el as ComponentPublicInstance | null)?.$el instanceof HTMLElement
        ? (el as ComponentPublicInstance).$el as HTMLElement
        : null
  mageMenusContents.value[key] = element
}

/** 测量 common-panel 实际尺寸，避免外层 wrapper 高度不准 */
function measureMenuPanelRect(el: HTMLElement | null) {
  if (!el) {
    return { width: 0, height: 0 }
  }
  const panel = el.querySelector('.common-panel')
  const target = panel instanceof HTMLElement ? panel : el
  const rect = target.getBoundingClientRect()
  return {
    width: rect.width,
    height: rect.height,
  }
}

async function initMageMenusWidths() {
  if (!import.meta.client) {
    return
  }

  await nextTick()
  // 等待字体与面板布局完成后再测量
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))

  mageMenus.value.forEach((menu) => {
    const rect = measureMenuPanelRect(mageMenusContents.value[menu.value] ?? null)
    mageMenusWidths.value[menu.value] = rect
  })
}

function applyActiveMenuSize(value: string) {
  const el = mageMenusContents.value[value]
  const menuRect = measureMenuPanelRect(el ?? null)
  if (menuRect.width > 0 && menuRect.height > 0) {
    mageMenusWidths.value[value] = menuRect
  }
  return mageMenusWidths.value[value]
}

const MOBILE_MENU_ANIMATION_MS = 300
const MOBILE_HEADER_MEDIA = '(max-width: 1123px)'
const showMobileMenu = ref(false)
const mobileMenuChromeVisible = ref(false)
const showMobileUserMenu = ref(false)
const mobileDropdownTheme = ref<'light' | 'dark'>('dark')
const isPricingHeaderFlat = computed(() => isPricingRoute())
const pricingHeaderShellClass = computed(() =>
  isPricingHeaderFlat.value
    ? 'mt-4 rounded-3 !bg-[rgba(12,26,49,0.20)] !backdrop-blur-[10px] md:!bg-[rgba(12,26,49,0.20)]'
    : '',
)
const pricingHeaderClass = computed(() =>
  isPricingHeaderFlat.value
    ? '!text-white min-[1124px]:pl-10 min-[1124px]:pr-[38px]'
    : '',
)
const isLightMobileDropdown = computed(() => {
  if (isHomeRoute.value && activity.isMobile.value)
    return true
  return isHomeRoute.value || mobileDropdownTheme.value === 'light'
})
const mobileHeaderChromeActive = computed(() => {
  if (isHomeRoute.value && activity.isMobile.value)
    return true
  if (isPricingRoute())
    return true
  return isHomeRoute.value || mobileMenuChromeVisible.value
})
const mobileHeaderOverflowClass = computed(() => {
  if (showMobileMenu.value) {
    return 'max-[1123px]:overflow-hidden'
  }

  if (showMobileUserMenu.value) {
    return 'max-[1123px]:overflow-visible'
  }

  return ''
})
const mobileHeaderTheme = computed(() => {
  if (isLightMobileDropdown.value) {
    return {
      shell: `max-[1123px]:!bg-white max-[1123px]:!backdrop-blur-none ${mobileHeaderOverflowClass.value} max-[1123px]:shadow-[0_4px_12px_0_rgba(0,0,0,0.08)]`,
      headerText: 'max-[1123px]:!text-[#111213]',
      iconColor: '#111213',
    }
  }

  return {
    shell: `max-[1123px]:!bg-[rgba(12,26,49,0.3)] max-[1123px]:!backdrop-blur-md ${mobileHeaderOverflowClass.value}`,
    headerText: 'max-[1123px]:!text-white',
    iconColor: '#FFF',
  }
})
const mobileMenuIconColor = computed(() => {
  if (mobileHeaderChromeActive.value) {
    return mobileHeaderTheme.value.iconColor
  }
  return textColor.value
})

let mobileMenuChromeTimer: ReturnType<typeof setTimeout> | null = null

watch(showMobileMenu, (visible) => {
  if (mobileMenuChromeTimer) {
    clearTimeout(mobileMenuChromeTimer)
    mobileMenuChromeTimer = null
  }

  if (visible) {
    mobileMenuChromeVisible.value = true
    return
  }

  mobileMenuChromeTimer = setTimeout(() => {
    if (showMobileMenu.value || showMobileUserMenu.value) {
      mobileMenuChromeVisible.value = true
      mobileMenuChromeTimer = null
      return
    }

    mobileMenuChromeVisible.value = false
    mobileMenuChromeTimer = null
  }, MOBILE_MENU_ANIMATION_MS)
})

const activeStyle = reactive({
  left: 0,
  width: 0,
  height: 0,
})

let leaveTimeout: NodeJS.Timeout | null = null

function handleEnter(value: string, event: MouseEvent) {
  leaveTimeout && clearTimeout(leaveTimeout)
  showMageMenu.value = true
  activeMageMenu.value = value

  const menuSize = applyActiveMenuSize(value)
  if (!menuSize?.width || !menuSize?.height) {
    return
  }

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const itemWOffset = rect.width / 2 / window.innerWidth * 100
  const itemLOffset = rect.left / window.innerWidth * 100
  const planWOffset = menuSize.width / 2 / window.innerWidth * 100
  activeStyle.left = Math.max(5, itemWOffset + itemLOffset - planWOffset)
  activeStyle.width = menuSize.width
  activeStyle.height = menuSize.height
}

function handleLeave() {
  leaveTimeout = setTimeout(() => {
    showMageMenu.value = false
  }, 150)
}

function handleEnterPlan() {
  leaveTimeout && clearTimeout(leaveTimeout)
}

const { login } = useAuth()

function handleLogin() {
  window.console.log('handleLogin')
  login()
}

function isMobileHeaderViewport() {
  return import.meta.client && window.matchMedia(MOBILE_HEADER_MEDIA).matches
}

function isPricingRoute() {
  return route.name?.toString()?.startsWith?.('pricing_') ?? false
}

function syncMobileDropdownTheme() {
  if (!isMobileHeaderViewport()) {
    return
  }

  if (!isHomeRoute.value) {
    mobileDropdownTheme.value = 'dark'
    return
  }

  mobileDropdownTheme.value = 'light'
}

function handleToggleMobileUserMenu(open: boolean) {
  if (mobileMenuChromeTimer) {
    clearTimeout(mobileMenuChromeTimer)
    mobileMenuChromeTimer = null
  }

  showMobileUserMenu.value = open

  if (open) {
    showMobileMenu.value = false
    syncMobileDropdownTheme()
    mobileMenuChromeVisible.value = true
    return
  }

  if (!showMobileMenu.value) {
    mobileMenuChromeVisible.value = false
  }
}

function handleToggleMobileMenu() {
  if (!isMobileHeaderViewport()) {
    showMobileMenu.value = false
    return
  }

  if (!showMobileMenu.value && import.meta.client) {
    showMobileUserMenu.value = false
    syncMobileDropdownTheme()
  }

  showMobileMenu.value = !showMobileMenu.value
}

function closeMobileMenuOnDesktop() {
  if (!isMobileHeaderViewport()) {
    showMobileMenu.value = false
  }
}

function closeMobileMenuOnOutsideClick(event: PointerEvent) {
  if (!showMobileMenu.value || !isMobileHeaderViewport()) {
    return
  }

  const target = event.target
  if (target instanceof Node && mobileHeaderRef.value?.contains(target)) {
    return
  }

  showMobileMenu.value = false
}

onMounted(() => {
  initMageMenusWidths()
  window.addEventListener('resize', closeMobileMenuOnDesktop)
  document.addEventListener('pointerdown', closeMobileMenuOnOutsideClick)

  $eventBus.on('headerReached', (reached: boolean) => {
    textColor.value = reached ? 'black' : 'white'
  })
  $eventBus.on('pageHomeHeroVisible', (visible: boolean) => {
    pageHomeHeroVisible.value = visible
  })

  onUnmounted(() => {
    $eventBus.off('headerReached')
    $eventBus.off('pageHomeHeroVisible')
  })
})

onBeforeUnmount(() => {
  $eventBus.off('pageHomeHeroVisible')
  window.removeEventListener('resize', closeMobileMenuOnDesktop)
  document.removeEventListener('pointerdown', closeMobileMenuOnOutsideClick)
  if (mobileMenuChromeTimer) {
    clearTimeout(mobileMenuChromeTimer)
  }
})

const headerLogo = computed(() => {
  const lightHeaderBg = mobileHeaderChromeActive.value && isLightMobileDropdown.value
  return lightHeaderBg ? '/header_logo_black_mobile-zh.svg' : '/header_logo.svg'
})
watch(locale, initMageMenusWidths, { flush: 'post' })
watch(() => mageMenus.value.length, initMageMenusWidths, { flush: 'post' })
const headerLogoMobileClass = computed(() => {
  const lightHeaderBg = mobileHeaderChromeActive.value && isLightMobileDropdown.value
  return lightHeaderBg ? 'mt-0' : 'mt-[-3px]'
})
</script>

<template>
  <div class="flex flex-col left-0 right-0 top-0 fixed z-100">
    <component :is="activity.component" v-if="activity.show.value" />
    <div class="rx-header flex flex-col w-full">
      <div
        ref="mobileHeaderRef"
        class="mt-4 rounded-3 bg-[rgba(12,26,49,0.3)] w-full backdrop-blur-md md:bg-[rgba(12,26,49,0.25)]"
        :class="[
          mobileHeaderChromeActive && !isPricingHeaderFlat
            ? mobileHeaderTheme.shell
            : undefined,
          pricingHeaderShellClass,
        ]"
      >
        <header
          class="text-white pl-1.1 pr-2 flex h-12 items-center box-border justify-between max-[1124px]:pr-2"
          :class="[
            mobileHeaderChromeActive && !isPricingHeaderFlat
              ? mobileHeaderTheme.headerText
              : undefined,
          ]"
        >
          <div class="flex gap-6 items-center">
            <NuxtLinkLocale to="/" class="flex gap-1 items-center">
              <template v-if="!isChinaSite">
                <div class="size-11">
                  <RxIcon name="base/rx_ic_logo" size="44" />
                </div>
                <span class="text-4 font-[Archivo] font-700 md:text-18px">{{ $t('Roxy浏览器') }}</span>
              </template>
              <template v-else>
                <img
                  src="/header_logo.svg"
                  alt="Roxy浏览器"
                  height="37"
                  draggable="false"
                  class="ml-1 mt-[-3px] hidden select-none min-[1124px]:block"
                >
                <div class="size-11 min-[1124px]:hidden">
                  <RxIcon name="base/rx_ic_logo" size="44" />
                </div>
                <span
                  class="text-4 font-[Archivo] font-700 min-[1124px]:hidden"
                >{{ $t('Roxy浏览器') }}</span>
              </template>
            </NuxtLinkLocale>

            <menu class="gap-3 hidden items-center min-[1124px]:flex">
              <li v-for="menu in mageMenus" :key="menu.title" class="menu-item menu-item-link" @mouseenter="(e) => handleEnter(menu.value, e)" @mouseleave="handleLeave">
                <span class="text-14px">{{ menu.title }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="text-white size-3.5" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.707 8.293a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 1.414-1.414L12 13.586l5.293-5.293a1 1 0 0 1 1.414 0Z" />
                </svg>
              </li>
              <li v-for="menu in menus" :key="menu.title" class="menu-item">
                <NuxtLinkLocale :to="menu.link" class="menu-item-link text-14px color-inherit ru-RU:text-4" :target="menu.target" @click="menu.click">
                  {{ menu.title }}
                </NuxtLinkLocale>
              </li>
            </menu>
          </div>

          <div class="flex gap-3 items-center lg:gap-5">
            <RxDownloadMenu :model="langItems">
              <template #default="{ toggle: onToggleLang }">
                <button class="text-inherit border-none bg-transparent gap-2 hidden cursor-pointer items-center min-[1124px]:flex" @click="onToggleLang">
                  <svg width="14" height="14" viewBox="0 0 14 14" :fill="textColor" xmlns="http://www.w3.org/2000/svg">
                    <g id="Group">
                      <path id="Vector" d="M12.5 7C12.5 10.0375 10.0375 12.5 7 12.5C3.96187 12.5 1.5 10.0375 1.5 7C1.5 3.96187 3.96187 1.5 7 1.5C10.0375 1.5 12.5 3.96187 12.5 7ZM13.5 7C13.5 3.41 10.5894 0.5 7 0.5C3.41 0.5 0.5 3.41 0.5 7C0.5 10.5894 3.41 13.5 7 13.5C10.5894 13.5 13.5 10.5894 13.5 7Z" />
                      <path id="Vector_2" d="M4.00006 7C4.00006 9.39938 4.83756 11.6337 6.27568 13.1831C6.64193 13.5819 7.26568 13.6081 7.66631 13.2394C7.68631 13.2206 7.70568 13.2006 7.72443 13.1806C9.16068 11.6325 9.99881 9.39875 9.99881 6.99875C9.99881 4.59875 9.16068 2.36438 7.72256 0.815C7.35568 0.415625 6.73193 0.389375 6.33131 0.758125C6.31068 0.77625 6.29131 0.79625 6.27256 0.81625C4.83568 2.36375 3.99756 4.5975 3.99756 6.9975L4.00006 7ZM5.00006 7C5.00006 4.84688 5.74631 2.85688 7.00881 1.49688C7.01006 1.495 7.00943 1.49563 7.00943 1.49563C7.00318 1.50063 6.99443 1.5 6.98881 1.49438C8.25256 2.85625 8.99881 4.84625 8.99881 6.99875C8.99881 9.15125 8.25193 11.1413 6.98943 12.5013C6.98756 12.5025 6.98818 12.5019 6.98818 12.5019C6.99381 12.4963 7.00256 12.4969 7.00818 12.5025C5.74381 11.14 4.99756 9.15 4.99756 6.9975L5.00006 7Z" />
                      <path id="Vector_3" d="M1 7.5H13C13.2756 7.5 13.5 7.27562 13.5 7C13.5 6.72375 13.2756 6.5 13 6.5H1C0.72375 6.5 0.5 6.72375 0.5 7C0.5 7.27562 0.72375 7.5 1 7.5Z" />
                    </g>
                  </svg>
                  <span class="text-14px text-inherit">{{ currentLang }}</span>
                </button>
              </template>
            </RxDownloadMenu>

            <a
              v-if="!loggedIn"
              class="text-3.5 text-white leading-18px font-[Inter] font-500 px-3 text-center rounded-2 bg-[#12A3FC] h-8 hidden cursor-pointer whitespace-nowrap items-center justify-center max-[1123px]:flex"
              :href="roxyBrowserSeoUrl"
              target="_blank"
              rel="noopener noreferrer"
              @click.prevent="handleLogin"
            >
              {{ $t('登录/注册') }}
            </a>
            <UserInfoMobile
              class="block lg:hidden"
              :open="showMobileUserMenu"
              :theme="mobileDropdownTheme"
              @toggle="handleToggleMobileUserMenu"
            />
            <button class="border-none bg-transparent shrink-0 size-8 hidden cursor-pointer items-center justify-center max-[1123px]:flex min-[1124px]:hidden" @click="handleToggleMobileMenu">
              <RxIcon
                :name="showMobileMenu ? 'base/rx_ic_delete' : 'base/rx_ic_menu'" class="cursor-pointer"
                :color="mobileMenuIconColor"
              />
            </button>
            <!-- lg：UserInfo 为多根节点，class 包在外层避免 attribute 继承警告 -->
            <div class="hidden lg:block">
              <UserInfo>
                <div v-if="isPricingHeaderFlat" class="hidden min-[1124px]:flex">
                  <a
                    class="text-3.5 text-white leading-18px font-[Inter] font-500 px-5 py-2 rounded-2 bg-[#12A3FC] cursor-pointer"
                    :href="roxyBrowserSeoUrl" target="_blank" rel="noopener noreferrer" @click.prevent="handleLogin"
                  >
                    {{ $t('登录') }}
                  </a>
                </div>
                <div v-else class="gap-2 hidden min-[1124px]:flex">
                  <a
                    class="text-3.5 leading-18px font-[Inter] font-500 px-5 py-2 outline-1 outline-white/30 outline rounded-2 bg-white/12 cursor-pointer box-border"
                    :href="roxyBrowserSeoUrl" target="_blank" rel="noopener noreferrer" @click.prevent="handleLogin"
                  >
                    {{ $t('登录') }}

                  </a>
                  <a
                    class="text-3.5 leading-18px font-[Inter] font-500 px-5 py-2 rounded-2 bg-[linear-gradient(82deg,#12A3FC_44.39%,#5BBDFA_100%)] cursor-pointer shadow-[0_0_6px_0_rgba(255,255,255,0.40)_inset]"
                    :href="roxyBrowserSeoUrl" target="_blank" rel="noopener noreferrer" @click.prevent="handleLogin"
                  >
                    {{ $t('注册') }}
                  </a>
                </div>
              </UserInfo>
            </div>
          <!-- <DevOnly>
            <ToggleSwitch :value="isDark" @change="toggle" />
          </DevOnly> -->
          </div>
        </header>
        <MobileMenu v-model="showMobileMenu" :theme="mobileDropdownTheme" />
      </div>
    </div>
  </div>

  <AnimatePresence>
    <motion.div
      v-if="showMageMenu"
      :initial="{
        opacity: 0,
        top: 80 + (activity.show.value ? activity.height.value : 0),
      }"
      :animate="{
        opacity: 1,
        top: 85 + (activity.show.value ? activity.height.value : 0),
      }"
      :exit="{
        opacity: 0,
        top: 80 + (activity.show.value ? activity.height.value : 0),
      }"
      :transition="{ duration: 0.2 }"
      :style="{
        left: `${activeStyle.left}%`,
      }"
      class="box-shadow rounded-3 bg-white transition-left duration-200 fixed z-100"
    >
      <div
        class="transition-all duration-200" :style="{
          width: `${activeStyle.width}px`,
          height: `${activeStyle.height}px`,
        }"
        @mouseenter="handleEnterPlan"
        @mouseleave="handleLeave"
      >
        <AnimatePresence :initial="false" mode="sync">
          <template v-for="m in mageMenus" :key="m.value">
            <div v-if="activeMageMenu === m.value" class="h-full w-full left-0 top-0 absolute">
              <motion.div
                :initial="{ opacity: 0, x: 50 }" :animate="{ opacity: 1, x: 0 }" :exit="{ opacity: 0, x: -50 }" :transition="{ duration: 0.2 }"
                class="rounded-3 flex gap-3 h-full overflow-hidden"
              >
                <component :is="m.component" v-bind="m.props" />
              </motion.div>
            </div>
          </template>
        </AnimatePresence>
      </div>
    </motion.div>
  </AnimatePresence>

  <!-- 离屏渲染各面板，用于准确测量宽高（含无博客侧栏的跨境营销面板） -->
  <div class="opacity-0 pointer-events-none top-0 fixed z-[-1] -left-[9999px]" aria-hidden="true">
    <div
      v-for="m in mageMenus"
      :key="m.value"
      :ref="(el) => setMenuMeasureRef(m.value, el)"
      class="inline-block relative"
    >
      <div class="box-shadow rounded-3 bg-white flex gap-3 overflow-hidden">
        <component :is="m.component" v-bind="m.props" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  /* color: #fff; */
}

.box-shadow {
  box-shadow: 0px 0px 0px 6px rgba(255, 255, 255, 0.4);
}

.box-shadow::before {
  content: '';
  position: absolute;
  z-index: -1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% + 12px);
  height: calc(100% + 12px);
  border-radius: 16px;
  backdrop-filter: blur(6px);
  box-shadow:
    0px 3px 8px 0px rgba(0, 0, 0, 0.07),
    0px 2px 5px 0px rgba(0, 0, 0, 0.07),
    0px 1px 1px 0px rgba(0, 0, 0, 0.07);
}

.download-btn {
  position: relative;
  display: flex;
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.2);
  transition: background 0.2s ease-in-out;
  color: var(--netural-25, #fff);
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  /* 128.571% */
  overflow: hidden;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  &:not(.deep-bg) {
    outline: 2px solid rgba(255, 255, 255, 0.1);
    background: linear-gradient(82deg, #12a3fc 44.39%, #5bbdfa 100%);
    box-shadow: 0 0 6px 0 rgba(255, 255, 255, 0.4) inset;

    &:hover {
      box-shadow: none;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.menu-item {
  @apply flex items-center gap-1;
}

.menu-item-link {
  @apply px-3 py-1.5 cursor-pointer hover:bg-white/20 rounded-1;
}
</style>
