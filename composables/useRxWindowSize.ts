import { useWindowSize } from '@vueuse/core'

export function useRxWindowSize() {
  const headers = useRequestHeaders(['user-agent']) || ''
  const userAgent = headers?.['user-agent'] || ''
  // console.log('userAgent', userAgent)
  const isMobile = /mobile/i.test(userAgent)

  const windowSize = useWindowSize({ initialWidth: isMobile ? 0 : 1920, initialHeight: isMobile ? 0 : 1080 })

  onMounted(() => {
    if (import.meta.client) {
      windowSize.width.value = window.innerWidth
    }
  })

  return windowSize
}
