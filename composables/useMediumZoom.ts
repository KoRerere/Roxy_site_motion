import type { Zoom, ZoomOptions, ZoomSelector } from 'medium-zoom'
import mediumZoom from 'medium-zoom/dist/pure'
import 'medium-zoom/dist/style.css'

export function useMediumZoom(selector?: ZoomSelector, options?: ZoomOptions) {
  let zoom: Zoom
  function initZoom() {
    if (import.meta.client) {
      zoom?.detach?.()
      zoom = mediumZoom(selector || 'img[data-zoomable]', {
        margin: 24,
        background: 'rgba(0, 0, 0, 0.7)',
        ...options,
      })
    }
  }

  onMounted(() => {
    initZoom()
  })

  onBeforeUnmount(() => {
    zoom?.detach?.()
  })

  return {
    initZoom,
  }
}
