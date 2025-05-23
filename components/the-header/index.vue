<template>
  <div class="rx-header fixed top-5 md:top-6 left-0 right-0 z-100">
    <header 
      :class="cn(
        'box-border flex items-center justify-between h-12', 
        'header',
        'pl-2 pr-5'
      )"
      :style="{ color: textColor }"
    >
      <div class="flex items-center gap-6">
        <NuxtLinkLocale to="/" class="flex items-center gap-2">
          <RxIcon name="base/rx_ic_logo" size="38" />
          <span class="text-4 md:text-18px font-700 font-[Archivo]">RoxyBrowser</span>
        </NuxtLinkLocale>

        <menu class="items-center gap-3 hidden lg:flex">
          <li 
            class="menu-item menu-item-link" 
            v-for="menu in mageMenus" :key="menu.title" 
            @mouseenter="(e) => handleEnter(menu.value, e)"
            @mouseleave="handleLeave"
          >
            <span class="text-14px">{{ menu.title }}</span>
            <RxIcon 
              name="base/rx_ic_chevron_down" :size="14" 
            />
          </li>
          <li 
            class="menu-item" 
            v-for="menu in menus" 
            :key="menu.title"
          >
            <NuxtLinkLocale :to="menu.link" class="menu-item-link color-inherit text-14px">
              {{ menu.title }}
            </NuxtLinkLocale>
          </li>
        </menu>
      </div>

      <div class="flex items-center gap-2">
        <button class="gap-2 hidden lg:flex items-center cursor-pointer border-none bg-transparent text-inherit" @click="toggleLang">
          <RxIcon 
            name="base/rx_ic_world" 
            size="14" 
            :color="textColor" 
          />
          <span class="text-14px text-inherit">{{ currentLang }}</span>

          <TieredMenu class="!min-w-150px" ref="langMenu" id="overlay_tmenu" :model="langItems" popup>
            <template #itemicon="{ item }">
              <RxIcon :name="item.icon" />
            </template>
          </TieredMenu>
        </button>

        <button class="lg:hidden border-none bg-transparent">
          <RxIcon 
            :name="showMobileMenu ? 'base/rx_ic_delete' : 'base/rx_ic_menu'" 
            class="cursor-pointer" 
            @click="showMobileMenu = !showMobileMenu" 
            :color="textColor"
          />
        </button>

        <DevOnly>
          <ToggleSwitch :value="isDark" @change="toggle" />
        </DevOnly>
      </div>
    </header>
  </div>

  <MobileMenu v-model="showMobileMenu" />

  <AnimatePresence>
    <motion.div
      v-if="showMageMenu"
      :initial="{ opacity: 0, top: 80 }"
      :animate="{ opacity: 1, top: 85 }"
      :exit="{ opacity: 0, top: 80 }"
      :transition="{ duration: 0.2 }"
      :style="{ 
        left: `${activeStyle.left}%`, 
      }"
      class="fixed z-100 transition-left duration-200 rounded-3 bg-white box-shadow"
    >
      <div 
        class="transition-all duration-200"
        :style="{ 
          width: `${activeStyle.width}px`, 
          height: `${activeStyle.height}px` 
        }"
        @mouseenter="handleEnterPlan"
        @mouseleave="handleLeave"
      >
        <AnimatePresence :initial="false" mode="sync">
          <template v-for="m in mageMenus">
            <div v-if="activeMageMenu === m.value" class="absolute top-0 left-0 w-full h-full">
              <motion.div 
                :initial="{ opacity: 0, x: 50 }"
                :animate="{ opacity: 1, x: 0 }"
                :exit="{ opacity: 0, x: -50 }"
                :transition="{ duration: 0.2 }"
                class="rounded-3 flex gap-3 p-4"
              >
                <component :is="m.component" v-bind="m.props" />
              </motion.div>
            </div>
          </template>
        </AnimatePresence>
      </div>
    </motion.div>
  </AnimatePresence>
  
  <!-- invisible  -->
  <div class="invisible absolute top-0 left-0 z-200" v-if="!initedMageMenusWidths">
    <div class="relative inline-block" v-for="m in mageMenus" :ref="(el) => mageMenusContents[m.value] = el">
      <div class="box-shadow rounded-3 flex gap-3 p-4 bg-white">
        <component :is="m.component" v-bind="m.props" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/utils'
import { RxIcon } from '@/components/rx-icon'
import { SUPPORTED_LANGUAGES } from '@/constants/langs'
import ToggleSwitch from 'primevue/toggleswitch';
import { motion, AnimatePresence } from 'motion-v';
import MobileMenu from './mobile.vue';
import { useMenuConfigs } from './config';

const { locale } = useRxI18n()
const switchLanguage = useSwitchLanguage()
const { isDark, toggle } = useTheme()
const textColor = ref('white')
const { $eventBus } = useNuxtApp()
const { mageMenus, menus } = useMenuConfigs()

const currentLang = computed(() => {
  return (SUPPORTED_LANGUAGES.find(lang => lang.code === locale.value)?.code || 'EN').toUpperCase()
})

const langMenu = ref();
const langItems = computed(() => {
  return SUPPORTED_LANGUAGES.map(lang => ({
    label: lang.title,
    // icon: lang.icon,
    command: () => switchLanguage(lang.code, (query) => {
      delete query.page
      return query
    })
  }))
})

const toggleLang = (event: Event) => {
  langMenu.value.toggle(event);
};

const activeMageMenu = ref('');
const mageMenusContents = ref<Record<string, HTMLElement>>({});
const mageMenusWidths = ref<Record<string, DOMRect>>({});
const showMageMenu = ref(false);
const initedMageMenusWidths = computed(() => Object.keys(mageMenusWidths.value).length > 0);

const showMobileMenu = ref(false);

const activeStyle = reactive({
  left: 0,
  width: 0,
  height: 0
})

let leaveTimeout: NodeJS.Timeout | null = null;

const handleEnter = (value: string, event: any) => {
  leaveTimeout && clearTimeout(leaveTimeout);
  showMageMenu.value = true;
  activeMageMenu.value = value
  if (!mageMenusWidths.value[value]) {
    return 
  }
  const rect = event.target.getBoundingClientRect();
  const itemWOffset = rect.width / 2 / window.innerWidth * 100;
  const itemLOffset = rect.left / window.innerWidth * 100
  const planWidth = mageMenusWidths.value[value].width
  const planWOffset = planWidth / 2 / window.innerWidth * 100;
  activeStyle.left = Math.max(5, itemWOffset + itemLOffset - planWOffset);
  activeStyle.width = mageMenusWidths.value[value].width;
  activeStyle.height = mageMenusWidths.value[value].height;
}

const handleLeave = () => {
  leaveTimeout = setTimeout(() => {
    showMageMenu.value = false;
  }, 150)
}

const handleEnterPlan = () => {
  leaveTimeout && clearTimeout(leaveTimeout);
}

// watch([() => route.path, isDark], () => {
//   if (route.path.startsWith('/download')) {
//     if (isDark.value) {
//       textColor.value = 'white'
//     } else {
//       textColor.value = 'black'
//     }
//   } else {
//     textColor.value = 'white'
//   }
// }, { immediate: true })

onMounted(() => {
  const __mageMenusWidths: Record<string, DOMRect> = {};
  Object.entries(mageMenusContents.value).forEach(([key, value]) => {
    __mageMenusWidths[key] = value.getBoundingClientRect()
  })
  mageMenusWidths.value = __mageMenusWidths;

  $eventBus.on('headerReached', (reached: boolean) => {
    textColor.value = reached ? 'black' : 'white'
  })

  onUnmounted(() => {
    $eventBus.off('headerReached');
  })
})
</script>

<style scoped>
.header {
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  /* color: #fff; */
}

.box-shadow {
  box-shadow: 
    0px 0px 0px 6px rgba(255, 255, 255, 0.4);
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
  border-radius: 12px;
  box-shadow: 
    0px 3px 8px 0px rgba(0, 0, 0, 0.07), 
    0px 2px 5px 0px rgba(0, 0, 0, 0.07), 
    0px 1px 1px 0px rgba(0, 0, 0, 0.07);
}

.menu-item {
  @apply flex items-center gap-1;
}

.menu-item-link {
  @apply px-3 py-6px cursor-pointer hover:bg-white/20 rounded-1;
}
</style>