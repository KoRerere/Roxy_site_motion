import { usePreferredDark } from '@vueuse/core'

export function useTheme() {
  const mode = ref('light')
  const isDark = usePreferredDark()

  const toggle = () => {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', mode.value)
    document.documentElement.classList.toggle('dark', mode.value === 'dark')
  }

  watch(isDark, (value) => {
    if (value) {
      mode.value = 'dark'
    }
    else {
      mode.value = 'light'
    }

    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', isDark.value)
    }
  }, { immediate: true })

  return {
    isDark,
    isLight: !isDark.value,
    mode,
    toggle,
  }
}
