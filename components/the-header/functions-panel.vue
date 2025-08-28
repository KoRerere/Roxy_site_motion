<script setup>
import { useRxI18n } from '~/composables/useRxI18n'
import PanelItem from './panel-item.vue'

const { $t } = useRxI18n()

const coreFeatures = computed(() => [
  {
    icon: 'menu/nav-change-ip',
    title: $t('更改IP地址'),
    desc: 'Build and deliver community coursesBuild and deliver community courses',
    link: '/functions/change-ip-address',
  },
  {
    icon: 'menu/nav-private-browsing',
    title: $t('保护线上隐私'),
    desc: 'Praesent vitae convallis quam',
    link: '/functions/private-browsing',
  },
  {
    icon: 'menu/proxy-panel',
    title: $t('代理面板'),
    desc: 'Praesent vitae convallis quam',
    link: '/features/proxy-panel',
  },
  {
    icon: 'menu/team-space',
    title: $t('团队空间'),
    desc: 'Praesent vitae convallis quam',
    link: '/features/team-space',
  },
  {
    icon: 'menu/account-hub',
    title: $t('账号中心'),
    desc: 'Praesent vitae convallis quam',
    link: '/features/account-hub',
  },
])

const mainFeatures = computed(() => [
  {
    icon: 'menu/window-sync',
    title: $t('窗口同步'),
    desc: 'Praesent vitae convallis quam',
    link: '/features/window-sync',
  },
  {
    icon: 'menu/api-flow',
    title: $t('API 流程'),
    desc: 'Praesent vitae convallis quam',
    link: '/features/api-flow',
  },
])
</script>

<template>
  <div class="flex flex-col text-white">
    <NuxtLinkLocale to="/features/window-sync">
      <div class="w-255px p-3 pb-4 bg-[radial-gradient(149.47%_89.09%_at_125.91%_100%,_#F9CDCE_0%,_#3384FF_100%)] rounded-1">
        <div class="text-14px leading-18px font-600 font-[Archivo]">
          {{ $t('窗口同步') }}
        </div>
        <p class="text-12px font-400 mt-10px">
          {{ $t('充分减少重复任务负担，自动执行常规操作') }}
        </p>
      </div>
    </NuxtLinkLocale>

    <div class="mt-3 relative w-255px aspect-476/400">
      <div class="absolute p-3 top-0 left-0 flex flex-col gap-6px">
        <div class="text-14px leading-18px font-600 font-[Archivo]">
          {{ $t('窗口投送') }}
        </div>
        <div class="text-note font-400">
          {{ $t('快速分享完整窗口环境，无缝处理团队协作') }}
        </div>
      </div>
      <RxResponsiveImage name="header/profile-transfer" class="w-full" alt="" />
    </div>
  </div>

  <div class="min-w-220px flex flex-col">
    <PanelItem v-for="feat in coreFeatures" :key="feat.title" v-bind="feat" />
  </div>

  <div class="min-w-220px flex flex-col">
    <PanelItem
      v-for="feat in mainFeatures"
      :key="feat.title"
      v-bind="feat"
    />
  </div>
</template>
