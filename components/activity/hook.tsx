// import BlackFriday from './black-friday.vue'
// import Christmas from './christmas.vue'
import TopUpSeason from './top-up-season.vue'

export function useActivity() {
  const minHeight = 56
  const maxHeight = 145
  const mobileNavHeight = 48
  const MOBILE_HOME_TOP_RESET_Y = 10
  const MOBILE_HOME_TOP_BAR_THRESHOLD = 620
  const SUPPRESS_HERO_VISIBILITY_MS = 300
  const height = ref(56)
  const close = ref(true)
  const { $eventBus } = useNuxtApp()
  const isHomePage = useIsHomeRoute()
  const windowScrollY = ref(0)
  const topUpHeroContentVisible = useState('top-up-hero-content-visible', () => true)
  const mobileHomeTopBarPinned = ref(false)
  const suppressHeroVisibilityUpdate = ref(false)

  const { width } = useRxWindowSize()

  const isMobile = computed(() => width.value < 768)

  const show = computed(() => {
    if (close.value)
      return false
    // 非首页全站常驻；首页移动端仍按滚动阈值展示 (当前活动价格页也不展示)
    if (!isHomePage.value)
      return true
    if (width.value >= 768)
      return true
    if (windowScrollY.value <= MOBILE_HOME_TOP_RESET_Y)
      return false
    return mobileHomeTopBarPinned.value
  })

  const isScrollTopBar = computed(() => {
    if (!isHomePage.value && isMobile.value)
      return false
    if (isHomePage.value && isMobile.value)
      return false
    return isMobile.value && !topUpHeroContentVisible.value
  })

  const bodyPaddingTop = computed(() => {
    if (!show.value)
      return 0
    // 桌面端：仅补偿活动条高度
    if (width.value >= 768)
      return minHeight
    // 非首页移动端：活动条全高，页面自身已处理导航栏留白
    if (!isHomePage.value)
      return maxHeight
    const barHeight = isScrollTopBar.value ? minHeight : maxHeight
    return barHeight + mobileNavHeight
  })

  useHead({
    bodyAttrs: {
      style: computed(() =>
        bodyPaddingTop.value > 0 ? `padding-top: ${bodyPaddingTop.value}px` : 'padding-top: 0px',
      ),
    },
  })

  if (import.meta.client) {
    watch(bodyPaddingTop, (newPadding, oldPadding) => {
      if (!isHomePage.value || width.value >= 768)
        return

      const delta = newPadding - (oldPadding ?? 0)
      if (delta === 0)
        return

      suppressHeroVisibilityUpdate.value = true
      nextTick(() => {
        window.scrollTo({ top: Math.max(0, window.scrollY + delta) })
        window.setTimeout(() => {
          suppressHeroVisibilityUpdate.value = false
        }, SUPPRESS_HERO_VISIBILITY_MS)
      })
    }, { flush: 'post' })
  }

  if (import.meta.client) {
    watch([show, width, isScrollTopBar], ([newShow, newWidth, scrolled]) => {
      if (newShow)
        height.value = newWidth >= 768 ? minHeight : (scrolled ? minHeight : maxHeight)
      else
        height.value = 0
    }, { immediate: true, flush: 'post' })

    watch(isHomePage, (home) => {
      if (home) {
        topUpHeroContentVisible.value = true
        mobileHomeTopBarPinned.value = false
      }
    })

    let lastScrollY = 0

    function syncMobileHomeScrollState(scrollY: number, scrollingDown: boolean) {
      windowScrollY.value = scrollY

      if (!isHomePage.value || width.value >= 768)
        return

      if (scrollY <= MOBILE_HOME_TOP_RESET_Y) {
        mobileHomeTopBarPinned.value = false
        topUpHeroContentVisible.value = true
        return
      }

      if (scrollingDown && scrollY >= MOBILE_HOME_TOP_BAR_THRESHOLD) {
        mobileHomeTopBarPinned.value = true
      }
      else if (!scrollingDown && scrollY <= MOBILE_HOME_TOP_BAR_THRESHOLD) {
        mobileHomeTopBarPinned.value = false
      }
    }

    onMounted(() => {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      lastScrollY = scrollY
      syncMobileHomeScrollState(scrollY, false)
    })

    useEventListener(window, 'scroll', () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      const scrollingDown = scrollY > lastScrollY
      syncMobileHomeScrollState(scrollY, scrollingDown)
      lastScrollY = scrollY
    }, { passive: true })

    $eventBus.on('topUpHeroContentVisible', (visible: boolean) => {
      if (!isHomePage.value || suppressHeroVisibilityUpdate.value)
        return

      topUpHeroContentVisible.value = visible
    })

    onUnmounted(() => {
      $eventBus.off('topUpHeroContentVisible')
    })

    width.value = window.innerWidth
  }

  function handleClose() {
    close.value = true
  }

  return {
    component: () => {
      return <TopUpSeason height={height.value} handleClose={handleClose} scrolled={isScrollTopBar.value} />
    },
    show,
    height,
    isMobile,
    isScrollTopBar,
  }
}
