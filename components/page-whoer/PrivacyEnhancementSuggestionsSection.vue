<script setup lang="ts">
import type { SvgNames } from '../rx-icon/svg-icon-types'
import SvgIcon from '../rx-icon/svg-icon.vue'

export interface PrivacySuggestionItem {
  /** 标题，用于 i18n */
  titleKey: string
  /** 描述，用于 i18n */
  descKey: string
  /** 匿名度标签，用于 i18n，如 "+20% anonymity" */
  tagKey: string
  /** 图标 */
  icon: SvgNames
  /** 卡片主题 */
  variant: 'green' | 'blue' | 'orange' | 'purple'
}

const props = withDefaults(
  defineProps<{
    /** 建议项列表，不传则使用默认四项 */
    items?: PrivacySuggestionItem[]
  }>(),
  { items: undefined },
)

const defaultItems: PrivacySuggestionItem[] = [
  {
    titleKey: 'Use a reliable VPN',
    descKey: 'Privacy suggestion VPN desc',
    tagKey: '+20% anonymity',
    icon: 'whoer/srds-1',
    variant: 'green',
  },
  {
    titleKey: 'RoxyBrowser fingerprint browser',
    descKey: 'Privacy suggestion RoxyBrowser desc',
    tagKey: '+30% anonymity',
    icon: 'whoer/srds-4',
    variant: 'blue',
  },
  {
    titleKey: 'Synchronize time zone settings',
    descKey: 'Privacy suggestion timezone desc',
    tagKey: '+20% anonymity',
    icon: 'whoer/srds-2',
    variant: 'orange',
  },
  {
    titleKey: 'Enable DNT',
    descKey: 'Privacy suggestion DNT desc',
    tagKey: '+20% anonymity',
    icon: 'whoer/srds-3',
    variant: 'purple',
  },
]

const list = computed(() => props.items ?? defaultItems)

const variantStyles: Record<PrivacySuggestionItem['variant'], { bg: string, border: string, iconBg: string, iconColor: string, tagBg: string, tagColor: string }> = {
  green: {
    bg: 'rgba(215, 250, 237, 0.60)',
    border: '#23C98C',
    iconBg: '#3CD9A0',
    iconColor: '#fff',
    tagBg: 'rgba(10, 225, 146, 0.40)',
    tagColor: '#13563D',
  },
  blue: {
    bg: 'rgba(161, 218, 255, 0.30)',
    border: '#09F',
    iconBg: '#09F',
    iconColor: '#fff',
    tagBg: 'rgba(0, 153, 255, 0.40)',
    tagColor: '#083F61',
  },
  orange: {
    bg: 'rgba(255, 213, 87, 0.20)',
    border: '#FFA600 ',
    iconBg: '#FFA600',
    iconColor: '#fff',
    tagBg: 'rgba(255, 166, 0, 0.40)',
    tagColor: '#483409',
  },
  purple: {
    bg: 'rgba(217, 184, 255, 0.30)',
    border: '#70F',
    iconBg: '#70F',
    iconColor: '#fff',
    tagBg: 'rgba(119, 0, 255, 0.30)',
    tagColor: '#230C3E',
  },
}
</script>

<template>
  <section class="py-16 bg-white">
    <Container class="flex flex-col gap-12">
      <div class="text-center flex flex-col gap-3 items-center">
        <h2 class="text-h2 text-primary font-[Archivo] font-700 m-0">
          {{ $t('Privacy Enhancement Suggestions') }}
        </h2>
        <p class="text-body text-secondary leading-115% m-0 max-w-[826px]">
          {{ $t('Privacy Enhancement Suggestions subtitle') }}
        </p>
      </div>

      <div class="px-150px gap-6 grid grid-cols-1 lg:grid-cols-2 sm:grid-cols-2">
        <div
          v-for="(item, idx) in list"
          :key="idx"
          class="px-10 py-9 border-1 rounded-4 border-solid flex flex-col gap-6"
          :style="{
            backgroundColor: variantStyles[item.variant].bg,
            borderColor: variantStyles[item.variant].border,
          }"
        >
          <div
            class="rounded-full flex shrink-0 size-12 items-center justify-center"
            :style="{
              backgroundColor: variantStyles[item.variant].iconBg,
            }"
          >
            <SvgIcon
              :name="item.icon"
              size="26"
              :color="variantStyles[item.variant].iconColor"
            />
          </div>
          <div class="flex flex-1 flex-col gap-4 justify-between">
            <div class="flex flex-col gap-1">
              <h3 class="text-5.5 text-primary leading-28px font-600 m-0">
                {{ $t(item.titleKey) }}
              </h3>
              <p class="text-3.5 text-primary leading-24px m-0">
                {{ $t(item.descKey) }}
              </p>
            </div>
            <span
              class="text-4.5 font-500 px-4.5 py-1 rounded-full w-fit"
              :style="{
                backgroundColor: variantStyles[item.variant].tagBg,
                color: variantStyles[item.variant].tagColor,
              }"
            >
              {{ $t(item.tagKey) }}
            </span>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>
