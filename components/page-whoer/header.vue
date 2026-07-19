<script setup lang="ts">
import { useActivity } from '@/components/activity/hook'
import { RxIcon } from '@/components/rx-icon'
import { SUPPORTED_LANGUAGES } from '@/constants/langs'
import { cn } from '@/utils'

const { locale } = useRxI18n()
const switchLanguage = useSwitchLanguage()
const { isDark, toggle } = useTheme()
const textColor = ref('white')
const { $eventBus } = useNuxtApp()
const activity = useActivity()

const currentLang = computed(() => {
  return (SUPPORTED_LANGUAGES.find(lang => lang.code === locale.value)?.code || 'EN').toUpperCase()
})

const langItems = computed(() => {
  return SUPPORTED_LANGUAGES.map(lang => ({
    label: lang.title,
    command: () => switchLanguage(lang.code, (query) => {
      delete query.page
      return query
    }),
  }))
})

const pageHomeHeroVisible = ref(false)

const showMobileMenu = ref(false)

onMounted(() => {
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

const { width } = useRxWindowSize()
</script>

<template>
  <div class="flex flex-col left-0 right-0 top-5 fixed z-100 !top-0 md:top-6" :class="{ 'rx-header': width < 1140 }">
    <ClientOnly>
      <component :is="activity.component" v-if="activity.show.value" />
    </ClientOnly>
    <div
      class="mt-4 rounded-3 bg-[rgba(12,26,49,0.3)] w-full backdrop-blur-md md:bg-[rgba(12,26,49,0.25)]"
      :class="{ 'rx-header': width >= 1140 }"
    >
      <header
        :class="cn(
          'box-border flex items-center justify-between h-12 text-white pl-2 pr-5',
          '',
        )"
      >
        <div class="flex gap-6 items-center">
          <NuxtLinkLocale to="/" class="flex gap-1 items-center">
            <RxIcon name="base/rx_ic_logo" size="44" />
            <span class="text-4 font-[Archivo] font-700 md:text-18px">RoxyBrowser</span>
          </NuxtLinkLocale>
        </div>

        <menu class="gap-3 hidden items-center lg:(flex gap-18)">
          <li v-for="(text, index) in [$t('IP 地址检测'), $t('指纹检测'), $t('常见问题')]" :key="text">
            <a :href="`#${index}`">{{ text }}</a>
          </li>
        </menu>

        <!-- <div class="flex gap-5 items-center">
          <RxDownloadMenu :model="langItems">
            <template #default="{ toggle: onToggleLang }">
              <button class="text-inherit border-none bg-transparent gap-2 hidden cursor-pointer items-center lg:flex" @click="onToggleLang">
                <RxIcon name="base/rx_ic_world" size="14" :color="textColor" />
                <span class="text-14px text-inherit">{{ currentLang }}</span>
              </button>
            </template>
          </RxDownloadMenu>

          <button class="border-none bg-transparent flex items-center lg:hidden">
            <RxIcon :name="showMobileMenu ? 'base/rx_ic_delete' : 'base/rx_ic_menu'" class="cursor-pointer" :color="textColor" @click="showMobileMenu = !showMobileMenu" />
          </button>

          <DevOnly>
            <ToggleSwitch :value="isDark" @change="toggle" />
          </DevOnly>
        </div> -->
      </header>
      <!-- <MobileMenu v-model="showMobileMenu" /> -->
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
