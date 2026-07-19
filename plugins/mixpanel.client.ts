import mixpanel from 'mixpanel-browser'
import { ensureAnonymousDistinctIdCaptured } from '~/utils/mixpanel-distinct'

export default defineNuxtPlugin(() => {
  const { public: { VITE_MIXPANEL_TOKEN } } = useRuntimeConfig()
  mixpanel.init(VITE_MIXPANEL_TOKEN as string, {
    debug: import.meta.env.DEV,
    track_pageview: false,
    persistence: 'localStorage',
  })

  ensureAnonymousDistinctIdCaptured(mixpanel)

  return {
    provide: {
      mixpanel,
    },
  }
})
