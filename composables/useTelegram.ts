

export const useTelegram = () => {
  const { locale } = useI18n()
  const telegramLink = computed(() => {
    return {
      'zh': 'https://t.me/RoxyBrowser_CN',
      'en': 'https://t.me/RoxyBrowser_EN',
      'ru': 'https://t.me/RoxyBrowser_RU',
    }[locale.value]
  })

  return {
    telegramLink
  }
}
