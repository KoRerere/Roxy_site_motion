<script setup lang="ts">
import type { SvgNames } from '../rx-icon/svg-icon-types'
import SvgIcon from '../rx-icon/svg-icon.vue'

export interface SecurityRiskItem {
  /** 检测类型标题，用于 i18n */
  titleKey: string
  /** 状态描述，用于 i18n */
  statusKey: string
  /** 图标 */
  icon: SvgNames
  /** 卡片主题：green | purple | pink | orange */
  variant: 'green' | 'purple' | 'pink' | 'orange'
}

const props = withDefaults(
  defineProps<{
    /** 检测项列表，不传则使用默认四项 */
    items?: SecurityRiskItem[]
  }>(),
  { items: undefined },
)

const defaultItems: SecurityRiskItem[] = [
  {
    titleKey: 'VPN Detection',
    statusKey: 'No VPN detected',
    icon: 'whoer/srds-1',
    variant: 'green',
  },
  {
    titleKey: 'Proxy detection',
    statusKey: 'No proxy detected',
    icon: 'whoer/srds-7',
    variant: 'purple',
  },
  {
    titleKey: 'TOR detection',
    statusKey: 'No Tor detected',
    icon: 'whoer/srds-5',
    variant: 'pink',
  },
  {
    titleKey: 'Blacklist Detection',
    statusKey: 'Not on the blacklist',
    icon: 'whoer/srds-6',
    variant: 'orange',
  },
]

const list = computed(() => props.items ?? defaultItems)

const variantStyles: Record<SecurityRiskItem['variant'], { bg: string, border: string, iconBg: string, iconColor: string }> = {
  green: {
    bg: 'rgba(215, 250, 237, 0.60)',
    border: '#0EED9B',
    iconBg: '#0EED9B',
    iconColor: '#fff',
  },
  purple: {
    bg: 'rgba(234, 215, 250, 0.60)',
    border: '#890DEE',
    iconBg: '#890DEE',
    iconColor: '#fff',
  },
  pink: {
    bg: 'rgba(246, 210, 229, 0.60)',
    border: '#CD0B6F',
    iconBg: '#FC0A87',
    iconColor: '#fff',
  },
  orange: {
    bg: 'rgba(251, 232, 212, 0.60)',
    border: '#E98112',
    iconBg: '#FF8400',
    iconColor: '#fff',
  },
}
</script>

<template>
  <section class="py-16 bg-white">
    <Container class="flex flex-col gap-12">
      <div class="text-center flex flex-col gap-3 items-center">
        <h2 class="text-h2 text-primary font-[Archivo] font-700 m-0">
          {{ $t('Security Risk Detection') }}
        </h2>
        <p class="text-body text-secondary leading-115% m-0 max-w-[826px]">
          {{ $t('Check your network connection for security vulnerabilities') }}
        </p>
      </div>

      <div class="gap-6 grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2">
        <div
          v-for="(item, idx) in list"
          :key="idx"
          class="px-6 py-7 border-1 rounded-4 border-solid flex gap-4 items-center"
          :style="{
            backgroundColor: variantStyles[item.variant].bg,
            borderColor: variantStyles[item.variant].border,
          }"
        >
          <div
            class="rounded-full flex shrink-0 size-11 items-center justify-center"
            :style="{
              backgroundColor: variantStyles[item.variant].iconBg,
            }"
          >
            <SvgIcon
              :name="item.icon"
              size="20"
              :color="variantStyles[item.variant].iconColor"
            />
          </div>
          <div class="flex flex-1 flex-col gap-1">
            <h3 class="text-4.5 text-primary leading-28px font-600 m-0">
              {{ $t(item.titleKey) }}
            </h3>
            <p class="text-4 text-primary leading-115% m-0">
              {{ $t(item.statusKey) }}
            </p>
          </div>
          <span
            class="rounded-full bg-[#1DC94D] shrink-0 size-3"
            aria-hidden="true"
          />
        </div>
      </div>
    </Container>
  </section>
</template>
