import {
  CONTACT_US_SOCIAL_INTERNATIONAL,
  CONTACT_US_SOCIAL_ZH,
} from '@/constants/contact-us'

/** Follow Us 社媒列表：中文 3 个，英文/俄文 6 个，均按 constants 中定义顺序展示 */
export function useContactUsSocial() {
  const { locale } = useRxI18n()

  const socialItems = computed(() =>
    locale.value === 'zh'
      ? CONTACT_US_SOCIAL_ZH
      : CONTACT_US_SOCIAL_INTERNATIONAL,
  )

  return {
    socialItems,
  }
}
