import { usePreferredDark } from '@vueuse/core'

const mode = ref('light')
export const useTheme = () => {
  const isDark = usePreferredDark()

  const toggle = () => {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', mode.value)
    document.documentElement.classList.toggle('dark', mode.value === 'dark')
  }

  watch(isDark, (value) => {
    if (value) {
      mode.value = 'dark'
    } else {
      mode.value = 'light'
    }

    if (import.meta.client) {
      // toggle()
      document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', isDark.value)
    }
  }, { immediate: true })

  // watch(() => route.path, () => {
  //   if (import.meta.client) document.documentElement.setAttribute('data-path', route.path)
  // }, { immediate: true })

  return {
    isDark: computed(() => mode.value === 'dark'),
    isLight: computed(() => mode.value === 'light'),
    mode,
    toggle,
  }
}