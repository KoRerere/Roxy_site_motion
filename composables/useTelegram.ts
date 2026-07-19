export function useTelegram() {
  const { locale } = useI18n()
  const telegramLink = computed(() => {
    return {
      zh: 'https://t.me/RoxyBrowser_CN2',
      en: 'https://t.me/RoxyBrowser_EN2',
      ru: 'https://t.me/RoxyBrowser_RU2',
    }[locale.value]
  })

  return {
    telegramLink,
  }
}
