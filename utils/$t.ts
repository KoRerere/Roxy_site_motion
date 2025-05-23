export const $t = (key: string, params?: any) => {
  const { $i18n } = useNuxtApp()
  return $i18n.t(key, params)
}