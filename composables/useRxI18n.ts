export function useRxI18n() {
  const { t, locale, ...rest } = useI18n()
  const isRu = computed(() => locale.value === 'ru')
  const isZh = computed(() => locale.value === 'zh')
  const isEn = computed(() => locale.value === 'en')

  return {
    $t: t,
    locale,
    isRu,
    isZh,
    isEn,
    ...rest,
  }
}
